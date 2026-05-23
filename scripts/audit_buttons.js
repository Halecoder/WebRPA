/**
 * 审计：扫所有 .tsx，找出所有可能"看不出是按钮"的可点击元素，按文件分类输出。
 *
 * 标记：
 *  - WHITE: className 含 bg-white 但元素是 button / 含 onClick
 *  - NO_BG: 元素是 button / 含 onClick，且 className 不含任何 bg- token
 *  - GHOST_LIKE: className 含 hover:bg-* 但没有自己的 bg-* / has-hover-only
 */
const fs = require('fs')
const path = require('path')

const TARGET = path.resolve(__dirname, '..', 'frontend', 'src', 'components')

function walk(d, a) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f)
    const s = fs.statSync(p)
    if (s.isDirectory()) walk(p, a)
    else if (/\.tsx$/.test(f)) a.push(p)
  }
}

function hasOwnBg(cls) {
  const tokens = cls.split(/\s+/).filter(Boolean)
  for (const t of tokens) {
    if (/^bg-/.test(t)) return true
  }
  return false
}

function findButtonOpens(src) {
  // 找所有 <button ... > 标签开头位置，包括跨多行
  const opens = []
  const re = /<button\b/g
  let m
  while ((m = re.exec(src))) opens.push(m.index)
  return opens
}

function findClassNamesNear(src, openIdx) {
  // 从 openIdx 找到对应 > 之间的字符串
  let i = openIdx
  let depth = 0
  let inStr = null
  for (; i < src.length; i++) {
    const c = src[i]
    if (inStr) {
      if (c === '\\') { i++; continue }
      if (c === inStr) inStr = null
      continue
    }
    if (c === '"' || c === "'" || c === '`') { inStr = c; continue }
    if (c === '{') depth++
    else if (c === '}') depth--
    else if (c === '>' && depth === 0) return src.slice(openIdx, i + 1)
  }
  return null
}

const files = []
walk(TARGET, files)

const issues = []

for (const f of files) {
  const src = fs.readFileSync(f, 'utf8')
  const opens = findButtonOpens(src)
  for (const idx of opens) {
    const tag = findClassNamesNear(src, idx)
    if (!tag) continue
    // 提取所有 className 字面量
    const cls = []
    const re1 = /className="([^"\n]*)"/g
    const re2 = /className=\{`([^`$]*)`\}/g
    const re3 = /className=\{'([^']*)'\}/g
    const re4 = /className=\{"([^"]*)"\}/g
    // 含 ${} 的模板字符串：找到 className={` ... `} 整段
    const re5 = /className=\{`([^`]*?)`\}/gs
    let m
    while ((m = re1.exec(tag))) cls.push(m[1])
    while ((m = re2.exec(tag))) cls.push(m[1])
    while ((m = re3.exec(tag))) cls.push(m[1])
    while ((m = re4.exec(tag))) cls.push(m[1])
    while ((m = re5.exec(tag))) cls.push(m[1])
    // 三元里的字符串字面量（在 className={...} 内）
    const reTernary = /['"]([^'"\\]*(?:bg-|hover:|text-|border-)[^'"\\]*)['"]/g
    while ((m = reTernary.exec(tag))) cls.push(m[1])

    const allCls = cls.join(' ')

    // 行号
    const lineNum = (src.slice(0, idx).match(/\n/g) || []).length + 1

    if (!cls.length) {
      issues.push({ file: f, line: lineNum, kind: 'NO_CLASS', tag: tag.slice(0, 200) })
      continue
    }

    if (allCls.includes('bg-white')) {
      // bg-white 在按钮上=纯白底
      issues.push({ file: f, line: lineNum, kind: 'WHITE', cls: allCls })
      continue
    }

    if (!hasOwnBg(allCls)) {
      // 没有任何独立 bg-，但可能有 hover:bg-、has-hover-only
      const hasFallback = allCls.includes('has-hover-only')
      issues.push({ file: f, line: lineNum, kind: hasFallback ? 'OK_FALLBACK' : 'NO_BG', cls: allCls })
    }
  }
}

// 输出
const groups = {}
for (const i of issues) {
  if (!groups[i.kind]) groups[i.kind] = []
  groups[i.kind].push(i)
}

console.log('=== Issue Summary ===')
for (const k of Object.keys(groups)) {
  console.log(`${k}: ${groups[k].length}`)
}
console.log('\n=== Detailed issues (NO_BG / WHITE / NO_CLASS) ===')
for (const k of ['NO_BG', 'WHITE', 'NO_CLASS']) {
  if (!groups[k]) continue
  for (const i of groups[k]) {
    console.log(`[${k}] ${path.relative(TARGET, i.file)}:${i.line}`)
    if (i.cls) console.log(`  cls: ${i.cls.slice(0, 200)}`)
    if (i.tag) console.log(`  tag: ${i.tag}`)
  }
}
