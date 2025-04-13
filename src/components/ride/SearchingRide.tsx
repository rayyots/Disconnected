
import React from 'react';
import { Car } from "lucide-react";

const SearchingRide = () => {
  return (
    <div className="glass-card p-6 flex flex-col items-center text-center animate-fade-in">
      <Car className="h-12 w-12 text-disconnected-light animate-pulse" />
      <h3 className="mt-4 font-medium">Finding you a driver</h3>
      <p className="text-sm text-muted-foreground mt-1">
        Please wait a moment...
      </p>
    </div>
  );
};

export default SearchingRide;
