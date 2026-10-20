# DSH 百图品牌插件

把 DeepSeek Harness **界面里**的品牌名与图标换成「百图」。

## ✨ 功能

插件通过 DSH 官方的 **UI Slot 机制**（而不是改 DOM 文本）替换品牌位：

| 位置 | 效果 |
| --- | --- |
| 侧边栏左上角（展开态） | 「DeepSeek HARNESS」→「百图 HARNESS」（百图 + 官方同款 HARNESS 小徽章），图标 → 百图图标 |
| 侧边栏（收起轨道） | 图标 → 百图图标 |
| 会话首屏（空会话页） | 官方动画鱼图标 → 百图图标 |
| 插件管理 → 已安装插件列表 | 插件卡片图标 → 百图图标（包 manifest 的 `icon` 字段） |
| 浏览器标签页（Web 方式打开时） | 标题 →「百图 HARNESS」，favicon → 百图图标 |

只有真正被 UI 渲染的 slot 才会变化，不改动页面其它文字，也不会干扰输入框、代码块等内容。

## ⚠️ 能力边界（重要）

DSH 插件运行在 **应用内部（Web 客户端层）**，因此：

- ✅ 可以改：应用窗口内显示的侧边栏品牌名/图标、首屏图标、网页标题与 favicon。
- ❌ 不能改：**macOS 应用本身**的 Dock 图标、程序名、菜单栏名称（「DeepSeek Harness」）。

Dock 图标与应用名来自 `/Applications/DeepSeek Harness.app` 这个安装包（`Info.plist`、`icon.icns`），属于应用打包资源，插件没有权限、也不应该去改它——即使改了，应用更新或重装也会被覆盖。若需要替换 Dock 图标，只能自行修改应用包（会破坏签名，且每次更新都要重做），不属于插件能力范围。

## 📦 安装（在 DSH 图形界面里完成）

1. 打开 DeepSeek Harness → 插件管理 → 「添加插件」。
2. 填入 GitHub 地址：

   ```
   https://github.com/litianbu/dsh-plugin-baitu-branding
   ```

3. 安装完成后**启用插件**，然后重启 DeepSeek Harness（或重新打开窗口）。
4. 侧边栏左上角应显示「百图」+ 百图图标。

> 若公司网络导致 git 无法直连 GitHub，可改用 `.tgz` 直链安装（跳过 git 连接检查）：
> `https://github.com/litianbu/dsh-plugin-baitu-branding/archive/refs/heads/main.tar.gz`

## 🧱 项目结构

```
dsh-plugin-baitu-branding/
├── package.json          # 插件清单（dsh.bundle.patch + dsh.client）
├── cordis.patch.yml      # 把插件插入 DSH 的插件列表
├── lib/
│   ├── index.js          # 服务端入口（空实现，仅占位）
│   └── client.js         # 浏览器端：注册品牌 slot + 标题/favicon
├── assets/
│   └── icon.svg          # 百图图标（内嵌 PNG，单文件可离线使用）
├── locale/
│   ├── zh.json
│   └── en.json
└── README.md
```

## 🔧 工作原理

`lib/client.js` 是一个 DSH **客户端模块**（浏览器端），按官方约定通过
`window.__ModuleLoader__.load({ id, factory })` 注册，导出 `inject` 与 `apply`：

- `apply(ctx)` 里用 `ctx.slots.inject(...)` 等待侧边栏声明后，用
  `ctx.slots.register({ name: 'sidebar.brand.mark' }, BaituMark)` 与
  `ctx.slots.register({ name: 'sidebar.brand.name' }, BaituName)` 占据品牌位；
  同时注册 `conversation.hero.brand.mark` 替换首屏图标。
- 用 `ctx.effect(...)` 设置 `document.title` 与 favicon，并在插件卸载时还原。
- 图标以 `data:image/png;base64,...` 内联进 `lib/client.js`，无需额外静态资源服务。

**遮蔽官方条目**：官方 `@deepseek-ai/dsh-client-ui-brand-official` 已以默认
`priority: 0` 占据 `sidebar.brand.mark` / `sidebar.brand.name`。DSH 的 single slot
在同一优先级上只允许一个注册（重复注册会直接抛错），而**数字越小越优先渲染**，
因此本插件以 `priority: -1` 注册，从而遮蔽官方条目；无需禁用官方插件。

## ⚙️ 自定义

- 改名称：编辑 `lib/client.js` 里的 `const NAME = "百图";`（品牌名）与 `const TITLE = "百图 HARNESS";`（标签页标题）。
- 改 HARNESS 徽章：徽章是官方 wordmark 的矢量字形（`HARNESS_PATHS`），不是字体排版；要换文字需要替换对应矢量路径。
- 改图标：替换 `assets/icon.svg`，并把新图标的 base64 同步进 `lib/client.js` 的 `MARK` 常量。

## 📝 开发与验证

```bash
# 语法检查
node --check lib/client.js
```

改完代码后，需要在 DSH 中更新插件（重新安装 GitHub 地址，或更新本地副本）并重启应用，
因为客户端 bundle 在启动时组合、带不可变 revision。

## 📄 许可证

MIT License