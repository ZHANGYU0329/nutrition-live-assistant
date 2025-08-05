/**
 * 女性减肥健康管理计算工具
 */
import { getBmiLevel, getDietAdvice, getNutrientFocus, getFoodRecommendation } from './bmiData';

/**
 * 用户输入数据接口
 */
export interface FemaleUserData {
  age: number | string;      // 年龄（岁）
  height: number | string;   // 身高（厘米）
  weight: number | string;   // 体重（斤）
}

/**
 * 计算结果数据接口
 */
export interface FemaleNutritionResult {
  standardWeight: number;   // 标准体重（斤）
  overweight: number;       // 超重（斤）
  bmi: number;              // BMI值
  obesityLevel: string;     // 肥胖程度
  activeCalories: number;   // 运动能吃（大卡）
  inactiveCalories: number; // 不运动能吃（大卡）
  timeEstimate: number;     // 时间估算（月）
  basalMetabolism: number;  // 基础代谢（大卡）
  dietAdvice: string;       // 膳食建议
  nutrientFocus: string;    // 营养素侧重
  foodRecommendations: string[]; // 食材推荐
}

/**
 * 计算标准体重
 * 公式：(身高 - 105) × 2
 */
export function calculateStandardWeight(height: number): number {
  return (height - 105) * 2;
}

/**
 * 计算超重
 * 公式：体重 - 标准体重
 */
export function calculateOverweight(weight: number, standardWeight: number): number {
  return weight - standardWeight;
}

/**
 * 计算BMI
 * 公式：(体重÷2) ÷ ((身高÷100)²)
 * 体重转千克：斤÷2；身高转米：cm÷100
 */
export function calculateBMI(weight: number, height: number): number {
  const weightInKg = weight / 2;
  const heightInM = height / 100;
  return weightInKg / (heightInM * heightInM);
}

/**
 * 计算基础代谢（使用数字参数）
 */
function calculateBasalMetabolismWithNumbers(age: number, height: number, weight: number): number {
  const weightInKg = weight / 2;
  return 655.1 + (9.56 * weightInKg) + (1.85 * height) - (4.68 * age);
}

/**
 * 计算基础代谢
 * 公式：655.1 + 9.56×(体重÷2) + 1.85×身高 - 4.68×年龄
 */
export function calculateBasalMetabolism(userData: FemaleUserData): number {
  // 转换输入值为数字
  const ageNum = typeof userData.age === 'string' ? parseInt(userData.age) || 0 : userData.age;
  const heightNum = typeof userData.height === 'string' ? parseInt(userData.height) || 0 : userData.height;
  const weightNum = typeof userData.weight === 'string' ? parseInt(userData.weight) || 0 : userData.weight;
  
  return calculateBasalMetabolismWithNumbers(ageNum, heightNum, weightNum);
}

/**
 * 计算运动能吃热量
 * 公式：基础代谢 × 1.6 - 800
 */
export function calculateActiveCalories(basalMetabolism: number): number {
  return basalMetabolism * 1.6 - 800;
}

/**
 * 计算不运动能吃热量
 * 公式：基础代谢 × 1.2 - 800
 */
export function calculateInactiveCalories(basalMetabolism: number): number {
  return basalMetabolism * 1.2 - 800;
}

/**
 * 计算时间估算（月）
 * 公式：ROUND(超重 ÷ 8, 0)
 */
export function calculateTimeEstimate(overweight: number): number {
  return Math.round(overweight / 8);
}

/**
 * 计算女性营养结果
 */
export function calculateFemaleNutrition(userData: FemaleUserData): FemaleNutritionResult {
  // 转换输入值为数字
  const ageNum = typeof userData.age === 'string' ? parseInt(userData.age) || 0 : userData.age;
  const heightNum = typeof userData.height === 'string' ? parseInt(userData.height) || 0 : userData.height;
  const weightNum = typeof userData.weight === 'string' ? parseInt(userData.weight) || 0 : userData.weight;
  
  // 验证输入范围
  if (ageNum < 12 || ageNum > 60) {
    throw new Error("年龄必须在12-60岁之间");
  }
  if (heightNum < 90 || heightNum > 200) {
    throw new Error("身高必须在90-200厘米之间");
  }
  if (weightNum < 30 || weightNum > 300) {
    throw new Error("体重必须在30-300斤之间");
  }
  
  // 使用转换后的数值进行计算
  const standardWeight = calculateStandardWeight(heightNum);
  const overweight = calculateOverweight(weightNum, standardWeight);
  const bmi = calculateBMI(weightNum, heightNum);
  const basalMetabolism = calculateBasalMetabolismWithNumbers(ageNum, heightNum, weightNum);
  const activeCalories = calculateActiveCalories(basalMetabolism);
  const inactiveCalories = calculateInactiveCalories(basalMetabolism);
  const timeEstimate = calculateTimeEstimate(overweight);
  const obesityLevel = getBmiLevel(bmi);
  const dietAdvice = getDietAdvice(bmi);
  const nutrientFocus = getNutrientFocus(bmi);
  const foodRecommendations = getFoodRecommendation(bmi);
  
  return {
    standardWeight,
    overweight,
    bmi,
    obesityLevel,
    activeCalories,
    inactiveCalories,
    timeEstimate,
    basalMetabolism,
    dietAdvice,
    nutrientFocus,
    foodRecommendations
  };
}