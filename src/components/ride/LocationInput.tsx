
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, X } from "lucide-react";

interface LocationInputProps {
  type: 'pickup' | 'dropoff';
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
}

const LocationInput = ({ type, value, onChange, onFocus }: LocationInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const handleFocus = () => {
    setIsFocused(true);
    if (onFocus) onFocus();
  };
  
  const handleBlur = () => {
    setIsFocused(false);
  };
  
  const clearInput = () => {
    onChange('');
  };
  
  return (
    <div className={`relative flex items-center rounded-md border ${isFocused ? 'border-disconnected-light' : 'border-border'} bg-muted p-1 transition-all duration-200`}>
      <MapPin 
        className={`ml-2 h-5 w-5 ${type === 'pickup' ? 'text-green-500' : 'text-red-500'}`} 
      />
      <Input
        type="text"
        placeholder={type === 'pickup' ? "Enter pickup location" : "Enter dropoff location"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={clearInput}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default LocationInput;
