
import React from 'react';
import { Driver } from '@/firebase/drivers';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Car, Star } from "lucide-react";

interface DriverSelectListProps {
  drivers: Driver[];
  onSelectDriver: (driver: Driver) => void;
  isLoading?: boolean;
}

const DriverSelectList = ({ drivers, onSelectDriver, isLoading = false }: DriverSelectListProps) => {
  if (isLoading) {
    return (
      <div className="glass-card p-4 text-center animate-pulse">
        <p>Finding available drivers...</p>
      </div>
    );
  }

  if (drivers.length === 0) {
    return (
      <div className="glass-card p-4 text-center">
        <p>No drivers available at the moment. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-fade-in">
      <h3 className="text-lg font-medium mb-2">Select a Driver</h3>
      
      {drivers.map((driver) => (
        <Card key={driver.id} className="glass-card overflow-hidden hover:bg-disconnected-light/5 transition-colors">
          <CardContent className="p-3">
            <div className="flex items-center">
              <Avatar className="h-12 w-12 border-2 border-disconnected-light">
                <AvatarImage src={driver.avatar} alt={driver.name} />
                <AvatarFallback className="bg-muted">{driver.name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div className="ml-3 flex-1">
                <div className="flex justify-between">
                  <h4 className="font-medium">{driver.name}</h4>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="text-sm">{driver.rating.toFixed(1)}</span>
                  </div>
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground mt-0.5">
                  <Car className="h-3.5 w-3.5 mr-1" />
                  <span>{driver.carModel}</span>
                  <span className="mx-2">•</span>
                  <span>{driver.licensePlate}</span>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                className="ml-2 border-disconnected-light/40 bg-muted hover:bg-disconnected-light/10"
                onClick={() => onSelectDriver(driver)}
              >
                Select
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DriverSelectList;
