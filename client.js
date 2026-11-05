/* Claude 风格主题：暖纸质底色 + 赤陶强调色 + 衬线正文。
 * 颜色通过 ctx.theme.overrideTokens 注册（浅色、深色各一套），字体靠注入样式表。
 * 界面各处的固定 px 字号在页面加载时被改写成正文字号的等比缩放，跟随字号设置一起变大。
 * 由 tools/gen-theme-client.mjs 生成，改颜色请改脚本后重新生成。 */
window.__ModuleLoader__.load({
  id: '@crh1022/dsh-claude-theme',
  factory(require) {
    const THEME_ID = '@crh1022/dsh-claude-theme'

    const TOKENS = {
    '--dsw-static-neutral-bluish-00': { light: '#fcfcfb', dark: '#fcfcfb' },
    '--dsw-static-neutral-bluish-50': { light: '#f8f7f5', dark: '#f8f7f5' },
    '--dsw-static-neutral-bluish-55': { light: '#f6f4f0', dark: '#f6f4f0' },
    '--dsw-static-neutral-bluish-60': { light: '#f8f7f5', dark: '#f8f7f5' },
    '--dsw-static-neutral-bluish-75': { light: '#f2f0ec', dark: '#f2f0ec' },
    '--dsw-static-neutral-bluish-90': { light: '#efede9', dark: '#efede9' },
    '--dsw-static-neutral-bluish-100': { light: '#edebe6', dark: '#edebe6' },
    '--dsw-static-neutral-bluish-150': { light: '#ebe9e4', dark: '#ebe9e4' },
    '--dsw-static-neutral-bluish-200': { light: '#e7e5e0', dark: '#e7e5e0' },
    '--dsw-static-neutral-bluish-300': { light: '#d5d2cc', dark: '#d5d2cc' },
    '--dsw-static-neutral-bluish-310': { light: '#d4d1cb', dark: '#d4d1cb' },
    '--dsw-static-neutral-bluish-400': { light: '#b4b1aa', dark: '#b4b1aa' },
    '--dsw-static-neutral-bluish-500': { light: '#9f9c96', dark: '#9f9c96' },
    '--dsw-static-neutral-bluish-600': { light: '#87857f', dark: '#87857f' },
    '--dsw-static-neutral-bluish-700': { light: '#676560', dark: '#676560' },
    '--dsw-static-neutral-bluish-750': { light: '#474542', dark: '#474542' },
    '--dsw-static-neutral-bluish-800': { light: '#373633', dark: '#373633' },
    '--dsw-static-neutral-bluish-850': { light: '#2d2c29', dark: '#2d2c29' },
    '--dsw-static-neutral-bluish-875': { light: '#242321', dark: '#242321' },
    '--dsw-static-neutral-bluish-900': { light: '#1c1b19', dark: '#1c1b19' },
    '--dsw-static-neutral-bluish-950': { light: '#161514', dark: '#161514' },
    '--dsw-static-neutral-bluish-1000': { light: '#181817', dark: '#181817' },
    '--dsw-static-neutral-00': { light: '#fcfcfb', dark: '#fcfcfb' },
    '--dsw-static-neutral-50': { light: '#f8f7f5', dark: '#f8f7f5' },
    '--dsw-static-neutral-100': { light: '#f4f2ef', dark: '#f4f2ef' },
    '--dsw-static-neutral-150': { light: '#edeae5', dark: '#edeae5' },
    '--dsw-static-neutral-200': { light: '#e7e5e0', dark: '#e7e5e0' },
    '--dsw-static-neutral-250': { light: '#dfdcd6', dark: '#dfdcd6' },
    '--dsw-static-neutral-300': { light: '#d7d4ce', dark: '#d7d4ce' },
    '--dsw-static-neutral-400': { light: '#a6a39e', dark: '#a6a39e' },
    '--dsw-static-neutral-500': { light: '#84827d', dark: '#84827d' },
    '--dsw-static-neutral-550': { light: '#696762', dark: '#696762' },
    '--dsw-static-neutral-600': { light: '#575551', dark: '#575551' },
    '--dsw-static-neutral-700': { light: '#3d3c39', dark: '#3d3c39' },
    '--dsw-static-neutral-800': { light: '#2a2926', dark: '#2a2926' },
    '--dsw-static-neutral-850': { light: '#22211f', dark: '#22211f' },
    '--dsw-static-neutral-900': { light: '#100f0e', dark: '#100f0e' },
    '--dsw-static-neutral-1000': { light: '#1c1a16', dark: '#1c1a16' },
    '--dsw-static-blue-50': { light: '#fef2ee', dark: '#fef2ee' },
    '--dsw-static-blue-50p': { light: '#feeee9', dark: '#feeee9' },
    '--dsw-static-blue-75': { light: '#feeae4', dark: '#feeae4' },
    '--dsw-static-blue-100': { light: '#fce2d9', dark: '#fce2d9' },
    '--dsw-static-blue-300': { light: '#f7ac93', dark: '#f7ac93' },
    '--dsw-static-blue-400': { light: '#ed805c', dark: '#ed805c' },
    '--dsw-static-blue-450': { light: '#de704a', dark: '#de704a' },
    '--dsw-static-blue-500': { light: '#da7756', dark: '#ffa384' },
    '--dsw-static-blue-600': { light: '#b54a24', dark: '#b54a24' },
    '--dsw-static-blue-800': { light: '#892800', dark: '#892800' },
    '--dsw-static-blue-900': { light: '#621800', dark: '#621800' },
    '--dsw-static-blue-950': { light: '#4b1502', dark: '#4b1502' },
    '--dsw-static-deepseek-50': { light: '#fdefeb', dark: '#fdefeb' },
    '--dsw-static-deepseek-100': { light: '#fce8e1', dark: '#fce8e1' },
    '--dsw-static-deepseek-200': { light: '#fcd9cd', dark: '#fcd9cd' },
    '--dsw-static-deepseek-300': { light: '#f8b9a5', dark: '#f8b9a5' },
    '--dsw-static-deepseek-400': { light: '#f28b69', dark: '#f28b69' },
    '--dsw-static-deepseek-450': { light: '#d86a44', dark: '#d86a44' },
    '--dsw-static-deepseek-500': { light: '#c15b39', dark: '#e07754' },
    '--dsw-static-deepseek-600': { light: '#a54f31', dark: '#a54f31' },
    '--dsw-static-deepseek-800': { light: '#57382e', dark: '#57382e' },
    '--dsw-static-deepseek-900': { light: '#402b24', dark: '#402b24' },
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

    const TYPOGRAPHY = "html body{\n  --dsh-font-family-text: \"AnthropicSans Text\", \"AnthropicSans\", \"Microsoft YaHei UI\", \"Microsoft YaHei\", \"PingFang SC\", system-ui, sans-serif;\n  --dsh-font-family-code: \"AnthropicMono\", Consolas, \"Microsoft YaHei UI\", \"Microsoft YaHei\", monospace;\n  --dsh-font-family-terminal: \"AnthropicMono\", Consolas, \"Microsoft YaHei UI\", \"Microsoft YaHei\", monospace;\n  --dsh-claude-serif: \"AnthropicSerif Text\", \"AnthropicSerif\", \"Microsoft YaHei UI\", \"Microsoft YaHei\", \"PingFang SC\", Georgia, serif;\n}\nhtml body [class*=\"_markdown_\"]{font-family:var(--dsh-claude-serif)}\nhtml body [class*=\"_markdown_\"] :is(h1,h2,h3,h4,h5,h6,th,td){font-family:var(--dsh-claude-serif)}\nhtml body [class*=\"_markdown_\"] :is(pre,code,kbd,samp){font-family:var(--dsh-font-family-code)}"

    const FALLBACK_CSS = "html body{--dsw-static-neutral-bluish-00:#fcfcfb!important;--dsw-static-neutral-bluish-50:#f8f7f5!important;--dsw-static-neutral-bluish-55:#f6f4f0!important;--dsw-static-neutral-bluish-60:#f8f7f5!important;--dsw-static-neutral-bluish-75:#f2f0ec!important;--dsw-static-neutral-bluish-90:#efede9!important;--dsw-static-neutral-bluish-100:#edebe6!important;--dsw-static-neutral-bluish-150:#ebe9e4!important;--dsw-static-neutral-bluish-200:#e7e5e0!important;--dsw-static-neutral-bluish-300:#d5d2cc!important;--dsw-static-neutral-bluish-310:#d4d1cb!important;--dsw-static-neutral-bluish-400:#b4b1aa!important;--dsw-static-neutral-bluish-500:#9f9c96!important;--dsw-static-neutral-bluish-600:#87857f!important;--dsw-static-neutral-bluish-700:#676560!important;--dsw-static-neutral-bluish-750:#474542!important;--dsw-static-neutral-bluish-800:#373633!important;--dsw-static-neutral-bluish-850:#2d2c29!important;--dsw-static-neutral-bluish-875:#242321!important;--dsw-static-neutral-bluish-900:#1c1b19!important;--dsw-static-neutral-bluish-950:#161514!important;--dsw-static-neutral-bluish-1000:#181817!important;--dsw-static-neutral-00:#fcfcfb!important;--dsw-static-neutral-50:#f8f7f5!important;--dsw-static-neutral-100:#f4f2ef!important;--dsw-static-neutral-150:#edeae5!important;--dsw-static-neutral-200:#e7e5e0!important;--dsw-static-neutral-250:#dfdcd6!important;--dsw-static-neutral-300:#d7d4ce!important;--dsw-static-neutral-400:#a6a39e!important;--dsw-static-neutral-500:#84827d!important;--dsw-static-neutral-550:#696762!important;--dsw-static-neutral-600:#575551!important;--dsw-static-neutral-700:#3d3c39!important;--dsw-static-neutral-800:#2a2926!important;--dsw-static-neutral-850:#22211f!important;--dsw-static-neutral-900:#100f0e!important;--dsw-static-neutral-1000:#1c1a16!important;--dsw-static-blue-50:#fef2ee!important;--dsw-static-blue-50p:#feeee9!important;--dsw-static-blue-75:#feeae4!important;--dsw-static-blue-100:#fce2d9!important;--dsw-static-blue-300:#f7ac93!important;--dsw-static-blue-400:#ed805c!important;--dsw-static-blue-450:#de704a!important;--dsw-static-blue-500:#da7756!important;--dsw-static-blue-600:#b54a24!important;--dsw-static-blue-800:#892800!important;--dsw-static-blue-900:#621800!important;--dsw-static-blue-950:#4b1502!important;--dsw-static-deepseek-50:#fdefeb!important;--dsw-static-deepseek-100:#fce8e1!important;--dsw-static-deepseek-200:#fcd9cd!important;--dsw-static-deepseek-300:#f8b9a5!important;--dsw-static-deepseek-400:#f28b69!important;--dsw-static-deepseek-450:#d86a44!important;--dsw-static-deepseek-500:#c15b39!important;--dsw-static-deepseek-600:#a54f31!important;--dsw-static-deepseek-800:#57382e!important;--dsw-static-deepseek-900:#402b24!important;--dsw-alias-file-diff-added-marker:#22863a!important;--dsw-alias-file-diff-added-bg:#eaf4ea!important;--dsw-alias-file-diff-added-gutter:#f2f8f2!important;--dsw-alias-file-diff-deleted-marker:#cf3e2e!important;--dsw-alias-file-diff-deleted-bg:#fbeae5!important;--dsw-alias-file-diff-deleted-gutter:#fdf2ee!important;--dsw-alias-code-diff-added:rgba(34, 134, 58, 0.10)!important;--dsw-alias-code-diff-deleted:rgba(207, 62, 46, 0.10)!important;--dsw-alias-state-done-primary:#8f5f3a!important;--dsw-specific-bubble:#f3f0e8!important;--dsw-specific-bubble-highlight:#ecebe1!important;--dsw-menu-surface-fill:#fcfbf7!important;--dsw-specific-menu:#fcfbf7!important;--dsw-alias-menu-group-header-fill:#f8f6f0!important;--dsw-alias-border-l1:rgba(24, 24, 23, 0.06)!important;--dsw-alias-border-l2-darkmode-thin:rgba(24, 24, 23, 0.11)!important;--dsw-alias-border-l2:rgba(24, 24, 23, 0.12)!important;--dsw-alias-border-l3:rgba(24, 24, 23, 0.16)!important;--dsw-alias-border-l4:rgba(24, 24, 23, 0.22)!important;--dsw-alias-interactive-bg-hover:rgba(60, 52, 38, 0.06)!important;--dsw-alias-button-tool-bar-fill:rgba(60, 52, 38, 0.30)!important;--dsw-alias-button-tool-bar-hover:rgba(60, 52, 38, 0.45)!important}\nhtml body[data-ds-dark-theme]{--dsw-static-neutral-bluish-00:#fcfcfb!important;--dsw-static-neutral-bluish-50:#f8f7f5!important;--dsw-static-neutral-bluish-55:#f6f4f0!important;--dsw-static-neutral-bluish-60:#f8f7f5!important;--dsw-static-neutral-bluish-75:#f2f0ec!important;--dsw-static-neutral-bluish-90:#efede9!important;--dsw-static-neutral-bluish-100:#edebe6!important;--dsw-static-neutral-bluish-150:#ebe9e4!important;--dsw-static-neutral-bluish-200:#e7e5e0!important;--dsw-static-neutral-bluish-300:#d5d2cc!important;--dsw-static-neutral-bluish-310:#d4d1cb!important;--dsw-static-neutral-bluish-400:#b4b1aa!important;--dsw-static-neutral-bluish-500:#9f9c96!important;--dsw-static-neutral-bluish-600:#87857f!important;--dsw-static-neutral-bluish-700:#676560!important;--dsw-static-neutral-bluish-750:#474542!important;--dsw-static-neutral-bluish-800:#373633!important;--dsw-static-neutral-bluish-850:#2d2c29!important;--dsw-static-neutral-bluish-875:#242321!important;--dsw-static-neutral-bluish-900:#1c1b19!important;--dsw-static-neutral-bluish-950:#161514!important;--dsw-static-neutral-bluish-1000:#181817!important;--dsw-static-neutral-00:#fcfcfb!important;--dsw-static-neutral-50:#f8f7f5!important;--dsw-static-neutral-100:#f4f2ef!important;--dsw-static-neutral-150:#edeae5!important;--dsw-static-neutral-200:#e7e5e0!important;--dsw-static-neutral-250:#dfdcd6!important;--dsw-static-neutral-300:#d7d4ce!important;--dsw-static-neutral-400:#a6a39e!important;--dsw-static-neutral-500:#84827d!important;--dsw-static-neutral-550:#696762!important;--dsw-static-neutral-600:#575551!important;--dsw-static-neutral-700:#3d3c39!important;--dsw-static-neutral-800:#2a2926!important;--dsw-static-neutral-850:#22211f!important;--dsw-static-neutral-900:#100f0e!important;--dsw-static-neutral-1000:#1c1a16!important;--dsw-static-blue-50:#fef2ee!important;--dsw-static-blue-50p:#feeee9!important;--dsw-static-blue-75:#feeae4!important;--dsw-static-blue-100:#fce2d9!important;--dsw-static-blue-300:#f7ac93!important;--dsw-static-blue-400:#ed805c!important;--dsw-static-blue-450:#de704a!important;--dsw-static-blue-500:#ffa384!important;--dsw-static-blue-600:#b54a24!important;--dsw-static-blue-800:#892800!important;--dsw-static-blue-900:#621800!important;--dsw-static-blue-950:#4b1502!important;--dsw-static-deepseek-50:#fdefeb!important;--dsw-static-deepseek-100:#fce8e1!important;--dsw-static-deepseek-200:#fcd9cd!important;--dsw-static-deepseek-300:#f8b9a5!important;--dsw-static-deepseek-400:#f28b69!important;--dsw-static-deepseek-450:#d86a44!important;--dsw-static-deepseek-500:#e07754!important;--dsw-static-deepseek-600:#a54f31!important;--dsw-static-deepseek-800:#57382e!important;--dsw-static-deepseek-900:#402b24!important;--dsw-alias-file-diff-added-marker:#41c977!important;--dsw-alias-file-diff-added-bg:#1f3124!important;--dsw-alias-file-diff-added-gutter:#132016!important;--dsw-alias-file-diff-deleted-marker:#fa423e!important;--dsw-alias-file-diff-deleted-bg:#3c1f1b!important;--dsw-alias-file-diff-deleted-gutter:#28130e!important;--dsw-alias-code-diff-added:rgba(65, 201, 119, 0.15)!important;--dsw-alias-code-diff-deleted:rgba(250, 66, 62, 0.15)!important;--dsw-alias-state-done-primary:#c08a5f!important;--dsw-specific-bubble:#2e2c27!important;--dsw-specific-bubble-highlight:#3a3730!important;--dsw-menu-surface-fill:#2a2724!important;--dsw-specific-menu:#2a2724!important;--dsw-alias-menu-group-header-fill:#2d2a26!important;--dsw-alias-border-l1:rgba(255, 255, 255, 0.07)!important;--dsw-alias-border-l2-darkmode-thin:rgba(255, 255, 255, 0.06)!important;--dsw-alias-border-l2:rgba(255, 255, 255, 0.12)!important;--dsw-alias-border-l3:rgba(255, 255, 255, 0.16)!important;--dsw-alias-border-l4:rgba(255, 255, 255, 0.22)!important;--dsw-alias-interactive-bg-hover:rgba(255, 255, 255, 0.08)!important;--dsw-alias-button-tool-bar-fill:rgba(60, 52, 38, 0.30)!important;--dsw-alias-button-tool-bar-hover:rgba(60, 52, 38, 0.45)!important}"

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
    const PX_ONLY = /^([\d.]+)px$/
    const FONT_VALUE = /(\d+(?:\.\d+)?)px(\s*\/\s*(\d+(?:\.\d+)?)(px|em|%))?/

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
        style.textContent = ['html body{font-size:var(--dsh-content-font-size, 14px)}'].concat(rules).join('\n')
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
