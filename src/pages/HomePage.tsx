
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Logo from "@/components/Logo";
import MapPlaceholder from "@/components/MapPlaceholder";
import RideRequestCard from "@/components/home/RideRequestCard";
import BottomNavBar from "@/components/BottomNavBar";
import useUser from "@/hooks/useUser";
import useDataUsage from "@/hooks/useDataUsage";
import ThemeToggle from "@/components/ThemeToggle";

const HomePage = () => {
  const navigate = useNavigate();
  const { user, userId, isLoading, updateUser } = useUser();
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  
  // Initialize data usage tracking
  const { totalData, usedData } = useDataUsage({ 
    userId, 
    initialUsedData: user?.dataUsed || 0 
  });
  
  // Update user with current data usage
  useEffect(() => {
    if (user && userId) {
      updateUser({ ...user, dataUsed: usedData });
    }
  }, [usedData]);
  
  // Show welcome message with user's name
  useEffect(() => {
    if (user?.name) {
      toast.success(`Welcome, ${user.name.split(' ')[0]}!`);
    }
  }, [user]);
  
  const handleRequestRide = () => {
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
  
  if (isLoading || !user) {
    return null; // Don't render until user data is loaded
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-disconnected-dark pb-16">
      {/* Main content */}
      <main className="flex-1 overflow-auto pt-4">
        <div className="px-4 mb-4 flex justify-between items-center">
          <Logo variant="full" />
          <div className="text-right">
            <p className="text-sm text-disconnected-light font-medium">{user.name}</p>
          </div>
        </div>
        
        <div className="p-4 space-y-4">
          <MapPlaceholder />
          
          <RideRequestCard
            pickup={pickup}
            setPickup={setPickup}
            dropoff={dropoff}
            setDropoff={setDropoff}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            totalData={totalData}
            usedData={usedData}
            onRequestRide={handleRequestRide}
          />
        </div>
      </main>
      
      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
};

export default HomePage;
