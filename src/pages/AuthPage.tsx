import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Logo from "@/components/Logo";
import PhoneLoginForm from "@/components/auth/PhoneLoginForm";
import OtpVerificationForm from "@/components/auth/OtpVerificationForm";
import { toast } from "sonner";
import { verifyPhone } from "@/services/api";
import { useData } from "@/context/DataContext";

const AuthPage = () => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate();
  const { setUserData } = useData();

  const handlePhoneSubmit = (phone: string) => {
    setPhoneNumber(phone);
    setStep('otp');
    toast.success("Verification code sent!");
  };

  const handleVerification = async () => {
    try {
      // In a real app, we would verify the OTP here
      const response = await verifyPhone(phoneNumber, "123456");
      
      if (response.success && response.data?.user) {
        setUserData(response.data.user);
        toast.success("Successfully logged in!");
        
        // Check if it's a new user (no username) or existing user
        if (!response.data.user.username) {
          // New user - redirect to profile edit page
          navigate('/profile/edit');
        } else {
          // Existing user - redirect to data selection page
          navigate('/data-selection');
        }
      } else {
        toast.error("Verification failed. Please try again.");
      }
    } catch (error) {
      console.error('Error during verification:', error);
      toast.error("An error occurred during verification");
    }
  };

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
