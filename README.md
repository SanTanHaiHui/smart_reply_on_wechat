# 接话 (smart_reply_on_wechat)

一个基于大语言模型的微信小程序，专门为**微信聊天**场景设计，帮助用户在与他人微信沟通时找到合适的回复。支持多轮对话分析、聊天截图识别、多种回复风格等功能。

## ✨ 功能特点

- 🎯 **智能回复生成**：专门为微信聊天场景优化，根据对方话语和上下文语境，生成3-5个不同风格的回复选项
- 📷 **聊天截图识别**：支持上传微信聊天截图，AI自动识别图片中的对话内容（绿框为用户话语，白框为对方话语），并基于最后一条消息生成合适的回复
- ⚙️ **灵活配置**：支持设置关系类型（恋人/同事/领导/朋友）、关系密度、回复风格（幽默/轻松/夸夸/严肃/严厉）
- 🎨 **优雅UI**：采用蓝白配色体系，简洁现代的界面设计
- 💬 **即时对话**：首页即可输入，无需跳转
- 🔄 **多轮对话**：支持上下文理解，基于历史对话生成回复

## 📹 演示视频

展示如何使用"接话"小程序进行微信聊天回复：

<div align="center">
  <img src="demo.gif" alt="Demo GIF" width="600"/>
</div>

## 🚀 快速开始

### 前置要求

- 微信开发者工具
- 豆包API密钥（推荐）或腾讯云Agent botId
- 微信小程序AppID

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/SanTanHaiHui/smart_reply_on_wechat.git
   cd smart_reply_on_wechat
   ```

2. **配置API密钥**

   打开 `smart_reply_on_wechat/pages/index/index.js`，找到 `agentConfig` 配置项：

   ```javascript
   agentConfig: {
     // 豆包API配置（推荐）
     doubaoApiKey: "your-doubao-api-key-here", // 从火山引擎控制台获取
     doubaoModel: "doubao-seed-1-6-flash-250828",
     useDoubao: true, // true=使用豆包，false=使用腾讯云
     
     // 腾讯云API配置（可选）
     botId: "your-bot-id-here", // 使用腾讯云时需要
     
     // 功能开关
     allowUploadImage: true, // 启用图片上传
     // ... 其他配置
   }
   ```

3. **配置小程序AppID**

   打开 `project.config.json`，修改 `appid`：

   ```json
   {
     "appid": "your-miniprogram-appid"
   }
   ```

4. **配置域名白名单**

   在微信公众平台配置request合法域名：
   - 开发 -> 开发管理 -> 开发设置 -> 服务器域名
   - 添加：`https://ark.cn-beijing.volces.com`（使用豆包API时）

5. **运行项目**

   使用微信开发者工具打开项目，点击"编译"即可运行。

## 📖 使用说明

### 基本使用

1. **输入对方话语**：在输入框中输入对方说的话
2. **配置对话参数**：点击右上角的配置按钮（⚙），设置：
   - **关系**：恋人、同事、领导、朋友
   - **关系密度**：陌生人、刚认识、很熟、非常熟
   - **回复风格**：幽默、轻松、夸夸、严肃、严厉
3. **获取回复选项**：AI会根据你的配置和输入，生成多个合适的回复选项
4. **复制使用**：点击"复制"按钮即可复制回复文案

### 微信聊天截图识别功能

1. 点击输入框右侧的"+"按钮
2. 选择"图片"或"相机"
3. 选择或拍摄微信聊天截图（支持多轮对话截图）
4. AI会自动识别截图中的对话内容：
   - 绿框识别为用户（自己）的话语
   - 白框识别为对方的话语
   - 基于对方最后一条消息生成合适的回复
5. 输入问题（可选）后发送，即可获得AI生成的回复选项

## 🏗️ 项目结构

```
smart_reply_on_wechat/
├── pages/
│   └── index/              # 首页（聊天界面）
│       ├── index.js        # 页面逻辑（包含配置）
│       ├── index.wxml      # 页面结构
│       └── index.wxss      # 页面样式
├── components/
│   ├── agent-ui/           # AI聊天组件
│   │   ├── index.js        # 核心聊天逻辑
│   │   ├── chatFile/       # 文件上传组件
│   │   └── wd-markdown/   # Markdown渲染组件
│   ├── reply-options/      # 回复选项展示组件
│   └── config-panel/       # 配置面板组件
├── utils/
│   └── doubao-api.js      # 豆包API调用工具
├── app.js                  # 应用入口
└── app.json                # 应用配置
```

## 🔧 技术栈

- **框架**：微信小程序原生框架
- **大语言模型**：豆包大模型（火山引擎）或腾讯云AI Agent
- **UI设计**：蓝白配色体系，简洁现代

## 📝 配置说明

### 豆包API配置（推荐）

1. 访问[火山引擎控制台](https://console.volcengine.com/)
2. 创建API密钥
3. 在 `smart_reply_on_wechat/pages/index/index.js` 中配置 `doubaoApiKey`

### 腾讯云API配置（可选）

1. 在腾讯云开发平台创建AI Agent
2. 获取botId
3. 在配置中设置 `useDoubao: false` 并填入 `botId`

### 系统提示词

系统提示词定义在 `smart_reply_on_wechat/pages/index/index.js` 的 `getSystemPrompt()` 方法中，可以根据需求自定义修改。

## 🤝 贡献指南

欢迎贡献代码！请查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解详细信息。

## 📄 许可证

本项目采用 [MIT License](LICENSE) 开源协议。

## 🙏 致谢

- [豆包大模型](https://www.volcengine.com/product/doubao) - 提供强大的AI能力
- 微信小程序平台 - 提供开发框架

## 📮 反馈与支持

如有问题或建议，欢迎提交 [Issue](https://github.com/SanTanHaiHui/smart_reply_on_wechat/issues)。

## 🔗 项目链接

- **GitHub仓库**：https://github.com/SanTanHaiHui/smart_reply_on_wechat

---

⭐ 如果这个项目对你有帮助，欢迎 Star！
