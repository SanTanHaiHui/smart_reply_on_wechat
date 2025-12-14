// pages/index/index.js
Page({
  data: {
    // Agent配置 - botId需要后续配置
    chatMode: "bot",
    showBotAvatar: false,
  agentConfig: {
      botId: "", // 请在此处配置你的Agent botId（使用腾讯云API时需要）
      // 豆包API配置
      doubaoApiKey: "", // 请在此处配置你的豆包API密钥（使用豆包API时需要）
      doubaoModel: "doubao-seed-1-6-flash-250828", // 豆包模型名称
      useDoubao: true, // 是否使用豆包API，true=使用豆包，false=使用腾讯云
      allowWebSearch: false,
      allowUploadFile: false,
      allowPullRefresh: false,
      allowUploadImage: true, // 启用图片上传功能
      allowMultiConversation: false,
      allowVoice: false,
      showToolCallDetail: false,
      showBotName: false,
    },
    // 配置面板状态
    showConfigPanel: false,
    // 对话配置
    relation: "朋友",
    relationDensity: "很熟",
    replyStyle: "轻松",
    // prompt转换对象
    promptTransform: null,
  },

  onLoad() {
    // 初始化prompt转换函数
    this.initPromptTransform();
    
    // 检查配置
    if (this.data.agentConfig.useDoubao) {
      if (!this.data.agentConfig.doubaoApiKey) {
        wx.showModal({
          title: "提示",
          content: "请在 pages/index/index.js 中配置 agentConfig.doubaoApiKey",
          showCancel: false,
        });
      }
    } else {
      if (!this.data.agentConfig.botId) {
        wx.showModal({
          title: "提示",
          content: "请在 pages/index/index.js 中配置 agentConfig.botId",
          showCancel: false,
        });
      }
    }
  },

  // 初始化prompt转换函数
  initPromptTransform() {
    const self = this;
    this.setData({
      promptTransform: {
        transform: function(userInput, fileList) {
          return self.buildPrompt(userInput, fileList);
        },
        getSystemPrompt: function() {
          return self.getSystemPrompt();
        }
      }
    });
  },

  // 打开配置面板
  openConfigPanel() {
    this.setData({
      showConfigPanel: true,
        });
      },

  // 关闭配置面板
  closeConfigPanel() {
    this.setData({
      showConfigPanel: false,
        });
      },

  // 配置项改变
  onConfigChange(e) {
    const { type, value } = e.detail;
    this.setData({
      [type]: value,
    });
    // 重新初始化prompt转换函数（因为配置改变了）
    this.initPromptTransform(); 
  },

  // 构建完整的prompt
  buildPrompt(userInput, fileList = []) {
    const { relation, relationDensity, replyStyle } = this.data;
    
    // 将配置项转换为自然语言描述
    const contextDescription = `我与对方的关系是${relation}，关系密度是${relationDensity}，希望回复风格是${replyStyle}。`;
    
    // 检查是否有图片
    const hasImage = fileList && fileList.length > 0 && fileList.some(item => item.rawType === 'image');
    
    // 拼接用户输入和上下文
    let fullPrompt;
    if (hasImage) {
      // 如果有图片，使用"双方对话如图所示"的文案
      fullPrompt = `${contextDescription}双方对话如图所示。请帮我生成几个合适的回复选项。`;
    } else {
      // 如果没有图片，使用原来的文案
      fullPrompt = `${contextDescription}对方说："${userInput}"。请帮我生成几个合适的回复选项。`;
    }
    
    return fullPrompt;
  },

  // 获取系统提示词
  getSystemPrompt() {
    return `你是一个专业的聊天助手，专门帮助用户在与他人沟通时找到合适的回复。你的任务是：

1. **理解上下文**：仔细分析用户提供的关系信息（关系类型、关系密度）和对方的话语内容。

2. **理解聊天上下文**：如果用户提供了两人的多段对话，以图片的形式提供，图片为微信聊天内容，其中绿框为用户话语，白框为对方话语，则理解图片中的对话，分析聊天语境，基于对方最后一句话进行回复。

3. **生成多个选项**：针对对方的话语，生成3-5个不同风格和角度的回复选项，让用户可以根据实际情况选择最合适的。

4. **风格适配**：根据用户选择的回复风格（幽默、轻松、夸夸、严肃、严厉），调整回复的语气和表达方式。

5. **关系敏感**：充分考虑用户与对方的关系类型和关系密度，确保回复既符合关系边界，又自然得体。

6. **输出格式（重要）**：你必须严格按照以下JSON数组格式输出，不要添加任何其他文字、说明或标记。只输出纯JSON，不要有任何前缀或后缀文字。

## 回复风格说明

- **幽默**：使用轻松幽默的表达，可以适当使用网络用语、表情符号的替代文字，但要注意分寸
- **轻松**：语气自然、随意，像朋友间的日常聊天，不过分正式
- **夸夸**：积极正面，多给予肯定和鼓励，表达欣赏和赞美
- **严肃**：正式、认真，适合工作场合或需要表达重视的场景
- **严厉**：语气强硬，表达不满或要求，但要注意不伤害关系

## 关系类型处理原则

- **恋人**：可以更亲密、直接，情感表达更丰富
- **同事**：保持专业和礼貌，注意职场边界
- **领导**：尊重、正式，体现对权威的认可
- **朋友**：自然、随意，可以更直接和真实

## 关系密度影响

- **陌生人/刚认识**：保持礼貌和距离，避免过于亲密
- **很熟/非常熟**：可以更随意、直接，使用更亲密的表达方式

## 注意事项

1. 不要生成可能引起误解或冲突的回复
2. 尊重不同关系的边界和礼仪
3. 考虑文化背景和社交习惯
4. 提供多个选项，让用户有选择空间
5. 如果对方的话语有明显问题或冒犯，可以建议用户如何得体地回应

## 输出格式要求（必须严格遵守）

**重要：你只能输出JSON数组，不要有任何其他文字！**

输出格式示例（直接复制这个格式，替换内容）：

[
    {
        "wording": "这不就是咸鱼想翻身结果粘锅了吗？建议撒点孜然直接开摆",
        "reason": "延续吐槽氛围，用烧烤梗化解焦虑"
    },
    {
        "wording": "懂了，你现在是仰卧起坐式人生 -- 躺下起来躺下起来 (递瓶脉动)",
        "reason": "谐音梗破冰，适合边说边发表情包时用"
    },
    {
        "wording": "卷饼躺板中间夹着个你？走！先去卷个煎饼果子补充能量",
        "reason": "用食物梗转移话题，顺势约饭最佳"
    }
]

**再次强调：只输出JSON数组，不要有任何前缀、后缀、说明文字或markdown代码块标记！**`;
  },
});
