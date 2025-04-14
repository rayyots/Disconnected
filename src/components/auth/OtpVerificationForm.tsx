
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Clock } from "lucide-react";

interface OtpVerificationFormProps {
  phoneNumber: string;
  onVerify: () => void;
  onChangeNumber: () => void;
}

const OtpVerificationForm = ({ phoneNumber, onVerify, onChangeNumber }: OtpVerificationFormProps) => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimeout, setResendTimeout] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    // Focus the OTP input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
    
    // Start countdown for resend
    let interval: number | undefined;
    if (resendTimeout > 0) {
      interval = window.setInterval(() => {
        setResendTimeout(prev => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const formatPhoneNumber = (phone: string) => {
    // Format phone number for display
    if (phone.length === 10) {
      return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
    }
    return phone;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length < 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid 6-digit verification code",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // For demo, we'll accept any 6-digit code
    setTimeout(() => {
      onVerify();
      setIsLoading(false);
    }, 1500);
  };
  
  const handleResendCode = () => {
    if (!canResend) return;
    
    toast({
      title: "Code Resent",
      description: "A new verification code has been sent to your phone",
    });
    
    setCanResend(false);
    setResendTimeout(60);
    
    // Restart the countdown
    const interval = window.setInterval(() => {
      setResendTimeout(prev => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <div className="text-center mb-4">
        <p className="text-muted-foreground">
          We've sent a verification code to
        </p>
        <p className="font-medium">{formatPhoneNumber(phoneNumber)}</p>
        <button 
          type="button" 
          className="text-sm text-disconnected-light mt-1 hover:underline flex items-center mx-auto gap-1"
          onClick={onChangeNumber}
        >
          <ArrowLeft className="h-3 w-3" />
          Change number
        </button>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="otp">Verification Code</Label>
        <Input
          id="otp"
          ref={inputRef}
          type="text"
          maxLength={6}
          pattern="[0-9]*"
          inputMode="numeric"
          placeholder="Enter 6-digit code"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
          className="bg-muted text-center text-lg tracking-widest"
          required
        />
        <p className="text-xs text-muted-foreground">
          Enter the 6-digit code sent to your phone
        </p>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-disconnected-light text-disconnected-dark hover:bg-disconnected-light/90"
        disabled={isLoading}
      >
        {isLoading ? "Verifying..." : "Verify Code"}
      </Button>
      
      <div className="text-center">
        {canResend ? (
          <button 
            type="button"
            className="text-sm text-disconnected-light hover:underline"
            onClick={handleResendCode}
          >
            Resend code
          </button>
        ) : (
          <div className="flex items-center justify-center text-sm text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            Resend code in {resendTimeout}s
          </div>
        )}
      </div>
    </form>
  );
};

export default OtpVerificationForm;
