import { useState, useEffect } from 'react';
import { FemaleUserData } from '../utils/femaleNutritionUtils';

interface FemaleNutritionFormProps {
  onCalculate: (userData: FemaleUserData) => void;
}

const FemaleNutritionForm = ({ onCalculate }: FemaleNutritionFormProps) => {
  const [formData, setFormData] = useState<FemaleUserData>({
    age: 25,
    height: 165,
    weight: 110
  });

  const [errors, setErrors] = useState<{
    age?: string;
    height?: string;
    weight?: string;
  }>({});

  // 输入验证函数
  const validateInput = (name: string, value: number): string | undefined => {
    switch (name) {
      case 'age':
        return value < 12 || value > 60 
          ? '请输入合理值（12≤年龄≤60）' 
          : undefined;
      case 'height':
        return value < 90 || value > 200 
          ? '请输入合理值（90≤身高≤200）' 
          : undefined;
      case 'weight':
        return value < 30 || value > 300 
          ? '请输入合理值（30≤体重≤300）' 
          : undefined;
      default:
        return undefined;
    }
  };

  // 处理输入变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // 只允许数字输入
    const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
    
    // 如果输入为空或非数字，不更新状态
    if (isNaN(numericValue)) return;
    
    // 验证输入
    const error = validateInput(name, numericValue);
    
    setFormData(prev => ({
      ...prev,
      [name]: numericValue
    }));
    
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  // 当表单数据变化时自动计算
  useEffect(() => {
    // 检查是否有错误
    const hasErrors = Object.values(errors).some(error => error !== undefined);
    
    // 如果没有错误且所有字段都有值，则触发计算
    if (!hasErrors && formData.age && formData.height && formData.weight) {
      onCalculate(formData);
    }
  }, [formData, errors, onCalculate]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {/* 年龄输入 */}
        <div className="space-y-2">
          <label htmlFor="age" className="block text-sm font-medium">
            年龄 (岁)
          </label>
          <input
            type="text"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className={`w-full p-2 rounded-md border ${
              errors.age ? 'border-red-500 bg-red-50' : 'border-input bg-background'
            }`}
          />
          {errors.age && (
            <p className="text-xs text-red-500">{errors.age}</p>
          )}
        </div>

        {/* 身高输入 */}
        <div className="space-y-2">
          <label htmlFor="height" className="block text-sm font-medium">
            身高 (厘米)
          </label>
          <input
            type="text"
            id="height"
            name="height"
            value={formData.height}
            onChange={handleChange}
            className={`w-full p-2 rounded-md border ${
              errors.height ? 'border-red-500 bg-red-50' : 'border-input bg-background'
            }`}
          />
          {errors.height && (
            <p className="text-xs text-red-500">{errors.height}</p>
          )}
        </div>

        {/* 体重输入 */}
        <div className="space-y-2">
          <label htmlFor="weight" className="block text-sm font-medium">
            体重 (斤)
          </label>
          <input
            type="text"
            id="weight"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            className={`w-full p-2 rounded-md border ${
              errors.weight ? 'border-red-500 bg-red-50' : 'border-input bg-background'
            }`}
          />
          {errors.weight && (
            <p className="text-xs text-red-500">{errors.weight}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FemaleNutritionForm;