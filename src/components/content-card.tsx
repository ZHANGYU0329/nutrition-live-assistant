import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Save, Copy, Share2, BookmarkPlus, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { GeneratedContent } from '@/services/ai-service';
import { cn } from '@/lib/utils';

interface ContentCardProps {
  content: GeneratedContent;
  onSave?: () => void;
  onCopy?: () => void;
  onShare?: () => void;
  onBookmark?: () => void;
  onClick?: () => void;
  className?: string;
}

const ContentCard: React.FC<ContentCardProps> = ({
  content,
  onSave,
  onCopy,
  onShare,
  onBookmark,
  onClick,
  className
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // 获取所有可用的图片
  const allImages = content.relatedImages && content.relatedImages.length > 0 
    ? content.relatedImages.filter(url => typeof url === 'string' && url.trim() !== '')
    : [content.imageUrl];

  // 5秒轮播效果
  useEffect(() => {
    if (!isPlaying || allImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, allImages.length]);

  // 手动切换到下一张图片
  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  // 手动切换到上一张图片
  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  // 切换播放状态
  const togglePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
  };

  // 格式化描述文本，支持Markdown样式
  const formatDescription = (text: string) => {
    // 简化卡片中的格式化，只保留基本文本
    const simplifiedText = text
      .replace(/\*\*(.*?)\*\*/g, '$1') // 移除加粗标记
      .replace(/---/g, '') // 移除分隔线
      .trim();
      
    return (
      <div className="text-[#86868B] dark:text-gray-300 leading-relaxed">
        {simplifiedText}
      </div>
    );
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden shadow-sm border-0 cursor-pointer hover:shadow-md transition-all duration-300 dark:bg-gray-800 dark:border-gray-700 flex flex-col",
        className
      )}
      onClick={onClick}
    >
      {/* 图片区域 - 现在作为banner在顶部 */}
      <div className="relative h-48 bg-cover bg-center">
        {/* 轮播图片 */}
        {allImages.map((image, index) => (
          <div 
            key={index}
            className={cn(
              "absolute inset-0 bg-cover bg-center transition-opacity duration-500",
              currentImageIndex === index ? "opacity-100" : "opacity-0"
            )}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* 轮播控制按钮 - 只有多张图片时才显示 */}
        {allImages.length > 1 && (
          <>
            {/* 左右切换按钮 */}
            <button
              className="absolute left-2 top-1/2 transform -translate-y-1/2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white w-8 h-8 flex items-center justify-center"
              onClick={prevImage}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white w-8 h-8 flex items-center justify-center"
              onClick={nextImage}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            
            {/* 播放/暂停按钮 */}
            <button
              className="absolute bottom-2 right-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white w-6 h-6 flex items-center justify-center"
              onClick={togglePlayPause}
            >
              {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            </button>
            
            {/* 图片指示器 */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex flex-wrap justify-center max-w-[80%]">
              {allImages.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-all m-0.5",
                    currentImageIndex === index 
                      ? "bg-white scale-125" 
                      : "bg-white/50 hover:bg-white/70"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                />
              ))}
            </div>
          </>
        )}
        
        {/* 操作按钮 */}
        <div className="absolute top-3 right-3 flex space-x-1">
          {onBookmark && (
            <Button 
              size="icon" 
              variant="secondary" 
              className="h-8 w-8 bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800"
              onClick={(e) => {
                e.stopPropagation();
                onBookmark();
              }}
            >
              <BookmarkPlus className="h-4 w-4" />
            </Button>
          )}
          {onShare && (
            <Button 
              size="icon" 
              variant="secondary" 
              className="h-8 w-8 bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800"
              onClick={(e) => {
                e.stopPropagation();
                onShare();
              }}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <CardContent className="p-3 sm:p-4 flex flex-col">
        {/* 标题 */}
        <h3 className="font-semibold text-lg text-[#1D1D1F] dark:text-white mb-2 line-clamp-2">
          {content.title}
        </h3>

        {/* 描述内容 - 使用line-clamp而不是max-height来限制显示行数 */}
        <div className="text-sm mb-3">
          <div className="line-clamp-3">
            {formatDescription(content.description.slice(0, 150) + (content.description.length > 150 ? '...' : ''))}
          </div>
        </div>

        {/* 标签 */}
        <div className="flex flex-wrap gap-2 mb-3">
          {content.tags.slice(0, 3).map((tag, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="text-xs bg-[#F5F5F7] text-[#86868B] dark:bg-gray-700 dark:text-gray-300"
            >
              {tag}
            </Badge>
          ))}
          {content.tags.length > 3 && (
            <Badge 
              variant="secondary" 
              className="text-xs bg-[#F5F5F7] text-[#86868B] dark:bg-gray-700 dark:text-gray-300"
            >
              +{content.tags.length - 3}
            </Badge>
          )}
        </div>

        {/* 底部操作按钮 - 使用mt-auto确保它始终在底部 */}
        <div className="flex justify-between items-center pt-2 border-t border-[#F5F5F7] dark:border-gray-700 mt-auto">
          <div className="text-xs text-[#86868B] dark:text-gray-400">
            点击查看详情
          </div>
          <div className="flex space-x-1">
            {onCopy && (
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8 text-[#86868B] hover:text-[#007AFF] dark:text-gray-400 dark:hover:text-blue-400"
                onClick={(e) => {
                  e.stopPropagation();
                  onCopy();
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
            )}
            {onSave && (
              <Button 
                size="icon" 
                variant="ghost"
                className="h-8 w-8 text-[#86868B] hover:text-[#007AFF] dark:text-gray-400 dark:hover:text-blue-400"
                onClick={(e) => {
                  e.stopPropagation();
                  onSave();
                }}
              >
                <Save className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentCard;