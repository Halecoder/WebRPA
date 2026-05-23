/**
 * 把所有 dialog 的关闭按钮（onClick={onClose} + X 图标）统一为 tonal-danger 风格的 Button。
 * 仅处理：
 *  - 原生 <button onClick={onClose} className="..." (含 has-hover-only / hover:bg-{...})>...</button>
 *  - <Button variant="ghost"|"outline" ... onClick={onClose} className="...">...</Button>
 *
 * 替换为：
 *  <Button variant="tonal-danger" size="icon" onClick={onClose} title="关闭">
 *    <X className="w-4 h-4" />
 *  </Button>
 */
const fs = require('fs')
const path = require('path')

const TARGET_DIR = path.resolve(__dirname, '..', 'frontend', 'src', 'components')

function walk(dir, list) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f)
    const s = fs.statSync(p)
    if (s.isDirectory()) walk(p, list)
    else if (/\.tsx$/.test(f)) list.push(p)
  }
}

const files = []
walk(TARGET_DIR, files)

const newButton = (indent) =>
  `<Button variant="tonal-danger" size="icon" onClick={onClose} title="关闭">\n${indent}  <X className="w-4 h-4" />\n${indent}</Button>`

let mod = 0
for (const f of files) {
  let s = fs.readFileSync(f, 'utf8')
  const before = s

  // 模式 1：原生 <button onClick={onClose} className="..."> <X .../> </button>
  s = s.replace(
    /(\s*)<button\s+onClick=\{onClose\}\s+className="[^"]*"\s*>\s*<X\s+className="[^"]*"\s*\/>\s*<\/button>/g,
    (_m, indent) => `${indent}${newButton(indent)}`,
  )

  // 模式 2：<Button variant="ghost"|"outline" size="..." className="..." onClick={onClose}> <X .../> </Button>
  s = s.replace(
    /(\s*)<Button\s+variant="(?:ghost|outline)"\s+size="(?:icon|sm)"\s+(?:className="[^"]*"\s+)?onClick=\{onClose\}(?:\s+className="[^"]*")?\s*>\s*<X\s+className="[^"]*"(?:\s+\/>|>\s*<\/X>)\s*<\/Button>/g,
    (_m, indent) => `${indent}${newButton(indent)}`,
  )

  // 模式 3：<Button variant="ghost" size="..." className="..." onClick={onClose}> ... </Button>（含图标，但不只是 X）
  // 这种情况风险大，跳过

  if (s !== before) {
    fs.writeFileSync(f, s, 'utf8')
    mod++
    console.log('updated:', path.relative(TARGET_DIR, f))
  }
}
console.log('--- modified:', mod)
