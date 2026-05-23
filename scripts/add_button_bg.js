/**
 * 给所有"看不出来是按钮"的可点击元素加默认底色。
 *
 * 规则：仅修改 className 字面量，并且只在以下情况注入 bg：
 *  - className 中含 hover:bg-{anything}
 *  - 但 className 中不含任何"非 hover 的"独立 bg- token（即没有自己的默认底色）
 *  - 注入后默认 bg 用 slate-100，使元素在白底/浅底面板上明显可见
 *
 * 不动的：
 *  - 已经有 bg-* 的（即使是 bg-transparent）
 *  - 含 'group-hover:' 的（这通常是子元素跟随父 hover 状态的，加底反而错）
 *  - className 模板字符串里含 ${} 的（条件 className，跳过避免破坏）
 */
const fs = require('fs')
const path = require('path')

const TARGET_DIR = path.resolve(__dirname, '..', 'frontend', 'src')

function walk(dir, list) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f)
    const s = fs.statSync(p)
    if (s.isDirectory()) walk(p, list)
    else if (/\.(tsx?)$/.test(f)) list.push(p)
  }
}

function shouldInject(cls) {
  if (!/\bhover:bg-/.test(cls)) return false
  // 已有非 hover 的 bg-（包括 bg-transparent / bg-white / bg-gray-50 / bg-[hsl...] 等）
  if (/(?:^|\s)(?!hover:|focus:|active:|group-hover:|group-focus:|peer-|disabled:|data-)bg-/.test(' ' + cls)) return false
  // 含 ${} 的模板字符串（条件类），跳过保险
  if (cls.includes('${')) return false
  return true
}

function transform(cls) {
  if (!shouldInject(cls)) return cls
  return ('bg-[hsl(var(--slate-100))] ' + cls).replace(/\s+/g, ' ').trim()
}

function processSrc(src) {
  let changed = false
  src = src.replace(/className="([^"]*)"/g, (m, inner) => {
    const next = transform(inner)
    if (next !== inner) { changed = true; return `className="${next}"` }
    return m
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
