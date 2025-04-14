
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface OtpVerificationFormProps {
  phoneNumber: string;
  onVerify: () => void;
  onChangeNumber: () => void;
}

const OtpVerificationForm = ({ phoneNumber, onVerify, onChangeNumber }: OtpVerificationFormProps) => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const formatPhoneNumber = (phone: string) => {
    // Simple formatting, can be improved for different country codes
    const last4 = phone.slice(-4);
    const middle3 = phone.slice(-7, -4);
    const first3 = phone.slice(0, -7);
    return `${first3}-${middle3}-${last4}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length < 4) {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid verification code",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // For demo, we'll accept any code
    setTimeout(() => {
      onVerify();
      setIsLoading(false);
    }, 1500);
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
          className="text-sm text-disconnected-light mt-1 hover:underline"
          onClick={onChangeNumber}
        >
          Change number
        </button>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="otp">Verification Code</Label>
        <Input
          id="otp"
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
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-disconnected-light text-disconnected-dark hover:bg-disconnected-light/90"
        disabled={isLoading}
      >
        {isLoading ? "Verifying..." : "Verify Code"}
      </Button>
      
      <div className="text-center">
        <button 
          type="button"
          className="text-sm text-disconnected-light hover:underline"
          onClick={() => {
            toast({
              title: "Code Resent",
              description: "A new verification code has been sent to your phone",
            });
          }}
        >
          Resend code
        </button>
      </div>
    </form>
  );
};

export default OtpVerificationForm;
