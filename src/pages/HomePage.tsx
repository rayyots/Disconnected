
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { History, Home, User, Car } from "lucide-react";
import Logo from "@/components/Logo";
import MapPlaceholder from "@/components/MapPlaceholder";
import LocationInput from "@/components/ride/LocationInput";
import PaymentMethodSelector from "@/components/ride/PaymentMethodSelector";
import DataUsageIndicator from "@/components/DataUsageIndicator";

const HomePage = () => {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [totalData, setTotalData] = useState(500); // 500 MB data balance
  const [usedData, setUsedData] = useState(125); // 125 MB used
  
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
    <div className="min-h-screen flex flex-col bg-disconnected-dark">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-disconnected-dark/80 backdrop-blur-sm border-b border-border p-4">
        <div className="flex justify-between items-center">
          <Logo variant="full" />
          <Button 
            variant="ghost" 
            size="icon"
            className="text-muted-foreground hover:text-white"
            onClick={() => toast.info("Profile coming soon")}
          >
            <User className="h-5 w-5" />
          </Button>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Tabs defaultValue="ride" className="w-full">
          <TabsList className="w-full grid grid-cols-3 gap-2 bg-muted/50 p-1">
            <TabsTrigger value="ride" className="data-[state=active]:bg-disconnected-light data-[state=active]:text-disconnected-dark">
              <Car className="h-4 w-4 mr-2" />
              Ride
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-disconnected-light data-[state=active]:text-disconnected-dark">
              <History className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
            <TabsTrigger value="home" className="data-[state=active]:bg-disconnected-light data-[state=active]:text-disconnected-dark">
              <Home className="h-4 w-4 mr-2" />
              Home
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="ride" className="p-4 space-y-4">
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
                  />
                  <LocationInput 
                    type="dropoff" 
                    value={dropoff} 
                    onChange={setDropoff} 
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
          </TabsContent>
          
          <TabsContent value="history" className="p-4">
            <div className="rounded-lg border border-border bg-muted/30 p-8 text-center">
              <History className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 font-medium">No ride history yet</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Your completed rides will appear here
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="home" className="p-4">
            <div className="rounded-lg border border-border bg-muted/30 p-8 text-center">
              <Home className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 font-medium">Saved addresses</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Add your home and work addresses for quick access
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => toast.info("Home address feature coming soon")}
              >
                Add Address
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default HomePage;
