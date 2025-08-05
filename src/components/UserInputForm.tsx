import { useState } from 'react'
import { UserData, ActivityLevel, Gender } from '../utils/types'

interface UserInputFormProps {
  onCalculate: (userData: UserData) => void
}

const UserInputForm = ({ onCalculate }: UserInputFormProps) => {
  const [formData, setFormData] = useState<UserData>({
    age: 30,
    gender: 'male',
    height: 170,
    weight: 65,
    activityLevel: 'moderate',
    goal: 'maintain'
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'height' || name === 'weight' 
        ? Number(value) 
        : value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCalculate(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 年龄输入 */}
        <div className="space-y-2">
          <label htmlFor="age" className="block text-sm font-medium">
            年龄 (岁)
          </label>
          <input
            type="number"
            id="age"
            name="age"
            min="15"
            max="100"
            value={formData.age}
            onChange={handleChange}
            className="w-full p-2 rounded-md border border-input bg-background"
            required
          />
        </div>

        {/* 性别选择 */}
        <div className="space-y-2">
          <label htmlFor="gender" className="block text-sm font-medium">
            性别
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-2 rounded-md border border-input bg-background"
            required
          >
            <option value="male">男性</option>
            <option value="female">女性</option>
          </select>
        </div>

        {/* 身高输入 */}
        <div className="space-y-2">
          <label htmlFor="height" className="block text-sm font-medium">
            身高 (厘米)
          </label>
          <input
            type="number"
            id="height"
            name="height"
            min="100"
            max="250"
            value={formData.height}
            onChange={handleChange}
            className="w-full p-2 rounded-md border border-input bg-background"
            required
          />
        </div>

        {/* 体重输入 */}
        <div className="space-y-2">
          <label htmlFor="weight" className="block text-sm font-medium">
            体重 (公斤)
          </label>
          <input
            type="number"
            id="weight"
            name="weight"
            min="30"
            max="300"
            step="0.1"
            value={formData.weight}
            onChange={handleChange}
            className="w-full p-2 rounded-md border border-input bg-background"
            required
          />
        </div>

        {/* 活动水平选择 */}
        <div className="space-y-2">
          <label htmlFor="activityLevel" className="block text-sm font-medium">
            活动水平
          </label>
          <select
            id="activityLevel"
            name="activityLevel"
            value={formData.activityLevel}
            onChange={handleChange}
            className="w-full p-2 rounded-md border border-input bg-background"
            required
          >
            <option value="sedentary">久坐不动 (几乎不运动)</option>
            <option value="light">轻度活动 (每周运动1-3次)</option>
            <option value="moderate">中度活动 (每周运动3-5次)</option>
            <option value="active">积极活动 (每周运动6-7次)</option>
            <option value="veryActive">非常活跃 (每天高强度运动或体力劳动)</option>
          </select>
        </div>

        {/* 目标选择 */}
        <div className="space-y-2">
          <label htmlFor="goal" className="block text-sm font-medium">
            健康目标
          </label>
          <select
            id="goal"
            name="goal"
            value={formData.goal}
            onChange={handleChange}
            className="w-full p-2 rounded-md border border-input bg-background"
            required
          >
            <option value="lose">减重</option>
            <option value="maintain">维持体重</option>
            <option value="gain">增肌增重</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
      >
        计算营养需求
      </button>
    </form>
  )
}

export default UserInputForm