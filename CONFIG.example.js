// 配置文件示例
// 复制此文件为 config.js 并填入你的实际配置

module.exports = {
  // 豆包API配置（推荐使用）
  doubao: {
    apiKey: "your-doubao-api-key-here", // 从火山引擎控制台获取
    model: "doubao-seed-1-6-flash-250828", // 模型名称
  },
  
  // 腾讯云API配置（可选，如果使用腾讯云）
  tencent: {
    botId: "your-bot-id-here", // 腾讯云Agent botId
  },
  
  // 小程序配置
  miniprogram: {
    appid: "your-miniprogram-appid", // 微信小程序AppID
  },
};

