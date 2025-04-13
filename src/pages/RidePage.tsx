
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import MapPlaceholder from "@/components/MapPlaceholder";
import DriverCard from "@/components/ride/DriverCard";
import DataUsageIndicator from "@/components/DataUsageIndicator";
import RideSummary from "@/components/ride/RideSummary";
import RideHeader from "@/components/ride/RideHeader";
import SearchingRide from "@/components/ride/SearchingRide";
import RideInProgress from "@/components/ride/RideInProgress";

const RidePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pickup, dropoff, paymentMethod, totalData, usedData: initialUsedData } = location.state || {};
  
  const [status, setStatus] = useState<'searching' | 'matched' | 'arriving' | 'inProgress' | 'completed'>('searching');
  const [usedData, setUsedData] = useState(initialUsedData || 125);
  const [dataUsedDuringRide, setDataUsedDuringRide] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  // Mock driver data
  const driver = {
    id: "driver-123",
    name: "James Wilson",
    rating: 4.8,
    carModel: "Toyota Camry",
    licensePlate: "XYZ 123",
  };
  
  // Mock ride data
  const ride = {
    pickupLocation: pickup || "123 Main St",
    dropoffLocation: dropoff || "456 Market St",
    distance: 3.5,
    duration: 12,
    baseFare: 8.50,
    dataUsed: dataUsedDuringRide,
    dataCost: dataUsedDuringRide * 0.01, // $0.01 per MB
    totalCost: 8.50 + (dataUsedDuringRide * 0.01),
    paymentMethod: paymentMethod || 'cash',
  };
  
  // Simulate finding a driver
  useEffect(() => {
    if (status === 'searching') {
      const timeout = setTimeout(() => {
        setStatus('matched');
        toast.success("Driver found!");
      }, 3000);
      
      return () => clearTimeout(timeout);
    }
  }, [status]);
  
  // Simulate driver arriving
  useEffect(() => {
    if (status === 'matched') {
      const timeout = setTimeout(() => {
        setStatus('arriving');
        toast.success("Your driver is arriving!");
      }, 5000);
      
      return () => clearTimeout(timeout);
    }
  }, [status]);
  
  // Simulate ride in progress
  useEffect(() => {
    if (status === 'arriving') {
      const timeout = setTimeout(() => {
        setStatus('inProgress');
        toast.success("Your ride has started!");
      }, 5000);
      
      return () => clearTimeout(timeout);
    }
  }, [status]);
  
  // Simulate ride completion
  useEffect(() => {
    if (status === 'inProgress') {
      const timeout = setTimeout(() => {
        setStatus('completed');
        toast.success("You've arrived at your destination!");
      }, 10000);
      
      return () => clearTimeout(timeout);
    }
  }, [status]);
  
  // Timer for ride duration
  useEffect(() => {
    if (status === 'inProgress') {
      const interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [status]);
  
  // Simulate data usage during ride
  useEffect(() => {
    if (status === 'inProgress') {
      const interval = setInterval(() => {
        setUsedData(prev => prev + 0.2);
        setDataUsedDuringRide(prev => prev + 0.2);
      }, 5000); // Use 0.2 MB every 5 seconds during ride
      
      return () => clearInterval(interval);
    }
  }, [status]);
  
  const handleConfirmPayment = () => {
    toast.success("Payment successful!");
    navigate('/home');
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-disconnected-dark">
      <RideHeader status={status} />
      
      {/* Main content */}
      <main className="flex-1 overflow-auto p-4 space-y-4">
        <MapPlaceholder />
        
        {status !== 'completed' && (
          <DataUsageIndicator 
            totalData={totalData} 
            usedData={usedData} 
            className="glass-card p-3 rounded-lg animate-fade-in"
          />
        )}
        
        {status === 'searching' && (
          <SearchingRide />
        )}
        
        {(status === 'matched' || status === 'arriving') && (
          <DriverCard driver={driver} />
        )}
        
        {status === 'inProgress' && (
          <RideInProgress 
            elapsedTime={elapsedTime}
            dataUsedDuringRide={dataUsedDuringRide}
            dropoffLocation={ride.dropoffLocation}
            driver={driver}
          />
        )}
        
        {status === 'completed' && (
          <RideSummary 
            ride={{
              ...ride,
              dataUsed: dataUsedDuringRide,
              dataCost: dataUsedDuringRide * 0.01,
              totalCost: ride.baseFare + (dataUsedDuringRide * 0.01)
            }} 
            onConfirm={handleConfirmPayment} 
          />
        )}
      </main>
    </div>
  );
};

export default RidePage;
