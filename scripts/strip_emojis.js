/**
 * 删除 frontend/src 下所有 .ts/.tsx 中字符串字面量里的 emoji 字符。
 * 仅替换 ' / " / ` 包裹的字面量内容；JSX 文本节点也处理。
 * Emoji 范围基于 Unicode 13 主要 emoji 区段。
 */
const fs = require('fs');
const path = require('path');

const TARGET_DIR = path.resolve(__dirname, '..', 'frontend', 'src');

// 综合 emoji 区段：杂项符号、各种符号与图形、补充箭头、Dingbats、CJK 符号、地图、emoticons、附加 emoticons、补充图形、扩展 A、变体选择器
const EMOJI_RE = /[\u{1F1E6}-\u{1F1FF}\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}\u{2B00}-\u{2BFF}\u{FE0E}\u{FE0F}\u{200D}]/gu;

function walk(dir, list) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const s = fs.statSync(p);
    if (s.isDirectory()) walk(p, list);
    else if (/\.(tsx?)$/.test(name)) list.push(p);
  }
}

function clean(str) {
  return str.replace(EMOJI_RE, '').replace(/\s{2,}/g, ' ').replace(/^\s+|\s+$/g, '');
}

function processSrc(src) {
  let changed = false;
  // 1) 单/双引号字符串
  src = src.replace(/('|")((?:\\.|(?!\1).)*)\1/g, (m, q, inner) => {
    if (!EMOJI_RE.test(inner)) { EMOJI_RE.lastIndex = 0; return m; }
    EMOJI_RE.lastIndex = 0;
    const next = clean(inner);
    if (next !== inner) { changed = true; return q + next + q; }
    return m;
  });
  // 2) 模板字符串（无 ${} 嵌套的简单情况）
  src = src.replace(/`([^`$]*)`/g, (m, inner) => {
    if (!EMOJI_RE.test(inner)) { EMOJI_RE.lastIndex = 0; return m; }
    EMOJI_RE.lastIndex = 0;
    const next = clean(inner);
    if (next !== inner) { changed = true; return '`' + next + '`'; }
    return m;
  });
  // 3) JSX 文本节点：>...<
  src = src.replace(/>([^<>{}]*)</g, (m, inner) => {
    if (!EMOJI_RE.test(inner)) { EMOJI_RE.lastIndex = 0; return m; }
    EMOJI_RE.lastIndex = 0;
    const next = inner.replace(EMOJI_RE, '');
    if (next !== inner) { changed = true; return '>' + next + '<'; }
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
