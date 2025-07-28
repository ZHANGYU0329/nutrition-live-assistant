/**
 * API测试服务
 * 用于测试火山方舟API和Unsplash API的调用
 */
import { volcengineConfig, unsplashConfig, apiEndpoints, systemPrompts, devConfig } from '@/config/api-config';

// 测试结果接口
export interface TestResult {
  success: boolean;
  message: string;
  data?: any;
  rawData?: any; // 添加原始响应数据
}

/**
 * 测试火山方舟API
 * @param prompt 测试提示词
 * @returns 测试结果
 */
export async function testVolcengineAPI(prompt: string = "你好，请用一句话介绍自己"): Promise<TestResult> {
  console.log('测试火山方舟API...');
  
  try {
    // 如果使用本地模拟数据
    if (devConfig.useLocalMockData) {
      console.log('使用模拟数据');
      // 模拟API响应延迟
      await new Promise(resolve => setTimeout(resolve, devConfig.mockDelay));
      
      // 返回模拟数据
      return {
        success: true,
        message: '使用模拟数据成功',
        data: {
          response: "我是一个AI助手，可以回答您的问题并提供帮助。",
          model: "模拟数据",
          usage: {
            prompt_tokens: 10,
            completion_tokens: 20,
            total_tokens: 30
          }
        }
      };
    }
    
    // 尝试调用火山方舟API
    console.log('尝试调用火山方舟API');
    console.log('火山方舟配置:', {
      apiKey: volcengineConfig.apiKey,
      model: volcengineConfig.model,
      endpoint: apiEndpoints.volcengine
    });
    
    // 构建请求体 - 使用火山方舟API的格式（doubao模型）
    const requestBody = {
      model: volcengineConfig.model,
      messages: [
        {
          role: "system",
          content: systemPrompts.nutritionAnalysis
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: volcengineConfig.temperature,
      max_tokens: volcengineConfig.maxTokens
    };
    
    console.log('请求体:', JSON.stringify(requestBody));
    
    // 调用火山方舟API
    const response = await fetch(apiEndpoints.volcengine, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${volcengineConfig.apiKey}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    console.log('API响应状态:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API错误响应:', errorText);
      
      // 尝试解析错误信息
      try {
        const errorData = JSON.parse(errorText);
        return {
          success: false,
          message: `API请求失败: ${response.status}, ${errorData.error?.message || errorText}`,
          data: errorData
        };
      } catch (e) {
        return {
          success: false,
          message: `API请求失败: ${response.status}, ${errorText}`,
        };
      }
    }
    
    const data = await response.json();
    console.log('API响应数据:', data);
    
    // 提取AI回复内容 - doubao模型返回格式
    const aiResponse = data.choices?.[0]?.message?.content || 
                      data.response || 
                      data.choices?.[0]?.text || 
                      data.result || 
                      '';
    
    if (!aiResponse) {
      console.error('API响应中没有找到内容:', data);
      return {
        success: false,
        message: 'API返回的响应为空',
        data
      };
    }
    
    return {
      success: true,
      message: '调用成功',
      data: {
        response: aiResponse,
        model: data.model || volcengineConfig.model,
        usage: data.usage || { total_tokens: 0 }
      },
      rawData: data // 保存原始响应数据
    };
  } catch (error) {
    console.error('调用火山方舟API失败:', error);
    
    // 如果API调用失败，回退到模拟数据
    console.log('API调用失败，使用模拟数据');
    
    return {
      success: false,
      message: `调用失败: ${error instanceof Error ? error.message : String(error)}`,
      data: {
        response: "API调用失败，这是模拟数据。错误信息: " + (error instanceof Error ? error.message : String(error)),
        model: "模拟数据(错误回退)",
        usage: {
          prompt_tokens: 0,
          completion_tokens: 0,
          total_tokens: 0
        }
      }
    };
  }
}

/**
 * 测试Unsplash API
 * @param keyword 搜索关键词
 * @returns 测试结果
 */
export async function testUnsplashAPI(keyword: string = "营养咨询"): Promise<TestResult> {
  console.log('测试Unsplash API...');
  
  try {
    // 如果使用本地模拟数据
    if (devConfig.useLocalMockData) {
      console.log('使用模拟数据');
      // 模拟API响应延迟
      await new Promise(resolve => setTimeout(resolve, devConfig.mockDelay));
      
      // 返回模拟数据
      return {
        success: true,
        message: '使用模拟数据成功',
        data: {
          imageUrl: 'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
          keyword
        }
      };
    }
    
    // 构建URL
    const url = `${apiEndpoints.unsplash}?query=${encodeURIComponent(keyword)}&per_page=1`;
    
    console.log('请求URL:', url);
    console.log('Unsplash配置:', {
      accessKey: unsplashConfig.accessKey
    });
    
    // 调用Unsplash API
    const response = await fetch(url, {
      headers: {
        'Authorization': `Client-ID ${unsplashConfig.accessKey}`
      }
    });
    
    console.log('API响应状态:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API错误响应:', errorText);
      return {
        success: false,
        message: `API请求失败: ${response.status}, ${errorText}`
      };
    }
    
    const data = await response.json();
    console.log('API响应数据:', data);
    
    if (data.results && data.results.length > 0) {
    return {
      success: true,
      message: '调用成功',
      data: {
        imageUrl: data.results[0].urls.regular,
        keyword,
        photographer: data.results[0].user?.name || '未知摄影师',
        description: data.results[0].description || data.results[0].alt_description || '无描述'
      },
      rawData: data // 保存原始响应数据
    };
    } else {
      return {
        success: false,
        message: '没有找到相关图片',
        data
      };
    }
  } catch (error) {
    console.error('调用Unsplash API失败:', error);
    
    // 如果API调用失败，回退到模拟数据
    console.log('API调用失败，使用模拟数据');
    
    return {
      success: false,
      message: `调用失败: ${error instanceof Error ? error.message : String(error)}`,
      data: {
        imageUrl: 'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        keyword,
        photographer: '模拟数据(错误回退)',
        description: '模拟图片描述'
      }
    };
  }
}

/**
 * 测试所有API
 * @returns 测试结果
 */
export async function testAllAPIs(): Promise<{
  volcengine: TestResult;
  unsplash: TestResult;
}> {
  const volcengineResult = await testVolcengineAPI();
  const unsplashResult = await testUnsplashAPI();
  
  return {
    volcengine: volcengineResult,
    unsplash: unsplashResult
  };
}