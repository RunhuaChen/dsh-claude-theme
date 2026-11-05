// 在 Node 里用桩对象跑一遍 client.js，验证模块注册、token 形状与样式注入逻辑。
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const source = readFileSync(join(HERE, 'client.js'), 'utf8')

const head = []
const document = {
  head: {
    appendChild(node) {
      head.push(node)
    },
  },
  createElement(tag) {
    return {
      tag,
      id: '',
      textContent: '',
      remove() {
        const index = head.indexOf(this)
        if (index >= 0) head.splice(index, 1)
      },
    }
  },
}

let loaded
const window = {
  __ModuleLoader__: {
    load(definition) {
      loaded = definition
    },
  },
}

new Function('window', 'document', source)(window, document)

if (!loaded) throw new Error('模块没有通过 __ModuleLoader__.load 注册')
if (loaded.id !== '@crh1022/dsh-claude-theme') throw new Error(`模块 id 不符: ${loaded.id}`)

const required = []
const plugin = loaded.factory((id) => {
  required.push(id)
  return {}
})
if (!Array.isArray(plugin.inject) || plugin.inject[0] !== 'theme') throw new Error('inject 未声明 theme')
if (typeof plugin.apply !== 'function') throw new Error('缺少 apply')

let registered = null
const theme = {
  overrideTokens(source, tokens) {
    registered = { source, tokens }
    return () => {
      registered = null
    }
  },
}

const disposers = []
const ctx = {
  theme,
  effect(callback, label) {
    const dispose = callback()
    if (typeof dispose !== 'function') throw new Error(`effect ${label} 没有返回清理函数`)
    disposers.push(dispose)
    return dispose
  },
}

plugin.apply(ctx)

if (!registered) throw new Error('没有调用 overrideTokens')
if (registered.source !== '@crh1022/dsh-claude-theme') throw new Error('overrideTokens source 不符')

const problems = []
const pattern = /^(#[0-9a-f]{6}|rgba\([0-9., ]+\))$/i
const entries = Object.entries(registered.tokens)
for (const [name, value] of entries) {
  if (!name.startsWith('--dsw-')) problems.push(`${name} 前缀不对`)
  else if (typeof value === 'string') problems.push(`${name} 是裸字符串，必须 {light,dark}`)
  else if (typeof value.light !== 'string' || typeof value.dark !== 'string')
    problems.push(`${name} 不是 {light,dark}`)
  else if (!pattern.test(value.light)) problems.push(`${name} light 值不合法: ${value.light}`)
  else if (!pattern.test(value.dark)) problems.push(`${name} dark 值不合法: ${value.dark}`)
}
if (problems.length) throw new Error(`token 校验失败:\n  ${problems.join('\n  ')}`)

const styles = head.map((node) => node.textContent).join('\n')
if (!styles.includes('--dsh-font-family-text')) throw new Error('没有注入字体样式')
if (!styles.includes('AnthropicSerif')) throw new Error('没有注入衬线正文样式')
if (!styles.includes('AnthropicMono')) throw new Error('没有注入等宽字体样式')
if (!styles.includes('--dsh-content-font-size')) throw new Error('没有注入界面字号缩放样式')

if (disposers.length !== 3) throw new Error(`期望 3 个清理函数，实际 ${disposers.length}`)
for (const dispose of disposers) dispose()
if (registered !== null) throw new Error('dispose 后覆盖层没有移除')
if (head.length !== 0) throw new Error('dispose 后样式表没有移除')

const count = (prefix) => entries.filter(([name]) => name.startsWith(prefix)).length
console.log(`模块 ${loaded.id} 校验通过`)
console.log(`覆盖 token ${entries.length} 个：静态色板 ${count('--dsw-static-')}、别名 ${count('--dsw-alias-')}、其他 ${count('--dsw-specific-') + count('--dsw-menu-')}`)
console.log('required 模块:', required.length === 0 ? '（工厂未 require 任何模块）' : required.join(','))
