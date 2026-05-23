/**
 * 给所有看不出来是按钮的原生 <button> 加上 has-hover-only 类。
 *
 * 触发条件（严格单行 className）：
 *  - 元素必须是原生 <button>（不是 React 组件 <Button>）
 *  - className="..."（仅匹配单行字符串字面量，不处理模板字符串）
 *  - className 中含 hover:bg-{anything}
 *  - className 中不含任何独立 bg- token（不包括 hover:/focus:/active:/group-hover: 等带前缀的）
 *
 * 不处理的情况（避免误伤）：
 *  - <Button>（自带样式）
 *  - className 含 group-hover:、opacity-0（隐藏控件）
 *  - className 含 ${...}（动态字符串）
 *  - className 含 has-hover-only（已加过）
 */
const fs = require('fs')
const path = require('path')

const TARGET_DIR = path.resolve(__dirname, '..', 'frontend', 'src')

function walk(dir, list) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f)
    const s = fs.statSync(p)
    if (s.isDirectory()) walk(p, list)
    else if (/\.tsx$/.test(f)) list.push(p)
  }
}

// 检测 className 中是否有独立的 bg- token（不计 hover:/focus:/active:/group-hover: 等带前缀）
function hasOwnBgToken(cls) {
  const tokens = cls.split(/\s+/)
  for (const t of tokens) {
    if (!t) continue
    if (t.startsWith('bg-')) return true
    // 如：disabled:bg-..., dark:bg-... 都不算"自己默认的 bg"
    // hover:bg-, focus:bg-, active:bg-, group-hover:bg- 等等也跳过
    if (/^(?:hover|focus|active|focus-visible|group-hover|group-focus|peer|peer-hover|disabled|dark|aria-|data-)/.test(t)) continue
    // 含中括号修饰的 bg：[&_*]:bg-... 这种少见情况也跳过
  }
  return false
}

function shouldInjectClass(cls) {
  if (cls.includes('has-hover-only')) return false
  if (cls.includes('${')) return false
  if (!/\bhover:bg-/.test(cls)) return false
  if (hasOwnBgToken(cls)) return false
  if (/\bgroup-hover:/.test(cls)) return false
  if (/\bopacity-0\b/.test(cls)) return false
  return true
}

function processSrc(src) {
  let changed = false
  // 仅匹配 <button ...> 之内的 className（不匹配 <Button>）
  // 严格：标签名后必须是空格或换行后跟 className，且整段 className 在同一行
  src = src.replace(/(<button\b[^>]*?\sclassName=)"([^"\n]*)"/g, (m, prefix, cls) => {
    if (!shouldInjectClass(cls)) return m
    const next = (cls.trim() + ' has-hover-only').replace(/\s+/g, ' ')
    changed = true
    return `${prefix}"${next}"`
  })
  return { src, changed }
}

const files = []
walk(TARGET_DIR, files)
let mod = 0
for (const f of files) {
  const before = fs.readFileSync(f, 'utf8')
  const { src, changed } = processSrc(before)
  if (changed) {
    fs.writeFileSync(f, src, 'utf8')
    mod++
    console.log('updated:', path.relative(TARGET_DIR, f))
  }
}
console.log('---', 'modified:', mod)
