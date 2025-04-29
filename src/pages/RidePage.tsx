
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
import { useData } from "@/context/DataContext";

const RidePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pickup, dropoff, paymentMethod } = location.state || {};
  
  const { 
    hasMobileData,
    dataSimulationActive, 
    totalData, 
    usedData, 
    incrementUsedData,
    setUsedData 
  } = useData();
  
  const [status, setStatus] = useState<'searching' | 'matched' | 'arriving' | 'inProgress' | 'completed'>('searching');
  const [dataUsedDuringRide, setDataUsedDuringRide] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [dataStopped, setDataStopped] = useState(false);
  
  // Mock driver data
  const driver = {
    id: "driver-123",
    name: "Mohamed Salah",
    rating: 4.8,
    carModel: "Nissan Sunny",
    licensePlate: "ا ج ط 481",
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
      }, 15000);
      
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
  
  // Simulate data usage during ride only if simulation is active
  useEffect(() => {
    if (status === 'inProgress' && dataSimulationActive && !dataStopped) {
      const interval = setInterval(() => {
        const dataIncrement = 0.8; // Data usage per interval in MB
        
        // Check if adding this increment would exceed the total data
        if (usedData + dataIncrement > totalData) {
          toast.error("Data balance depleted! Conserving remaining data.");
          setDataStopped(true);
          return;
        }
        
        incrementUsedData(0.2);
        setDataUsedDuringRide(prev => prev + dataIncrement);
      }, 5000); // Use 0.8 MB every 5 seconds during ride
      
      return () => clearInterval(interval);
    }
  }, [status, dataSimulationActive, incrementUsedData, usedData, totalData, dataStopped]);
  
  const handleConfirmPayment = () => {
    toast.success("Payment successful!");
    navigate('/home');
  };
  
  // Calculate ride data for summary
  const ride = {
    pickupLocation: pickup || "123 Main St",
    dropoffLocation: dropoff || "456 Market St",
    distance: 5.3,
    duration: 15,
    baseFare: 25,
    dataUsed: dataUsedDuringRide,
    dataCost: dataUsedDuringRide * 0.1,
    totalCost: 25 + (dataSimulationActive ? dataUsedDuringRide * 0.1 : 0),
    paymentMethod: paymentMethod || 'cash',
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-disconnected-dark">
      <RideHeader status={status} />
      
      {/* Main content */}
      <main className="flex-1 overflow-auto p-4 space-y-4">
        <MapPlaceholder />
        
        {status !== 'completed' && (!hasMobileData || dataSimulationActive) && (
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
            dataUsedDuringRide={dataSimulationActive ? dataUsedDuringRide : 0}
            dropoffLocation={ride.dropoffLocation}
            driver={driver}
          />
        )}
        
        {status === 'completed' && (
          <RideSummary 
            ride={{
              ...ride,
              dataUsed: dataSimulationActive ? dataUsedDuringRide : 0,
              dataCost: dataSimulationActive ? dataUsedDuringRide * 0.1 : 0,
              totalCost: ride.baseFare + (dataSimulationActive ? dataUsedDuringRide * 0.1 : 0)
            }} 
            onConfirm={handleConfirmPayment} 
          />
        )}
      </main>
    </div>
  );
};

export default RidePage;
