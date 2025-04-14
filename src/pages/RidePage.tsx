
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import MapPlaceholder from "@/components/MapPlaceholder";
import DriverCard from "@/components/ride/DriverCard";
import DataUsageIndicator from "@/components/DataUsageIndicator";
import RideSummary from "@/components/ride/RideSummary";
import RideHeader from "@/components/ride/RideHeader";
import SearchingRide from "@/components/ride/SearchingRide";
import RideInProgress from "@/components/ride/RideInProgress";
import DriverSelectList from "@/components/ride/DriverSelectList";
import { getAvailableDrivers, Driver, updateDriverStatus } from "@/firebase/drivers";
import { createRideRequest, assignDriverToRide, updateRideStatus, updateRideDataUsage, updateUserDataUsage } from "@/firebase/rides";

const RidePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pickup, dropoff, paymentMethod, totalData } = location.state || {};
  
  const [status, setStatus] = useState<'searching' | 'selectingDriver' | 'matched' | 'arriving' | 'inProgress' | 'completed'>('searching');
  const [usedData, setUsedData] = useState(0);
  const [dataUsedDuringRide, setDataUsedDuringRide] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [availableDrivers, setAvailableDrivers] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [rideId, setRideId] = useState<string | null>(null);
  const [loadingDrivers, setLoadingDrivers] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  // Get user ID from local storage
  useEffect(() => {
    const userIdFromStorage = localStorage.getItem('userId');
    if (userIdFromStorage) {
      setUserId(userIdFromStorage);
    }
    
    // Get current data usage from local storage
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUsedData(user.dataUsed || 0);
    }
  }, []);
  
  // Create ride request when component mounts
  useEffect(() => {
    const initializeRide = async () => {
      if (!userId || !pickup || !dropoff) {
        toast.error("Missing ride information");
        navigate('/home');
        return;
      }
      
      try {
        const newRideId = await createRideRequest(
          userId,
          pickup,
          dropoff,
          paymentMethod || 'cash'
        );
        
        if (newRideId) {
          setRideId(newRideId);
          // After creating ride, move to selecting driver stage
          setTimeout(() => {
            setStatus('selectingDriver');
            fetchAvailableDrivers();
          }, 3000);
        } else {
          toast.error("Failed to create ride request");
          navigate('/home');
        }
      } catch (error) {
        console.error("Error creating ride:", error);
        toast.error("An error occurred while setting up your ride");
        navigate('/home');
      }
    };
    
    if (userId) {
      initializeRide();
    }
  }, [userId, pickup, dropoff, paymentMethod, navigate]);
  
  // Fetch available drivers
  const fetchAvailableDrivers = useCallback(async () => {
    if (!pickup) return;
    
    setLoadingDrivers(true);
    try {
      const drivers = await getAvailableDrivers(pickup);
      setAvailableDrivers(drivers);
    } catch (error) {
      console.error("Error fetching drivers:", error);
      toast.error("Couldn't find available drivers");
    } finally {
      setLoadingDrivers(false);
    }
  }, [pickup]);
  
  // Handle driver selection
  const handleSelectDriver = async (driver: Driver) => {
    if (!rideId) {
      toast.error("Ride information missing");
      return;
    }
    
    try {
      setSelectedDriver(driver);
      const success = await assignDriverToRide(rideId, driver.id);
      
      if (success) {
        await updateDriverStatus(driver.id, 'busy');
        setStatus('matched');
        toast.success(`${driver.name} will be your driver!`);
        
        // Simulate driver arriving after a delay
        setTimeout(() => {
          setStatus('arriving');
          toast.success("Your driver is arriving!");
          
          // Simulate ride starting after another delay
          setTimeout(() => {
            setStatus('inProgress');
            updateRideStatus(rideId, 'inProgress');
            toast.success("Your ride has started!");
          }, 5000);
        }, 5000);
      } else {
        toast.error("Failed to assign driver");
        setSelectedDriver(null);
      }
    } catch (error) {
      console.error("Error selecting driver:", error);
      toast.error("An error occurred while selecting your driver");
      setSelectedDriver(null);
    }
  };
  
  // Timer for ride duration
  useEffect(() => {
    if (status === 'inProgress') {
      const interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [status]);
  
  // Data usage simulation - start tracking right after page loads
  useEffect(() => {
    const dataUsageInterval = setInterval(() => {
      // Add data usage regardless of ride status
      const dataIncrement = 0.2; // 0.2 MB every interval
      
      setUsedData(prev => {
        const newValue = prev + dataIncrement;
        if (userId) {
          // Update user's data usage in Firebase
          updateUserDataUsage(userId, dataIncrement);
        }
        return newValue;
      });
      
      // If ride is in progress, also track ride-specific data usage
      if (status === 'inProgress' && rideId) {
        setDataUsedDuringRide(prev => {
          const newValue = prev + dataIncrement;
          // Update ride's data usage in Firebase
          updateRideDataUsage(rideId, newValue);
          return newValue;
        });
      }
    }, 5000); // Track data usage every 5 seconds
    
    return () => clearInterval(dataUsageInterval);
  }, [status, userId, rideId]);
  
  // Simulate ride completion
  useEffect(() => {
    if (status === 'inProgress' && elapsedTime > 10) {
      setStatus('completed');
      if (rideId) {
        updateRideStatus(rideId, 'completed', {
          dataUsed: dataUsedDuringRide,
          dataCost: dataUsedDuringRide * 0.01,
          totalCost: 8.50 + (dataUsedDuringRide * 0.01)
        });
      }
      toast.success("You've arrived at your destination!");
      
      // Update driver status back to available
      if (selectedDriver) {
        updateDriverStatus(selectedDriver.id, 'available');
      }
    }
  }, [status, elapsedTime, rideId, dataUsedDuringRide, selectedDriver]);
  
  const handleConfirmPayment = () => {
    toast.success("Payment successful!");
    navigate('/home');
  };
  
  // Calculate ride data
  const ride = {
    pickupLocation: pickup || "123 Main St",
    dropoffLocation: dropoff || "456 Market St",
    distance: 3.9,
    duration: 15,
    baseFare: 8.50,
    dataUsed: dataUsedDuringRide,
    dataCost: dataUsedDuringRide * 0.01, // $0.01 per MB
    totalCost: 8.50 + (dataUsedDuringRide * 0.01),
    paymentMethod: paymentMethod || 'cash',
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-disconnected-dark">
      <RideHeader status={status} />
      
      {/* Main content */}
      <main className="flex-1 overflow-auto p-4 space-y-4">
        <MapPlaceholder />
        
        {status !== 'completed' && (
          <DataUsageIndicator 
            totalData={totalData || 500} 
            usedData={usedData} 
            className="glass-card p-3 rounded-lg animate-fade-in"
          />
        )}
        
        {status === 'searching' && (
          <SearchingRide />
        )}
        
        {status === 'selectingDriver' && (
          <DriverSelectList 
            drivers={availableDrivers}
            onSelectDriver={handleSelectDriver}
            isLoading={loadingDrivers}
          />
        )}
        
        {(status === 'matched' || status === 'arriving') && selectedDriver && (
          <DriverCard driver={selectedDriver} />
        )}
        
        {status === 'inProgress' && selectedDriver && (
          <RideInProgress 
            elapsedTime={elapsedTime}
            dataUsedDuringRide={dataUsedDuringRide}
            dropoffLocation={ride.dropoffLocation}
            driver={selectedDriver}
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
