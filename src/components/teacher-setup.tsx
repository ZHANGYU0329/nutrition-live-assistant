import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { User, Save, Edit } from 'lucide-react';
import { useTeacher, TeacherInfo } from '../contexts/teacher-context';
import { cn } from '@/lib/utils';

interface TeacherSetupProps {
  className?: string;
}

const TeacherSetup: React.FC<TeacherSetupProps> = ({ className }) => {
  const { teacher, setTeacher, isTeacherSet } = useTeacher();
  const [isEditing, setIsEditing] = useState(!isTeacherSet);
  const [formData, setFormData] = useState({
    name: teacher?.name || '',
    specialty: teacher?.specialty || ''
  });

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('请输入老师姓名');
      return;
    }

    const newTeacher: TeacherInfo = {
      name: formData.name.trim(),
      specialty: formData.specialty.trim() || undefined,
      createdAt: teacher?.createdAt || Date.now()
    };

    setTeacher(newTeacher);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({
      name: teacher?.name || '',
      specialty: teacher?.specialty || ''
    });
  };

  if (isTeacherSet && !isEditing) {
    return (
      <Card className={cn("shadow-sm border-0 dark:bg-gray-800 dark:border-gray-700", className)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={teacher?.avatar} />
                <AvatarFallback className="bg-[#007AFF] text-white">
                  {teacher?.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold text-[#1D1D1F] dark:text-white">
                  {teacher?.name} 老师
                </div>
                {teacher?.specialty && (
                  <div className="text-sm text-[#86868B] dark:text-gray-400">
                    {teacher.specialty}
                  </div>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              className="text-[#007AFF] hover:text-[#0066CC]"
            >
              <Edit className="h-4 w-4 mr-1" />
              编辑
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("shadow-sm border-0 dark:bg-gray-800 dark:border-gray-700", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-lg text-[#1D1D1F] dark:text-white">
          <User className="h-5 w-5 mr-2 text-[#007AFF]" />
          {isTeacherSet ? '编辑老师信息' : '设置老师信息'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="teacher-name" className="text-[#1D1D1F] dark:text-white">
            老师姓名 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="teacher-name"
            placeholder="请输入老师姓名"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="border-[#D2D2D7] focus:border-[#007AFF] focus:ring-[#007AFF] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="teacher-specialty" className="text-[#1D1D1F] dark:text-white">
            专业领域
          </Label>
          <Input
            id="teacher-specialty"
            placeholder="如：营养学专家、健康饮食顾问等"
            value={formData.specialty}
            onChange={(e) => setFormData(prev => ({ ...prev, specialty: e.target.value }))}
            className="border-[#D2D2D7] focus:border-[#007AFF] focus:ring-[#007AFF] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div className="flex space-x-3 pt-2">
          <Button
            onClick={handleSave}
            className="bg-[#007AFF] hover:bg-[#0066CC] text-white flex-1"
          >
            <Save className="h-4 w-4 mr-2" />
            保存
          </Button>
          {isTeacherSet && (
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="flex-1"
            >
              取消
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeacherSetup;