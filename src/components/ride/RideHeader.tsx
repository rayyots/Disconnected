
import React from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Logo from "@/components/Logo";
import { toast } from "sonner";

interface RideHeaderProps {
  status: 'searching' | 'selectingDriver' | 'matched' | 'arriving' | 'inProgress' | 'completed';
}

const RideHeader = ({ status }: RideHeaderProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (status === 'searching' || status === 'selectingDriver') {
      navigate('/home');
    } else {
      toast.error("Cannot cancel ride in progress");
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-disconnected-dark/80 backdrop-blur-sm border-b border-border p-4">
      <div className="flex justify-between items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-muted-foreground hover:text-white"
          onClick={handleBack}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Logo variant="icon" />
        <div className="w-8"></div> {/* Placeholder for symmetry */}
      </div>
    </header>
  );
};

export default RideHeader;
