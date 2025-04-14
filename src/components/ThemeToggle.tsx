
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Switch } from "@/components/ui/switch";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle = ({ className }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center space-x-2">
        {theme === 'dark' ? (
          <Moon className="h-5 w-5 text-primary" />
        ) : (
          <Sun className="h-5 w-5 text-primary" />
        )}
        <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
      </div>
      <Switch checked={theme === 'light'} onCheckedChange={toggleTheme} />
    </div>
  );
};

export default ThemeToggle;
