/**
 * 清理 strip_gradients.js 残留：
 *  1) ' 0 0 ' / ' 0 0' / '0 0 ' 这种 className 中误留的孤立残片（来自 shadow-color/0.X 删除）
 *  2) animate-gradient -> 删除（连带 bg-[length:200%_100%] 一起清理）
 *  注：text-gradient 在 CSS 中已被重定义成纯品牌色，无需在源码中替换。
 */
const fs = require('fs');
const path = require('path');

const TARGET_DIR = path.resolve(__dirname, '..', 'frontend', 'src');

function walk(dir, list) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const s = fs.statSync(p);
    if (s.isDirectory()) walk(p, list);
    else if (/\.(tsx?|css)$/.test(name)) list.push(p);
  }
}

function transform(cls) {
  let out = cls;
  // 1) 移除孤立的 ' 0 0 '（前导空白 + 0 0 + 词边界）
  out = out.replace(/(\s)0 0(?=\s|$)/g, '$1');
  // 2) animate-gradient
  out = out.replace(/\banimate-gradient\b/g, '');
  // 3) bg-[length:200%_100%]
  out = out.replace(/\bbg-\[length:200%_100%\]/g, '');
  // 折叠
  out = out.replace(/\s+/g, ' ').trim();
  return out;
}

function processSrc(src) {
  let changed = false;
  src = src.replace(/className="([^"]*)"/g, (m, inner) => {
    const next = transform(inner);
    if (next !== inner) { changed = true; return `className="${next}"`; }
    return m;
  });
  src = src.replace(/className=\{`([^`$]*)`\}/g, (m, inner) => {
    const next = transform(inner);
    if (next !== inner) { changed = true; return `className={\`${next}\`}`; }
    return m;
  });
  src = src.replace(/className=\{(['"])([^'"]*)\1\}/g, (m, q, inner) => {
    const next = transform(inner);
    if (next !== inner) { changed = true; return `className={${q}${next}${q}}`; }
    return m;
  });
  return { src, changed };
}

const files = [];
walk(TARGET_DIR, files);
let mod = 0;
for (const f of files) {
  const before = fs.readFileSync(f, 'utf8');
  const { src, changed } = processSrc(before);
  if (changed) {
    fs.writeFileSync(f, src, 'utf8');
    mod++;
    console.log('updated:', path.relative(TARGET_DIR, f));
  }
}
console.log('--- modified:', mod);
