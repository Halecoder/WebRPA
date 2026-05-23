/**
 * 批量清理 frontend/src 下所有 .tsx/.ts 文件中 className 内的 Tailwind 渐变与彩虹阴影类。
 * 替换为基于设计 token 的统一纯色样式，保证全局浅色一致。
 *
 * ⚠️ 仅在 className="..." / className={`...`} / className={'...'} / className={"..."} 内做替换，
 *    不会触碰 JSX 表达式 / 条件 / 三元表达式之外的代码。
 *
 * 处理规则（仅在 className 内文本上运行）：
 *  - bg-gradient-to-{r,br,b,t,tr,tl,bl,l}            -> 删除
 *  - hover:bg-gradient-to-{...}                      -> 删除
 *  - {hover:}?{from|via|to}-{color}-{n}{/op}?         -> 删除
 *  - {hover:}?shadow-{color}-{n}{/op}?                -> 删除
 *  - bg-[length:200%_100%]                            -> 删除
 *  - animate-gradient                                 -> 删除
 *
 * 然后基于上下文给被处理的 className 注入纯色：
 *  - 含 text-white 且原本有渐变背景：注入 bg-[hsl(var(--brand-600))]
 *  - 含 border-b/border-t/border-y 顶/底栏：注入 bg-[hsl(var(--card))]
 *  - 否则（按钮/卡片）：注入 bg-[hsl(var(--card))]
 *  - 含 hover:bg-gradient-to-：注入 hover:bg-[hsl(var(--muted))]
 */

const fs = require('fs');
const path = require('path');

const TARGET_DIR = path.resolve(__dirname, '..', 'frontend', 'src');

const COLORS = [
  'slate','gray','zinc','neutral','stone',
  'red','orange','amber','yellow','lime','green','emerald','teal','cyan','sky','blue','indigo','violet','purple','fuchsia','pink','rose'
];
const COLOR_RE = COLORS.join('|');

const fromViaToRe = new RegExp(`(?:hover:)?(?:from|via|to)-(?:${COLOR_RE})-(?:950|900|800|700|600|500|400|300|200|100|50)(?:\\/\\d+)?`, 'g');
const gradientDirRe = /(?:hover:)?bg-gradient-to-(?:r|br|b|bl|l|tl|t|tr)/g;
const colorShadowRe = new RegExp(`(?:hover:)?shadow-(?:${COLOR_RE})-(?:950|900|800|700|600|500|400|300|200|100|50)(?:\\/\\d+)?`, 'g');
const lengthBgRe = /\bbg-\[length:200%_100%\]/g;
const animateGradientRe = /\banimate-gradient\b/g;

function walk(dir, list) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const s = fs.statSync(p);
    if (s.isDirectory()) walk(p, list);
    else if (/\.(tsx?)$/.test(name)) list.push(p);
  }
}

function tidy(cls) {
  return cls.replace(/\s+/g, ' ').trim();
}

function transformClassString(cls) {
  if (!/(bg-gradient-to-|from-|via-|to-|shadow-|bg-\[length:200%_100%\]|animate-gradient)/.test(cls)) {
    return cls;
  }

  const hadHoverGradient = /hover:bg-gradient-to-/.test(cls);
  const hadGradient = /bg-gradient-to-/.test(cls);
  const hasTextWhite = /\btext-white\b/.test(cls);
  const isBorderBar = /\b(border-b|border-t|border-y)\b/.test(cls);

  let out = cls;
  out = out.replace(gradientDirRe, '');
  out = out.replace(fromViaToRe, '');
  out = out.replace(colorShadowRe, '');
  out = out.replace(lengthBgRe, '');
  out = out.replace(animateGradientRe, '');

  // 注入替换样式
  const inject = [];
  if (hadGradient) {
    if (hasTextWhite) {
      inject.push('bg-[hsl(var(--brand-600))]');
    } else if (isBorderBar) {
      inject.push('bg-[hsl(var(--card))]');
    } else {
      inject.push('bg-[hsl(var(--card))]');
    }
  }
  if (hadHoverGradient && !/\bhover:bg-/.test(out)) {
    inject.push('hover:bg-[hsl(var(--muted))]');
  }
  if (inject.length) {
    out = (inject.join(' ') + ' ' + out).trim();
  }

  return tidy(out);
}

function processClassNamesInSource(src) {
  let changed = false;

  // 1) className="..."
  src = src.replace(/className="([^"]*)"/g, (m, inner) => {
    const next = transformClassString(inner);
    if (next !== inner) { changed = true; return `className="${next}"`; }
    return m;
  });

  // 2) className={`...`}（无 ${} 插值的纯模板字符串）
  src = src.replace(/className=\{`([^`$]*)`\}/g, (m, inner) => {
    const next = transformClassString(inner);
    if (next !== inner) { changed = true; return `className={\`${next}\`}`; }
    return m;
  });

  // 3) className={'...'} or className={"..."}
  src = src.replace(/className=\{(['"])([^'"]*)\1\}/g, (m, q, inner) => {
    const next = transformClassString(inner);
    if (next !== inner) { changed = true; return `className={${q}${next}${q}}`; }
    return m;
  });

  return { src, changed };
}

const files = [];
walk(TARGET_DIR, files);
let modifiedCount = 0;
for (const f of files) {
  const before = fs.readFileSync(f, 'utf8');
  const { src, changed } = processClassNamesInSource(before);
  if (changed) {
    fs.writeFileSync(f, src, 'utf8');
    modifiedCount++;
    console.log('updated:', path.relative(TARGET_DIR, f));
  }
}
console.log('---');
console.log('total scanned:', files.length, 'modified:', modifiedCount);
