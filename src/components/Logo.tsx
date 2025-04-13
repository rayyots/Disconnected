
import React from 'react';

interface LogoProps {
  variant?: 'full' | 'icon';
  className?: string;
}

const Logo = ({ variant = 'full', className = '' }: LogoProps) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative">
        {/* Dots and lines */}
        <div className="flex items-center gap-1">
          <div className="data-dots"></div>
          <div className="data-line w-4"></div>
          <div className="data-dots"></div>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <div className="data-line w-3.5"></div>
          <div className="data-dots"></div>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <div className="data-dots"></div>
          <div className="data-line w-5"></div>
        </div>
        
        {/* D shape */}
        <div className="absolute top-0 left-4 w-8 h-8 border-2 border-disconnected-light rounded-r-full border-l-0"></div>
        <div className="absolute top-1 left-5 w-6 h-6 border-2 border-disconnected-light rounded-r-full border-l-0"></div>
        <div className="absolute top-2 left-6 w-4 h-4 border-2 border-disconnected-light rounded-r-full border-l-0"></div>
        
        {/* More dots */}
        <div className="absolute bottom-0 left-1 flex items-center gap-1">
          <div className="data-dots"></div>
          <div className="data-dots"></div>
          <div className="data-dots"></div>
        </div>
      </div>
      
      {variant === 'full' && (
        <div className="ml-3 text-2xl font-bold tracking-wider text-white">
          ISCONNECTED
        </div>
      )}
    </div>
  );
};

export default Logo;
