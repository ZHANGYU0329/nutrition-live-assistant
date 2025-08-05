import { useState } from 'react'
import UserInputForm from '../components/UserInputForm'
import NutritionResults from '../components/NutritionResults'
import { calculateMetabolism, calculateNutrients } from '../utils/calculationUtils'
import { UserData, NutritionData } from '../utils/types'

const NutritionCalculator = () => {
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(null)

  const handleCalculate = (userData: UserData) => {
    // 计算基础代谢率和总能量消耗
    const metabolism = calculateMetabolism(userData)
    
    // 计算宏量营养素和微量营养素需求
    const nutrients = calculateNutrients(userData, metabolism)
    
    // 设置计算结果
    setNutritionData({
      userData,
      metabolism,
      nutrients
    })
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-card p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">个人信息</h2>
          <UserInputForm onCalculate={handleCalculate} />
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">计算结果</h2>
          {nutritionData ? (
            <NutritionResults data={nutritionData} />
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>请输入您的个人信息并点击计算按钮</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NutritionCalculator