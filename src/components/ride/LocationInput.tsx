
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, X } from "lucide-react";

interface LocationInputProps {
  type: 'pickup' | 'dropoff';
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  withSuggestions?: boolean;
  suggestions?: any[];
  onSelectSuggestion?: (address: string) => void;
}

// Mock location data for suggestions
const MOCK_LOCATIONS = [
  "123 Main Street",
  "456 Oak Avenue",
  "789 Pine Boulevard",
  "321 Maple Road",
  "654 Cedar Lane",
  "987 Elm Drive",
  "Downtown Mall",
  "Central Park",
  "Airport Terminal",
  "Train Station",
  "City Hospital",
  "University Campus",
  "Shopping Center",
  "Business District",
  "Waterfront Plaza"
];

const LocationInput = ({ 
  type, 
  value, 
  onChange, 
  onFocus, 
  withSuggestions = false,
  suggestions,
  onSelectSuggestion
}: LocationInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [internalSuggestions, setInternalSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  useEffect(() => {
    if (withSuggestions && value.length > 0) {
      if (suggestions) {
        // Use external suggestions if provided
        setShowSuggestions(suggestions.length > 0 && isFocused);
      } else {
        // Filter locations that match the input
        const filtered = MOCK_LOCATIONS.filter(loc => 
          loc.toLowerCase().includes(value.toLowerCase())
        ).slice(0, 4); // Limit to 4 suggestions
        
        setInternalSuggestions(filtered);
        setShowSuggestions(filtered.length > 0 && isFocused);
      }
    } else {
      setShowSuggestions(false);
    }
  }, [value, isFocused, withSuggestions, suggestions]);
  
  const handleFocus = () => {
    setIsFocused(true);
    if (onFocus) onFocus();
  };
  
  const handleBlur = () => {
    // Delay hiding suggestions to allow for selection
    setTimeout(() => {
      setIsFocused(false);
      setShowSuggestions(false);
    }, 150);
  };
  
  const clearInput = () => {
    onChange('');
  };
  
  const selectSuggestion = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    if (onSelectSuggestion) {
      onSelectSuggestion(suggestion);
    }
  };
  
  // Determine which suggestions to display
  const displaySuggestions = suggestions || internalSuggestions;
  
  return (
    <div className="relative">
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
      
      {showSuggestions && displaySuggestions.length > 0 && (
        <div className="absolute z-10 mt-1 w-full rounded-md border border-border bg-muted shadow-lg">
          <ul className="py-1">
            {displaySuggestions.map((suggestion, index) => {
              const suggestionText = typeof suggestion === 'string' ? suggestion : suggestion.address;
              return (
                <li 
                  key={index}
                  className="px-4 py-2 text-sm cursor-pointer hover:bg-disconnected-light/10 flex items-center"
                  onClick={() => selectSuggestion(suggestionText)}
                >
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  {suggestionText}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LocationInput;
