// utils/doubao-api.js
// 豆包大模型API调用工具

/**
 * 将图片文件转换为base64
 * @param {string} filePath 图片文件路径
 * @returns {Promise<string>} base64字符串
 */
function fileToBase64(filePath) {
  return new Promise((resolve, reject) => {
    const fs = wx.getFileSystemManager();
    fs.readFile({
      filePath: filePath,
      encoding: 'base64',
      success: (res) => {
        resolve(res.data);
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}

/**
 * 调用豆包大模型API（流式）
 * @param {Object} options 配置选项
 * @param {string} options.apiKey API密钥
 * @param {string} options.model 模型名称，默认 doubao-seed-1-6-flash-250828
 * @param {string} options.message 用户消息
 * @param {Array} options.history 历史对话记录，格式：[{role: "user", content: "..."}, {role: "assistant", content: "..."}]
 * @param {string} options.systemPrompt 系统提示词（可选）
 * @param {Array} options.images 图片列表，格式：[{tempPath: "...", rawType: "image"}]
 * @returns {Object} 返回一个包含eventStream的对象，兼容腾讯云API格式
 */
export async function callDoubaoStream(options) {
  const { apiKey, model = "doubao-seed-1-6-flash-250828", message, history = [], systemPrompt, images = [] } = options;
  
  if (!apiKey) {
    throw new Error("豆包API密钥未配置");
  }

  // 构建消息列表
  const messages = [];
  
  // 添加系统提示词（如果有）
  if (systemPrompt) {
    messages.push({
      role: "system",
      content: systemPrompt,
    });
  }
  
  // 添加历史对话
  if (history && history.length > 0) {
    messages.push(...history);
  }
  
  // 添加当前用户消息（支持图片）
  if (images && images.length > 0) {
    // 如果有图片，构建多模态消息
    const contentArray = [];
    
    // 先处理图片
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      
      if (image.rawType === 'image' && image.tempPath) {
        try {
          // 将图片转换为base64
          const base64 = await fileToBase64(image.tempPath);
          
          // 获取文件扩展名
          const ext = image.tempPath.split('.').pop() || 'jpg';
          const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';
          const dataUrl = `data:${mimeType};base64,${base64}`;
          
          contentArray.push({
            type: "image_url",
            image_url: {
              url: dataUrl
            }
          });
        } catch (error) {
          console.error('图片转换失败:', error);
          // 如果图片转换失败，继续处理其他图片，不中断流程
        }
      }
    }
    
    // 添加文本内容（如果有）
    if (message && message.trim()) {
      contentArray.push({
        type: "text",
        text: message
      });
    }
    
    if (contentArray.length === 0) {
      messages.push({
        role: "user",
        content: message || "请分析图片内容",
      });
    } else {
      messages.push({
        role: "user",
        content: contentArray,
      });
    }
  } else {
    // 没有图片，只发送文本
    messages.push({
      role: "user",
      content: message,
    });
  }

  // 构建请求体
  // 注意：微信小程序的wx.request不支持真正的流式响应，先使用非流式请求
  const requestBody = {
    model: model,
    messages: messages,
    stream: false, // 微信小程序不支持流式，使用非流式请求
    prefix_cache: true, // 启用前缀缓存，提升性能并降低成本
  };

  // 创建一个适配器，将豆包API的响应转换为与腾讯云兼容的格式
  const eventStream = (async function* () {
    try {
      const response = await new Promise((resolve, reject) => {
        wx.request({
          url: "https://ark.cn-beijing.volces.com/api/v3/chat/completions",
          method: "POST",
          header: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
          },
          data: requestBody,
          responseType: "text", // 使用text类型以接收JSON字符串
          timeout: 60000, // 60秒超时
          success: (res) => {
            if (res.statusCode === 200) {
              resolve(res);
            } else {
              const errorMsg = `请求失败: ${res.statusCode}`;
              console.error('豆包API请求失败:', errorMsg, res.data);
              reject(new Error(`${errorMsg} ${JSON.stringify(res.data)}`));
            }
          },
          fail: (err) => {
            console.error('豆包API请求失败:', err);
            let errorMessage = "网络请求失败";
            if (err.errMsg) {
              if (err.errMsg.includes("url not in domain list")) {
                errorMessage = "域名未在白名单，请在微信公众平台配置request合法域名: ark.cn-beijing.volces.com";
              } else if (err.errMsg.includes("timeout")) {
                errorMessage = "请求超时，请检查网络连接";
              } else {
                errorMessage = err.errMsg;
              }
            }
            reject(new Error(errorMessage));
          },
        });
      });

      // 处理响应 - 微信小程序不支持流式，使用非流式JSON响应
      
      let recordId = "record_id" + String(+new Date());
      let jsonData = null;
      
      // 解析响应数据
      if (typeof response.data === 'string') {
        if (response.data.length === 0) {
          throw new Error('响应数据为空，可能是流式响应在微信小程序中无法正确处理');
        }
        try {
          jsonData = JSON.parse(response.data);
        } catch (e) {
          // 尝试作为SSE流式响应处理
          const lines = response.data.split('\n');
          for (const line of lines) {
            if (line.trim() === '' || !line.startsWith('data: ')) continue;
            const dataStr = line.substring(6).trim();
            if (dataStr === '[DONE]') {
              yield { data: "[DONE]" };
              return;
            }
            try {
              const chunk = JSON.parse(dataStr);
              if (chunk.choices && chunk.choices.length > 0) {
                const choice = chunk.choices[0];
                const delta = choice.delta || {};
                if (delta.content) {
                  yield {
                    data: JSON.stringify({
                      type: "text",
                      content: delta.content,
                      role: "assistant",
                      record_id: recordId,
                    })
                  };
                }
                if (choice.finish_reason === "stop") {
                  yield { data: "[DONE]" };
                  return;
                }
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
          throw new Error('无法解析响应数据');
        }
      } else if (typeof response.data === 'object') {
        jsonData = response.data;
      } else {
        throw new Error(`未知的响应数据类型: ${typeof response.data}`);
      }
      
      // 处理JSON响应（非流式）
      if (jsonData && jsonData.choices && jsonData.choices.length > 0) {
        const choice = jsonData.choices[0];
        const content = choice.message?.content || '';
        
        if (content) {
          // 模拟流式输出：每次输出10个字符，间隔20ms
          const chunkSize = 10;
          for (let i = 0; i < content.length; i += chunkSize) {
            const chunk = content.substring(i, i + chunkSize);
            yield {
              data: JSON.stringify({
                type: "text",
                content: chunk,
                role: "assistant",
                record_id: recordId,
              })
            };
            // 添加小延迟以模拟流式效果
            await new Promise(resolve => setTimeout(resolve, 20));
          }
        }
        
        yield {
          data: JSON.stringify({
            type: "finish",
            finish_reason: choice.finish_reason || "stop",
            role: "assistant",
            record_id: recordId,
            usage: jsonData.usage,
          })
        };
        
        yield { data: "[DONE]" };
      } else {
        throw new Error('响应格式不正确，未找到choices数据');
      }
    } catch (error) {
      console.error('豆包API调用异常:', error);
      const recordId = "record_id" + String(+new Date());
      yield {
        data: JSON.stringify({
          type: "finish",
          finish_reason: "error",
          role: "assistant",
          record_id: recordId,
          error: {
            message: error.message || "豆包API调用失败",
          },
        })
      };
      yield { data: "[DONE]" };
    }
  })();

  return {
    eventStream: eventStream,
  };
}

/**
 * 调用豆包大模型API（非流式）
 * @param {Object} options 配置选项
 * @param {string} options.apiKey API密钥
 * @param {string} options.model 模型名称
 * @param {string} options.message 用户消息
 * @param {Array} options.history 历史对话记录
 * @param {string} options.systemPrompt 系统提示词（可选）
 * @returns {Promise<Object>} API响应
 */
export async function callDoubao(options) {
  const { apiKey, model = "doubao-seed-1-6-flash-250828", message, history = [], systemPrompt } = options;
  
  if (!apiKey) {
    throw new Error("豆包API密钥未配置");
  }

  const messages = [];
  
  // 添加系统提示词（如果有）
  if (systemPrompt) {
    messages.push({
      role: "system",
      content: systemPrompt,
    });
  }
  
  // 添加历史对话
  if (history && history.length > 0) {
    messages.push(...history);
  }
  
  // 添加当前用户消息
  messages.push({
    role: "user",
    content: message,
  });

  const requestBody = {
    model: model,
    messages: messages,
    stream: false,
    prefix_cache: true, // 启用前缀缓存，提升性能并降低成本
  };

  return new Promise((resolve, reject) => {
    wx.request({
      url: "https://ark.cn-beijing.volces.com/api/v3/chat/completions",
      method: "POST",
      header: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      data: requestBody,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error(`请求失败: ${res.statusCode} ${JSON.stringify(res.data)}`));
        }
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
}

