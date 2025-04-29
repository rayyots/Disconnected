
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Logo from "@/components/Logo";
import PhoneLoginForm from "@/components/auth/PhoneLoginForm";
import OtpVerificationForm from "@/components/auth/OtpVerificationForm";
import { toast } from "sonner";

const AuthPage = () => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate();

  const handlePhoneSubmit = (phone: string) => {
    setPhoneNumber(phone);
    setStep('otp');
    toast.success("Verification code sent!");
  };

  const handleVerification = () => {
    // In a real app, we would store authentication tokens here
    toast.success("Successfully logged in!");
    // Redirect to data selection page instead of home page
    navigate('/data-selection');
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
