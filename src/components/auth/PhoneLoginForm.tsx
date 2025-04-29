
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PhoneLoginFormProps {
  onSubmit: (phoneNumber: string) => void;
}

// Demo users for quick access
const demoUsers = [
  { name: "John Doe", phone: "12345678901", email: "john@example.com" },
  { name: "Jane Smith", phone: "12345678902", email: "jane@example.com" },
  { name: "Alex Johnson", phone: "12345678903", email: "alex@example.com" },
  { name: "Sarah Williams", phone: "12345678904", email: "sarah@example.com" },
  { name: "Michael Brown", phone: "12345678905", email: "michael@example.com" }
];

const PhoneLoginForm = ({ onSubmit }: PhoneLoginFormProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Save the phone number to localStorage
    localStorage.setItem('phoneNumber', phoneNumber);
    
    // Simulate API call
    setTimeout(() => {
      onSubmit(phoneNumber);
      setIsLoading(false);
    }, 1500);
  };

  const selectDemoUser = (phone: string) => {
    setPhoneNumber(phone);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="Enter your phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="bg-muted"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Demo Users</Label>
        <Select onValueChange={selectDemoUser}>
          <SelectTrigger className="bg-muted">
            <SelectValue placeholder="Select a demo user" />
          </SelectTrigger>
          <SelectContent>
            {demoUsers.map((user) => (
              <SelectItem key={user.phone} value={user.phone}>
                {user.name} ({user.phone})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Select a demo user or enter your own phone number
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
