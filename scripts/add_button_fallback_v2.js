/**
 * v2: 全面给所有"有 hover:bg- 但没默认 bg 的可交互元素"加 has-hover-only 类。
 *
 * 这次覆盖：
 *  1) 原生 <button>（包括跨多行属性）
 *  2) 含 hover:bg- 的 onClick 元素（div/span/a）
 *  3) 模板字符串 className={`...`}
 *  4) 三元字符串 'a' : 'b'（仅当 a/b 字符串都符合"有 hover 没 bg"条件）
 *
 * 严格排除：
 *  - 已经含 has-hover-only
 *  - 含 group-hover:（跟随父 hover）
 *  - 含 opacity-0（默认隐藏控件）
 *  - 已经有独立 bg- token（自带底色）
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
  const tokens = cls.split(/\s+/).filter(Boolean)
  for (const t of tokens) {
    if (/^bg-/.test(t)) return true
  }
  return false
}

function shouldInjectClass(cls) {
  if (!cls) return false
  if (cls.includes('has-hover-only')) return false
  if (!/\bhover:bg-/.test(cls)) return false
  if (hasOwnBgToken(cls)) return false
  if (/\bgroup-hover:/.test(cls)) return false
  if (/\bopacity-0\b/.test(cls)) return false
  return true
}

function injectInto(cls) {
  const tokens = cls.split(/\s+/).filter(Boolean)
  tokens.push('has-hover-only')
  return tokens.join(' ')
}

function processSrc(src) {
  let changed = false

  // 1) className="..."（单行）
  src = src.replace(/className="([^"\n]*)"/g, (m, cls) => {
    if (!shouldInjectClass(cls)) return m
    changed = true
    return `className="${injectInto(cls)}"`
  })

  // 2) className={`...`}（无 ${} 的纯模板）
  src = src.replace(/className=\{`([^`$]*)`\}/g, (m, cls) => {
    if (!shouldInjectClass(cls)) return m
    changed = true
    return `className={\`${injectInto(cls)}\`}`
  })

  // 3) className={'...'} or className={"..."}
  src = src.replace(/className=\{(['"])([^'"]*)\1\}/g, (m, q, cls) => {
    if (!shouldInjectClass(cls)) return m
    changed = true
    return `className={${q}${injectInto(cls)}${q}}`
  })

  // 4) 三元中的字符串：cond ? 'a' : 'b' —— 仅在 a 或 b 单独命中条件时给该字符串注入
  // 这种场景需要更小心，只处理形如 'xxxxhover:bg-xxxxx' 单引号字符串字面量
  // 通过直接搜单/双引号包裹的字符串：要求字符串里含 hover:bg- 且不含 bg-（独立）
  src = src.replace(/(['"])((?:[^'"\\]|\\.)+)\1/g, (m, q, val) => {
    // 只处理像 className 用的 token 字符串
    if (!shouldInjectClass(val)) return m
    // 进一步限制：必须像是 className 字符串（包含 tailwind 风格的连字符 token）
    if (!/^[\w\s:[\]/().%-]+$/.test(val)) return m
    changed = true
    return `${q}${injectInto(val)}${q}`
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
console.log('--- modified:', mod)
