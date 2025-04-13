
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Home, Building, MapPin } from "lucide-react";
import { toast } from "sonner";

export interface SavedAddress {
  id: string;
  label: string;
  address: string;
  type: 'home' | 'work' | 'other';
}

interface SavedAddressFormProps {
  onSave: (address: Omit<SavedAddress, 'id'>) => void;
  onCancel: () => void;
}

const SavedAddressForm = ({ onSave, onCancel }: SavedAddressFormProps) => {
  const [addressType, setAddressType] = useState<'home' | 'work' | 'other'>('home');
  
  const form = useForm({
    defaultValues: {
      label: '',
      address: '',
    }
  });
  
  const handleSubmit = (data: { label: string; address: string }) => {
    if (!data.address.trim()) {
      toast.error("Please enter an address");
      return;
    }
    
    onSave({
      label: data.label || addressTypeLabels[addressType],
      address: data.address,
      type: addressType,
    });
  };
  
  const addressTypeLabels = {
    home: 'Home',
    work: 'Work',
    other: 'Other',
  };
  
  const addressTypeIcons = {
    home: Home,
    work: Building,
    other: MapPin,
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label>Address Type</Label>
          <div className="flex space-x-2">
            {(['home', 'work', 'other'] as const).map((type) => {
              const Icon = addressTypeIcons[type];
              return (
                <Button
                  key={type}
                  type="button"
                  variant={addressType === type ? "secondary" : "outline"}
                  className={addressType === type ? "bg-disconnected-light text-disconnected-dark" : ""}
                  onClick={() => setAddressType(type)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {addressTypeLabels[type]}
                </Button>
              );
            })}
          </div>
        </div>
        
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label (optional)</FormLabel>
              <FormControl>
                <Input 
                  placeholder={addressTypeLabels[addressType]} 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter full address" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex space-x-2 pt-2">
          <Button 
            type="button" 
            variant="outline" 
            className="flex-1"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="flex-1 bg-disconnected-light text-disconnected-dark hover:bg-disconnected-light/90"
          >
            Save Address
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SavedAddressForm;
