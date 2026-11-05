# dsh-claude-theme

给 DeepSeek Harness（DSH）Web 界面用的 Claude 风格主题：暖纸质底色、赤陶强调色、Anthropic 字体，外加让整个界面跟着字号设置一起缩放。

配色由作者在 OpenAI Codex 的 `absolutely` 主题基础上自行调校而来：保留它纸白 `#fcfcfb`、近黑 `#181817`、赤陶 `#da7756` 的基调，重新推导了整套中性色阶和强调色阶，并补齐到 DSH 需要的 82 个颜色变量。深浅两套都做了，跟随 DSH 的「浅色 / 深色 / 跟随系统」设置。

## 效果

| 项目 | 说明 |
| --- | --- |
| 底色 | 纸白 `#fcfcfb`，侧栏和代码块略沉一点 |
| 文字 | 近黑 `#181817`，次要文字是暖灰阶 |
| 强调色 | 赤陶橙 `#da7756`，用在链接、焦点环、选中态、信息按钮 |
| 差异色 | 新增 `#22863a`、删除 `#cf3e2e`（文件 diff 的标记、底色、行号槽） |
| 完成态 | `#8f5f3a`，替换原本的紫色 |
| 弹层 | 菜单改成不透明暖白，不再透出底下的内容 |
| 正文 | 会话内容用 Anthropic Serif 衬线体 |
| 代码 | Anthropic Mono 等宽体 |
| 界面字号 | 侧栏、顶栏、按钮、菜单的字号跟随「设置 → 外观 → 字体大小」一起缩放 |

## 字体

插件不打包字体文件。Anthropic 的字体归 Anthropic 所有，只允许个人使用，不能随插件再分发。没装字体时界面会回退到系统字体，主题颜色和排版规则照常生效。

想要和截图完全一致的效果，自己安装这三款字体（Text 光学尺寸的 Regular 和 Bold 就够）：

```
AnthropicSans-Regular.ttf    AnthropicSans-Bold.ttf
AnthropicSerif-Regular.ttf   AnthropicSerif-Bold.ttf
AnthropicMono-Regular.ttf
```

GitHub 上有几个第三方仓库提供这些字体的 TTF 和 woff2 导出，例如 [matthieuhuguet/anthropic-fonts](https://github.com/matthieuhuguet/anthropic-fonts)（`ttf/` 目录）。也可以从 Claude 的桌面应用里提取。安装后重新加载页面即可，不需要重启 DSH。

中文字体不需要额外安装，会回退到系统里的雅黑或苹方。

## 安装

前提：DSH 运行时版本 `>=0.2.0-rc.1 <0.3.0-0`，并且在 Web 界面里使用。

克隆仓库，然后把仓库根目录交给 DSH 的插件安装器：

```bash
git clone https://github.com/RunhuaChen/dsh-claude-theme.git
```

在 DSH 的会话里让 Agent 安装这个本地包目录：

> 用 plugin_manager 把我的 dsh-claude-theme 仓库目录装成 bundle，目录是 /你的路径/dsh-claude-theme

或者直接调用插件管理工具：

```json
{ "action": "install_bundle", "target": "/你的路径/dsh-claude-theme" }
```

安装完成后刷新页面。如果刷新后没有任何变化，把 DSH 应用完整重启一次，让客户端模块清单重新收集。

卸载：

```json
{ "action": "remove_bundle", "target": "@RunhuaChen/dsh-claude-theme" }
```

## 工作原理

插件是一个只带客户端模块的 DSH bundle：

- `index.js` 是宿主侧入口，留空。
- `cordis.patch.yml` 往组合里插一行 `dsh-claude-theme`。
- `client.js` 在 Web 界面里做三件事：
  1. 调用 `ctx.theme.overrideTokens()` 注册 82 个 `--dsw-*` 颜色 token，每个 token 给出浅色和深色两个值。这是 DSH 官方的主题扩展点，优先于内置样式表，也自动跟随明暗切换。
  2. 注入一段样式表，把 `--dsh-font-family-text`、`--dsh-font-family-code`、`--dsh-font-family-terminal` 指向 Anthropic 字体，并给会话正文和标题套上衬线字体（`pre`、`code` 仍用等宽体）。
  3. 读出页面上所有已生效的样式表，把 9–20px 的固定字号改写成以正文字号为基准的等比缩放，这样侧栏、顶栏、按钮、菜单这些写死像素的界面元素也会跟着字号设置变化。上限是原来的 1.35 倍，避免撑破布局。

颜色不走样式表覆盖，是因为 DSH 的 token 展示层把颜色写成 body 的内联自定义属性，只有 `overrideTokens` 这种方式才能稳定压过内置值。

## 已知限制

- 只适配 Web 界面，桌面端的原生窗口框架不在范围内。
- 界面字号缩放只改字号和行高，不改按钮写死的高度和内边距。个别按钮在极大字号下可能显得紧凑。
- 界面缩放依赖运行时读取样式表，DSH 大版本改动样式结构后可能需要更新插件。
- 代码块里语法高亮的具体颜色由 DSH 的 shiki 主题决定，插件只改代码块的底色和边框，改不了高亮色本身。

## 开发

`client.js` 由仓库的生成脚本生成，色板在脚本里用 OKLCH 推导（中性色相 85°，强调色相 39°），改颜色请改脚本后重新生成，不要手改 `client.js`。

```bash
node gen-theme-client.mjs      # 重新生成 client.js
node check-theme-client.mjs    # 桩测：模块注册、token 形状、样式注入
node check-chrome-scale.mjs    # 桩测：界面字号改写规则
```

## 许可

代码以 MIT 许可发布，见 `LICENSE`。配色方案由本项目作者调校，按同一许可开放，转载或二次分发时请保留出处。Anthropic 字体不在此许可范围内，插件也不包含任何字体文件。

## 致谢

配色由本项目的作者在 OpenAI Codex 的 `absolutely` 主题基础上自行优化，并适配为 DSH 的颜色体系。字体属于 Anthropic，界面结构属于 DeepSeek Harness。
