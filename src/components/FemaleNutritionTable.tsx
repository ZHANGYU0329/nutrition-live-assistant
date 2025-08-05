import React, { useState, useEffect, useRef } from 'react';
import { FemaleUserData, FemaleNutritionResult, calculateFemaleNutrition } from '../utils/femaleNutritionUtils';
import { getStatistics, recordUserData, UserRecord } from '../utils/statisticsUtils';
import BmiBodyIcon from './BmiBodyIcon';
import DoctorIcon from './DoctorIcon';

// 食材信息接口
interface FoodItem {
  name: string;
  category: string;
  icon: string;
}

const FemaleNutritionTable: React.FC = () => {
  const [userData, setUserData] = useState<FemaleUserData>({
    age: 18,
    height: 158,
    weight: 110
  });

  const [result, setResult] = useState<FemaleNutritionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState(() => getStatistics());
  
  // 轮播状态
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // 输入框状态
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  
  // 输入框引用
  const ageInputRef = useRef<HTMLInputElement>(null);
  const heightInputRef = useRef<HTMLInputElement>(null);
  const weightInputRef = useRef<HTMLInputElement>(null);

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // 如果输入为空，允许清空输入框
    if (value === '') {
      setUserData(prev => ({
        ...prev,
        [name]: ''
      }));
      return;
    }
    
    // 只允许数字输入
    const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
    
    // 如果输入非数字，不更新状态
    if (isNaN(numericValue)) return;
    
    setUserData(prev => ({
      ...prev,
      [name]: numericValue
    }));
  };

  // 处理输入框获取焦点
  const handleFocus = (name: string) => {
    setFocusedInput(name);
  };

  // 处理输入框失去焦点
  const handleBlur = () => {
    setFocusedInput(null);
  };

  // 处理键盘导航
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: 'age' | 'height' | 'weight') => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      // 向右导航
      if (field === 'age' && heightInputRef.current) {
        heightInputRef.current.focus();
        heightInputRef.current.select();
      } else if (field === 'height' && weightInputRef.current) {
        weightInputRef.current.focus();
        weightInputRef.current.select();
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      // 向左导航
      if (field === 'weight' && heightInputRef.current) {
        heightInputRef.current.focus();
        heightInputRef.current.select();
      } else if (field === 'height' && ageInputRef.current) {
        ageInputRef.current.focus();
        ageInputRef.current.select();
      }
    }
  };

  // 获取标尺上指定BMI位置的颜色
  const getRulerColorAtPosition = (bmi: number) => {
    // 根据BMI值在标尺上的位置获取对应的颜色
    if (bmi < 16) return { bg: 'bg-blue-800', text: 'text-yellow-200' }; // 严重体重不足
    if (bmi < 18.5) return { bg: 'bg-blue-500', text: 'text-yellow-100' }; // 轻度体重不足
    if (bmi < 24) return { bg: 'bg-green-400', text: 'text-gray-900' }; // 健康区间
    if (bmi < 28) return { bg: 'bg-orange-400', text: 'text-gray-900' }; // 超重前期和中期
    if (bmi < 30) return { bg: 'bg-red-500', text: 'text-white' }; // 超重临界
    if (bmi < 34) return { bg: 'bg-red-600', text: 'text-white' }; // 肥胖Ⅰ级
    if (bmi < 38) return { bg: 'bg-red-800', text: 'text-white' }; // 肥胖Ⅱ级和Ⅲ级
    return { bg: 'bg-red-900', text: 'text-white' }; // 高危肥胖
  };
  
  // 获取BMI对应的背景色
  const getBmiBackgroundColor = (bmi: number) => {
    return getRulerColorAtPosition(bmi).bg;
  };
  
  // 获取BMI对应的文字颜色
  const getBmiTextColor = (bmi: number) => {
    return getRulerColorAtPosition(bmi).text;
  };

  // 当用户数据变化时计算结果
  useEffect(() => {
    // 验证数据是否在有效范围内
    const { age, height, weight } = userData;
    
    // 检查是否有空值
    if (age === '' || height === '' || weight === '') {
      return; // 如果有空值，不进行计算
    }
    
    // 转换为数字进行比较
    const ageNum = typeof age === 'string' ? parseInt(age) : age;
    const heightNum = typeof height === 'string' ? parseInt(height) : height;
    const weightNum = typeof weight === 'string' ? parseInt(weight) : weight;
    
    if (ageNum < 12 || ageNum > 60 || heightNum < 90 || heightNum > 200 || weightNum < 30 || weightNum > 300) {
      return; // 如果数据无效，不进行计算
    }
    
    try {
      const result = calculateFemaleNutrition(userData);
      setResult(result);
      setError(null);
      
      // 记录用户数据并更新统计信息
      if (result) {
        const userRecord: UserRecord = {
          age: typeof userData.age === 'string' ? parseInt(userData.age) : userData.age,
          height: typeof userData.height === 'string' ? parseInt(userData.height) : userData.height,
          weight: typeof userData.weight === 'string' ? parseInt(userData.weight) : userData.weight,
          bmi: result.bmi,
          obesityLevel: result.obesityLevel,
          timestamp: Date.now()
        };
        
        const updatedStats = recordUserData(userRecord);
        setStatistics(updatedStats);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('计算过程中发生错误');
      }
    }
  }, [userData.age, userData.height, userData.weight]);

  // 轮播效果
  useEffect(() => {
    if (result) {
      const timer = setInterval(() => {
        // 开始过渡动画
        setIsTransitioning(true);
        
        // 延迟更新索引，等待淡出动画完成
        setTimeout(() => {
          setCarouselIndex((prevIndex) => (prevIndex + 1) % 2);
          
          // 延迟结束过渡状态，等待淡入动画完成
          setTimeout(() => {
            setIsTransitioning(false);
          }, 300);
        }, 300);
      }, 4000);
      
      return () => clearInterval(timer);
    }
  }, [result]);

  // 根据超重情况确定颜色
  const getOverweightColor = (value: number) => {
    if (value < 0) return 'text-blue-600 font-bold';
    if (value > 0) return 'text-red-600 font-bold';
    return 'font-bold';
  };

  // 根据BMI和轮播索引获取膳食建议
  const getDietAdviceByCarousel = () => {
    if (!result) return '-';
    
    switch (carouselIndex) {
      case 0:
        return result.dietAdvice;
      case 1:
        // 第二轮：更具体的膳食建议，基于提供的BMI对应关系
        if (result.bmi < 16) {
          return "搭配新鲜蔬果（如草莓、菠菜），用全脂乳制品+坚果时，补充维生素C促进钙吸收";
        } else if (result.bmi < 18.5) {
          return "分餐时优先搭配慢碳食物（如燕麦、鹰嘴豆），避免精制碳水导致血糖波动";
        } else if (result.bmi < 20) {
          return "搭配胡萝卜（含VA）促进VD吸收，加蓝莓补充类黄酮抗氧化";
        } else if (result.bmi < 22) {
          return "用甜叶菊调味，搭配无糖酸奶（益生菌）调理肠道，强化控糖后的肠道健康";
        } else if (result.bmi < 24) {
          return "搭配鸡胸肉（优质蛋白），补充绿叶菜中的镁元素（如杏仁），平衡营养";
        } else if (result.bmi < 26) {
          return "搭配香蕉（高钾）平衡钠摄入，用橄榄油（单不饱和脂肪）烹饪，强化'少油少盐'逻辑";
        } else if (result.bmi < 28) {
          return "断食期喝椰青补充电解质，复食期优先选低GI食物（如蓝莓、鸡蛋），降低能量波动";
        } else if (result.bmi < 30) {
          return "减热量同时，用魔芋（高纤维）增加饱腹感，避免因节食导致便秘";
        } else if (result.bmi < 32) {
          return "搭配无糖酸奶（益生菌），让膳食纤维成为益生元的'食物'，强化肠道调理逻辑";
        } else if (result.bmi < 34) {
          return "低GI食材搭配牛油果（优质脂肪），进一步延缓升糖，强化'控糖'效果";
        } else if (result.bmi < 36) {
          return "减热量时，保留瘦牛肉（铁/锌）和菠菜（铁），保证微量元素摄入，避免营养不良";
        } else if (result.bmi < 38) {
          return "每周吃'彩虹蔬果'（彩椒、橙子等），覆盖维生素A/B/C/E，强化营养多样性";
        } else {
          return "每月尝试新食材（如巴西坚果），用蒸/烤替代油炸，强化'健康烹饪'逻辑";
        }
      case 2:
        // 第三轮：反思启发
        if (result.bmi < 16) {
          return "只吃坚果和全脂奶，没配蔬果，膳食纤维会不足吗？";
        } else if (result.bmi < 18.5) {
          return "分5-6餐但全是精制碳水，反而升糖快，还能控体重吗？";
        } else if (result.bmi < 20) {
          return "只吃深海鱼，没配VA食材，VD能有效利用吗？";
        } else if (result.bmi < 22) {
          return "全谷物吃了但加糖调味，控糖还有效果吗？";
        } else if (result.bmi < 24) {
          return "晚餐少碳水只吃绿叶菜，蛋白不够，夜间修复受影响吗？";
        } else if (result.bmi < 26) {
          return "白肉做的时候油盐多，替换红肉还有意义吗？";
        } else if (result.bmi < 28) {
          return "间歇性饮食但断食期缺水，会导致脱水吗？";
        } else if (result.bmi < 30) {
          return "热量减了但蛋白过量，肾脏负担会加重吗？";
        } else if (result.bmi < 32) {
          return "只吃纤维补充剂，没配益生菌，能改善肠道吗？";
        } else if (result.bmi < 34) {
          return "低GI食材吃太多，总热量超标，还能控糖吗？";
        } else if (result.bmi < 36) {
          return "热量减了却不吃瘦肉，铁锌会缺乏吗？";
        } else if (result.bmi < 38) {
          return "营养丰富但量太多，热量超标，均衡还有用吗？";
        } else {
          return "逐步调整但一直吃旧食材，多样化怎么实现？";
        }
      default:
        return result.dietAdvice;
    }
  };

  // 根据BMI和轮播索引获取营养素侧重
  const getNutrientFocusByCarousel = () => {
    if (!result) return '-';
    
    switch (carouselIndex) {
      case 0:
        return result.nutrientFocus;
      case 1:
        // 第二轮：更具体的营养素建议，基于提供的BMI对应关系
        if (result.bmi < 16) {
          return "健康脂肪+钙+维生素C（促进钙吸收）";
        } else if (result.bmi < 18.5) {
          return "蛋白质+复合碳水+缓释碳水（稳定血糖）";
        } else if (result.bmi < 20) {
          return "Ω-3脂肪酸+维生素D+维生素A+类黄酮（抗氧化）";
        } else if (result.bmi < 22) {
          return "膳食纤维+B族维生素+益生菌+天然甜味（低卡）";
        } else if (result.bmi < 24) {
          return "膳食纤维+植物营养素+优质蛋白+镁";
        } else if (result.bmi < 26) {
          return "不饱和脂肪酸+钾+单不饱和脂肪+低钠";
        } else if (result.bmi < 28) {
          return "能量循环营养素+电解质+低GI碳水（复食期）";
        } else if (result.bmi < 30) {
          return "高蛋白+健康脂肪+膳食纤维+低热量";
        } else if (result.bmi < 32) {
          return "膳食纤维+益生元+益生菌+发酵食物";
        } else if (result.bmi < 34) {
          return "低GI碳水+优质脂肪+慢吸收蛋白+抗氧化";
        } else if (result.bmi < 36) {
          return "必需营养素+铁/锌/硒+深色蔬菜+瘦肉";
        } else if (result.bmi < 38) {
          return "蛋白质+复合维生素（A/B/C/E）+全谷物+彩虹蔬果";
        } else {
          return "健康脂肪+膳食纤维+多样化食材+健康烹饪";
        }
      case 2:
        // 第三轮：反思启发
        if (result.bmi < 16) {
          return "健康脂肪和钙够了，缺维生素C，钙吸收会受影响吗？";
        } else if (result.bmi < 18.5) {
          return "只补蛋白和复合碳，缺健康脂肪，代谢会变慢吗？";
        } else if (result.bmi < 20) {
          return "Ω3和VD够了，缺抗氧化，炎症风险会增加吗？";
        } else if (result.bmi < 22) {
          return "纤维和B族够了，缺益生菌，肠道消化会差吗？";
        } else if (result.bmi < 24) {
          return "植物营养素够了，缺优质蛋白，肌肉会流失吗？";
        } else if (result.bmi < 26) {
          return "不饱和脂肪和钾够了，没控钠，血压会升高吗？";
        } else if (result.bmi < 28) {
          return "戒了含糖饮料，复食期吃高糖，能量循环会紊乱吗？";
        } else if (result.bmi < 30) {
          return "高蛋白和健康脂够了，缺纤维，肠道会不畅吗？";
        } else if (result.bmi < 32) {
          return "纤维和益生元够了，缺益生菌，菌群能平衡吗？";
        } else if (result.bmi < 34) {
          return "低GI和能量循环营养素够了，缺抗氧化，血糖波动会大吗？";
        } else if (result.bmi < 36) {
          return "必需营养素够了，缺微量元素，免疫力会下降吗？";
        } else if (result.bmi < 38) {
          return "蛋白和维生素够了，缺全谷物，膳食纤维会缺吗？";
        } else {
          return "健康脂和纤维够了，烹饪用油过量，反而成负担？";
        }
      default:
        return result.nutrientFocus;
    }
  };

  // 根据BMI和轮播索引获取食材推荐
  const getFoodRecommendationByCarousel = (): FoodItem[] => {
    if (!result || !result.foodRecommendations[0]) return [];
    if (result.foodRecommendations[0].startsWith('⚠️')) return [{ name: result.foodRecommendations[0], category: '其他', icon: '⚠️' }];
    
    // 每个BMI等级只推荐一批食材，不根据轮播索引变化
    if (result.bmi < 16) {
      return [
        { name: "全脂酸奶", category: "乳制品类", icon: "🧁" },
        { name: "巴旦木", category: "坚果类", icon: "🥜" },
        { name: "草莓", category: "水果类", icon: "🍓" },
        { name: "菠菜", category: "蔬菜类", icon: "🥬" },
        { name: "亚麻籽", category: "补充剂", icon: "🌱" },
        { name: "鸡蛋", category: "蛋白质类", icon: "🥚" },
        { name: "燕麦片", category: "谷物类", icon: "🥣" },
        { name: "蓝莓", category: "水果类", icon: "🫐" },
        { name: "核桃", category: "坚果类", icon: "🌰" },
        { name: "牛奶", category: "乳制品类", icon: "🥛" }
      ];
    } else if (result.bmi < 18.5) {
      return [
        { name: "煮鸡蛋", category: "蛋白质类", icon: "🥚" },
        { name: "燕麦片", category: "谷物类", icon: "🥣" },
        { name: "鹰嘴豆", category: "蛋白质类", icon: "🫘" },
        { name: "蓝莓", category: "水果类", icon: "🫐" },
        { name: "全麦面包", category: "谷物类", icon: "🍞" },
        { name: "鸡胸肉", category: "蛋白质类", icon: "🍗" },
        { name: "香蕉", category: "水果类", icon: "🍌" },
        { name: "杏仁", category: "坚果类", icon: "🥜" },
        { name: "希腊酸奶", category: "乳制品类", icon: "🧁" },
        { name: "西兰花", category: "蔬菜类", icon: "🥦" }
      ];
    } else if (result.bmi < 20) {
      return [
        { name: "三文鱼", category: "蛋白质类", icon: "🐟" },
        { name: "胡萝卜", category: "蔬菜类", icon: "🥕" },
        { name: "蓝莓", category: "水果类", icon: "🫐" },
        { name: "核桃", category: "坚果类", icon: "🌰" },
        { name: "蘑菇", category: "蔬菜类", icon: "🍄" },
        { name: "鸡蛋", category: "蛋白质类", icon: "🥚" },
        { name: "菠菜", category: "蔬菜类", icon: "🥬" },
        { name: "苹果", category: "水果类", icon: "🍎" },
        { name: "燕麦", category: "谷物类", icon: "🥣" },
        { name: "牛奶", category: "乳制品类", icon: "🥛" }
      ];
    } else if (result.bmi < 22) {
      return [
        { name: "藜麦", category: "谷物类", icon: "🌾" },
        { name: "奇亚籽", category: "补充剂", icon: "🌱" },
        { name: "无糖酸奶", category: "乳制品类", icon: "🧁" },
        { name: "苹果", category: "水果类", icon: "🍎" },
        { name: "肉桂", category: "其他", icon: "🌿" },
        { name: "牛油果", category: "油脂类", icon: "🥑" },
        { name: "鸡蛋", category: "蛋白质类", icon: "🥚" },
        { name: "蓝莓", category: "水果类", icon: "🫐" },
        { name: "杏仁", category: "坚果类", icon: "🥜" },
        { name: "西兰花", category: "蔬菜类", icon: "🥦" }
      ];
    } else if (result.bmi < 24) {
      return [
        { name: "菠菜", category: "蔬菜类", icon: "🥬" },
        { name: "鸡胸肉", category: "蛋白质类", icon: "🍗" },
        { name: "西兰花", category: "蔬菜类", icon: "🥦" },
        { name: "杏仁", category: "坚果类", icon: "🥜" },
        { name: "荞麦面", category: "谷物类", icon: "🍜" },
        { name: "鸡蛋", category: "蛋白质类", icon: "🥚" },
        { name: "蓝莓", category: "水果类", icon: "🫐" },
        { name: "希腊酸奶", category: "乳制品类", icon: "🧁" },
        { name: "胡萝卜", category: "蔬菜类", icon: "🥕" },
        { name: "燕麦", category: "谷物类", icon: "🥣" }
      ];
    } else if (result.bmi < 26) {
      return [
        { name: "鳕鱼", category: "蛋白质类", icon: "🐟" },
        { name: "黄瓜", category: "蔬菜类", icon: "🥒" },
        { name: "牛油果", category: "油脂类", icon: "🥑" },
        { name: "香蕉", category: "水果类", icon: "🍌" },
        { name: "番茄", category: "蔬菜类", icon: "🍅" },
        { name: "鸡胸肉", category: "蛋白质类", icon: "🍗" },
        { name: "蓝莓", category: "水果类", icon: "🫐" },
        { name: "杏仁", category: "坚果类", icon: "🥜" },
        { name: "希腊酸奶", category: "乳制品类", icon: "🧁" },
        { name: "西兰花", category: "蔬菜类", icon: "🥦" }
      ];
    } else if (result.bmi < 28) {
      return [
        { name: "黑咖啡", category: "其他", icon: "☕" },
        { name: "椰青", category: "其他", icon: "🥥" },
        { name: "鸡蛋", category: "蛋白质类", icon: "🥚" },
        { name: "蓝莓", category: "水果类", icon: "🫐" },
        { name: "杏仁", category: "坚果类", icon: "🥜" },
        { name: "鸡胸肉", category: "蛋白质类", icon: "🍗" },
        { name: "菠菜", category: "蔬菜类", icon: "🥬" },
        { name: "燕麦", category: "谷物类", icon: "🥣" },
        { name: "希腊酸奶", category: "乳制品类", icon: "🧁" },
        { name: "胡萝卜", category: "蔬菜类", icon: "🥕" }
      ];
    } else if (result.bmi < 30) {
      return [
        { name: "鸡胸肉", category: "蛋白质类", icon: "🍗" },
        { name: "西兰花", category: "蔬菜类", icon: "🥦" },
        { name: "杏仁", category: "坚果类", icon: "🥜" },
        { name: "魔芋", category: "补充剂", icon: "🍠" },
        { name: "希腊酸奶", category: "乳制品类", icon: "🧁" },
        { name: "鸡蛋", category: "蛋白质类", icon: "🥚" },
        { name: "蓝莓", category: "水果类", icon: "🫐" },
        { name: "菠菜", category: "蔬菜类", icon: "🥬" },
        { name: "燕麦", category: "谷物类", icon: "🥣" },
        { name: "胡萝卜", category: "蔬菜类", icon: "🥕" }
      ];
    } else if (result.bmi < 32) {
      return [
        { name: "洋车前子壳", category: "补充剂", icon: "🌿" },
        { name: "无糖酸奶", category: "乳制品类", icon: "🧁" },
        { name: "香蕉", category: "水果类", icon: "🍌" },
        { name: "燕麦", category: "谷物类", icon: "🥣" },
        { name: "奇亚籽", category: "补充剂", icon: "🌱" },
        { name: "鸡胸肉", category: "蛋白质类", icon: "🍗" },
        { name: "蓝莓", category: "水果类", icon: "🫐" },
        { name: "杏仁", category: "坚果类", icon: "🥜" },
        { name: "菠菜", category: "蔬菜类", icon: "🥬" },
        { name: "鸡蛋", category: "蛋白质类", icon: "🥚" }
      ];
    } else if (result.bmi < 34) {
      return [
        { name: "藜麦", category: "谷物类", icon: "🌾" },
        { name: "牛油果", category: "油脂类", icon: "🥑" },
        { name: "鸡蛋", category: "蛋白质类", icon: "🥚" },
        { name: "蓝莓", category: "水果类", icon: "🫐" },
        { name: "全麦面包", category: "谷物类", icon: "🍞" },
        { name: "鸡胸肉", category: "蛋白质类", icon: "🍗" },
        { name: "杏仁", category: "坚果类", icon: "🥜" },
        { name: "希腊酸奶", category: "乳制品类", icon: "🧁" },
        { name: "西兰花", category: "蔬菜类", icon: "🥦" },
        { name: "胡萝卜", category: "蔬菜类", icon: "🥕" }
      ];
    } else if (result.bmi < 36) {
      return [
        { name: "瘦牛肉", category: "蛋白质类", icon: "🥩" },
        { name: "菠菜", category: "蔬菜类", icon: "🥬" },
        { name: "南瓜籽", category: "坚果类", icon: "🎃" },
        { name: "蓝莓", category: "水果类", icon: "🫐" },
        { name: "糙米", category: "谷物类", icon: "🍚" },
        { name: "鸡蛋", category: "蛋白质类", icon: "🥚" },
        { name: "杏仁", category: "坚果类", icon: "🥜" },
        { name: "希腊酸奶", category: "乳制品类", icon: "🧁" },
        { name: "西兰花", category: "蔬菜类", icon: "🥦" },
        { name: "胡萝卜", category: "蔬菜类", icon: "🥕" }
      ];
    } else if (result.bmi < 38) {
      return [
        { name: "三文鱼", category: "蛋白质类", icon: "🐟" },
        { name: "彩椒", category: "蔬菜类", icon: "🫑" },
        { name: "藜麦", category: "谷物类", icon: "🌾" },
        { name: "橙子", category: "水果类", icon: "🍊" },
        { name: "核桃", category: "坚果类", icon: "🌰" },
        { name: "鸡胸肉", category: "蛋白质类", icon: "🍗" },
        { name: "蓝莓", category: "水果类", icon: "🫐" },
        { name: "希腊酸奶", category: "乳制品类", icon: "🧁" },
        { name: "西兰花", category: "蔬菜类", icon: "🥦" },
        { name: "菠菜", category: "蔬菜类", icon: "🥬" }
      ];
    } else {
      return [
        { name: "橄榄油", category: "油脂类", icon: "🫒" },
        { name: "奇亚籽", category: "补充剂", icon: "🌱" },
        { name: "紫甘蓝", category: "蔬菜类", icon: "🥬" },
        { name: "鲑鱼", category: "蛋白质类", icon: "🐟" },
        { name: "巴西坚果", category: "坚果类", icon: "🥜" },
        { name: "鸡胸肉", category: "蛋白质类", icon: "🍗" },
        { name: "蓝莓", category: "水果类", icon: "🫐" },
        { name: "希腊酸奶", category: "乳制品类", icon: "🧁" },
        { name: "西兰花", category: "蔬菜类", icon: "🥦" },
        { name: "燕麦", category: "谷物类", icon: "🥣" }
      ];
    }
  };

  // 获取轮播内容的动画类名
  const getCarouselAnimationClass = () => {
    return isTransitioning ? 'opacity-0' : 'opacity-100';
  };

  return (
    <div className="max-w-5xl mx-auto">
      <style>{`
        .writing-vertical-rl {
          writing-mode: vertical-rl;
          text-orientation: upright;
        }
        .text-shadow {
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
        }
        .transition-opacity {
          transition: opacity 0.5s ease-in-out;
        }
        @keyframes fadeInOut {
          0% { opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { opacity: 0; }
        }
        .shadow-input-excel {
          box-shadow: 0 0 0 2px #2684FF;
        }
        .excel-handle {
          position: absolute;
          bottom: -5px;
          right: -5px;
          width: 8px;
          height: 8px;
          background-color: #2684FF;
          border: 1px solid white;
          cursor: nwse-resize;
        }
        .carousel-transition {
          transition: opacity 0.3s ease-in-out;
        }
        @keyframes heartbeat {
          0% { transform: scale(1); }
          15% { transform: scale(1.3); }
          30% { transform: scale(1); }
          45% { transform: scale(1.3); }
          60% { transform: scale(1); }
          100% { transform: scale(1); }
        }
        .heartbeat-animation {
          animation: heartbeat 1.2s infinite;
          display: inline-block;
          font-size: 2rem;
        }
      `}</style>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
          {error}
        </div>
      )}

      <div className="overflow-hidden border-b border-gray-200 rounded-lg relative">
        {/* 标题栏 - 行高缩小到80% */}
        <div className={`${result ? getBmiBackgroundColor(result.bmi) : 'bg-purple-700'} text-center py-2 text-4xl font-bold`} style={{ height: '80%' }}>
          <span className={`${result ? getBmiTextColor(result.bmi) : 'text-white'}`}>女生减肥不能只看吃多少</span>
        </div>

        {/* 基础信息区 */}
        <div>
            {/* 基础信息区 */}
            <table className="w-full table-fixed border-collapse">
              <thead>
                <tr className={`${result ? getBmiBackgroundColor(result.bmi) : 'bg-purple-700'} h-8`}>
                  <th className={`w-1/5 px-2 py-1 text-center border border-purple-800 whitespace-nowrap ${result ? getBmiTextColor(result.bmi) : 'text-white'}`}>年龄(岁)</th>
                  <th className={`w-1/5 px-2 py-1 text-center border border-purple-800 whitespace-nowrap ${result ? getBmiTextColor(result.bmi) : 'text-white'}`}>身高(cm)</th>
                  <th className={`w-1/5 px-2 py-1 text-center border border-purple-800 whitespace-nowrap ${result ? getBmiTextColor(result.bmi) : 'text-white'}`}>体重(斤)</th>
                  <th className={`w-1/5 px-2 py-1 text-center border border-purple-800 whitespace-nowrap ${result ? getBmiTextColor(result.bmi) : 'text-white'}`}>标准体重(斤)</th>
                  <th className={`w-1/5 px-2 py-1 text-center border border-purple-800 whitespace-nowrap ${result ? getBmiTextColor(result.bmi) : 'text-white'}`}>超重(斤)</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr style={{ height: '85%' }}>
                  <td className={`w-1/5 px-2 py-1 border ${focusedInput === 'age' ? 'border-blue-500 shadow-input-excel' : 'border-gray-300'} bg-gray-100 relative`}>
                    <div className="flex items-center justify-center">
                      <input
                        ref={ageInputRef}
                        type="text"
                        name="age"
                        value={userData.age}
                        onChange={handleInputChange}
                        onFocus={() => handleFocus('age')}
                        onBlur={handleBlur}
                        onKeyDown={(e) => handleKeyDown(e, 'age')}
                        className="w-16 text-center text-3xl font-bold bg-transparent border-none focus:outline-none"
                      />
                      {focusedInput === 'age' && <div className="excel-handle"></div>}
                    </div>
                  </td>
                  <td className={`w-1/5 px-2 py-1 border ${focusedInput === 'height' ? 'border-blue-500 shadow-input-excel' : 'border-gray-300'} bg-teal-50 relative`}>
                    <input
                      ref={heightInputRef}
                      type="text"
                      name="height"
                      value={userData.height}
                      onChange={handleInputChange}
                      onFocus={() => handleFocus('height')}
                      onBlur={handleBlur}
                      onKeyDown={(e) => handleKeyDown(e, 'height')}
                      className="w-full text-center text-3xl font-bold bg-transparent border-none focus:outline-none"
                    />
                    {focusedInput === 'height' && <div className="excel-handle"></div>}
                  </td>
                  <td className={`w-1/5 px-2 py-1 border ${focusedInput === 'weight' ? 'border-blue-500 shadow-input-excel' : 'border-gray-300'} bg-yellow-50 relative`}>
                    <input
                      ref={weightInputRef}
                      type="text"
                      name="weight"
                      value={userData.weight}
                      onChange={handleInputChange}
                      onFocus={() => handleFocus('weight')}
                      onBlur={handleBlur}
                      onKeyDown={(e) => handleKeyDown(e, 'weight')}
                      className="w-full text-center text-3xl font-bold bg-transparent border-none focus:outline-none"
                    />
                    {focusedInput === 'weight' && <div className="excel-handle"></div>}
                  </td>
                  <td className="w-1/5 px-2 py-1 border border-gray-300 bg-gray-50 text-center text-3xl font-bold">
                    {result ? result.standardWeight : '-'}
                  </td>
                  <td className={`w-1/5 px-2 py-1 border border-gray-300 bg-gray-50 text-center text-3xl ${result ? getOverweightColor(result.overweight) : ''}`}>
                    {result ? (result.overweight > 0 ? <span className="heartbeat-animation">+{result.overweight}</span> : result.overweight) : '-'}
                  </td>
                </tr>
              </tbody>
            </table>
            
            {/* BMI、肥胖程度、运动能吃、不运动能吃、时间估算区（合并在一行） */}
            <table className="w-full table-fixed border-collapse">
              <thead>
                <tr className={`${result ? getBmiBackgroundColor(result.bmi) : 'bg-purple-700'} h-8`}>
                  <th className={`w-1/6 px-2 py-1 text-center border border-purple-800 ${result ? getBmiTextColor(result.bmi) : 'text-white'}`}>BMI</th>
                  <th className={`w-1/3 px-2 py-1 text-center border border-purple-800 ${result ? getBmiTextColor(result.bmi) : 'text-white'}`}>肥胖程度</th>
                  <th className={`w-1/6 px-2 py-1 text-center border border-purple-800 ${result ? getBmiTextColor(result.bmi) : 'text-white'}`}>运动能吃(大卡)</th>
                  <th className={`w-1/6 px-2 py-1 text-center border border-purple-800 ${result ? getBmiTextColor(result.bmi) : 'text-white'}`}>不运动能吃(大卡)</th>
                  <th className={`w-1/6 px-2 py-1 text-center border border-purple-800 ${result ? getBmiTextColor(result.bmi) : 'text-white'}`}>时间估算(月)</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr className="h-12">
                  <td className="w-1/6 px-2 py-0 border border-gray-300 bg-gray-50 text-center text-3xl font-bold">
                    {result ? result.bmi.toFixed(1) : '-'}
                  </td>
                  <td className="w-1/3 px-2 py-0 border border-gray-300 bg-gray-50">
                    <div className="flex items-center justify-between h-12">
                      <div className="flex-1 text-center text-xl font-bold">
                        {result ? result.obesityLevel : '-'}
                      </div>
                      {result && (
                        <div className="w-16 h-16">
                          <BmiBodyIcon bmi={result.bmi} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="w-1/6 px-2 py-0 border border-gray-300 bg-gray-50 text-center text-3xl font-bold">
                    {result ? Math.round(result.activeCalories) : '-'}
                  </td>
                  <td className="w-1/6 px-2 py-0 border border-gray-300 bg-gray-50 text-center text-3xl font-bold">
                    {result ? Math.round(result.inactiveCalories) : '-'}
                  </td>
                  <td className="w-1/6 px-2 py-0 border border-gray-300 bg-gray-50 text-center text-3xl font-bold">
                    {result ? (result.overweight > 0 ? result.timeEstimate : 0) : '-'}
                  </td>
                </tr>
              </tbody>
            </table>
            
            {/* 膳食建议和关键营养素侧重区 */}
            <table className="w-full table-fixed border-collapse">
              <thead>
                <tr className={`${result ? getBmiBackgroundColor(result.bmi) : 'bg-purple-700'} h-8`}>
                  <th className={`w-1/2 px-2 py-1 text-center border border-purple-800 ${result ? getBmiTextColor(result.bmi) : 'text-white'}`}>膳食建议</th>
                  <th className={`w-1/2 px-2 py-1 text-center border border-purple-800 ${result ? getBmiTextColor(result.bmi) : 'text-white'}`}>关键营养素侧重</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr>
                  <td className="w-1/2 px-2 py-1 border border-gray-300 bg-gray-50" style={{ height: '4.5rem' }}>
                    <div className="flex items-center justify-center h-full">
                      <div className={`text-center carousel-transition ${getCarouselAnimationClass()} text-lg font-bold`}>
                        {getDietAdviceByCarousel()}
                      </div>
                    </div>
                  </td>
                  <td className="w-1/2 px-2 py-1 border border-gray-300 bg-gray-50" style={{ height: '4.5rem' }}>
                    <div className="flex items-center justify-center h-full">
                      <div className={`text-center carousel-transition ${getCarouselAnimationClass()} text-lg font-bold`}>
                        {getNutrientFocusByCarousel()}
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            
            {/* 食材推荐区 */}
            <table className="w-full table-fixed border-collapse">
              <thead>
                <tr className={`${result ? getBmiBackgroundColor(result.bmi) : 'bg-purple-700'} h-8`}>
                  <th className={`px-2 py-1 text-center border border-purple-800 ${result ? getBmiTextColor(result.bmi) : 'text-white'}`}>食材推荐</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr>
                  <td className="px-2 py-1 border border-gray-300 bg-gray-50" style={{ height: '2.5rem' }}>
                    <div className="flex items-center justify-center h-full">
                      <div className={`text-center carousel-transition ${getCarouselAnimationClass()} text-lg font-bold`}>
                        {(() => {
                          const foods = getFoodRecommendationByCarousel();
                          if (foods.length === 0) return '-';
                          if (foods.length === 1 && foods[0].name.startsWith('⚠️')) {
                            return foods[0].name;
                          }
                          
                          // 按类别分组食材，用 | 分隔不同类别
                          const groupedFoods = foods.reduce((groups, food) => {
                            if (!groups[food.category]) {
                              groups[food.category] = [];
                            }
                            groups[food.category].push(food);
                            return groups;
                          }, {} as Record<string, FoodItem[]>);

                          const categoryKeys = Object.keys(groupedFoods);
                          return categoryKeys.map((category, categoryIndex) => (
                            <span key={category}>
                              {groupedFoods[category].map((food, foodIndex) => (
                                <span key={`${category}-${foodIndex}`}>
                                  {food.icon}{food.name}
                                </span>
                              ))}
                              {categoryIndex < categoryKeys.length - 1 ? ' | ' : ''}
                            </span>
                          ));
                        })()}
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        
        {/* 视觉效果（炸弹或花朵） */}
        {result && (
          <div className="absolute bottom-2 right-2">
            <DoctorIcon bmi={result.bmi} />
          </div>
        )}
      </div>
      
      {/* 统计信息区 */}
      {statistics && statistics.totalCount > 0 && (
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md text-sm">
          <div className="font-bold mb-1">统计信息</div>
          <div>总记录数: {statistics.totalCount}</div>
          <div>今日记录: {statistics.todayCount}</div>
          {statistics.topUsers.length > 0 && (
            <div>最高BMI记录: {statistics.topUsers[0].bmi.toFixed(1)}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default FemaleNutritionTable;
