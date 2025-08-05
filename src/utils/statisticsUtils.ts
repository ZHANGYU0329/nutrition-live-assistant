/**
 * 统计工具函数
 */

// 用户记录接口
export interface UserRecord {
  age: number;
  height: number;
  weight: number;
  bmi: number;
  obesityLevel: string;
  timestamp: number;
}

// 统计数据接口
export interface StatisticsData {
  todayCount: number;
  totalCount: number;
  lastUpdated: number;
  topUsers: UserRecord[];
}

// 本地存储键名
const STATS_KEY = 'nutrition_calculator_stats';

/**
 * 获取统计数据
 */
export function getStatistics(): StatisticsData {
  const defaultStats: StatisticsData = {
    todayCount: 0,
    totalCount: 0,
    lastUpdated: Date.now(),
    topUsers: []
  };

  try {
    const storedStats = localStorage.getItem(STATS_KEY);
    if (!storedStats) return defaultStats;

    const stats: StatisticsData = JSON.parse(storedStats);
    
    // 检查是否是新的一天，如果是则重置当天计数
    const today = new Date().setHours(0, 0, 0, 0);
    const lastDate = new Date(stats.lastUpdated).setHours(0, 0, 0, 0);
    
    if (today > lastDate) {
      stats.todayCount = 0;
      stats.lastUpdated = Date.now();
    }
    
    return stats;
  } catch (error) {
    console.error('Failed to load statistics:', error);
    return defaultStats;
  }
}

/**
 * 记录新的用户数据
 */
export function recordUserData(userData: UserRecord): StatisticsData {
  const stats = getStatistics();
  
  // 更新计数
  stats.todayCount += 1;
  stats.totalCount += 1;
  stats.lastUpdated = Date.now();
  
  // 添加到排行榜
  stats.topUsers.push(userData);
  
  // 按BMI降序排序，保留前10名
  stats.topUsers.sort((a, b) => b.bmi - a.bmi);
  stats.topUsers = stats.topUsers.slice(0, 10);
  
  // 保存到本地存储
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Failed to save statistics:', error);
  }
  
  return stats;
}