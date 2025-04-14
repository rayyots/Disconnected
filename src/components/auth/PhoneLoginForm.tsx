
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Phone } from "lucide-react";

interface PhoneLoginFormProps {
  onSubmit: (phoneNumber: string) => void;
}

const PhoneLoginForm = ({ onSubmit }: PhoneLoginFormProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Improved phone validation - strip non-numeric characters first
    const cleanedNumber = phoneNumber.replace(/\D/g, '');
    
    if (!cleanedNumber || cleanedNumber.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number with at least 10 digits",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      onSubmit(cleanedNumber);
      setIsLoading(false);
    }, 1500);
  };

  const formatPhoneNumber = (value: string) => {
    // Format as user types: (123) 456-7890
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    } else {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedNumber = formatPhoneNumber(e.target.value);
    setPhoneNumber(formattedNumber);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            id="phone"
            type="tel"
            placeholder="(555) 123-4567"
            value={phoneNumber}
            onChange={handlePhoneChange}
            className="bg-muted pl-10"
            autoComplete="tel"
            required
          />
        </div>
        <p className="text-xs text-muted-foreground">
          We'll send a verification code to this number
        </p>
      </div>
      <Button 
        type="submit" 
        className="w-full bg-disconnected-light text-disconnected-dark hover:bg-disconnected-light/90"
        disabled={isLoading}
      >
        {isLoading ? "Sending Code..." : "Send Verification Code"}
      </Button>
    </form>
  );
};

export default PhoneLoginForm;
