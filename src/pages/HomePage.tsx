
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import Logo from "@/components/Logo";
import MapPlaceholder from "@/components/MapPlaceholder";
import LocationInput from "@/components/ride/LocationInput";
import PaymentMethodSelector from "@/components/ride/PaymentMethodSelector";
import DataUsageIndicator from "@/components/DataUsageIndicator";
import BottomNavBar from "@/components/BottomNavBar";
import { SavedAddress } from "@/components/address/SavedAddressForm";

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [totalData, setTotalData] = useState(500); // 500 MB data balance
  const [usedData, setUsedData] = useState(0); // Starting from 0 MB used
  
  // Check if an address was selected from the saved addresses page
  useEffect(() => {
    const state = location.state as { selectedAddress?: SavedAddress };
    if (state?.selectedAddress) {
      if (!pickup) {
        setPickup(state.selectedAddress.address);
      } else if (!dropoff) {
        setDropoff(state.selectedAddress.address);
      }
      // Clear the state after using it
      navigate('/home', { replace: true });
    }
  }, [location.state, navigate, pickup, dropoff]);
  
  const handleRequestRide = () => {
    if (!pickup || !dropoff) {
      toast.error("Please enter pickup and dropoff locations");
      return;
    }
    
    navigate('/ride', { 
      state: { 
        pickup, 
        dropoff, 
        paymentMethod,
        totalData,
        usedData
      } 
    });
  };
  
  // Simulate data usage
  useEffect(() => {
    const interval = setInterval(() => {
      setUsedData(prev => {
        if (prev < totalData) {
          return prev + 0.5;
        }
        return prev;
      });
    }, 30000); // Use 0.5 MB every 30 seconds
    
    return () => clearInterval(interval);
  }, [totalData]);
  
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
              <DataUsageIndicator 
                totalData={totalData} 
                usedData={usedData} 
              />
              
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
