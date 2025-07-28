import React from 'react';
import { Button } from './ui/button';
import { HelpCircle, Settings } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-[#E5E5EA] sticky top-0 z-10 dark:bg-gray-900/80 dark:border-gray-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-[#4CAF50] to-[#8BC34A] flex items-center justify-center text-white font-bold mr-3">
            营
          </div>
          <h1 className="text-lg font-semibold text-[#1D1D1F] dark:text-white">营养咨询助手</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon">
            <HelpCircle className="h-5 w-5 text-[#86868B] dark:text-[#A1A1A6]" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5 text-[#86868B] dark:text-[#A1A1A6]" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;