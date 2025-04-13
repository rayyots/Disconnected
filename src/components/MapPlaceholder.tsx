
import React from 'react';
import { MapPin } from "lucide-react";

interface MapPlaceholderProps {
  className?: string;
}

const MapPlaceholder = ({
  className = ''
}: MapPlaceholderProps) => {
  // Sample map features
  const renderMapFeatures = () => (
    <>
      {/* Main roads */}
      <div className="absolute top-1/2 left-0 right-0 h-1 bg-disconnected-light/30"></div>
      <div className="absolute top-1/4 left-0 right-0 h-0.5 bg-disconnected-light/20"></div>
      <div className="absolute top-3/4 left-0 right-0 h-0.5 bg-disconnected-light/20"></div>
      <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-disconnected-light/30"></div>
      <div className="absolute left-1/4 top-0 bottom-0 w-0.5 bg-disconnected-light/20"></div>
      <div className="absolute left-3/4 top-0 bottom-0 w-0.5 bg-disconnected-light/20"></div>
      
      {/* Secondary roads */}
      {[...Array(5)].map((_, i) => (
        <div key={`h-road-${i}`} className="absolute h-px bg-disconnected-light/10" 
          style={{ top: `${15 + i * 15}%`, left: 0, right: 0 }}></div>
      ))}
      {[...Array(5)].map((_, i) => (
        <div key={`v-road-${i}`} className="absolute w-px bg-disconnected-light/10" 
          style={{ left: `${15 + i * 15}%`, top: 0, bottom: 0 }}></div>
      ))}
      
      {/* Location pin */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="animate-pulse">
          <MapPin className="h-8 w-8 text-disconnected-light" />
        </div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-24 h-6 bg-black/70 rounded-full flex items-center justify-center">
          <span className="text-xs text-white font-medium">Your location</span>
        </div>
      </div>
      
      {/* Random building blocks */}
      {[...Array(30)].map((_, i) => {
        const size = 5 + Math.random() * 10;
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        const opacity = 0.1 + Math.random() * 0.3;
        return (
          <div 
            key={`building-${i}`} 
            className="absolute bg-white rounded-sm"
            style={{ 
              width: `${size}px`, 
              height: `${size}px`, 
              top: `${top}%`, 
              left: `${left}%`,
              opacity
            }}
          ></div>
        );
      })}
    </>
  );
  
  return (
    <div className={`relative bg-disconnected-dark h-60 rounded-lg overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-zinc-950 opacity-70"></div>
      
      {renderMapFeatures()}
      
      <div className="absolute bottom-2 right-2 bg-black/50 px-2 py-1 rounded text-xs text-white">
        <p className="text-muted-foreground">
          Map simulation
        </p>
      </div>
    </div>
  );
};

export default MapPlaceholder;
