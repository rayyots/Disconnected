
import React from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Clock, MapPin, User } from "lucide-react";
import { cn } from "@/lib/utils";

const BottomNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleNavigation = (path: string) => {
    navigate(path);
  };
  
  const navItems = [
    { icon: Home, label: 'Home', path: '/home' },
    { icon: Clock, label: 'History', path: '/history' },
    { icon: MapPin, label: 'Saved', path: '/saved' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center p-2 bg-disconnected-dark/95 backdrop-blur-sm border-t border-border">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        
        return (
          <button
            key={item.path}
            className={cn(
              "flex flex-col items-center justify-center w-16 py-1 rounded-lg transition-colors",
              isActive ? "text-disconnected-light" : "text-muted-foreground hover:text-white"
            )}
            onClick={() => handleNavigation(item.path)}
          >
            <Icon className={cn("h-5 w-5 mb-1", isActive && "text-disconnected-light")} />
            <span className="text-xs">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNavBar;
