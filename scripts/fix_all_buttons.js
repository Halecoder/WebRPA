/**
 * 全项目按钮可见性修复（终极版）。
 *
 * 策略：
 *  - 在每个 .tsx 文件中找所有 <button ... > 开标签（含跨多行）。
 *  - 取出该开标签内所有 className 字面量（含字符串/模板字符串/三元）。
 *  - 用更"激进而精确"的规则修复：
 *      a) 移除 hover:bg-white 系列（在白底上的白 hover 等于无效），不动其他
 *      b) 如果整组 className 没有任何 bg-* token（默认底）：
 *           - 如果含 has-hover-only：跳过（已有兜底）
 *           - 否则注入 has-hover-only
 *      c) 显式 bg-white 在按钮上：替换为 bg-[hsl(var(--brand-50))] + 蓝边框文字
 *
 * 不动场景：
 *  - <Button>（React 组件，自带样式）
 *  - 已经包含 group-hover:、disabled、opacity-0 默认隐藏的元素
 *  - 在 ReactFlow 节点 / 已有彩色容器的子按钮（含 hover:bg-white/N、text-white、hover:bg-black 等）
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

/** 找每个 <button ...> 开标签的 [start, end] 索引 */
function findButtonOpenTags(src) {
  const result = []
  const re = /<button\b/g
  let m
  while ((m = re.exec(src))) {
    const start = m.index
    // 找到对应的 > （要跳过字符串、JSX 表达式 {} 内的 >）
    let i = m.index + m[0].length
    let depth = 0
    let inStr = null
    while (i < src.length) {
      const c = src[i]
      if (inStr) {
        if (c === '\\') { i += 2; continue }
        if (c === inStr) inStr = null
      } else {
        if (c === '"' || c === "'" || c === '`') inStr = c
        else if (c === '{') depth++
        else if (c === '}') depth--
        else if (c === '>' && depth === 0) {
          result.push([start, i + 1])
          break
        }
      }
      i++
    }
  }
  return result
}

function hasOwnBgToken(cls) {
  const tokens = cls.split(/\s+/).filter(Boolean)
  for (const t of tokens) {
    if (/^bg-/.test(t)) return true
  }
  return false
}

function extractAllClassNames(tag) {
  const all = []
  // className="..."
  let re = /className="([^"\n]*)"/g
  let m
  while ((m = re.exec(tag))) all.push({ kind: 'str', val: m[1] })
  // className={`...`} 单行
  re = /className=\{`([^`$]*)`\}/g
  while ((m = re.exec(tag))) all.push({ kind: 'tpl', val: m[1] })
  // className={'...'} or className={"..."}
  re = /className=\{(['"])([^'"]*)\1\}/g
  while ((m = re.exec(tag))) all.push({ kind: 'qstr', val: m[2], q: m[1] })
  // 三元里的字符串：condition ? '...' : '...' 在 className={...} 中
  // 只在 className={ ... } 或 className={`${cond ? 'a' : 'b'}`} 中出现
  // 简化：直接扫整个 tag 中所有形如 'xxx hover:bg-xxx' 的字符串字面量
  re = /(['"])((?:[^'"\\]|\\.)*hover:bg-[^'"\\]*?)\1/g
  while ((m = re.exec(tag))) {
    // 排除已经计入的（多次添加同字符串没事，处理时去重）
    all.push({ kind: 'embed', val: m[2], q: m[1] })
  }
  return all
}

function shouldSkip(allCls) {
  // 已有 has-hover-only
  if (allCls.includes('has-hover-only')) return true
  // 节点内/彩色容器内按钮（一般有 text-white、hover:bg-white/N、hover:bg-black 等）
  if (/text-white\b/.test(allCls)) return true
  if (/hover:bg-white\/\d/.test(allCls)) return true
  if (/hover:bg-black\b|hover:bg-black\//.test(allCls)) return true
  // 默认隐藏的悬浮控件
  if (/\bopacity-0\b/.test(allCls)) return true
  // 跟随父级 hover
  if (/\bgroup-hover:/.test(allCls)) return true
  return false
}

function processFile(file) {
  let src = fs.readFileSync(file, 'utf8')
  const original = src
  const opens = findButtonOpenTags(src)
  // 倒序处理避免索引偏移
  for (let k = opens.length - 1; k >= 0; k--) {
    const [s, e] = opens[k]
    const tag = src.slice(s, e)
    const classes = extractAllClassNames(tag)
    if (!classes.length) {
      // 完全没 className 的 button，跳过——这种通常是 React Flow 库或 children 走 prop 注入
      continue
    }
    const allCls = classes.map((c) => c.val).join(' ')
    if (shouldSkip(allCls)) continue
    // 如果有自己的 bg- 且不是 bg-white，跳过
    if (hasOwnBgToken(allCls)) {
      if (!/\bbg-white\b/.test(allCls)) continue
    }

    // 需要修复
    // 策略：把第一个 className 字面量末尾追加 has-hover-only
    // 同时把 bg-white 替换为空（让 has-hover-only 接管）
    let newTag = tag
    let firstReplaced = false
    // 处理顺序：先替换 bg-white，再追加 has-hover-only 到第一个字面量
    newTag = newTag.replace(/\bbg-white\b/g, '')

    // 找到第一个 className= 然后在其字面量末尾追加 has-hover-only
    newTag = newTag.replace(/className="([^"\n]*)"/, (m, cls) => {
      if (firstReplaced) return m
      firstReplaced = true
      const cleaned = (cls + ' has-hover-only').replace(/\s+/g, ' ').trim()
      return `className="${cleaned}"`
    })
    if (!firstReplaced) {
      newTag = newTag.replace(/className=\{`([^`$]*)`\}/, (m, cls) => {
        if (firstReplaced) return m
        firstReplaced = true
        const cleaned = (cls + ' has-hover-only').replace(/\s+/g, ' ').trim()
        return `className={\`${cleaned}\`}`
      })
    }
    if (!firstReplaced) {
      newTag = newTag.replace(/className=\{(['"])([^'"]*)\1\}/, (m, q, cls) => {
        if (firstReplaced) return m
        firstReplaced = true
        const cleaned = (cls + ' has-hover-only').replace(/\s+/g, ' ').trim()
        return `className={${q}${cleaned}${q}}`
      })
    }

    if (newTag !== tag) {
      src = src.slice(0, s) + newTag + src.slice(e)
    }
  }

  if (src !== original) {
    fs.writeFileSync(file, src, 'utf8')
    return true
  }
  return false
}

const files = []
walk(TARGET, files)
let mod = 0
for (const f of files) {
  try {
    if (processFile(f)) {
      mod++
      console.log('updated:', path.relative(TARGET, f))
    }
  } catch (e) {
    console.error('error:', f, e.message)
  }
}
console.log('--- modified:', mod)
