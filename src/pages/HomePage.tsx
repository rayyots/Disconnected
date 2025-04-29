
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Logo from "@/components/Logo";
import MapPlaceholder from "@/components/MapPlaceholder";
import LocationInput from "@/components/ride/LocationInput";
import PaymentMethodSelector from "@/components/ride/PaymentMethodSelector";
import DataUsageIndicator from "@/components/DataUsageIndicator";
import BottomNavBar from "@/components/BottomNavBar";
import { useData } from "@/context/DataContext";

const HomePage = () => {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const { 
    hasMobileData, 
    dataSimulationActive, 
    totalData, 
    usedData, 
    incrementUsedData 
  } = useData();

  const handleRequestRide = () => {
    if (!pickup || !dropoff) {
      toast.error("Please enter pickup and dropoff locations");
      return;
    }
    
    navigate('/ride', { 
      state: { 
        pickup, 
        dropoff, 
        paymentMethod
      } 
    });
  };
  
  // Simulate data usage only if simulation is active
  useEffect(() => {
    if (dataSimulationActive) {
      const interval = setInterval(() => {
        incrementUsedData(0.5);
      }, 30000); // Use 0.5 MB every 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [dataSimulationActive, incrementUsedData]);
  
  return (
    <div className="min-h-screen flex flex-col bg-disconnected-dark pb-16">
      {/* Main content */}
      <main className="flex-1 overflow-auto pt-4">
        <div className="px-4 mb-4 flex justify-center">
          <Logo variant="full" />
        </div>
        
        <div className="p-4 space-y-4">
          <MapPlaceholder />
          
          <Card className="glass-card">
            <CardContent className="p-4 space-y-4">
              {(!hasMobileData || dataSimulationActive) && (
                <DataUsageIndicator 
                  totalData={totalData} 
                  usedData={usedData} 
                />
              )}
              
              <div className="space-y-2">
                <LocationInput 
                  type="pickup" 
                  value={pickup} 
                  onChange={setPickup}
                  withSuggestions
                />
                <LocationInput 
                  type="dropoff" 
                  value={dropoff} 
                  onChange={setDropoff}
                  withSuggestions
                />
              </div>
              
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
        </div>
      </main>
      
      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
};

export default HomePage;
