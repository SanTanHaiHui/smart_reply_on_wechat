# 配置指南

本文档详细说明如何配置和运行本项目。

## 前置要求

- 微信开发者工具（最新版本）
- 微信小程序账号（用于获取 AppID）
- 豆包API密钥（推荐）或腾讯云Agent botId

## 详细配置步骤

### 1. 获取豆包API密钥（推荐）

1. 访问 [火山引擎控制台](https://console.volcengine.com/)
2. 注册/登录账号
3. 进入"火山方舟"服务
4. 创建API密钥
5. 复制API密钥（格式类似：`11a4dfb3-35a5-4af8-ae22-33a082b4e390`）

### 2. 获取微信小程序AppID

1. 访问 [微信公众平台](https://mp.weixin.qq.com/)
2. 注册小程序账号
3. 在"开发" -> "开发管理" -> "开发设置"中获取 AppID

### 3. 配置项目

#### 3.1 配置API密钥

打开 `smart_reply_on_wechat/pages/index/index.js`，找到 `agentConfig` 配置：

```javascript
agentConfig: {
  // 豆包API配置（推荐）
  doubaoApiKey: "your-doubao-api-key-here", // 填入你的豆包API密钥
  doubaoModel: "doubao-seed-1-6-flash-250828", // 模型名称，一般不需要修改
  useDoubao: true, // true=使用豆包，false=使用腾讯云
  
  // 腾讯云API配置（可选，如果使用腾讯云）
  botId: "your-bot-id-here", // 使用腾讯云时需要
  
  // 功能开关
  allowUploadImage: true, // 启用图片上传功能
  allowWebSearch: false, // 是否启用网络搜索
  allowUploadFile: false, // 是否启用文件上传
  allowPullRefresh: false, // 是否启用下拉刷新
  allowMultiConversation: false, // 是否启用多会话
  allowVoice: false, // 是否启用语音输入
  showToolCallDetail: false, // 是否显示工具调用详情
  showBotName: false, // 是否显示机器人名称
}
```

#### 3.2 配置小程序AppID

打开 `project.config.json`，修改 `appid`：

```json
{
  "appid": "your-miniprogram-appid"
}
```

#### 3.3 配置域名白名单（重要）

如果使用豆包API，需要在微信公众平台配置域名白名单：

1. 访问 [微信公众平台](https://mp.weixin.qq.com/)
2. 进入"开发" -> "开发管理" -> "开发设置" -> "服务器域名"
3. 在 **request合法域名** 中添加：
   ```
   https://ark.cn-beijing.volces.com
   ```
4. 保存配置

**注意**：如果只是本地开发测试，可以在微信开发者工具中：
- 点击右上角"详情"
- 勾选"不校验合法域名、web-view（业务域名）、TLS 版本以及 HTTPS 证书"

### 4. 运行项目

1. 打开微信开发者工具
2. 选择"导入项目"
3. 选择项目目录
4. 输入 AppID（或选择"测试号"）
5. 点击"编译"
6. 等待编译完成

### 5. 测试功能

1. **基本对话测试**
   - 在输入框中输入"你好"
   - 点击发送
   - 查看是否收到AI回复

2. **图片识别测试**
   - 点击输入框右侧的"+"按钮
   - 选择"图片"
   - 选择一张聊天截图
   - 发送消息
   - 查看AI是否能够识别图片内容

3. **配置测试**
   - 点击右上角配置按钮
   - 修改关系、关系密度、回复风格
   - 发送消息
   - 查看回复是否符合配置

## 常见问题

### Q: 提示"豆包API密钥未配置"

A: 检查 `smart_reply_on_wechat/pages/index/index.js` 中的 `doubaoApiKey` 是否已正确配置。

### Q: 提示"域名未在白名单"

A: 需要在微信公众平台配置域名白名单，或勾选开发者工具的"不校验合法域名"选项。

### Q: 图片上传后没有反应

A: 检查：
1. `allowUploadImage` 是否设置为 `true`
2. 图片路径是否有效
3. 控制台是否有错误信息

### Q: API调用失败

A: 检查：
1. API密钥是否正确
2. 网络连接是否正常
3. 域名白名单是否已配置
4. 查看控制台错误信息

## 高级配置

### 自定义系统提示词

系统提示词定义在 `smart_reply_on_wechat/pages/index/index.js` 的 `getSystemPrompt()` 方法中，可以根据需求修改。

### 切换API提供商

在 `agentConfig` 中设置：
- `useDoubao: true` - 使用豆包API
- `useDoubao: false` - 使用腾讯云API（需要配置 `botId`）

### 自定义模型

修改 `doubaoModel` 配置项，支持其他豆包模型：
- `doubao-seed-1-6-flash-250828`（默认，快速响应）
- 其他模型请参考[豆包模型文档](https://www.volcengine.com/docs/82379)

## 技术支持

如遇到问题，请：
1. 查看本文档的"常见问题"部分
2. 查看 [Issues](https://github.com/SanTanHaiHui/smart_reply_on_wechat/issues)
3. 提交新的 Issue 描述问题

