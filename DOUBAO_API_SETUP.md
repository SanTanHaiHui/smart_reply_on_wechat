# 豆包大模型API配置说明

## 概述

本项目已支持使用豆包（字节跳动）大模型API替代腾讯云大模型。豆包API采用OpenAI兼容的接口格式，支持流式响应。

## 配置步骤

### 1. 获取豆包API密钥

1. 访问豆包开放平台（https://console.volcengine.com/ark）
2. 创建应用并获取API密钥（Bearer Token）
3. 记录你的API密钥，格式类似：`11a4dfb3-35a5-4af8-ae22-33a082b4e390`

### 2. 配置小程序

在 `smart_reply_on_wechat/pages/index/index.js` 文件中，找到 `agentConfig` 配置：

```javascript
agentConfig: {
  // 豆包API配置
  doubaoApiKey: "你的API密钥", // 请替换为你的豆包API密钥
  doubaoModel: "doubao-seed-1-6-flash-250828", // 豆包模型名称
  useDoubao: true, // true=使用豆包，false=使用腾讯云
  
  // 其他配置...
}
```

### 3. 配置说明

- **doubaoApiKey**: 你的豆包API密钥（必填）
- **doubaoModel**: 豆包模型名称，默认为 `doubao-seed-1-6-flash-250828`
- **useDoubao**: 
  - `true`: 使用豆包API
  - `false`: 使用腾讯云API（原有逻辑）

## API端点

- **URL**: `https://ark.cn-beijing.volces.com/api/v3/chat/completions`
- **方法**: POST
- **认证**: Bearer Token（在Header中）

## 请求格式

```json
{
  "model": "doubao-seed-1-6-flash-250828",
  "messages": [
    {
      "role": "user",
      "content": "用户消息内容"
    }
  ],
  "stream": true
}
```

## 响应格式

豆包API返回SSE（Server-Sent Events）格式的流式响应，每个chunk格式如下：

```
data: {"choices":[{"delta":{"content":"..."},"finish_reason":null}]}

data: [DONE]
```

## 功能支持

### ✅ 已支持
- 流式响应
- 历史对话上下文（最多10轮）
- JSON格式回复选项解析
- 错误处理

### ❌ 不支持（仅腾讯云API支持）
- 推荐问题功能
- 文件上传
- 知识库检索
- 工具调用（Tool Calling）
- 多会话管理

## 注意事项

1. **API密钥安全**: 请勿将API密钥提交到代码仓库，建议使用环境变量或配置文件
2. **流式响应**: 微信小程序的 `wx.request` 对SSE流式支持有限，如果遇到问题，可能需要使用其他方案
3. **Token限制**: 历史对话记录限制为最近10轮，避免token过多
4. **错误处理**: 如果API调用失败，会在控制台输出错误信息，并在界面上显示错误提示

## 切换回腾讯云API

如果需要切换回腾讯云API，只需将 `useDoubao` 设置为 `false`：

```javascript
agentConfig: {
  useDoubao: false, // 切换回腾讯云
  botId: "你的botId", // 需要配置腾讯云的botId
  // ...
}
```

## 故障排查

1. **API调用失败**: 检查API密钥是否正确，网络是否正常
2. **流式响应不工作**: 检查微信小程序基础库版本，建议使用最新版本
3. **响应格式错误**: 查看控制台日志，检查豆包API返回的数据格式

