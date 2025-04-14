
import React from 'react';
import { Wifi } from "lucide-react";
import DriverCard from "@/components/ride/DriverCard";

interface RideInProgressProps {
  elapsedTime: number;
  dataUsedDuringRide: number;
  dropoffLocation: string;
  driver: {
    id: string;
    name: string;
    rating: number;
    carModel: string;
    licensePlate: string;
    avatarUrl?: string;
  };
}

const RideInProgress = ({ 
  elapsedTime, 
  dataUsedDuringRide, 
  dropoffLocation,
  driver 
}: RideInProgressProps) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="glass-card p-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-medium">In Progress</h3>
          <p className="text-sm text-muted-foreground">On the way to {dropoffLocation}</p>
        </div>
        <div className="text-right">
          <div className="text-xl font-mono">{formatTime(elapsedTime)}</div>
          <div className="flex items-center text-xs text-disconnected-light">
            <Wifi className="h-3 w-3 mr-1 animate-pulse-light" />
            <span>{dataUsedDuringRide.toFixed(1)} MB used</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <DriverCard driver={driver} />
      </div>
    </div>
  );
};

export default RideInProgress;
