# DSH 百图品牌插件

将 DeepSeek Harness 客户端品牌改为"百图"，使用自定义图标。

## ✨ 功能

- 🎯 将页面标题改为"百图"
- 🎨 替换浏览器标签页图标为自定义 SVG
- 📝 自动替换页面中所有"DeepSeek Harness"文本为"百图"
- 👀 使用 MutationObserver 监控 DOM 变化，确保动态加载的内容也会被替换
- 🌍 支持中英文界面

## 📦 安装

### 方式 1：从 GitHub 安装（推荐）

1. 克隆此仓库：
```bash
git clone https://github.com/YOUR_USERNAME/dsh-plugin-baitu-branding.git
```

2. 将插件链接到 DSH 插件目录：
```bash
# macOS/Linux
ln -s "$(pwd)" ~/.dsh/profiles/desktop/node_modules/dsh-plugin-baitu-branding

# Windows (需要管理员权限)
mklink /D "%USERPROFILE%\.dsh\profiles\desktop\node_modules\dsh-plugin-baitu-branding" "%CD%"
```

3. 在 DSH 配置中启用插件：
编辑 `~/.dsh/profiles/desktop/package.json`，添加：
```json
{
  "dependencies": {
    "dsh-plugin-baitu-branding": "^1.0.0"
  },
  "dsh": {
    "profile": {
      "bundles": [
        "dsh-plugin-baitu-branding"
      ]
    }
  }
}
```

4. 重启 DeepSeek Harness

### 方式 2：直接复制

1. 下载或克隆此仓库
2. 将整个目录复制到 DSH 插件目录：
```bash
cp -r dsh-plugin-baitu-branding ~/.dsh/profiles/desktop/node_modules/
```
3. 按照"方式 1"的步骤 3 和 4 配置并重启

## 📁 项目结构

```
dsh-plugin-baitu-branding/
├── package.json          # 插件配置和元数据
├── cordis.patch.yml      # Cordis 插件注册
├── README.md            # 说明文档
├── .gitignore           # Git 忽略文件
├── lib/
│   ├── index.js         # 服务端入口
│   └── client.js        # 客户端实现（核心逻辑）
├── assets/
│   └── icon.svg         # 自定义百图图标
└── locale/
    ├── zh.json          # 中文本地化
    └── en.json          # 英文本地化
```

## 🔧 工作原理

插件通过以下方式实现品牌替换：

1. **页面标题**: 直接修改 `document.title`
2. **图标**: 加载 `assets/icon.svg` 并转换为 Blob URL，替换所有 favicon 链接
3. **文本替换**: 使用 TreeWalker 遍历 DOM，替换所有包含"DeepSeek Harness"的文本节点
4. **动态监控**: 使用 MutationObserver 监控 DOM 变化，确保新加载的内容也会被处理
5. **标题保护**: 监听标题变化，防止被覆盖

## ⚙️ 自定义

### 修改品牌名称

编辑 `lib/client.js`，搜索"百图"并替换为你想要的名称：

```javascript
document.title = '你的品牌名称';
```

### 修改图标

替换 `assets/icon.svg` 文件为你的自定义 SVG 图标。

## 🚀 发布到 npm

如果你想将插件发布到 npm：

```bash
# 登录 npm
npm login

# 发布
npm publish
```

发布后，用户可以通过以下方式安装：

```bash
cd ~/.dsh/profiles/desktop
npm install dsh-plugin-baitu-branding
```

## 📝 开发

### 本地开发

1. 在开发目录中修改代码
2. 使用符号链接安装到 DSH
3. 重启 DSH 查看效果

### 测试

重启 DSH 后，检查：
- 浏览器标签页标题是否显示"百图"
- 标签页图标是否为自定义 SVG
- 页面中的"DeepSeek Harness"文本是否被替换

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🙏 致谢

- [DeepSeek Harness](https://github.com/deepseek-ai/dsh) - 优秀的 AI 开发工具
- 图标设计灵感来自百图项目
