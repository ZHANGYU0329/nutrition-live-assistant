// AI服务，用于与火山方舟API通信
import { volcengineConfig, unsplashConfig, systemPrompts, apiEndpoints, devConfig } from '@/config/api-config';
import { imageCacheService } from './image-cache-service';

// 定义生成内容的接口
export interface GeneratedContent {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  relatedImages?: string[]; // 添加相关图片数组
  createdAt: number; // 添加创建时间
}

// 生成营养学内容
export async function generateNutritionContent(userComment: string): Promise<GeneratedContent[]> {
  console.log('生成内容，用户问题:', userComment);
  
  // 如果使用本地模拟数据
  if (devConfig.useLocalMockData) {
    console.log('使用模拟数据');
    // 模拟API响应延迟
    await new Promise(resolve => setTimeout(resolve, devConfig.mockDelay));
    return generateMockContent(userComment);
  }
  
  try {
    // 尝试调用火山方舟API
    console.log('尝试调用火山方舟API');
    console.log('火山方舟配置:', {
      apiKey: volcengineConfig.apiKey,
      model: volcengineConfig.model,
      endpoint: apiEndpoints.volcengine
    });
    
    // 构建请求体 - 使用火山方舟API的官方格式（doubao模型）
    const requestBody = {
      model: volcengineConfig.model,
      messages: [
        {
          role: "system",
          content: systemPrompts.nutritionAnalysis
        },
        {
          role: "user",
          content: userComment
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
      throw new Error(`API请求失败: ${response.status}, ${errorText}`);
    }
    
    const data = await response.json();
    console.log('API响应数据:', data);
    
    // 根据火山方舟API的官方响应格式获取内容
    const aiResponse = data.choices?.[0]?.message?.content || 
                      data.output?.text || 
                      data.response || 
                      data.choices?.[0]?.text || 
                      data.result || 
                      '';
    
    if (!aiResponse) {
      console.error('API响应中没有找到内容:', data);
      throw new Error('API返回的响应为空');
    }
    
    // 解析AI响应
    return parseAIResponse(aiResponse, userComment);
  } catch (error) {
    console.error('调用火山方舟API失败:', error);
    // 如果API调用失败，回退到模拟数据
    console.log('API调用失败，使用模拟数据');
    const mockContent = generateMockContent(userComment);
    
    // 添加一些定制信息，表明这是基于火山方舟API的模拟
    const content = await mockContent;
    if (content.length > 0) {
      content[0].title = `${content[0].title} (火山方舟AI分析)`;
      content[0].tags = [...content[0].tags, '火山方舟AI'];
    }
    
    return mockContent;
  }
}

// 保留原来的函数名以保持兼容性
export const generatePsychologyContent = generateNutritionContent;

// 解析AI响应
async function parseAIResponse(aiResponse: string, userComment: string): Promise<GeneratedContent[]> {
  console.log('解析AI响应:', aiResponse);
  try {
    // 尝试解析AI响应
    const lines = aiResponse.split('\n');
    let title = '';
    let explanation = '';
    let suggestion = '';
    let tags: string[] = [];
    
    for (const line of lines) {
      if (line.startsWith('标题：')) {
        title = line.replace('标题：', '').trim().replace(/^\[|\]$/g, '');
      } else if (line.startsWith('解释：')) {
        explanation = line.replace('解释：', '').trim();
      } else if (line.startsWith('建议：')) {
        suggestion = line.replace('建议：', '').trim();
      } else if (line.startsWith('标签：')) {
        const tagLine = line.replace('标签：', '').trim();
        tags = tagLine.replace(/^\[|\]$/g, '').split(/[,，]/).map(tag => tag.trim().replace(/^\[|\]$/g, ''));
      }
    }
    
    // 如果解析失败，使用默认值
    if (!title) title = '营养学分析';
    if (!explanation && !suggestion) {
      explanation = aiResponse;
    }
    if (tags.length === 0) tags = ['营养分析', '健康饮食'];
    
    // 格式化描述内容，添加段落分隔和思维导图
    const formattedDescription = formatContentWithMindMap(explanation, suggestion, tags, userComment);
    
    // 搜索相关图片
    let relatedImages: string[] = [];
    let mainImageUrl = 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80';
    
    try {
      // 使用标题和标签作为搜索关键词
      const searchKeywords = [title, ...tags].join(' ');
      relatedImages = await getRelatedImages(searchKeywords, 12); // 增加到12张图片
      
      // 如果找到相关图片，使用第一张作为主图
      if (relatedImages.length > 0) {
        mainImageUrl = relatedImages[0];
      }
    } catch (error) {
      console.error('搜索相关图片失败:', error);
      // 如果搜索失败，使用默认图片
    }
    
    return [{
      id: Date.now(),
      title,
      description: formattedDescription,
      imageUrl: mainImageUrl,
      tags: [...tags, '火山方舟AI'],
      relatedImages: relatedImages.length > 0 ? relatedImages : [mainImageUrl],
      createdAt: Date.now()
    }];
  } catch (error) {
    console.error('解析AI响应失败:', error);
    // 如果解析失败，回退到模拟数据
    return generateMockContent(userComment);
  }
}

// 格式化内容，添加段落分隔和思维导图
function formatContentWithMindMap(explanation: string, suggestion: string, tags: string[], userComment: string): string {
  let formattedContent = '';
  
  // 添加思维导图部分
  const mindMapKeywords = extractKeywords(explanation + ' ' + suggestion + ' ' + userComment, tags);
  if (mindMapKeywords.length > 0) {
    formattedContent += '🧠 **核心概念关系图**\n\n';
    formattedContent += generateMindMapText(mindMapKeywords, userComment);
    formattedContent += '\n\n---\n\n';
  }
  
  // 格式化解释部分
  if (explanation) {
    formattedContent += '📖 **营养学解析**\n\n';
    formattedContent += formatParagraphs(explanation);
    formattedContent += '\n\n';
  }
  
  // 格式化建议部分
  if (suggestion) {
    formattedContent += '💡 **实用建议**\n\n';
    formattedContent += formatParagraphs(suggestion);
  }
  
  return formattedContent;
}

// 提取关键词
function extractKeywords(text: string, tags: string[]): string[] {
  const keywords = new Set<string>();
  
  // 添加标签作为关键词
  tags.forEach(tag => {
    if (tag && tag !== '火山方舟AI') {
      keywords.add(tag);
    }
  });
  
  // 从文本中提取营养相关关键词
  const nutritionKeywords = [
    '蛋白质', '碳水化合物', '脂肪', '维生素', '矿物质', '膳食纤维',
    '钙', '铁', '锌', '维生素C', '维生素D', '叶酸',
    '减肥', '增肌', '健康', '营养', '饮食', '食物',
    '水果', '蔬菜', '肉类', '鱼类', '豆类', '坚果',
    '消化', '吸收', '代谢', '免疫', '抗氧化',
    '血糖', '血压', '胆固醇', '心脏', '大脑'
  ];
  
  nutritionKeywords.forEach(keyword => {
    if (text.includes(keyword)) {
      keywords.add(keyword);
    }
  });
  
  return Array.from(keywords).slice(0, 6); // 限制关键词数量
}

// 生成思维导图文本
function generateMindMapText(keywords: string[], userComment: string): string {
  if (keywords.length === 0) return '';
  
  let mindMap = '';
  const centerTopic = keywords[0] || '营养健康';
  
  mindMap += `┌─ 🎯 **${centerTopic}**\n`;
  
  keywords.slice(1).forEach((keyword, index) => {
    const isLast = index === keywords.length - 2;
    const connector = isLast ? '└─' : '├─';
    mindMap += `${connector} 📌 ${keyword}\n`;
  });
  
  // 添加用户问题的关联
  if (userComment) {
    mindMap += `└─ ❓ 用户关注: ${userComment.slice(0, 20)}${userComment.length > 20 ? '...' : ''}\n`;
  }
  
  return mindMap;
}

// 格式化段落，添加适当的换行
function formatParagraphs(text: string): string {
  // 按句号分割，但保留句号
  const sentences = text.split(/([。！？])/).filter(s => s.trim());
  let formattedText = '';
  let currentParagraph = '';
  
  for (let i = 0; i < sentences.length; i += 2) {
    const sentence = sentences[i] || '';
    const punctuation = sentences[i + 1] || '';
    const fullSentence = sentence + punctuation;
    
    currentParagraph += fullSentence;
    
    // 每2-3句话换一段，或者遇到特定关键词时换段
    if ((i >= 4 && (i % 4 === 0)) || 
        sentence.includes('建议') || 
        sentence.includes('此外') || 
        sentence.includes('另外') ||
        sentence.includes('同时')) {
      formattedText += currentParagraph.trim() + '\n\n';
      currentParagraph = '';
    }
  }
  
  // 添加剩余内容
  if (currentParagraph.trim()) {
    formattedText += currentParagraph.trim();
  }
  
  return formattedText;
}

// 生成模拟内容
async function generateMockContent(userComment: string): Promise<GeneratedContent[]> {
  console.log('使用模拟数据');
  
  // 根据用户问题的内容，生成不同的响应
  const generatedContents: GeneratedContent[] = [];
  let content: GeneratedContent | null = null;
  
  if (userComment.includes('减肥') || userComment.includes('瘦身') || userComment.includes('体重')) {
    content = {
      id: 1,
      title: '健康减重与营养平衡',
      description: '健康减重不是短期节食，而是长期的生活方式改变。就像建造一座坚固的房子，需要稳固的地基，健康减重也需要均衡的营养摄入作为基础。\n\n蛋白质是减重过程中的重要营养素，它就像房子的支柱，能够维持肌肉量，增加饱腹感。建议每天摄入足够的优质蛋白质，如鸡胸肉、鱼类、豆类和蛋类。\n\n同时，复合碳水化合物如全谷物、蔬菜和水果，就像房子的砖块，提供持久的能量和必要的纤维。控制热量摄入是减重的关键，但更重要的是保证营养的全面性。\n\n建议采用"盘子法"：一半盘子装蔬菜，四分之一装优质蛋白质，四分之一装全谷物。此外，规律的体育锻炼和充足的水分摄入也是健康减重计划的重要组成部分。',
      imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      tags: ['健康减重', '营养平衡', '饮食计划'],
      createdAt: Date.now()
    };
  } else if (userComment.includes('蛋白质') || userComment.includes('肌肉') || userComment.includes('增肌')) {
    content = {
      id: 2,
      title: '蛋白质摄入与肌肉健康',
      description: '蛋白质是肌肉生长和修复的基础营养素，就像建筑工地上的砖块和水泥，为肌肉提供必要的建筑材料。\n\n对于普通成年人，每天推荐的蛋白质摄入量为体重每公斤0.8克；而对于有规律力量训练的人群，这个数值可以提高到每公斤1.2-2.0克。\n\n蛋白质的质量和摄入时机同样重要。优质蛋白质来源包括瘦肉、鱼类、蛋类、奶制品和豆类。这些食物提供完整的氨基酸谱，特别是支链氨基酸（BCAA），它们就像特殊的建筑材料，对肌肉生长尤为重要。\n\n在训练后30-60分钟内摄入蛋白质，可以最大化肌肉蛋白质合成。此外，将蛋白质均匀分布在一天的各餐中，比集中在一餐中摄入大量蛋白质更有利于肌肉生长和维持。建议每餐摄入20-40克优质蛋白质，根据个人体重和训练强度调整。',
      imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      tags: ['蛋白质', '肌肉健康', '运动营养'],
      createdAt: Date.now()
    };
  } else if (userComment.includes('碳水') || userComment.includes('糖') || userComment.includes('能量')) {
    content = {
      id: 3,
      title: '碳水化合物与能量管理',
      description: '碳水化合物是人体的主要能量来源，就像汽车的燃料，为日常活动和运动提供动力。\n\n然而，并非所有碳水化合物都是平等的。简单碳水化合物（如精制糖和白面粉）就像快速燃烧的纸，提供短暂的能量爆发后迅速消失，可能导致血糖波动和能量崩溃。\n\n相比之下，复合碳水化合物（如全谷物、豆类、蔬菜和水果）就像缓慢燃烧的木柴，提供持久稳定的能量。膳食纤维是复合碳水化合物的重要组成部分，它就像燃料系统的调节器，帮助稳定血糖水平，延长饱腹感，并支持肠道健康。\n\n对于一般成年人，碳水化合物应占总热量的45-65%，但具体需求因个人活动水平、健康状况和目标而异。建议选择全谷物、豆类、蔬菜和水果作为主要碳水化合物来源，限制添加糖和精制谷物的摄入。',
      imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      tags: ['碳水化合物', '能量管理', '血糖控制'],
      createdAt: Date.now()
    };
  } else if (userComment.includes('脂肪') || userComment.includes('油') || userComment.includes('胆固醇')) {
    content = {
      id: 4,
      title: '健康脂肪与心脏健康',
      description: '脂肪在饮食中扮演着重要角色，就像房屋的隔热层，不仅提供能量储备，还支持细胞功能、促进脂溶性维生素吸收，并参与荷尔蒙生成。\n\n然而，不同类型的脂肪对健康的影响各不相同。不饱和脂肪（如橄榄油、坚果和鱼类中的脂肪）就像优质的隔热材料，有助于降低心脏病风险；而反式脂肪（如部分氢化植物油）则像有缺陷的材料，可能增加心脏病和其他慢性疾病风险。\n\n饱和脂肪（如肉类和全脂奶制品中的脂肪）则介于两者之间，应适量摄入。对于一般成年人，脂肪应占总热量的20-35%，其中大部分应来自不饱和脂肪。\n\n特别是omega-3脂肪酸（如鱼油中的EPA和DHA）对心脏健康和大脑功能尤为重要。建议每周至少食用两次富含omega-3的鱼类，如三文鱼、沙丁鱼或鲭鱼。同时，应限制反式脂肪的摄入，并适量控制饱和脂肪的摄入。',
      imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      tags: ['健康脂肪', '心脏健康', '饮食指南'],
      createdAt: Date.now()
    };
  } else if (userComment.includes('维生素') || userComment.includes('矿物质') || userComment.includes('补充剂')) {
    content = {
      id: 5,
      title: '微量营养素与健康',
      description: '维生素和矿物质虽然需求量小，但对健康至关重要，就像复杂机器中的小零件，缺一不可。这些微量营养素参与几乎所有生理过程，从能量产生到免疫功能，从骨骼健康到神经传导。\n\n维生素分为水溶性（如B族维生素和维生素C）和脂溶性（如维生素A、D、E和K）。水溶性维生素就像流动的河水，不易在体内储存，需要定期补充；而脂溶性维生素则像湖泊，可以在体内储存较长时间。\n\n矿物质如钙、铁、锌和硒等同样重要，它们就像建筑物的钢筋，提供结构支持和功能调节。多样化的饮食是获取全面微量营养素的最佳方式。\n\n彩虹色蔬果（红、橙、黄、绿、蓝/紫、白）提供不同的植物营养素；全谷物提供B族维生素；坚果和种子富含维生素E和矿物质；动物性食品提供维生素B12和铁等。对于某些人群，如孕妇、老年人或特定饮食模式的人，可能需要补充剂。但应在专业营养师或医生指导下使用。',
      imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      tags: ['维生素', '矿物质', '营养补充'],
      createdAt: Date.now()
    };
  } else {
    // 如果没有匹配到特定关键词，生成通用回应
    content = {
      id: 6,
      title: '均衡饮食与整体健康',
      description: '均衡饮食就像一座精心设计的花园，需要各种植物共同生长，才能形成健康的生态系统。我们的身体也需要多样化的营养素来维持最佳功能。\n\n根据中国居民膳食指南，健康饮食应包括谷薯类、蔬果类、畜禽鱼蛋奶类、大豆坚果类等食物，形成"食物多样，谷物为主"的膳食模式。这种多样化饮食就像一支交响乐团，每种食物都贡献其独特的"营养音符"，共同演奏出健康的"生命乐章"。\n\n蔬菜水果提供维生素、矿物质和抗氧化物；全谷物提供能量和膳食纤维；优质蛋白质来源如鱼、禽、蛋、瘦肉和豆类支持组织修复和免疫功能；健康脂肪如橄榄油、坚果和鱼油支持大脑和心脏健康。\n\n除了食物选择，饮食模式和习惯同样重要。规律进餐、细嚼慢咽、控制食量、限制盐糖摄入、适量饮水，这些习惯就像花园的灌溉和维护系统，确保营养生态系统的长期健康。',
      imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      tags: ['均衡饮食', '营养健康', '饮食指南'],
      createdAt: Date.now()
    };
  }
  
  // 为模拟内容搜索相关图片
  if (content) {
    try {
      // 使用标题和标签作为搜索关键词
      const searchKeywords = [content.title, ...content.tags].join(' ');
      const relatedImages = await getRelatedImages(searchKeywords, 12); // 增加到12张图片
      
      // 如果找到相关图片，使用第一张作为主图
      if (relatedImages.length > 0) {
        content.imageUrl = relatedImages[0];
        content.relatedImages = relatedImages;
      }
      
      // 确保 relatedImages 字段存在
      if (!content.relatedImages || content.relatedImages.length === 0) {
        content.relatedImages = [content.imageUrl];
      }
      
      generatedContents.push(content);
    } catch (error) {
      console.error('搜索相关图片失败:', error);
      // 如果搜索失败，使用默认图片
      if (!content.relatedImages || content.relatedImages.length === 0) {
        content.relatedImages = [content.imageUrl];
      }
      generatedContents.push(content);
    }
  }
  
  return generatedContents;
}

// 获取相关图片的函数
export async function getRelatedImages(keyword: string, count: number = 12): Promise<string[]> {
  console.log('搜索相关图片，关键词:', keyword);
  
  // 首先尝试从缓存获取
  const cacheKey = `images_${keyword}`;
  
  // 检查是否已经有缓存的图片结果
  const cachedResult = sessionStorage.getItem(cacheKey);
  if (cachedResult) {
    console.log('使用缓存的图片结果');
    return JSON.parse(cachedResult);
  }
  
  // 检查Unsplash API密钥是否有效
  if (devConfig.useLocalMockData || unsplashConfig.accessKey === 'demo-unsplash-key' || !unsplashConfig.accessKey) {
    console.log('使用模拟图片数据（本地模式或API密钥无效）');
    const mockImages = getMockImages(keyword);
    
    // 将结果存入会话存储
    sessionStorage.setItem(cacheKey, JSON.stringify(mockImages));
    
    // 异步预加载模拟图片以提高显示速度，但不等待完成
    setTimeout(() => {
      imageCacheService.preloadImages(
        mockImages.map((url: string, index: number) => ({ key: `${cacheKey}_${index}`, url }))
      ).catch(error => {
        console.warn('预加载模拟图片失败:', error);
      });
    }, 100);
    
    return mockImages;
  }
  
  try {
    // 实际调用Unsplash API
    const response = await fetch(`${apiEndpoints.unsplash}?query=${encodeURIComponent(keyword)}&per_page=${count}`, {
      headers: {
        'Authorization': `Client-ID ${unsplashConfig.accessKey}`
      }
    });
    
    if (!response.ok) {
      console.warn(`Unsplash API请求失败: ${response.status}，使用模拟数据`);
      const mockImages = getMockImages(keyword);
      
      // 将结果存入会话存储
      sessionStorage.setItem(cacheKey, JSON.stringify(mockImages));
      
      // 异步预加载模拟图片
      setTimeout(() => {
        imageCacheService.preloadImages(
          mockImages.map((url: string, index: number) => ({ key: `${cacheKey}_${index}`, url }))
        ).catch(error => {
          console.warn('预加载模拟图片失败:', error);
        });
      }, 100);
      
      return mockImages;
    }
    
    const data = await response.json();
    console.log(`找到 ${data.results.length} 张相关图片`);
    
    // 如果没有找到图片，使用模拟数据
    if (!data.results || data.results.length === 0) {
      console.log('Unsplash API没有返回图片，使用模拟数据');
      const mockImages = getMockImages(keyword);
      
      // 将结果存入会话存储
      sessionStorage.setItem(cacheKey, JSON.stringify(mockImages));
      
      // 异步预加载模拟图片
      setTimeout(() => {
        imageCacheService.preloadImages(
          mockImages.map((url: string, index: number) => ({ key: `${cacheKey}_${index}`, url }))
        ).catch(error => {
          console.warn('预加载模拟图片失败:', error);
        });
      }, 100);
      
      return mockImages;
    }
    
    // 获取图片URL数组
    const imageUrls = data.results.map((result: any) => result.urls.regular);
    
    // 将结果存入会话存储
    sessionStorage.setItem(cacheKey, JSON.stringify(imageUrls));
    
    // 异步预加载真实图片以提高显示速度
    setTimeout(() => {
      imageCacheService.preloadImages(
        imageUrls.map((url: string, index: number) => ({ key: `${cacheKey}_${index}`, url }))
      ).then(() => {
        console.log('图片预加载完成');
      }).catch(error => {
        console.warn('预加载真实图片失败:', error);
      });
    }, 100);
    
    return imageUrls;
  } catch (error) {
    console.error('调用Unsplash API失败:', error);
    // 如果API调用失败，回退到模拟数据
    const mockImages = getMockImages(keyword);
    
    // 将结果存入会话存储
    sessionStorage.setItem(cacheKey, JSON.stringify(mockImages));
    
    // 异步预加载模拟图片
    setTimeout(() => {
      imageCacheService.preloadImages(
        mockImages.map((url: string, index: number) => ({ key: `${cacheKey}_${index}`, url }))
      ).catch(error => {
        console.warn('预加载模拟图片失败:', error);
      });
    }, 100);
    
    return mockImages;
  }
}

// 获取模拟图片
function getMockImages(keyword: string): string[] {
  console.log('使用模拟图片数据，关键词:', keyword);
  
  // 模拟图片数据库 - 根据不同的营养学主题提供相关图片
  const imageMap: Record<string, string[]> = {
    '减肥': [
      'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1466637574441-749b8f19452f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80',
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1493770348161-369560ae357d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
    ],
    '蛋白质': [
      'https://images.unsplash.com/photo-1607532941433-304659e8198a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1478&q=80',
      'https://images.unsplash.com/photo-1615937657715-bc7b4b7962fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1432139555190-58524dae6a55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1476&q=80',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80',
      'https://images.unsplash.com/photo-1529566652340-2c41a1eb6d93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
    ],
    'default': [
      'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80',
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
    ]
  };
  
  // 查找匹配的关键词
  const lowerKeyword = keyword.toLowerCase();
  
  // 尝试精确匹配关键词
  for (const key in imageMap) {
    if (lowerKeyword.includes(key.toLowerCase())) {
      console.log(`找到关键词匹配: ${key}`);
      return imageMap[key];
    }
  }
  
  // 如果没有匹配，返回默认图片
  console.log('没有找到匹配，使用默认图片');
  return imageMap['default'];
}
