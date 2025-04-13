
import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";

const SplashPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading time
    const timeout = setTimeout(() => {
      navigate('/auth');
    }, 3000);
    
    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-disconnected-dark">
      <div className="animate-pulse-light">
        <Logo variant="full" className="scale-150" />
      </div>
      
      <div className="mt-16 flex space-x-3">
        <div className="h-2 w-2 rounded-full bg-disconnected-light/60 animate-pulse delay-0"></div>
        <div className="h-2 w-2 rounded-full bg-disconnected-light/60 animate-pulse delay-300"></div>
        <div className="h-2 w-2 rounded-full bg-disconnected-light/60 animate-pulse delay-600"></div>
      </div>
    </div>
  );
};

export default SplashPage;
