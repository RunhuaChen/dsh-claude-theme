// 生成 Claude 主题插件的 client.js：暖纸质中性色板 + 赤陶强调色。
// 中性色保留原 OKLCH 明度（对比关系不变），色相旋到 85°（米黄）；强调色族旋到 accent 色相。
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const OUT = join(HERE, 'client.js')

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))
const toLinear = (c) => {
  const v = c / 255
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
}
const toSrgb = (lin) => {
  const v = clamp(lin, 0, 1)
  const s = v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055
  return clamp(Math.round(s * 255), 0, 255)
}
const parse = (hex) => {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? [...h].map((c) => c + c).join('') : h
  return [
    Number.parseInt(full.slice(0, 2), 16),
    Number.parseInt(full.slice(2, 4), 16),
    Number.parseInt(full.slice(4, 6), 16),
  ]
}
function oklabFromRgb([r8, g8, b8]) {
  const r = toLinear(r8)
  const g = toLinear(g8)
  const b = toLinear(b8)
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  return [L, A, B]
}
const lch = (hex) => {
  const [L, A, B] = oklabFromRgb(parse(hex))
  return { L, C: Math.hypot(A, B), H: (Math.atan2(B, A) * 180) / Math.PI }
}
function rgbFromOklch(L, C, Hdeg) {
  const rad = (Hdeg * Math.PI) / 180
  const A = C * Math.cos(rad)
  const B = C * Math.sin(rad)
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ]
}
const inGamut = (L, C, H) => rgbFromOklch(L, C, H).every((v) => v >= -0.0015 && v <= 1.0015)
function hexFromOklch(L, C, H) {
  let c = C
  while (c > 0 && !inGamut(L, c, H)) c -= 0.0015
  const [r, g, b] = rgbFromOklch(L, c, H)
  return `#${[r, g, b].map((v) => toSrgb(v).toString(16).padStart(2, '0')).join('')}`
}
const relLuma = (hex) => {
  const [r, g, b] = parse(hex).map(toLinear)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const contrast = (a, b) => {
  const [hi, lo] = [relLuma(a), relLuma(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

const SURFACE = '#fcfcfb'
const INK = '#181817'
const ACCENT = '#da7756'
const DARK_SURFACE = '#161512'
const accent = lch(ACCENT)

// 内置静态色板（浅色块）作为明度锚点
const BLUISH_ANCHORS = {
  0: '#ffffff',
  50: '#f9fafb',
  55: '#f5f7fa',
  60: '#f9fafb',
  75: '#f1f3f5',
  90: '#edf0f4',
  100: '#ebeef2',
  150: '#e9ecf2',
  200: '#e1e5ee',
  300: '#cfd3d6',
  310: '#cad2db',
  400: '#adb2b8',
  500: '#979da6',
  600: '#81858c',
  700: '#61666b',
  750: '#43454a',
  800: '#353638',
  850: '#2c2c2e',
  875: '#232324',
  900: '#1b1b1c',
  950: '#151517',
  1000: '#0f1115',
}
const NEUTRAL_ANCHORS = {
  0: '#ffffff',
  50: '#fafafa',
  100: '#f5f5f5',
  150: '#ededed',
  200: '#e5e5e5',
  250: '#dcdcdc',
  300: '#d4d4d4',
  400: '#a2a4a6',
  500: '#7f8287',
  550: '#65676b',
  600: '#545557',
  700: '#3c3c3d',
  800: '#292929',
  850: '#212123',
  900: '#0f0f0f',
  1000: '#000000',
}
const ACCENT_ANCHORS = {
  'blue-50': '#eff6ff',
  'blue-50p': '#eaf3ff',
  'blue-75': '#e5f0ff',
  'blue-100': '#dbeafe',
  'blue-300': '#93c5fd',
  'blue-400': '#60a5fa',
  'blue-450': '#4d93f8',
  'blue-500': '#3b82f6',
  'blue-600': '#2563eb',
  'blue-800': '#1e40af',
  'blue-900': '#0e3074',
  'blue-950': '#172554',
  'deepseek-50': '#edf3fe',
  'deepseek-100': '#e4edfd',
  'deepseek-200': '#d3e2ff',
  'deepseek-300': '#b7c8fe',
  'deepseek-400': '#7aaaff',
  'deepseek-450': '#5686fe',
  'deepseek-500': '#4176e6',
  'deepseek-600': '#4868b2',
  'deepseek-800': '#34415b',
  'deepseek-900': '#283142',
}

const NEUTRAL_HUE = 85
function warmth(L) {
  if (L > 0.975) return 0.0035
  if (L > 0.94) return 0.005
  if (L > 0.9) return 0.007
  if (L > 0.84) return 0.009
  if (L > 0.74) return 0.01
  if (L > 0.62) return 0.009
  if (L > 0.5) return 0.008
  if (L > 0.38) return 0.006
  if (L > 0.28) return 0.005
  if (L > 0.2) return 0.004
  return 0.003
}
const warmNeutral = (anchor) => {
  const { L } = lch(anchor)
  // 最亮的几档再压一点，让侧栏、代码块比画布稍沉。
  const level = L > 0.94 ? L - 0.008 : L
  return hexFromOklch(level, warmth(level), NEUTRAL_HUE)
}

const tokens = {}
const put = (name, value) => {
  tokens[name] = typeof value === 'string' ? { light: value, dark: value } : value
}
const same = (value) => ({ light: value, dark: value })

// 1. 暖中性静态色板
for (const [step, anchor] of Object.entries(BLUISH_ANCHORS)) {
  put(step === '0' ? '--dsw-static-neutral-bluish-00' : `--dsw-static-neutral-bluish-${step}`, warmNeutral(anchor))
}
for (const [step, anchor] of Object.entries(NEUTRAL_ANCHORS)) {
  put(step === '0' ? '--dsw-static-neutral-00' : `--dsw-static-neutral-${step}`, warmNeutral(anchor))
}
// 主题文件直接给定的颜色
put('--dsw-static-neutral-bluish-00', same(SURFACE))
put('--dsw-static-neutral-00', same(SURFACE))
put('--dsw-static-neutral-bluish-1000', same(INK))
put('--dsw-static-neutral-1000', same('#1c1a16'))

// 2. 强调色族：保明度、色相转到 accent，色度略收敛避免过艳
const ACCENT_CAP = 0.148
for (const [name, anchor] of Object.entries(ACCENT_ANCHORS)) {
  const { L, C } = lch(anchor)
  put(`--dsw-static-${name}`, same(hexFromOklch(L, Math.min(C, ACCENT_CAP), accent.H)))
}
// 链接与焦点环压暗 accent 以满足正文对比度；另一套给深色模式提亮
const reachContrast = (target, bg, startL, dir) => {
  let L = startL
  for (let i = 0; i < 600; i += 1) {
    const hex = hexFromOklch(L, 0.14, accent.H)
    if (contrast(hex, bg) >= target) return hex
    L += dir * 0.002
  }
  return hexFromOklch(startL, 0.14, accent.H)
}
const linkLight = reachContrast(4.2, SURFACE, accent.L, -1)
const linkDark = reachContrast(6.0, DARK_SURFACE, accent.L, 1)
put('--dsw-static-deepseek-500', { light: linkLight, dark: linkDark })
put('--dsw-static-blue-500', { light: ACCENT, dark: hexFromOklch(0.8, 0.13, accent.H) })

// 3. 主题文件显式给出的语义色、不透明窗口与气泡
const explicit = {
  '--dsw-alias-file-diff-added-marker': { light: '#22863a', dark: '#41c977' },
  '--dsw-alias-file-diff-added-bg': { light: '#eaf4ea', dark: '#1f3124' },
  '--dsw-alias-file-diff-added-gutter': { light: '#f2f8f2', dark: '#132016' },
  '--dsw-alias-file-diff-deleted-marker': { light: '#cf3e2e', dark: '#fa423e' },
  '--dsw-alias-file-diff-deleted-bg': { light: '#fbeae5', dark: '#3c1f1b' },
  '--dsw-alias-file-diff-deleted-gutter': { light: '#fdf2ee', dark: '#28130e' },
  '--dsw-alias-code-diff-added': { light: 'rgba(34, 134, 58, 0.10)', dark: 'rgba(65, 201, 119, 0.15)' },
  '--dsw-alias-code-diff-deleted': { light: 'rgba(207, 62, 46, 0.10)', dark: 'rgba(250, 66, 62, 0.15)' },
  '--dsw-alias-state-done-primary': { light: '#8f5f3a', dark: '#c08a5f' },
  '--dsw-specific-bubble': { light: '#f3f0e8', dark: '#2e2c27' },
  '--dsw-specific-bubble-highlight': { light: '#ecebe1', dark: '#3a3730' },
  '--dsw-menu-surface-fill': { light: '#fcfbf7', dark: '#2a2724' },
  '--dsw-specific-menu': { light: '#fcfbf7', dark: '#2a2724' },
  '--dsw-alias-menu-group-header-fill': { light: '#f8f6f0', dark: '#2d2a26' },
  '--dsw-alias-border-l1': { light: 'rgba(24, 24, 23, 0.06)', dark: 'rgba(255, 255, 255, 0.07)' },
  '--dsw-alias-border-l2-darkmode-thin': { light: 'rgba(24, 24, 23, 0.11)', dark: 'rgba(255, 255, 255, 0.06)' },
  '--dsw-alias-border-l2': { light: 'rgba(24, 24, 23, 0.12)', dark: 'rgba(255, 255, 255, 0.12)' },
  '--dsw-alias-border-l3': { light: 'rgba(24, 24, 23, 0.16)', dark: 'rgba(255, 255, 255, 0.16)' },
  '--dsw-alias-border-l4': { light: 'rgba(24, 24, 23, 0.22)', dark: 'rgba(255, 255, 255, 0.22)' },
  '--dsw-alias-interactive-bg-hover': { light: 'rgba(60, 52, 38, 0.06)', dark: 'rgba(255, 255, 255, 0.08)' },
  '--dsw-alias-button-tool-bar-fill': { light: 'rgba(60, 52, 38, 0.30)', dark: 'rgba(60, 52, 38, 0.30)' },
  '--dsw-alias-button-tool-bar-hover': { light: 'rgba(60, 52, 38, 0.45)', dark: 'rgba(60, 52, 38, 0.45)' },
}
for (const [name, value] of Object.entries(explicit)) put(name, value)

const TYPOGRAPHY = [
  'html body{',
  '  --dsh-font-family-text: "AnthropicSans Text", "AnthropicSans", "Microsoft YaHei UI", "Microsoft YaHei", "PingFang SC", system-ui, sans-serif;',
  '  --dsh-font-family-code: "AnthropicMono", Consolas, "Microsoft YaHei UI", "Microsoft YaHei", monospace;',
  '  --dsh-font-family-terminal: "AnthropicMono", Consolas, "Microsoft YaHei UI", "Microsoft YaHei", monospace;',
  '  --dsh-claude-serif: "AnthropicSerif Text", "AnthropicSerif", "Microsoft YaHei UI", "Microsoft YaHei", "PingFang SC", Georgia, serif;',
  '}',
  'html body [class*="_markdown_"]{font-family:var(--dsh-claude-serif)}',
  'html body [class*="_markdown_"] :is(h1,h2,h3,h4,h5,h6,th,td){font-family:var(--dsh-claude-serif)}',
  'html body [class*="_markdown_"] :is(pre,code,kbd,samp){font-family:var(--dsh-font-family-code)}',
].join('\n')

const entries = Object.entries(tokens)
const tokenLines = entries
  .map(([name, pair]) => `    '${name}': { light: '${pair.light}', dark: '${pair.dark}' },`)
  .join('\n')
const fallbackLight = entries.map(([name, pair]) => `${name}:${pair.light}!important`).join(';')
const fallbackDark = entries.map(([name, pair]) => `${name}:${pair.dark}!important`).join(';')
const FALLBACK_CSS = `html body{${fallbackLight}}\nhtml body[data-ds-dark-theme]{${fallbackDark}}`

const source = `/* Claude 风格主题：暖纸质底色 + 赤陶强调色 + 衬线正文。
 * 颜色通过 ctx.theme.overrideTokens 注册（浅色、深色各一套），字体靠注入样式表。
 * 界面各处的固定 px 字号在页面加载时被改写成正文字号的等比缩放，跟随字号设置一起变大。
 * 由 tools/gen-theme-client.mjs 生成，改颜色请改脚本后重新生成。 */
window.__ModuleLoader__.load({
  id: '@crh1022/dsh-claude-theme',
  factory(require) {
    const THEME_ID = '@crh1022/dsh-claude-theme'

    const TOKENS = {
${tokenLines}
    }

    const TYPOGRAPHY = ${JSON.stringify(TYPOGRAPHY)}

    const FALLBACK_CSS = ${JSON.stringify(FALLBACK_CSS)}

    function injectStyle(id, text) {
      const style = document.createElement('style')
      style.id = id
      style.textContent = text
      document.head.appendChild(style)
      return () => {
        style.remove()
      }
    }

    const CHROME_BASE = 14
    const CHROME_STYLE_ID = 'dsh-claude-chrome-scale'
    const PX_ONLY = /^([\\d.]+)px$/
    const FONT_VALUE = /(\\d+(?:\\.\\d+)?)px(\\s*\\/\\s*(\\d+(?:\\.\\d+)?)(px|em|%))?/

    // 固定 px 字号 -> 按 14px 为基准等比放大到当前正文字号
    function chromeLength(px) {
      const ratio = (px / CHROME_BASE).toFixed(4)
      const low = (px * 0.9).toFixed(2)
      const high = (px * 1.35).toFixed(2)
      return (
        'clamp(' + low + 'px, calc(' + ratio + ' * var(--dsh-content-font-size, 14px)), ' + high + 'px)'
      )
    }

    function chromeDeclarations(rule) {
      const declarations = []
      const size = PX_ONLY.exec((rule.style.getPropertyValue('font-size') || '').trim())
      if (size) {
        const px = parseFloat(size[1])
        if (px >= 9 && px <= 20) declarations.push('font-size:' + chromeLength(px) + '!important')
      }
      const height = PX_ONLY.exec((rule.style.getPropertyValue('line-height') || '').trim())
      if (height) {
        const px = parseFloat(height[1])
        if (px >= 9 && px <= 40) declarations.push('line-height:' + chromeLength(px) + '!important')
      }
      const shorthand = rule.style.getPropertyValue('font')
      if (shorthand && shorthand.indexOf('var(') < 0 && shorthand.indexOf('inherit') < 0) {
        const match = FONT_VALUE.exec(shorthand)
        if (match) {
          const px = parseFloat(match[1])
          if (px >= 9 && px <= 20) {
            let replacement = chromeLength(px)
            if (match[2]) {
              const linePx = parseFloat(match[3])
              replacement +=
                ' / ' + (match[4] === 'px' && linePx >= 9 && linePx <= 40 ? chromeLength(linePx) : match[3] + match[4])
            }
            declarations.push(
              'font:' + shorthand.slice(0, match.index) + replacement + shorthand.slice(match.index + match[0].length) + '!important',
            )
          }
        }
      }
      return declarations
    }

    function collectChromeRules() {
      const output = []
      const visit = (rules, media) => {
        for (const rule of Array.from(rules)) {
          if (!rule) continue
          if (rule.type === 1) {
            const selector = rule.selectorText
            if (!selector || selector.indexOf(':root') >= 0) continue
            const declarations = chromeDeclarations(rule)
            if (!declarations.length) continue
            const block = selector + '{' + declarations.join(';') + '}'
            output.push(media ? '@media ' + media + '{' + block + '}' : block)
          } else if (rule.cssRules && rule.cssRules.length) {
            const condition = rule.conditionText || ''
            if (!condition) continue
            visit(rule.cssRules, media ? media + ' and ' + condition : condition)
          }
        }
      }
      const sheets = document.styleSheets
      if (!sheets) return output
      for (const sheet of Array.from(sheets)) {
        const owner = sheet.ownerNode
        if (owner && owner.id && owner.id.indexOf('dsh-claude-') === 0) continue
        let rules
        try {
          rules = sheet.cssRules
        } catch (error) {
          continue
        }
        if (!rules) continue
        visit(rules, '')
      }
      return output
    }

    function installChromeScale() {
      const style = document.createElement('style')
      style.id = CHROME_STYLE_ID
      let frame = 0
      const render = () => {
        frame = 0
        const rules = collectChromeRules()
        style.textContent = ['html body{font-size:var(--dsh-content-font-size, 14px)}'].concat(rules).join('\\n')
      }
      const schedule = () => {
        if (frame) return
        if (typeof window.requestAnimationFrame === 'function') frame = window.requestAnimationFrame(render)
        else frame = setTimeout(render, 50)
      }
      document.head.appendChild(style)
      render()
      const Observer = window.MutationObserver
      const observer = typeof Observer === 'function' ? new Observer(schedule) : null
      if (observer) observer.observe(document.head, { childList: true })
      return () => {
        if (observer) observer.disconnect()
        style.remove()
      }
    }

    return {
      inject: ['theme'],
      apply(ctx) {
        ctx.effect(() => {
          const theme = ctx.theme
          if (!theme || typeof theme.overrideTokens !== 'function') {
            return injectStyle('dsh-claude-palette', FALLBACK_CSS)
          }
          try {
            return theme.overrideTokens(THEME_ID, TOKENS)
          } catch (error) {
            console.error('[claude-theme] 注册 token 覆盖失败，退回样式表方案', error)
            return injectStyle('dsh-claude-palette', FALLBACK_CSS)
          }
        }, 'claude-theme: palette')

        ctx.effect(() => injectStyle('dsh-claude-typography', TYPOGRAPHY), 'claude-theme: typography')

        ctx.effect(() => installChromeScale(), 'claude-theme: chrome scale')
      },
    }
  },
})
`

mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, source, 'utf8')

console.log(`token 条目 ${entries.length} 个 -> ${OUT}`)
console.log('accent oklch', accent)
console.log('\n对比度核算（浅色底 #fcfcfb / 深色底 #161512）')
for (const [name, pair] of entries) {
  if (!name.includes('neutral-bluish-1000') && !name.includes('neutral-bluish-700') && !name.includes('neutral-bluish-600') && !name.includes('neutral-bluish-400') && !name.includes('deepseek-500') && !name.includes('blue-500') && !name.includes('deepseek-400') && !name.includes('deepseek-450')) continue
  console.log(
    name.padEnd(36),
    pair.light,
    contrast(pair.light, SURFACE).toFixed(2).padStart(5),
    '|',
    pair.dark,
    contrast(pair.dark, DARK_SURFACE).toFixed(2).padStart(5),
  )
}
