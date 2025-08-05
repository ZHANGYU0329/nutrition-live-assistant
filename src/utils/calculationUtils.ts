import { UserData, MetabolismData, NutrientsData, ActivityLevel, Goal } from './types';

// 活动水平系数
const activityFactors: Record<ActivityLevel, number> = {
  sedentary: 1.2,      // 久坐不动
  light: 1.375,        // 轻度活动
  moderate: 1.55,      // 中度活动
  active: 1.725,       // 积极活动
  veryActive: 1.9      // 非常活跃
};

// 目标调整系数
const goalFactors: Record<Goal, number> = {
  lose: 0.8,           // 减重 (减少20%热量)
  maintain: 1.0,       // 维持体重
  gain: 1.15           // 增肌增重 (增加15%热量)
};

/**
 * 计算基础代谢率 (BMR) 和总能量消耗 (TDEE)
 * 使用修正的Harris-Benedict公式
 */
export function calculateMetabolism(userData: UserData): MetabolismData {
  const { age, gender, height, weight, activityLevel, goal } = userData;
  
  // 计算基础代谢率 (BMR)
  let bmr = 0;
  if (gender === 'male') {
    // 男性BMR公式
    bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    // 女性BMR公式
    bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }
  
  // 计算总能量消耗 (TDEE)
  const tdee = bmr * activityFactors[activityLevel];
  
  // 根据目标调整热量需求
  const targetCalories = tdee * goalFactors[goal];
  
  return {
    bmr,
    tdee,
    targetCalories
  };
}

/**
 * 计算宏量营养素和微量营养素需求
 */
export function calculateNutrients(userData: UserData, metabolism: MetabolismData): NutrientsData {
  const { weight, goal, activityLevel } = userData;
  const { targetCalories } = metabolism;
  
  // 计算蛋白质需求 (根据体重和目标)
  let proteinPerKg = 0;
  if (goal === 'lose') {
    proteinPerKg = 2.0; // 减重时增加蛋白质摄入
  } else if (goal === 'gain') {
    proteinPerKg = 1.8; // 增肌时适当增加蛋白质
  } else {
    proteinPerKg = 1.2; // 维持体重时的标准蛋白质摄入
  }
  
  // 根据活动水平调整蛋白质需求
  if (activityLevel === 'active' || activityLevel === 'veryActive') {
    proteinPerKg += 0.2; // 高活动水平增加蛋白质需求
  }
  
  const protein = weight * proteinPerKg;
  
  // 计算脂肪需求 (总热量的25-30%)
  const fatPercentage = goal === 'lose' ? 0.3 : 0.25; // 减重时适当增加脂肪比例
  const fat = (targetCalories * fatPercentage) / 9; // 每克脂肪提供9千卡热量
  
  // 计算碳水化合物需求 (剩余热量)
  const proteinCalories = protein * 4; // 每克蛋白质提供4千卡热量
  const fatCalories = fat * 9;
  const carbsCalories = targetCalories - proteinCalories - fatCalories;
  const carbs = carbsCalories / 4; // 每克碳水化合物提供4千卡热量
  
  // 计算膳食纤维需求 (每1000千卡约14克)
  const fiber = (targetCalories / 1000) * 14;
  
  // 计算水分需求 (每千卡约1毫升，最低2000毫升)
  const water = Math.max(targetCalories, 2000);
  
  // 生成个性化建议
  let recommendations = '';
  
  if (goal === 'lose') {
    recommendations = '建议增加蛋白质摄入以保持肌肉量，控制碳水化合物摄入，优先选择复合碳水化合物。每天进行30-60分钟有氧运动，每周2-3次力量训练。多摄入富含纤维的蔬菜水果，保持充足的水分摄入以增强饱腹感。';
  } else if (goal === 'gain') {
    recommendations = '建议增加优质蛋白质和复合碳水化合物的摄入，分成5-6餐进食。每周进行3-5次力量训练，注重渐进式负荷增加。确保摄入足够的健康脂肪来支持荷尔蒙平衡。训练后30分钟内补充蛋白质和碳水化合物。';
  } else {
    recommendations = '建议均衡摄入各类营养素，保持多样化饮食。每周进行150分钟中等强度有氧运动和2次力量训练。优先选择全谷物、瘦肉蛋白、健康脂肪和多种蔬果。保持规律进餐，避免过度加工食品和添加糖。';
  }
  
  return {
    protein,
    carbs,
    fat,
    fiber,
    water,
    recommendations
  };
}