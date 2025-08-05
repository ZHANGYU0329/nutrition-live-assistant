import { NutritionData } from '../utils/types'

interface NutritionResultsProps {
  data: NutritionData
}

const NutritionResults = ({ data }: NutritionResultsProps) => {
  const { metabolism, nutrients } = data
  
  return (
    <div className="space-y-6">
      {/* 代谢信息 */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium">代谢信息</h3>
        <div className="grid grid-cols-1 gap-2">
          <div className="flex justify-between items-center py-2 border-b">
            <span>基础代谢率 (BMR)</span>
            <span className="font-semibold">{metabolism.bmr.toFixed(0)} 千卡/天</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span>总能量消耗 (TDEE)</span>
            <span className="font-semibold">{metabolism.tdee.toFixed(0)} 千卡/天</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span>根据目标调整后的能量需求</span>
            <span className="font-semibold">{metabolism.targetCalories.toFixed(0)} 千卡/天</span>
          </div>
        </div>
      </div>
      
      {/* 宏量营养素 */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium">宏量营养素分配</h3>
        <div className="grid grid-cols-1 gap-2">
          <div className="flex justify-between items-center py-2 border-b">
            <span>蛋白质</span>
            <span className="font-semibold">{nutrients.protein.toFixed(0)}g ({(nutrients.protein * 4).toFixed(0)} 千卡)</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span>碳水化合物</span>
            <span className="font-semibold">{nutrients.carbs.toFixed(0)}g ({(nutrients.carbs * 4).toFixed(0)} 千卡)</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span>脂肪</span>
            <span className="font-semibold">{nutrients.fat.toFixed(0)}g ({(nutrients.fat * 9).toFixed(0)} 千卡)</span>
          </div>
        </div>
        
        {/* 宏量营养素比例图表 */}
        <div className="mt-4">
          <div className="flex h-6 rounded-md overflow-hidden">
            <div 
              className="bg-blue-500" 
              style={{ width: `${(nutrients.protein * 4 / metabolism.targetCalories) * 100}%` }}
              title={`蛋白质: ${((nutrients.protein * 4 / metabolism.targetCalories) * 100).toFixed(0)}%`}
            />
            <div 
              className="bg-green-500" 
              style={{ width: `${(nutrients.carbs * 4 / metabolism.targetCalories) * 100}%` }}
              title={`碳水化合物: ${((nutrients.carbs * 4 / metabolism.targetCalories) * 100).toFixed(0)}%`}
            />
            <div 
              className="bg-yellow-500" 
              style={{ width: `${(nutrients.fat * 9 / metabolism.targetCalories) * 100}%` }}
              title={`脂肪: ${((nutrients.fat * 9 / metabolism.targetCalories) * 100).toFixed(0)}%`}
            />
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span className="text-blue-500">蛋白质 {((nutrients.protein * 4 / metabolism.targetCalories) * 100).toFixed(0)}%</span>
            <span className="text-green-500">碳水 {((nutrients.carbs * 4 / metabolism.targetCalories) * 100).toFixed(0)}%</span>
            <span className="text-yellow-500">脂肪 {((nutrients.fat * 9 / metabolism.targetCalories) * 100).toFixed(0)}%</span>
          </div>
        </div>
      </div>
      
      {/* 微量营养素和水分 */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium">其他营养素建议</h3>
        <div className="grid grid-cols-1 gap-2">
          <div className="flex justify-between items-center py-2 border-b">
            <span>膳食纤维</span>
            <span className="font-semibold">{nutrients.fiber.toFixed(0)}g/天</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span>水分摄入</span>
            <span className="font-semibold">{nutrients.water.toFixed(0)}ml/天</span>
          </div>
        </div>
      </div>
      
      {/* 营养建议 */}
      <div className="mt-6 p-4 bg-muted rounded-md">
        <h3 className="text-lg font-medium mb-2">个性化建议</h3>
        <p className="text-sm">{nutrients.recommendations}</p>
      </div>
    </div>
  )
}

export default NutritionResults