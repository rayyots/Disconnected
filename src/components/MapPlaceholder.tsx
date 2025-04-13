
import React from 'react';
import { MapPin } from "lucide-react";

interface MapPlaceholderProps {
  className?: string;
}

const MapPlaceholder = ({ className = '' }: MapPlaceholderProps) => {
  return (
    <div className={`map-container flex items-center justify-center ${className}`}>
      <div className="text-center">
        <MapPin className="h-12 w-12 text-disconnected-light mx-auto mb-4" />
        <p className="text-muted-foreground">
          Map integration will appear here
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Powered by Google Maps
        </p>
      </div>
    </div>
  );
};

export default MapPlaceholder;
