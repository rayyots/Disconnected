
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, CreditCard, Wifi } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { completeRide } from "@/services/api";
import { toast } from "sonner";
import { useData } from "@/context/DataContext";

interface RideSummaryProps {
  ride: {
    pickupLocation: string;
    dropoffLocation: string;
    distance: number;
    duration: number;
    baseFare: number;
    dataUsed: number;
    dataCost: number;
    totalCost: number;
    paymentMethod: 'cash' | 'card';
  };
  onConfirm: () => void;
}

const RideSummary = ({ ride, onConfirm }: RideSummaryProps) => {
  const { dataSimulationActive } = useData();
  
  const handleConfirmPayment = async () => {
    try {
      // Get phone number from local storage (in a real app, you'd use a proper auth system)
      const phoneNumber = localStorage.getItem('phoneNumber') || '';
      
      if (phoneNumber) {
        // Add timestamp to the ride
        const rideWithTimestamp = {
          ...ride,
          timestamp: new Date().toISOString()
        };
        
        // Save the ride to the backend
        await completeRide(phoneNumber, rideWithTimestamp);
      }
      
      // Call the original onConfirm function
      onConfirm();
    } catch (error) {
      console.error('Error saving ride:', error);
      toast.error('Failed to save ride history');
      onConfirm(); // Still continue even if saving fails
    }
  };

  return (
    <Card className="glass-card animate-fade-in">
      <CardContent className="p-4 pt-6">
        <h3 className="text-lg font-medium mb-4">Ride Summary</h3>
        
        <div className="space-y-4">
          {/* Locations */}
          <div className="space-y-3">
            <div className="flex">
              <MapPin className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Pickup</p>
                <p className="font-medium">{ride.pickupLocation}</p>
              </div>
            </div>
            <div className="flex">
              <MapPin className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Dropoff</p>
                <p className="font-medium">{ride.dropoffLocation}</p>
              </div>
            </div>
          </div>
          
          {/* Time & Distance */}
          <div className="flex justify-between">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">{ride.duration} min</span>
            </div>
            <div className="text-sm">
              {ride.distance.toFixed(1)} km
            </div>
          </div>
          
          <Separator />
          
          {/* Costs */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ride fare</span>
              <span>EGP {ride.baseFare.toFixed(2)}</span>
            </div>
            {dataSimulationActive && (
              <div className="flex justify-between">
                <div className="flex items-center">
                  <Wifi className="h-4 w-4 mr-1 text-disconnected-light" />
                  <span className="text-muted-foreground">Data used ({ride.dataUsed.toFixed(1)} MB)</span>
                </div>
                <span>EGP {ride.dataCost.toFixed(2)}</span>
              </div>
            )}
          </div>
          
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>EGP {ride.totalCost.toFixed(2)}</span>
          </div>
          
          <div className="flex items-center">
            <CreditCard className="h-4 w-4 mr-2" />
            <span className="capitalize">{ride.paymentMethod}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full bg-disconnected-light text-disconnected-dark hover:bg-disconnected-light/90"
          onClick={handleConfirmPayment}
        >
          Confirm & Pay
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RideSummary;
