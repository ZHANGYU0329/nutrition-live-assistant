/**
 * 食材图标和分类工具
 */

// 食材分类枚举
export enum FoodCategory {
  PROTEIN = "蛋白质类",
  VEGETABLE = "蔬菜类",
  FRUIT = "水果类",
  GRAIN = "谷物类",
  DAIRY = "乳制品类",
  NUT = "坚果类",
  OIL = "油脂类",
  SUPPLEMENT = "补充剂",
  OTHER = "其他"
}

// 食材信息接口
export interface FoodInfo {
  name: string;        // 食材名称
  category: FoodCategory; // 食材分类
  icon: string;        // 食材图标 (emoji)
}

// 食材信息数据
export const foodInfoData: FoodInfo[] = [
  // 蛋白质类
  { name: "鸡胸肉", category: FoodCategory.PROTEIN, icon: "🍗" },
  { name: "鱼", category: FoodCategory.PROTEIN, icon: "🐟" },
  { name: "三文鱼", category: FoodCategory.PROTEIN, icon: "🐟" },
  { name: "鳕鱼", category: FoodCategory.PROTEIN, icon: "🐟" },
  { name: "鲑鱼", category: FoodCategory.PROTEIN, icon: "🐟" },
  { name: "鸡蛋", category: FoodCategory.PROTEIN, icon: "🥚" },
  { name: "蛋清", category: FoodCategory.PROTEIN, icon: "🥚" },
  { name: "瘦肉", category: FoodCategory.PROTEIN, icon: "🥩" },
  { name: "瘦牛肉", category: FoodCategory.PROTEIN, icon: "🥩" },
  { name: "豆类", category: FoodCategory.PROTEIN, icon: "🫘" },
  { name: "鹰嘴豆", category: FoodCategory.PROTEIN, icon: "🫘" },
  { name: "黑豆", category: FoodCategory.PROTEIN, icon: "🫘" },
  { name: "红豆", category: FoodCategory.PROTEIN, icon: "🫘" },
  { name: "豆腐", category: FoodCategory.PROTEIN, icon: "🧈" },
  { name: "虾", category: FoodCategory.PROTEIN, icon: "🦐" },
  { name: "蛋白粉", category: FoodCategory.SUPPLEMENT, icon: "🥤" },
  
  // 蔬菜类
  { name: "绿叶蔬菜", category: FoodCategory.VEGETABLE, icon: "🥬" },
  { name: "西兰花", category: FoodCategory.VEGETABLE, icon: "🥦" },
  { name: "蔬菜", category: FoodCategory.VEGETABLE, icon: "🥗" },
  { name: "菠菜", category: FoodCategory.VEGETABLE, icon: "🥬" },
  { name: "胡萝卜", category: FoodCategory.VEGETABLE, icon: "🥕" },
  { name: "黄瓜", category: FoodCategory.VEGETABLE, icon: "🥒" },
  { name: "番茄", category: FoodCategory.VEGETABLE, icon: "🍅" },
  { name: "彩椒", category: FoodCategory.VEGETABLE, icon: "🫑" },
  { name: "紫甘蓝", category: FoodCategory.VEGETABLE, icon: "🥬" },
  { name: "芦笋", category: FoodCategory.VEGETABLE, icon: "🫛" },
  { name: "蘑菇", category: FoodCategory.VEGETABLE, icon: "🍄" },
  
  // 水果类
  { name: "水果", category: FoodCategory.FRUIT, icon: "🍎" },
  { name: "香蕉", category: FoodCategory.FRUIT, icon: "🍌" },
  { name: "小份水果", category: FoodCategory.FRUIT, icon: "🍓" },
  { name: "小份浆果", category: FoodCategory.FRUIT, icon: "🫐" },
  { name: "草莓", category: FoodCategory.FRUIT, icon: "🍓" },
  { name: "蓝莓", category: FoodCategory.FRUIT, icon: "🫐" },
  { name: "苹果", category: FoodCategory.FRUIT, icon: "🍎" },
  { name: "橙子", category: FoodCategory.FRUIT, icon: "🍊" },
  
  // 谷物类
  { name: "燕麦片", category: FoodCategory.GRAIN, icon: "🥣" },
  { name: "燕麦", category: FoodCategory.GRAIN, icon: "🥣" },
  { name: "全麦面包", category: FoodCategory.GRAIN, icon: "🍞" },
  { name: "糙米", category: FoodCategory.GRAIN, icon: "🍚" },
  { name: "藜麦", category: FoodCategory.GRAIN, icon: "🌾" },
  { name: "荞麦面", category: FoodCategory.GRAIN, icon: "🍜" },
  { name: "红薯", category: FoodCategory.GRAIN, icon: "🍠" },
  { name: "紫薯", category: FoodCategory.GRAIN, icon: "🍠" },
  
  // 乳制品类
  { name: "牛奶", category: FoodCategory.DAIRY, icon: "🥛" },
  { name: "全脂牛奶", category: FoodCategory.DAIRY, icon: "🥛" },
  { name: "全脂酸奶", category: FoodCategory.DAIRY, icon: "🧁" },
  { name: "希腊酸奶", category: FoodCategory.DAIRY, icon: "🧁" },
  { name: "无糖酸奶", category: FoodCategory.DAIRY, icon: "🧁" },
  
  // 坚果类
  { name: "坚果", category: FoodCategory.NUT, icon: "🥜" },
  { name: "坚果少量", category: FoodCategory.NUT, icon: "🥜" },
  { name: "花生酱", category: FoodCategory.NUT, icon: "🥜" },
  { name: "巴旦木", category: FoodCategory.NUT, icon: "🥜" },
  { name: "杏仁", category: FoodCategory.NUT, icon: "🥜" },
  { name: "核桃", category: FoodCategory.NUT, icon: "🌰" },
  { name: "南瓜籽", category: FoodCategory.NUT, icon: "🎃" },
  { name: "巴西坚果", category: FoodCategory.NUT, icon: "🥜" },
  
  // 油脂类
  { name: "牛油果", category: FoodCategory.OIL, icon: "🥑" },
  { name: "橄榄油", category: FoodCategory.OIL, icon: "🫒" },
  
  // 补充剂
  { name: "补充剂", category: FoodCategory.SUPPLEMENT, icon: "💊" },
  { name: "必需营养素", category: FoodCategory.SUPPLEMENT, icon: "💊" },
  { name: "奇亚籽", category: FoodCategory.SUPPLEMENT, icon: "🌱" },
  { name: "亚麻籽", category: FoodCategory.SUPPLEMENT, icon: "🌱" },
  { name: "洋车前子壳", category: FoodCategory.SUPPLEMENT, icon: "🌿" },
  { name: "魔芋", category: FoodCategory.SUPPLEMENT, icon: "🍠" },
  
  // 其他
  { name: "遵医嘱", category: FoodCategory.OTHER, icon: "⚕️" },
  { name: "高蛋白", category: FoodCategory.PROTEIN, icon: "🍖" },
  { name: "低碳水", category: FoodCategory.OTHER, icon: "📉" },
  { name: "黑咖啡", category: FoodCategory.OTHER, icon: "☕" },
  { name: "椰青", category: FoodCategory.OTHER, icon: "🥥" },
  { name: "肉桂", category: FoodCategory.OTHER, icon: "🌿" },
];

/**
 * 获取食材信息
 * @param name 食材名称
 * @returns 食材信息对象，如果未找到则返回默认值
 */
export function getFoodInfo(name: string): FoodInfo {
  const foodInfo = foodInfoData.find(food => food.name === name);
  if (foodInfo) {
    return foodInfo;
  }
  
  // 默认返回其他类别
  return {
    name,
    category: FoodCategory.OTHER,
    icon: "🍽️" // 默认图标
  };
}

/**
 * 对食材列表进行分类和排序
 * @param foods 食材名称列表
 * @returns 排序后的食材信息列表
 */
export function sortFoodsByCategory(foods: string[]): FoodInfo[] {
  // 转换为食材信息对象
  const foodInfos = foods.map(food => getFoodInfo(food));
  
  // 按分类排序
  return foodInfos.sort((a, b) => {
    // 先按分类排序
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    // 同一分类按名称排序
    return a.name.localeCompare(b.name);
  });
}

/**
 * 移除重复食材并替换为新的食材
 * @param foods 原始食材列表
 * @returns 去重后的食材列表
 */
export function removeDuplicateFoods(foods: string[]): string[] {
  // 用于记录已出现的食材
  const seen = new Set<string>();
  // 结果列表
  const result: string[] = [];
  // 替代食材列表（当发现重复时使用）
  const alternativeFoods = [
    "豆腐", "鳕鱼", "虾", "杏仁", "核桃", "南瓜籽", 
    "奇亚籽", "亚麻籽", "藜麦", "红薯", "紫薯", "蓝莓", 
    "草莓", "菠菜", "胡萝卜", "芦笋", "黑豆", "红豆"
  ];
  
  // 替代食材索引
  let alternativeIndex = 0;
  
  // 遍历原始食材列表
  for (const food of foods) {
    if (!seen.has(food)) {
      // 如果是新食材，添加到结果列表
      seen.add(food);
      result.push(food);
    } else {
      // 如果是重复食材，添加替代食材
      while (alternativeIndex < alternativeFoods.length) {
        const alternative = alternativeFoods[alternativeIndex++];
        if (!seen.has(alternative)) {
          seen.add(alternative);
          result.push(alternative);
          break;
        }
      }
    }
  }
  
  return result;
}