import React, { createContext, useContext, useState, useEffect } from 'react';

// 老师信息接口
export interface TeacherInfo {
  name: string;
  avatar?: string;
  specialty?: string;
  createdAt: number;
}

// 上下文接口
interface TeacherContextType {
  teacher: TeacherInfo | null;
  setTeacher: (teacher: TeacherInfo | null) => void;
  isTeacherSet: boolean;
}

// 创建上下文
const TeacherContext = createContext<TeacherContextType | undefined>(undefined);

// 本地存储键名
const TEACHER_INFO_KEY = 'nutrition_teacher_info';

// 提供者组件
export const TeacherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [teacher, setTeacherState] = useState<TeacherInfo | null>(null);

  // 组件挂载时从本地存储恢复老师信息
  useEffect(() => {
    try {
      const savedTeacher = localStorage.getItem(TEACHER_INFO_KEY);
      if (savedTeacher) {
        const parsedTeacher = JSON.parse(savedTeacher);
        setTeacherState(parsedTeacher);
      }
    } catch (error) {
      console.error('恢复老师信息失败:', error);
    }
  }, []);

  // 设置老师信息并保存到本地存储
  const setTeacher = (newTeacher: TeacherInfo | null) => {
    setTeacherState(newTeacher);
    try {
      if (newTeacher) {
        localStorage.setItem(TEACHER_INFO_KEY, JSON.stringify(newTeacher));
      } else {
        localStorage.removeItem(TEACHER_INFO_KEY);
      }
    } catch (error) {
      console.error('保存老师信息失败:', error);
    }
  };

  const value: TeacherContextType = {
    teacher,
    setTeacher,
    isTeacherSet: !!teacher
  };

  return (
    <TeacherContext.Provider value={value}>
      {children}
    </TeacherContext.Provider>
  );
};

// 自定义Hook
export const useTeacher = () => {
  const context = useContext(TeacherContext);
  if (context === undefined) {
    throw new Error('useTeacher must be used within a TeacherProvider');
  }
  return context;
};