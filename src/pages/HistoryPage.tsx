
import React, { useEffect, useState } from 'react';
import { History, Clock, MapPin, Wifi } from "lucide-react";
import BottomNavBar from "@/components/BottomNavBar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getRideHistory } from "@/services/api";
import { toast } from "sonner";
import { format } from "date-fns";
import { useData } from "@/context/DataContext";

interface RideHistoryItem {
  id: string;
  pickupLocation: string;
  dropoffLocation: string;
  distance: number;
  duration: number;
  baseFare: number;
  dataUsed: number;
  dataCost: number;
  totalCost: number;
  paymentMethod: string;
  date: string;
}

const HistoryPage = () => {
  const [rideHistory, setRideHistory] = useState<RideHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { dataSimulationActive } = useData();

  useEffect(() => {
    const fetchRideHistory = async () => {
      try {
        // Get phone number from local storage
        const phoneNumber = localStorage.getItem('phoneNumber');
        if (!phoneNumber) {
          setLoading(false);
          return;
        }

        const response = await getRideHistory(phoneNumber);
        if (response.success && response.data) {
          setRideHistory(response.data.rides || []);
        }
      } catch (error) {
        console.error('Error fetching ride history:', error);
        toast.error('Failed to load ride history');
      } finally {
        setLoading(false);
      }
    };

    fetchRideHistory();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy • HH:mm');
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-disconnected-dark pb-16">
      <main className="flex-1 overflow-auto pt-4 px-4">
        <h1 className="text-xl font-bold mb-4 text-center">Ride History</h1>
        
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-pulse text-muted-foreground">Loading...</div>
          </div>
        ) : rideHistory.length === 0 ? (
          <div className="rounded-lg border border-border bg-muted/30 p-8 text-center">
            <History className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 font-medium">No ride history yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Your completed rides will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {rideHistory.map((ride) => (
              <Card key={ride.id} className="glass-card overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(ride.date)}
                    </span>
                    <span className="text-sm font-semibold">
                      EGP {ride.totalCost.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="space-y-3 mb-3">
                    <div className="flex">
                      <MapPin className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">{ride.pickupLocation}</p>
                    </div>
                    <div className="flex">
                      <MapPin className="h-4 w-4 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">{ride.dropoffLocation}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      <span>{ride.duration} min</span>
                    </div>
                    <span>{ride.distance.toFixed(1)} km</span>
                    {dataSimulationActive && ride.dataUsed > 0 && (
                      <div className="flex items-center">
                        <Wifi className="h-3.5 w-3.5 mr-1" />
                        <span>{ride.dataUsed.toFixed(1)} MB</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      
      <BottomNavBar />
    </div>
  );
};

export default HistoryPage;
