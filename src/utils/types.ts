// 性别类型
export type Gender = 'male' | 'female';

// 活动水平类型
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';

// 健康目标类型
export type Goal = 'lose' | 'maintain' | 'gain';

// 用户数据接口
export interface UserData {
  age: number;
  gender: Gender;
  height: number; // 厘米
  weight: number; // 公斤
  activityLevel: ActivityLevel;
  goal: Goal;
}

// 代谢数据接口
export interface MetabolismData {
  bmr: number; // 基础代谢率 (千卡/天)
  tdee: number; // 总能量消耗 (千卡/天)
  targetCalories: number; // 根据目标调整后的能量需求 (千卡/天)
}

// 营养素数据接口
export interface NutrientsData {
  protein: number; // 蛋白质 (克)
  carbs: number; // 碳水化合物 (克)
  fat: number; // 脂肪 (克)
  fiber: number; // 膳食纤维 (克)
  water: number; // 水分 (毫升)
  recommendations: string; // 个性化建议
}

// 营养计算结果接口
export interface NutritionData {
  userData: UserData;
  metabolism: MetabolismData;
  nutrients: NutrientsData;
}