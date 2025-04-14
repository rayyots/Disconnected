
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import LocationInput from "@/components/ride/LocationInput";
import { SavedAddress } from "@/components/address/SavedAddressForm";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";

interface LocationSectionProps {
  pickup: string;
  setPickup: (value: string) => void;
  dropoff: string;
  setDropoff: (value: string) => void;
}

// Mock location suggestions based on input
export const getLocationSuggestions = (input: string) => {
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

const LocationSection: React.FC<LocationSectionProps> = ({ 
  pickup, 
  setPickup, 
  dropoff, 
  setDropoff 
}) => {
  const location = useLocation();
  const [pickupSuggestions, setPickupSuggestions] = useState<any[]>([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState<any[]>([]);

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
    }
  }, [location.state, pickup, dropoff, setPickup, setDropoff]);
  
  const handleSelectSuggestion = (type: 'pickup' | 'dropoff', address: string) => {
    if (type === 'pickup') {
      setPickup(address);
      setPickupSuggestions([]);
    } else {
      setDropoff(address);
      setDropoffSuggestions([]);
    }
  };

  return (
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
  );
};

export default LocationSection;
