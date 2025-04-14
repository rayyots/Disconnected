
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import LocationSection from "@/components/home/LocationSection";
import PaymentMethodSelector from "@/components/ride/PaymentMethodSelector";
import DataUsageIndicator from "@/components/DataUsageIndicator";

interface RideRequestCardProps {
  pickup: string;
  setPickup: (value: string) => void;
  dropoff: string;
  setDropoff: (value: string) => void;
  paymentMethod: 'cash' | 'card';
  setPaymentMethod: (method: 'cash' | 'card') => void;
  totalData: number;
  usedData: number;
  onRequestRide: () => void;
}

const RideRequestCard: React.FC<RideRequestCardProps> = ({
  pickup,
  setPickup,
  dropoff,
  setDropoff,
  paymentMethod,
  setPaymentMethod,
  totalData,
  usedData,
  onRequestRide
}) => {
  const handleRequestRide = () => {
    if (!pickup || !dropoff) {
      toast.error("Please enter pickup and dropoff locations");
      return;
    }
    
    onRequestRide();
  };

  return (
    <Card className="glass-card">
      <CardContent className="p-4 space-y-4">
        <DataUsageIndicator 
          totalData={totalData} 
          usedData={usedData} 
        />
        
        <LocationSection 
          pickup={pickup}
          setPickup={setPickup}
          dropoff={dropoff}
          setDropoff={setDropoff}
        />
        
        <Separator />
        
        <div className="flex justify-between items-center">
          <span className="text-sm">Payment</span>
          <PaymentMethodSelector
            value={paymentMethod}
            onChange={setPaymentMethod}
          />
        </div>
        
        <Button 
          className="w-full bg-disconnected-light text-disconnected-dark hover:bg-disconnected-light/90"
          onClick={handleRequestRide}
        >
          Request Ride
        </Button>
      </CardContent>
    </Card>
  );
};

export default RideRequestCard;
