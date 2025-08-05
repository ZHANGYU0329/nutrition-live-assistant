import React from 'react';

interface BmiGifDisplayProps {
  bmi: number;
}

const BmiGifDisplay: React.FC<BmiGifDisplayProps> = ({ bmi }) => {
  // 根据BMI值选择不同的GIF
  const getGifUrl = () => {
    if (bmi >= 32) {
      // 重度肥胖
      return "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjI5YzJjMzk0ZDM0ZDM0ZDM0ZDM0/giphy.gif";
    } else if (bmi >= 28) {
      // 中度肥胖
      return "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjI5YzJjMzk0ZDM0ZDM0ZDM0ZDM0/giphy.gif";
    } else if (bmi >= 24) {
      // 超重
      return "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjI5YzJjMzk0ZDM0ZDM0ZDM0ZDM0/giphy.gif";
    } else if (bmi < 18.5) {
      // 偏瘦
      return "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjI5YzJjMzk0ZDM0ZDM0ZDM0ZDM0/giphy.gif";
    } else {
      // 正常
      return "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjI5YzJjMzk0ZDM0ZDM0ZDM0ZDM0/giphy.gif";
    }
  };

  // 根据BMI值获取建议文本
  const getAdviceText = () => {
    if (bmi >= 32) {
      return "需要制定减重计划，建议咨询医生";
    } else if (bmi >= 28) {
      return "需要减重，增加运动和控制饮食";
    } else if (bmi >= 24) {
      return "需要控制饮食，增加运动量";
    } else if (bmi < 18.5) {
      return "需要增加营养摄入";
    } else {
      return "保持健康生活方式";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <img 
        src={getGifUrl()} 
        alt="BMI相关建议" 
        className="h-16 w-auto object-contain"
      />
      <p className="text-sm font-bold mt-1 text-center">{getAdviceText()}</p>
    </div>
  );
};

export default BmiGifDisplay;