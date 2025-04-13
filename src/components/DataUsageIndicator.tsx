
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Wifi } from "lucide-react";

interface DataUsageIndicatorProps {
  totalData: number;
  usedData: number;
  className?: string;
}

const DataUsageIndicator = ({ totalData, usedData, className = '' }: DataUsageIndicatorProps) => {
  const percentUsed = Math.min((usedData / totalData) * 100, 100);
  const remaining = Math.max(totalData - usedData, 0);
  
  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2 text-sm">
          <Wifi className="h-4 w-4 text-disconnected-light animate-pulse-light" />
          <span>Data Balance</span>
        </div>
        <span className="text-sm font-medium">{remaining.toFixed(1)} MB</span>
      </div>
      <Progress 
        value={percentUsed} 
        className="h-2 bg-muted" 
        indicatorClassName={`${percentUsed > 75 ? 'bg-red-500' : 'bg-disconnected-light'}`}
      />
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span>Used: {usedData.toFixed(1)} MB</span>
        <span>Total: {totalData} MB</span>
      </div>
    </div>
  );
};

export default DataUsageIndicator;
