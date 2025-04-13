
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Banknote } from "lucide-react";

interface PaymentMethodSelectorProps {
  value: 'cash' | 'card';
  onChange: (value: 'cash' | 'card') => void;
}

const PaymentMethodSelector = ({ value, onChange }: PaymentMethodSelectorProps) => {
  return (
    <RadioGroup
      value={value}
      onValueChange={(val) => onChange(val as 'cash' | 'card')}
      className="flex gap-4"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="cash" id="cash" />
        <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer">
          <Banknote className="h-4 w-4" />
          Cash
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="card" id="card" />
        <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
          <CreditCard className="h-4 w-4" />
          Card
        </Label>
      </div>
    </RadioGroup>
  );
};

export default PaymentMethodSelector;
