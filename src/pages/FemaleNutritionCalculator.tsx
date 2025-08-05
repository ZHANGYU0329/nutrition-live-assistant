import { useState } from 'react';
import FemaleNutritionForm from '../components/FemaleNutritionForm';
import FemaleNutritionResults from '../components/FemaleNutritionResults';
import { FemaleUserData, FemaleNutritionResult, calculateFemaleNutrition } from '../utils/femaleNutritionUtils';

const FemaleNutritionCalculator = () => {
  const [nutritionResult, setNutritionResult] = useState<FemaleNutritionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = (userData: FemaleUserData) => {
    try {
      // 计算营养结果
      const result = calculateFemaleNutrition(userData);
      setNutritionResult(result);
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('计算过程中发生错误');
      }
      setNutritionResult(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-purple-700 mb-2">女生减肥健康管理</h1>
        <p className="text-gray-600">
          输入您的年龄、身高和体重，获取个性化的健康建议和营养指导。
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4 text-purple-600">个人信息</h2>
          <FemaleNutritionForm onCalculate={handleCalculate} />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4 text-purple-600">计算结果</h2>
          <FemaleNutritionResults data={nutritionResult} />
        </div>
      </div>
    </div>
  );
};

export default FemaleNutritionCalculator;