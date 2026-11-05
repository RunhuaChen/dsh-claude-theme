// 用假的 CSSOM 跑一遍 client.js，验证「界面字号随正文字号等比缩放」的重写规则。
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const source = readFileSync(join(HERE, 'client.js'), 'utf8')

const styleRule = (selectorText, declarations) => {
  const map = new Map(Object.entries(declarations))
  return {
    type: 1,
    selectorText,
    style: { getPropertyValue: (name) => map.get(name) || '' },
  }
}

const mediaRule = (conditionText, cssRules) => ({ type: 4, conditionText, cssRules })

const head = []
const document = {
  head: { appendChild: (node) => head.push(node) },
  createElement: (tag) => ({
    tag,
    id: '',
    textContent: '',
    remove() {
      const index = head.indexOf(this)
      if (index >= 0) head.splice(index, 1)
    },
  }),
  styleSheets: [
    {
      ownerNode: { id: '' },
      cssRules: [
        styleRule('.wtg9ga_root', { 'font-size': '14px' }),
        styleRule('.wtg9ga_panelRow', { font: 'inherit' }),
        styleRule('.Zf6DNq_headline', { 'font-size': '15px', 'line-height': '24px' }),
        styleRule('.legacy_field', { font: '500 12px/16px Inter' }),
        styleRule('.markdown_body', { font: 'var(--dsw-font-markdown-base)' }),
        styleRule(':root', { 'font-size': '16px' }),
        styleRule('.huge_title', { 'font-size': '48px' }),
        mediaRule('(min-width: 600px)', [styleRule('.wide_menu', { 'font-size': '13px' })]),
      ],
    },
    {
      ownerNode: { id: 'dsh-claude-typography' },
      cssRules: [styleRule('.own_rule', { 'font-size': '14px' })],
    },
  ],
}

let loaded
const window = {
  requestAnimationFrame: (callback) => {
    callback()
    return 1
  },
  __ModuleLoader__: { load: (definition) => (loaded = definition) },
}

new Function('window', 'document', source)(window, document)

const plugin = loaded.factory(() => ({}))
const theme = { overrideTokens: () => () => {} }
plugin.apply({
  theme,
  effect(callback) {
    return callback()
  },
})

const chromeStyle = head.find((node) => node.id === 'dsh-claude-chrome-scale')
if (!chromeStyle) throw new Error('没有注入界面字号缩放样式')
const css = chromeStyle.textContent

const checks = [
  ['正文字号变量作为基准', css.includes('html body{font-size:var(--dsh-content-font-size, 14px)}'), true],
  ['侧栏字号被改写', css.includes('.wtg9ga_root{font-size:clamp('), true],
  ['标题字号与行高都被改写', css.includes('.Zf6DNq_headline{font-size:clamp(') && css.includes('line-height:clamp('), true],
  ['font 简写被改写', css.includes('.legacy_field{font:500 ') && css.includes('/ clamp('), true],
  ['@media 包了一层', css.includes('@media (min-width: 600px){.wide_menu{font-size:clamp('), true],
  ['font:inherit 不被改写', css.includes('.wtg9ga_panelRow'), false],
  ['var() 字号不被改写', css.includes('.markdown_body'), false],
  [':root 规则被跳过', css.includes(':root'), false],
  ['超大字号不缩放', css.includes('.huge_title'), false],
  ['跳过自己的样式表', css.includes('.own_rule'), false],
]

const failures = checks.filter(([, actual, expected]) => actual !== expected)
if (failures.length) {
  console.error(css)
  throw new Error('检查失败:\n' + failures.map(([label, actual, expected]) => `  ${label}: 实际 ${actual}，期望 ${expected}`).join('\n'))
}

const sample = css.split('\n').find((line) => line.startsWith('.wtg9ga_root'))
console.log('界面字号缩放校验通过')
console.log('示例:', sample)
console.log(`共改写 ${css.split('\n').length - 1} 条字号规则`)
