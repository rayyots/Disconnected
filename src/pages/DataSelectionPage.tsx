
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wifi, WifiOff } from "lucide-react";
import Logo from "@/components/Logo";
import { toast } from "sonner";

const DataSelectionPage = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<'use-own' | 'request-data' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = () => {
    if (!selectedOption) {
      toast.error("Please select an option to continue");
      return;
    }

    setIsLoading(true);

    // In a real app, this would be a call to a backend API
    setTimeout(() => {
      if (selectedOption === 'use-own') {
        // User has their own data
        navigate('/home', { 
          state: { 
            hasMobileData: true, 
            dataSimulationActive: false 
          } 
        });
        toast.success("You're all set! Using your own data plan.");
      } else {
        // User is requesting data
        navigate('/home', { 
          state: { 
            hasMobileData: false, 
            dataSimulationActive: true,
            dataActivationTime: new Date().getTime()
          } 
        });
        toast.success("Mobile data has been activated for you!");
      }

      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-disconnected-dark">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo variant="full" className="scale-125" />
        </div>
        
        <Card className="glass-card">
          <CardHeader className="text-center pb-2">
            <h2 className="text-xl font-bold">Mobile Data</h2>
            <p className="text-muted-foreground text-sm">
              Do you have your own mobile data or would you like to request data?
            </p>
          </CardHeader>
          <CardContent className="pb-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Card 
                className={`cursor-pointer border p-4 text-center hover:border-disconnected-light transition-all ${
                  selectedOption === 'use-own' ? 'border-disconnected-light bg-disconnected-light/10' : ''
                }`}
                onClick={() => setSelectedOption('use-own')}
              >
                <Wifi className="mx-auto h-8 w-8 mb-2" />
                <h3 className="font-medium">I have my own data</h3>
                <p className="text-xs text-muted-foreground mt-1">Use your personal data plan</p>
              </Card>
              <Card 
                className={`cursor-pointer border p-4 text-center hover:border-disconnected-light transition-all ${
                  selectedOption === 'request-data' ? 'border-disconnected-light bg-disconnected-light/10' : ''
                }`}
                onClick={() => setSelectedOption('request-data')}
              >
                <WifiOff className="mx-auto h-8 w-8 mb-2" />
                <h3 className="font-medium">Request data</h3>
                <p className="text-xs text-muted-foreground mt-1">Pay for data as you ride</p>
              </Card>
            </div>
            
            <Button 
              className="w-full bg-disconnected-light text-disconnected-dark hover:bg-disconnected-light/90"
              onClick={handleContinue}
              disabled={isLoading || !selectedOption}
            >
              {isLoading ? "Processing..." : "Continue"}
            </Button>
          </CardContent>
        </Card>
        
        <p className="text-center text-xs text-muted-foreground mt-8">
          Data charges may apply based on your selection
        </p>
      </div>
    </div>
  );
};

export default DataSelectionPage;
