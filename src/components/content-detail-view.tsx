import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Save, Copy, Share2, ChevronLeft, ChevronRight, Pause, Play, X } from 'lucide-react';
import { GeneratedContent } from '@/services/ai-service';
import { cn } from '@/lib/utils';
// 移除 useTeacher 的导入

// 图片轮播组件
interface ImageCarouselProps {
  images: string[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  
  // 确保至少有一张图片，并且所有图片都是有效的URL
  const allImages = images && images.length > 0 
    ? images.filter(url => typeof url === 'string' && url.trim() !== '')
    : ['https://images.unsplash.com/photo-1490645935967-10de6ba17061'];
  
  // 添加调试日志
  console.log('轮播图片数组:', allImages);
  
  // 切换到下一张图片
  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  }, [allImages.length]);
  
  // 切换到上一张图片
  const prevImage = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);
  
  // 自动轮播效果
  useEffect(() => {
    if (!isPlaying || allImages.length <= 1) return;
    
    const interval = setInterval(() => {
      nextImage();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isPlaying, allImages.length, nextImage]);
  
  // 处理键盘事件
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevImage, nextImage]);
  
  // 处理按钮点击事件，阻止冒泡
  const handlePrevClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    prevImage();
  };
  
  const handleNextClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    nextImage();
  };
  
  const handlePlayPauseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsPlaying(!isPlaying);
  };
  
  const handleDotClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentIndex(index);
  };
  
  return (
    <div className="relative h-56 md:h-64 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
      {allImages.map((image, index) => (
        <img 
          key={index}
          src={image} 
          alt={`图片 ${index + 1}`}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
            currentIndex === index ? "opacity-100" : "opacity-0"
          )}
        />
      ))}
      
      {/* 图片覆盖层 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      
      {/* 只有多张图片时才显示控制按钮 */}
      {allImages.length > 1 && (
        <>
          {/* 左右切换按钮 */}
          <button
            type="button"
            className="absolute left-2 top-1/2 transform -translate-y-1/2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white w-8 h-8 flex items-center justify-center"
            onClick={handlePrevClick}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <button
            type="button"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white w-8 h-8 flex items-center justify-center"
            onClick={handleNextClick}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          
          {/* 播放/暂停按钮 */}
          <button
            type="button"
            className="absolute bottom-4 right-4 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white w-8 h-8 flex items-center justify-center"
            onClick={handlePlayPauseClick}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          
          {/* 图片指示器 */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-wrap justify-center max-w-[80%]">
            {allImages.map((_, index) => (
              <button
                key={index}
                type="button"
                className={cn(
                  "w-2 h-2 rounded-full transition-all m-1",
                  currentIndex === index 
                    ? "bg-white scale-125" 
                    : "bg-white/50 hover:bg-white/70"
                )}
                onClick={(e) => handleDotClick(e, index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

interface ContentDetailViewProps {
  content: GeneratedContent;
  onClose: () => void;
  onSave?: () => void;
  onCopy?: () => void;
  onShare?: () => void;
}

const ContentDetailView: React.FC<ContentDetailViewProps> = ({
  content,
  onClose,
  onSave,
  onCopy,
  onShare
}) => {
  // 添加调试日志
  console.log('ContentDetailView 渲染，内容:', content);

  // 格式化描述文本，支持Markdown样式和思维导图
  const formatDescription = (text: string) => {
    return text
      .split('\n')
      .map((line, index) => {
        // 处理标题
        if (line.startsWith('🧠 **') || line.startsWith('📖 **') || line.startsWith('💡 **')) {
          const title = line.replace(/\*\*/g, '');
          return (
            <div key={index} className="font-bold text-lg text-[#1D1D1F] dark:text-white mb-3 mt-6 first:mt-0 flex items-center">
              {title}
            </div>
          );
        }
        
        // 处理思维导图部分
        if (line.includes('┌─') || line.includes('├─') || line.includes('└─')) {
          return (
            <div key={index} className="font-mono text-sm bg-[#F5F5F7] dark:bg-gray-800 p-2 rounded text-[#007AFF] dark:text-blue-400 leading-relaxed my-1">
              {line}
            </div>
          );
        }
        
        // 处理分隔线
        if (line.trim() === '---') {
          return <hr key={index} className="my-6 border-[#D2D2D7] dark:border-gray-600" />;
        }
        
        // 处理空行
        if (line.trim() === '') {
          return <div key={index} className="h-3" />;
        }
        
        // 处理普通文本
        return (
          <p key={index} className="text-[#424245] dark:text-gray-300 leading-relaxed mb-3">
            {line}
          </p>
        );
      });
  };

  return (
    <Dialog defaultOpen={true} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[95vh] p-0 dark:bg-gray-900 flex flex-col overflow-hidden" hideCloseButton>
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-[#1D1D1F] dark:text-white mb-2">
                {content.title}
              </DialogTitle>
              
              {/* 移除老师信息 */}
              
              {/* 标签 */}
              <div className="flex flex-wrap gap-2 mb-4">
                {content.tags.map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="bg-[#E5E5EA] text-[#86868B] dark:bg-gray-700 dark:text-gray-300"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* 操作按钮 */}
            <div className="flex space-x-2 ml-4">
              {onShare && (
                <Button variant="outline" size="sm" onClick={onShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  分享
                </Button>
              )}
              {onCopy && (
                <Button variant="outline" size="sm" onClick={onCopy}>
                  <Copy className="h-4 w-4 mr-2" />
                  复制
                </Button>
              )}
              {onSave && (
                <Button size="sm" onClick={onSave} className="bg-[#007AFF] hover:bg-[#0066CC] text-white">
                  <Save className="h-4 w-4 mr-2" />
                  保存
                </Button>
              )}
              {/* 添加关闭按钮 */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onClose}
                className="ml-2"
              >
                <X className="h-4 w-4 mr-2" />
                关闭
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* 主体内容区域 - 使用flex布局确保正确的高度计算 */}
        <div className="flex flex-col flex-1 max-h-[calc(95vh-120px)]">
          {/* 图片区域 - 现在作为banner在顶部，固定高度 */}
          <div className="w-full p-4 md:p-6 pt-0 flex-shrink-0">
            {/* 确保传递正确的图片数组 */}
            <ImageCarousel 
              images={content.relatedImages && content.relatedImages.length > 0 
                ? content.relatedImages 
                : [content.imageUrl]} 
            />
          </div>

          {/* 内容区域 - 自适应高度，确保可以滚动 */}
          <div className="flex-1 p-4 md:p-6 pt-0 overflow-hidden">
            <ScrollArea className="h-full max-h-[calc(95vh-300px)] overflow-auto">
              <div className="pr-2 md:pr-4 pb-32">
                {formatDescription(content.description)}
                {/* 添加额外的空白区域确保底部内容完全可见 */}
                <div className="h-16"></div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContentDetailView;