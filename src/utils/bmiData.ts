// BMI数据和对应的建议
export interface BmiAdvice {
  bmi: number;        // BMI基准值
  diet: string;       // 膳食建议
  nutrient: string;   // 营养素侧重
  food: string;       // 推荐食材（以+分隔）
}

// BMI与肥胖程度对应表
export interface BmiLevel {
  min: number;        // 最小BMI值
  max: number;        // 最大BMI值
  level: string;      // 肥胖程度判定
}

// BMI肥胖程度对应表
export const bmiLevels: BmiLevel[] = [
  { min: 38, max: Infinity, level: "高危肥胖" },
  { min: 36, max: 38, level: "中危肥胖" },
  { min: 34, max: 36, level: "肥胖Ⅲ级" },
  { min: 32, max: 34, level: "肥胖Ⅱ级" },
  { min: 30, max: 32, level: "肥胖Ⅰ级" },
  { min: 28, max: 30, level: "超重临界" },
  { min: 26, max: 28, level: "超重中期" },
  { min: 24, max: 26, level: "超重前期" },
  { min: 22, max: 24, level: "理想区间" },
  { min: 20, max: 22, level: "健康下限" },
  { min: 18, max: 20, level: "轻度体重不足" },
  { min: 16, max: 18, level: "严重体重不足" },
  { min: -Infinity, max: 16, level: "BMI异常" }
];

// BMI对应的膳食建议、营养素侧重和食材推荐
export const bmiAdviceData: BmiAdvice[] = [
  { 
    bmi: 16, 
    diet: "增加坚果和全脂乳制品", 
    nutrient: "健康脂肪+钙", 
    food: "全脂牛奶+坚果+香蕉+燕麦片+牛油果" 
  },
  { 
    bmi: 18, 
    diet: "每日5-6餐，增加优质蛋白", 
    nutrient: "蛋白质+复合碳水", 
    food: "鸡胸肉+鸡蛋+希腊酸奶+鹰嘴豆+花生酱" 
  },
  { 
    bmi: 20, 
    diet: "均衡饮食，适量增加热量", 
    nutrient: "均衡营养", 
    food: "全麦面包+瘦肉+鸡蛋+牛奶+水果" 
  },
  { 
    bmi: 22, 
    diet: "保持均衡饮食，控制精制糖", 
    nutrient: "优质蛋白+复合碳水", 
    food: "鸡胸肉+三文鱼+糙米+蔬菜+水果" 
  },
  { 
    bmi: 24, 
    diet: "控制总热量，增加蛋白质", 
    nutrient: "优质蛋白+膳食纤维", 
    food: "鸡胸肉+鸡蛋+燕麦+西兰花+豆类" 
  },
  { 
    bmi: 26, 
    diet: "减少碳水摄入，控制总热量", 
    nutrient: "蛋白质+膳食纤维", 
    food: "鸡胸肉+鸡蛋+绿叶蔬菜+豆类+坚果少量" 
  },
  { 
    bmi: 28, 
    diet: "严格控制碳水，增加蛋白质和纤维", 
    nutrient: "优质蛋白+膳食纤维", 
    food: "鸡胸肉+鱼+鸡蛋+绿叶蔬菜+小份水果" 
  },
  { 
    bmi: 30, 
    diet: "低碳生酮饮食，控制总热量", 
    nutrient: "优质蛋白+健康脂肪", 
    food: "鸡胸肉+鱼+鸡蛋+牛油果+橄榄油" 
  },
  { 
    bmi: 32, 
    diet: "严格控制热量，增加蛋白质", 
    nutrient: "优质蛋白+膳食纤维", 
    food: "鸡胸肉+鱼+蛋清+绿叶蔬菜+小份浆果" 
  },
  { 
    bmi: 34, 
    diet: "医学监督下的低热量饮食", 
    nutrient: "优质蛋白+必需微量元素", 
    food: "鸡胸肉+鱼+蛋清+绿叶蔬菜+补充剂" 
  },
  { 
    bmi: 36, 
    diet: "医学监督下的低热量饮食", 
    nutrient: "优质蛋白+必需微量元素", 
    food: "蛋白粉+鱼+蛋清+绿叶蔬菜+补充剂" 
  },
  { 
    bmi: 38, 
    diet: "医学干预，专业营养师指导", 
    nutrient: "医学营养干预", 
    food: "遵医嘱+高蛋白+低碳水+必需营养素" 
  },
  { 
    bmi: 40, 
    diet: "医学干预，专业营养师指导", 
    nutrient: "医学营养干预", 
    food: "遵医嘱+高蛋白+低碳水+必需营养素" 
  }
];

/**
 * 根据BMI获取肥胖程度
 * @param bmi BMI值
 * @returns 肥胖程度描述
 */
export function getBmiLevel(bmi: number): string {
  const level = bmiLevels.find(level => bmi >= level.min && bmi < level.max);
  return level ? level.level : "BMI异常";
}

/**
 * 根据BMI获取膳食建议
 * @param bmi BMI值
 * @returns 膳食建议或错误提示
 */
export function getDietAdvice(bmi: number): string {
  if (bmi < 16 || bmi > 40) {
    return "⚠️ BMI值超出建议范围（16-40）";
  }
  
  // 向下取整到最近的偶数
  const floorBmi = Math.floor(bmi / 2) * 2;
  
  // 找到最接近的建议
  const advice = bmiAdviceData.find(item => item.bmi === floorBmi) || 
                 bmiAdviceData.find(item => item.bmi >= floorBmi);
                 
  return advice ? advice.diet : "⚠️ BMI值超出建议范围（16-40）";
}

/**
 * 根据BMI获取营养素侧重
 * @param bmi BMI值
 * @returns 营养素侧重或错误提示
 */
export function getNutrientFocus(bmi: number): string {
  if (bmi < 16 || bmi > 40) {
    return "❗ 请咨询专业营养师";
  }
  
  // 向下取整到最近的偶数
  const floorBmi = Math.floor(bmi / 2) * 2;
  
  // 找到最接近的建议
  const advice = bmiAdviceData.find(item => item.bmi === floorBmi) || 
                 bmiAdviceData.find(item => item.bmi >= floorBmi);
                 
  return advice ? advice.nutrient : "❗ 请咨询专业营养师";
}

/**
 * 根据BMI获取食材推荐
 * @param bmi BMI值
 * @returns 食材推荐列表或错误提示
 */
export function getFoodRecommendation(bmi: number): string[] {
  if (bmi < 16 || bmi > 40) {
    return ["⚠️ 请检查BMI输入（有效范围16-40）"];
  }
  
  // 向下取整到最近的偶数
  const floorBmi = Math.floor(bmi / 2) * 2;
  
  // 找到最接近的建议
  const advice = bmiAdviceData.find(item => item.bmi === floorBmi) || 
                 bmiAdviceData.find(item => item.bmi >= floorBmi);
                 
  return advice ? advice.food.split("+") : ["⚠️ 请检查BMI输入（有效范围16-40）"];
}