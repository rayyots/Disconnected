
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Logo from "@/components/Logo";
import PhoneLoginForm from "@/components/auth/PhoneLoginForm";
import OtpVerificationForm from "@/components/auth/OtpVerificationForm";
import { toast } from "sonner";
import { checkAndSeedData } from "@/firebase/seedData";

const AuthPage = () => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  // Check if user is already logged in and seed database if needed
  useEffect(() => {
    const initializeApp = async () => {
      setIsLoading(true);
      
      try {
        // Seed Firebase with initial data if needed
        await checkAndSeedData();
        
        // Check if user is logged in
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          // Auto-login if user data exists
          setTimeout(() => {
            navigate('/home');
            toast.success("Welcome back, Omar!");
          }, 500);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error initializing app:", error);
        setIsLoading(false);
      }
    };
    
    initializeApp();
  }, [navigate]);

  const handlePhoneSubmit = (phone: string) => {
    setPhoneNumber(phone);
    setStep('otp');
    toast.success("Verification code sent!");
    
    // For demo purposes, we'll just log the verification code to console
    console.log("Verification code sent to", phone);
  };

  const handleVerification = () => {
    toast.success("Successfully logged in!");
    navigate('/home');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-disconnected-dark">
        <Logo variant="full" className="animate-pulse" />
        <p className="text-disconnected-light mt-4">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-disconnected-dark">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo variant="full" className="scale-125" />
        </div>
        
        <Card className="glass-card">
          <CardHeader className="text-center pb-2">
            <h2 className="text-xl font-bold">Welcome</h2>
            <p className="text-muted-foreground text-sm">
              {step === 'phone' 
                ? 'Enter your phone number to continue' 
                : 'Enter the verification code'}
            </p>
          </CardHeader>
          <CardContent className="pb-6">
            {step === 'phone' ? (
              <PhoneLoginForm onSubmit={handlePhoneSubmit} />
            ) : (
              <OtpVerificationForm 
                phoneNumber={phoneNumber}
                onVerify={handleVerification}
                onChangeNumber={() => setStep('phone')}
              />
            )}
          </CardContent>
        </Card>
        
        <p className="text-center text-xs text-muted-foreground mt-8">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
