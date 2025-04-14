
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, Car, Star } from "lucide-react";
import { Driver } from '@/firebase/drivers';

interface DriverCardProps {
  driver: Driver;
}

const DriverCard = ({ driver }: DriverCardProps) => {
  return (
    <Card className="glass-card overflow-hidden animate-fade-in">
      <CardContent className="p-4">
        <div className="flex items-center">
          <Avatar className="h-12 w-12 border-2 border-disconnected-light">
            <AvatarImage src={driver.avatar} alt={driver.name} />
            <AvatarFallback className="bg-muted">{driver.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 flex-1">
            <div className="flex justify-between">
              <h3 className="font-medium">{driver.name}</h3>
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="text-sm">{driver.rating.toFixed(1)}</span>
              </div>
            </div>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <Car className="h-3.5 w-3.5 mr-1" />
              <span>{driver.carModel}</span>
              <span className="mx-2">•</span>
              <span>{driver.licensePlate}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 bg-muted border-disconnected-light/40 hover:bg-disconnected-light/10"
          >
            <Phone className="h-4 w-4 mr-2" />
            Call
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 bg-muted border-disconnected-light/40 hover:bg-disconnected-light/10"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Message
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DriverCard;
