import React from 'react';
import { Button } from './ui/button';
import { Download, Share2, Copy } from 'lucide-react';

interface ImageGeneratorProps {
  contentRef: React.RefObject<HTMLDivElement>;
  onGenerated?: (dataUrl: string) => void;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ contentRef, onGenerated }) => {
  // 复制内容到剪贴板
  const copyContent = () => {
    if (!contentRef.current) return;
    
    try {
      // 获取内容
      const title = contentRef.current.querySelector('h2')?.textContent || '心理咨询内容';
      const description = contentRef.current.querySelector('p')?.textContent || '';
      const tags = Array.from(contentRef.current.querySelectorAll('.tag')).map(tag => tag.textContent).join(', ');
      
      // 组合内容
      const content = `
【${title}】

${description}

标签: ${tags}

-- 来自心理咨询直播助手
      `;
      
      // 复制到剪贴板
      navigator.clipboard.writeText(content).then(() => {
        showToast('内容已复制到剪贴板！');
      });
    } catch (error) {
      console.error('复制内容失败:', error);
      alert('复制内容失败，请重试');
    }
  };

  // 显示提示信息
  const showToast = (message: string, duration = 3000) => {
    const toast = document.createElement('div');
    toast.innerText = message;
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.padding = '10px 20px';
    toast.style.backgroundColor = 'rgba(0,122,255,0.9)';
    toast.style.color = 'white';
    toast.style.borderRadius = '20px';
    toast.style.zIndex = '9999';
    document.body.appendChild(toast);
    
    // 指定时间后移除提示
    setTimeout(() => {
      document.body.removeChild(toast);
    }, duration);
  };

  // 保存为文本文件
  const saveAsText = () => {
    if (!contentRef.current) return;
    
    try {
      // 获取内容
      const title = contentRef.current.querySelector('h2')?.textContent || '心理咨询内容';
      const description = contentRef.current.querySelector('p')?.textContent || '';
      const tags = Array.from(contentRef.current.querySelectorAll('.tag')).map(tag => tag.textContent).join(', ');
      
      // 组合内容
      const content = `
【${title}】

${description}

标签: ${tags}

-- 来自心理咨询直播助手
      `;
      
      // 创建Blob对象
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      
      // 创建下载链接
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `心理咨询-${new Date().toISOString().slice(0, 10)}.txt`;
      link.click();
      
      // 释放URL对象
      URL.revokeObjectURL(url);
      
      showToast('文本已保存！');
    } catch (error) {
      console.error('保存文本失败:', error);
      alert('保存文本失败，请重试');
    }
  };

  return (
    <div className="flex space-x-2">
      <Button 
        variant="outline" 
        size="sm"
        className="border-[#D2D2D7] text-[#1D1D1F]"
        onClick={copyContent}
      >
        <Copy className="h-4 w-4 mr-1" />
        复制文本
      </Button>
      <Button 
        size="sm"
        className="bg-[#007AFF] hover:bg-[#0066CC] text-white"
        onClick={saveAsText}
      >
        <Download className="h-4 w-4 mr-1" />
        保存文本
      </Button>
    </div>
  );
};

export default ImageGenerator;