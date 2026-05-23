const fs = require('fs')

const f = 'frontend/src/components/workflow/GlobalConfigDialog.tsx'
let s = fs.readFileSync(f, 'utf8')
const before = s

const FROM = `'border-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]'`
const TO = `'border-[hsl(var(--slate-200))] bg-[hsl(var(--slate-100))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--slate-200))]'`

while (s.includes(FROM)) {
  s = s.replace(FROM, TO)
}

fs.writeFileSync(f, s, 'utf8')
console.log('changed:', s !== before)
