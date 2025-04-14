
import React, { useState, useEffect } from 'react';
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
import { db } from "@/firebase/config";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { updateUserDataUsage } from "@/firebase/rides";

// Mock location suggestions based on input
const getLocationSuggestions = (input: string) => {
  if (!input || input.length < 2) return [];
  
  const suggestions = [
    { id: 1, address: "123 Main Street, New York, NY" },
    { id: 2, address: "456 Park Avenue, New York, NY" },
    { id: 3, address: "789 Broadway, New York, NY" },
    { id: 4, address: "321 5th Avenue, New York, NY" },
    { id: 5, address: "654 Madison Avenue, New York, NY" }
  ];
  
  return suggestions.filter(s => 
    s.address.toLowerCase().includes(input.toLowerCase())
  );
};

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [totalData, setTotalData] = useState(500); // 500 MB data balance
  const [usedData, setUsedData] = useState(0); // Starting from 0 MB used
  const [pickupSuggestions, setPickupSuggestions] = useState<any[]>([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  
  // Check authentication and get user data
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userData = localStorage.getItem('user');
    const userIdFromStorage = localStorage.getItem('userId');
    
    if (!isAuthenticated || !userData) {
      navigate('/auth');
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setUsedData(parsedUser.dataUsed || 0);
      
      if (userIdFromStorage) {
        setUserId(userIdFromStorage);
      }
    } catch (e) {
      console.error("Error parsing user data", e);
      navigate('/auth');
    }
  }, [navigate]);
  
  // Handle location suggestions
  useEffect(() => {
    setPickupSuggestions(getLocationSuggestions(pickup));
  }, [pickup]);
  
  useEffect(() => {
    setDropoffSuggestions(getLocationSuggestions(dropoff));
  }, [dropoff]);
  
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
  
  // Simulate data usage - start from the moment the app loads
  useEffect(() => {
    if (!userId) return;
    
    const interval = setInterval(async () => {
      const dataIncrement = 0.5; // 0.5 MB every 30 seconds
      
      setUsedData(prev => {
        const newValue = prev + dataIncrement;
        
        // Update user data in Firebase and local storage
        if (userId) {
          updateUserDataUsage(userId, dataIncrement);
          
          // Update local user object
          if (user) {
            const updatedUser = { ...user, dataUsed: newValue };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
          }
        }
        
        return newValue;
      });
    }, 30000);
    
    return () => clearInterval(interval);
  }, [userId, user, totalData]);
  
  const handleSelectSuggestion = (type: 'pickup' | 'dropoff', address: string) => {
    if (type === 'pickup') {
      setPickup(address);
      setPickupSuggestions([]);
    } else {
      setDropoff(address);
      setDropoffSuggestions([]);
    }
  };
  
  // Show welcome message with user's name
  useEffect(() => {
    if (user?.name) {
      toast.success(`Welcome, ${user.name.split(' ')[0]}!`);
    }
  }, [user]);
  
  if (!user) {
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
                  withSuggestions={true}
                  suggestions={pickupSuggestions}
                  onSelectSuggestion={(address) => handleSelectSuggestion('pickup', address)}
                />
                <LocationInput 
                  type="dropoff" 
                  value={dropoff} 
                  onChange={setDropoff}
                  withSuggestions={true}
                  suggestions={dropoffSuggestions}
                  onSelectSuggestion={(address) => handleSelectSuggestion('dropoff', address)}
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
