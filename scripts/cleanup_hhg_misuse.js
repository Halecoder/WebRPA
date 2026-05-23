/**
 * 仅保留 <button> 元素自身的 has-hover-only。
 * 移除以下场景中误加的：
 *  - <tr>/<td>/<label>/<div>/<a>/<span> 等非 button 标签
 *  - <Button> 组件（已自带样式，没必要兜底）
 *  - 列表项类 div（满 100% 宽 / 含 cursor-pointer）
 *  - <input> 元素等
 *
 * 策略：扫描每个 className 字面量，回溯到它所在的 JSX 标签开头。如果开头不是
 * `<button` 就移除其中的 has-hover-only。
 *
 * 简化实现：用更稳的方法——直接逐行匹配；如果匹配到的 className 上下文不像 button
 * （前 200 字符里没有 <button），就移除 has-hover-only。
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

/** 找到 className 字面量在源码中的起始位置，回溯查找该字面量所属 JSX 标签 */
function isOnButtonElement(src, classNameStartIdx) {
  // 从 className 的位置回溯 ~400 字符，找最近的 < 标签开头
  const lookbackStart = Math.max(0, classNameStartIdx - 400)
  const window = src.slice(lookbackStart, classNameStartIdx)
  // 找最后一个 `<标签名` 形式
  const match = window.match(/<([A-Za-z][\w.]*)\b(?![^>]*\/>$)[^>]*$/m)
  if (!match) return false
  return match[1] === 'button'
}

function processSrc(src, filePath) {
  const original = src
  let changed = false

  // 处理三种 className 形式
  const patterns = [
    /className="([^"\n]*)"/g,
    /className=\{`([^`$]*)`\}/g,
    /className=\{(['"])([^'"]*)\1\}/g,
  ]

  for (let i = 0; i < patterns.length; i++) {
    const re = patterns[i]
    src = src.replace(re, (m, ...groups) => {
      // 取出实际的 className 文本
      let cls
      let isQuoted = false
      let q = ''
      if (i === 0) {
        cls = groups[0]
      } else if (i === 1) {
        cls = groups[0]
      } else {
        q = groups[0]
        cls = groups[1]
        isQuoted = true
      }
      if (!cls.includes('has-hover-only')) return m

      // 查找当前 m 在 src 中的位置（用 indexOf 从上次位置开始）
      // 由于 replace 是流式的，我们直接用 m 在 original 中查找
      const idx = original.indexOf(m)
      if (idx < 0) return m

      const onButton = isOnButtonElement(original, idx)
      // 还要排除 <Button>（首字母大写）
      // isOnButtonElement 已限定 'button' 小写，所以 <Button> 不会被误判为 button

      // 仅保留原生 <button> 的，其余移除
      if (onButton) return m

      const cleaned = cls.replace(/\s*has-hover-only/g, '').trim()
      changed = true
      if (i === 0) return `className="${cleaned}"`
      if (i === 1) return `className={\`${cleaned}\`}`
      return `className={${q}${cleaned}${q}}`
    })
  }

  // 还有：通过单/双引号字符串字面量直接被脚本注入的（位于 cn(... 'xxx has-hover-only' ...)）
  // 这些字符串通常不能区分上下文，只能保留——除非全文中只有它一处
  // 但我们的目标主要是 className 容器内的，已通过上面三步覆盖。
  // 对于剩余的孤立字符串字面量，保险起见全部移除（只要不是在原生 button 标签内）
  src = src.replace(/(['"])((?:[^'"\\]|\\.)+)\1/g, (m, q, val) => {
    if (!val.includes('has-hover-only')) return m
    if (!/[\w-]+:bg-/.test(val) && !/^[\s\w:[\]/().%-]+$/.test(val)) return m
    // 找到这个字符串字面量的位置并判断
    const idx = original.indexOf(m)
    if (idx < 0) return m
    if (isOnButtonElement(original, idx)) return m
    const cleaned = val.replace(/\s*has-hover-only/g, '').trim()
    if (cleaned === val) return m
    changed = true
    return `${q}${cleaned}${q}`
  })

  return { src, changed }
}

const files = []
walk(TARGET_DIR, files)
let mod = 0
for (const f of files) {
  const before = fs.readFileSync(f, 'utf8')
  const { src, changed } = processSrc(before, f)
  if (changed) {
    fs.writeFileSync(f, src, 'utf8')
    mod++
    console.log('cleaned:', path.relative(TARGET_DIR, f))
  }
}
console.log('--- modified:', mod)
