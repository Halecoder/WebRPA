/**
 * 根据 <Button> 内的图标自动推断功能色，把所有 outline 按钮替换成对应的 tonal-* variant。
 *
 * 图标到颜色的映射：
 *   红色（tonal-danger）：Trash2, Trash, X, XCircle, Ban, AlertTriangle, AlertCircle, Square (停止)
 *   绿色（tonal-success）：Check, CheckCircle2, Play, Upload, Save, Plus, FolderPlus, RefreshCw (执行)
 *   橙色（tonal-warning）：FolderOpen, Folder, Edit2, Edit, Pencil, Eye (查看), Settings
 *   青色（tonal-info）：Download, FileDown, Search, Info, Eye, ExternalLink, Link, Copy
 *   紫色（tonal）品牌：Package, Sparkles, Bot, Brain, Star, Zap, Wand2
 *
 * 仅替换：variant="outline" 的 Button，并且整个 Button 的内部 JSX 中能识别出主图标。
 *
 * 严格不动：
 *  - 不使用 Button 组件的原生 button 元素
 *  - 已经是 tonal-* / success / warning / destructive / info / default 的 Button
 *  - className 中含 "border-{color}-" 的（开发者已经手动指定颜色）
 *  - 跨多行 Button 但识别不出主图标的
 */
const fs = require('fs')
const path = require('path')

const TARGET_DIR = path.resolve(__dirname, '..', 'frontend', 'src', 'components')

const ICON_TO_VARIANT = {
  // 危险/停止/关闭/删除
  Trash2: 'tonal-danger',
  Trash: 'tonal-danger',
  XCircle: 'tonal-danger',
  Ban: 'tonal-danger',
  AlertTriangle: 'tonal-danger',
  AlertCircle: 'tonal-danger',
  // 成功/执行/上传/保存/创建
  Check: 'tonal-success',
  CheckCircle2: 'tonal-success',
  Play: 'tonal-success',
  Upload: 'tonal-success',
  Save: 'tonal-success',
  Plus: 'tonal-success',
  FolderPlus: 'tonal-success',
  RefreshCw: 'tonal-success',
  RotateCcw: 'tonal-success',
  RotateCw: 'tonal-success',
  // 警告/打开/编辑/设置/查看
  FolderOpen: 'tonal-warning',
  Folder: 'tonal-warning',
  Edit2: 'tonal-warning',
  Edit: 'tonal-warning',
  Pencil: 'tonal-warning',
  Settings: 'tonal-warning',
  // 信息/下载/搜索/链接/复制
  Download: 'tonal-info',
  FileDown: 'tonal-info',
  Search: 'tonal-info',
  Info: 'tonal-info',
  Eye: 'tonal-info',
  ExternalLink: 'tonal-info',
  Link: 'tonal-info',
  Copy: 'tonal-info',
  Filter: 'tonal-info',
  // 品牌（紫蓝）
  Package: 'tonal',
  Sparkles: 'tonal',
  Bot: 'tonal',
  Brain: 'tonal',
  Star: 'tonal',
  Zap: 'tonal',
  Wand2: 'tonal',
  Send: 'tonal',
}

function walk(dir, list) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f)
    const s = fs.statSync(p)
    if (s.isDirectory()) walk(p, list)
    else if (/\.tsx$/.test(f)) list.push(p)
  }
}

/**
 * 匹配每个 <Button ...>...</Button> 块（含跨多行）。
 * 用平衡：Button 内部不允许嵌套另一个 <Button>（罕见），用最简单的非贪婪 + . 匹配。
 */
const BUTTON_BLOCK_RE = /<Button\b([^>]*)>([\s\S]*?)<\/Button>/g

function pickIconVariant(content) {
  // 尝试找第一个 <IconName ... /> 的 IconName
  const m = content.match(/<([A-Z]\w+)(?:\s|\/)/)
  if (!m) return null
  const iconName = m[1]
  return ICON_TO_VARIANT[iconName] || null
}

function processSrc(src) {
  let changed = false
  src = src.replace(BUTTON_BLOCK_RE, (m, attrs, content) => {
    // 必须是 variant="outline"
    if (!/variant="outline"/.test(attrs)) return m
    // 跳过明确指定颜色的（border/text/bg color 类）
    if (/className="[^"]*\b(border|text|bg)-(red|orange|amber|yellow|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-/.test(attrs)) return m

    const variant = pickIconVariant(content)
    if (!variant) return m

    // 替换 variant="outline" 为新的
    const newAttrs = attrs.replace(/variant="outline"/, `variant="${variant}"`)
    changed = true
    return `<Button${newAttrs}>${content}</Button>`
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
