import React, { useState, useEffect } from 'react';

interface DoctorIconProps {
  bmi: number;
}

const DoctorIcon: React.FC<DoctorIconProps> = ({ bmi }) => {
  const [showBomb, setShowBomb] = useState(false);
  const [bombExploding, setBombExploding] = useState(false);
  const [showFlower, setShowFlower] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  
  // 动画效果
  useEffect(() => {
    // 根据BMI值决定显示炸弹、花或警告标志
    if (bmi < 20 || bmi > 28) {
      setShowBomb(true);
      setShowFlower(false);
      setShowWarning(false);
      
      // 炸弹爆炸动画循环 - 更快的爆炸频率
      const bombInterval = setInterval(() => {
        setBombExploding(true);
        
        setTimeout(() => {
          setBombExploding(false);
        }, 800); // 爆炸持续800毫秒
      }, 2000); // 每2秒爆炸一次
      
      return () => {
        clearInterval(bombInterval);
      };
    } else if (bmi >= 20 && bmi <= 24) {
      setShowBomb(false);
      setShowFlower(true);
      setShowWarning(false);
      return () => {};
    } else if (bmi > 24 && bmi <= 28) {
      setShowBomb(false);
      setShowFlower(false);
      setShowWarning(true);
      return () => {};
    } else {
      setShowBomb(false);
      setShowFlower(false);
      setShowWarning(false);
      return () => {};
    }
  }, [bmi]);

  return (
    <div className="visual-effect">
      {/* 炸弹效果 - 当BMI < 20 或 BMI > 28时显示 */}
      {showBomb && (
        <div className={`bomb ${bombExploding ? 'exploding' : ''}`}>
          <div className="bomb-body">
            <div className="bomb-fuse"></div>
            {bombExploding && (
              <div className="explosion">
                <div className="explosion-ray ray1"></div>
                <div className="explosion-ray ray2"></div>
                <div className="explosion-ray ray3"></div>
                <div className="explosion-ray ray4"></div>
                <div className="explosion-ray ray5"></div>
                <div className="explosion-ray ray6"></div>
                <div className="explosion-ray ray7"></div>
                <div className="explosion-ray ray8"></div>
                <div className="explosion-ray ray9"></div>
                <div className="explosion-ray ray10"></div>
                <div className="explosion-ray ray11"></div>
                <div className="explosion-ray ray12"></div>
                <div className="explosion-ray ray13"></div>
                <div className="explosion-ray ray14"></div>
                <div className="explosion-ray ray15"></div>
                <div className="explosion-ray ray16"></div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* 花朵效果 - 当BMI在20-24之间时显示 */}
      {showFlower && (
        <div className="flower-container">
          <div className="flower">
            <div className="flower-center"></div>
            <div className="petal petal1"></div>
            <div className="petal petal2"></div>
            <div className="petal petal3"></div>
            <div className="petal petal4"></div>
            <div className="petal petal5"></div>
            <div className="stem"></div>
            <div className="leaf leaf1"></div>
            <div className="leaf leaf2"></div>
          </div>
        </div>
      )}
      
      {/* 警告标志效果 - 当BMI在24-28之间时显示 */}
      {showWarning && (
        <div className="warning-container">
          <div className="warning-sign">
            <div className="warning-exclamation">!</div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .visual-effect {
          position: relative;
          width: 150px;
          height: 150px;
          z-index: 10;
        }
        
        /* 炸弹样式 */
        .bomb {
          position: absolute;
          bottom: 20px;
          right: 20px;
          width: 60px;
          height: 60px;
          z-index: 15;
        }
        
        .bomb-body {
          position: relative;
          width: 50px;
          height: 50px;
          background-color: #000;
          border-radius: 50%;
          animation: pulse 0.5s infinite alternate;
          box-shadow: 0 0 15px #ff0000, 0 0 25px #ff6600;
        }
        
        .bomb-fuse {
          position: absolute;
          top: -18px;
          left: 50%;
          transform: translateX(-50%);
          width: 6px;
          height: 18px;
          background-color: #888;
          border-radius: 2px;
        }
        
        .bomb-fuse:before {
          content: '';
          position: absolute;
          top: -10px;
          left: -3px;
          width: 12px;
          height: 12px;
          background-color: #ff6600;
          border-radius: 50%;
          animation: flicker 0.15s infinite alternate;
          box-shadow: 0 0 15px #ff0000, 0 0 20px #ffff00;
        }
        
        .exploding .bomb-body {
          animation: none;
          background-color: transparent;
        }
        
        .exploding .bomb-fuse {
          display: none;
        }
        
        .explosion {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 300px; /* 更大的爆炸范围 */
          height: 300px; /* 更大的爆炸范围 */
        }
        
        .explosion-ray {
          position: absolute;
          top: 50%;
          left: 50%;
          transform-origin: center;
          background: linear-gradient(to top, #ff6600, #ffff00);
          width: 10px;
          height: 150px; /* 更长的光线 */
          border-radius: 5px;
          animation: explode 0.4s ease-out forwards; /* 更快的爆炸动画 */
          box-shadow: 0 0 15px #ff0000, 0 0 25px rgba(255, 102, 0, 0.7);
        }
        
        .ray1 { transform: translate(-50%, -50%) rotate(0deg); }
        .ray2 { transform: translate(-50%, -50%) rotate(22.5deg); }
        .ray3 { transform: translate(-50%, -50%) rotate(45deg); }
        .ray4 { transform: translate(-50%, -50%) rotate(67.5deg); }
        .ray5 { transform: translate(-50%, -50%) rotate(90deg); }
        .ray6 { transform: translate(-50%, -50%) rotate(112.5deg); }
        .ray7 { transform: translate(-50%, -50%) rotate(135deg); }
        .ray8 { transform: translate(-50%, -50%) rotate(157.5deg); }
        .ray9 { transform: translate(-50%, -50%) rotate(180deg); }
        .ray10 { transform: translate(-50%, -50%) rotate(202.5deg); }
        .ray11 { transform: translate(-50%, -50%) rotate(225deg); }
        .ray12 { transform: translate(-50%, -50%) rotate(247.5deg); }
        .ray13 { transform: translate(-50%, -50%) rotate(270deg); }
        .ray14 { transform: translate(-50%, -50%) rotate(292.5deg); }
        .ray15 { transform: translate(-50%, -50%) rotate(315deg); }
        .ray16 { transform: translate(-50%, -50%) rotate(337.5deg); }
        
        /* 花朵样式 */
        .flower-container {
          position: absolute;
          bottom: 10px;
          right: 20px;
          width: 80px;
          height: 120px;
          z-index: 15;
        }
        
        .flower {
          position: relative;
          width: 100%;
          height: 100%;
        }
        
        .flower-center {
          position: absolute;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 20px;
          background-color: #ffcc00;
          border-radius: 50%;
          z-index: 2;
        }
        
        .petal {
          position: absolute;
          top: 10px;
          left: 50%;
          width: 25px;
          height: 40px;
          background-color: #ff66cc;
          border-radius: 50% 50% 50% 50% / 80% 80% 20% 20%;
          transform-origin: center bottom;
          animation: sway 3s ease-in-out infinite alternate;
        }
        
        .petal1 { transform: translateX(-50%) rotate(-70deg); animation-delay: 0s; }
        .petal2 { transform: translateX(-50%) rotate(-35deg); animation-delay: 0.2s; }
        .petal3 { transform: translateX(-50%) rotate(0deg); animation-delay: 0.4s; }
        .petal4 { transform: translateX(-50%) rotate(35deg); animation-delay: 0.6s; }
        .petal5 { transform: translateX(-50%) rotate(70deg); animation-delay: 0.8s; }
        
        .stem {
          position: absolute;
          top: 40px;
          left: 50%;
          transform: translateX(-50%);
          width: 5px;
          height: 70px;
          background-color: #33cc33;
          z-index: 1;
        }
        
        .leaf {
          position: absolute;
          width: 25px;
          height: 15px;
          background-color: #33cc33;
          border-radius: 50%;
          z-index: 1;
          animation: leafSway 4s ease-in-out infinite alternate;
        }
        
        .leaf1 {
          top: 60px;
          left: 30px;
          transform: rotate(-30deg);
          animation-delay: 0.5s;
        }
        
        .leaf2 {
          top: 80px;
          right: 30px;
          transform: rotate(30deg);
          animation-delay: 1s;
        }
        
        /* 警告标志样式 */
        .warning-container {
          position: absolute;
          bottom: 20px;
          right: 20px;
          width: 60px;
          height: 60px;
          z-index: 15;
          animation: warningPulse 1.5s infinite;
        }
        
        .warning-sign {
          position: relative;
          width: 60px;
          height: 60px;
          background-color: #ffcc00;
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
          animation: warningRotate 2s infinite alternate;
          box-shadow: 0 0 15px rgba(255, 204, 0, 0.8);
        }
        
        .warning-exclamation {
          position: absolute;
          bottom: 15px;
          left: 50%;
          transform: translateX(-50%);
          color: #000;
          font-size: 30px;
          font-weight: bold;
          line-height: 1;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          100% { transform: scale(1.3); }
        }
        
        @keyframes flicker {
          0% { opacity: 0.7; transform: scale(1); }
          100% { opacity: 1; transform: scale(1.5); }
        }
        
        @keyframes explode {
          0% { height: 0; opacity: 1; }
          50% { height: 120px; opacity: 1; }
          100% { height: 150px; opacity: 0; }
        }
        
        @keyframes sway {
          0%, 100% { transform: translateX(-50%) rotate(var(--rotate, 0deg)); }
          50% { transform: translateX(-50%) rotate(calc(var(--rotate, 0deg) + 10deg)) translateY(-5px); }
        }
        
        @keyframes leafSway {
          0%, 100% { transform: rotate(var(--rotate, 0deg)); }
          50% { transform: rotate(calc(var(--rotate, 0deg) + 15deg)); }
        }
        
        @keyframes warningPulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes warningRotate {
          0% { transform: rotate(-5deg); }
          100% { transform: rotate(5deg); }
        }
      `}</style>
    </div>
  );
};

export default DoctorIcon;