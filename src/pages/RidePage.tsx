
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import RideHeader from "@/components/ride/RideHeader";
import RideContent from "@/components/ride/RideContent";
import useRideState from "@/hooks/useRideState";

const RidePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pickup, dropoff, paymentMethod, totalData } = location.state || {};
  const [userId, setUserId] = useState<string | null>(null);
  const [usedData, setUsedData] = useState(0);
  
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
  
  // Initialize ride state
  const {
    status,
    usedData: currentUsedData,
    dataUsedDuringRide,
    elapsedTime,
    availableDrivers,
    selectedDriver,
    loadingDrivers,
    ride,
    handleSelectDriver
  } = useRideState({
    pickup,
    dropoff,
    paymentMethod,
    userId
  });
  
  // Update usedData when it changes in the hook
  useEffect(() => {
    if (currentUsedData > 0) {
      setUsedData(currentUsedData);
    }
  }, [currentUsedData]);
  
  // Handle payment confirmation
  const handleConfirmPayment = () => {
    toast.success("Payment successful!");
    navigate('/home');
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-disconnected-dark">
      <RideHeader status={status} />
      <RideContent 
        status={status}
        totalData={totalData || 500}
        usedData={usedData}
        availableDrivers={availableDrivers}
        selectedDriver={selectedDriver}
        loadingDrivers={loadingDrivers}
        dataUsedDuringRide={dataUsedDuringRide}
        elapsedTime={elapsedTime}
        ride={ride}
        onSelectDriver={handleSelectDriver}
        onConfirmPayment={handleConfirmPayment}
      />
    </div>
  );
};

export default RidePage;
