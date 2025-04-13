
import React from 'react';
import { Home, Building, MapPin, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SavedAddress } from './SavedAddressForm';

interface SavedAddressListProps {
  addresses: SavedAddress[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onSelect: (address: SavedAddress) => void;
}

const SavedAddressList = ({ addresses, onEdit, onDelete, onSelect }: SavedAddressListProps) => {
  if (addresses.length === 0) {
    return (
      <div className="text-center py-8">
        <MapPin className="h-12 w-12 mx-auto text-muted-foreground" />
        <h3 className="mt-4 font-medium">No saved addresses</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Add your frequently visited places for quick access
        </p>
      </div>
    );
  }
  
  const addressTypeIcons = {
    home: Home,
    work: Building,
    other: MapPin,
  };
  
  return (
    <div className="space-y-3">
      {addresses.map((address) => {
        const Icon = addressTypeIcons[address.type];
        
        return (
          <div 
            key={address.id}
            className="border border-border rounded-lg p-3 hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div 
                className="flex-1 cursor-pointer"
                onClick={() => onSelect(address)}
              >
                <div className="flex items-center">
                  <div className="bg-muted rounded-full p-2 mr-3">
                    <Icon className="h-4 w-4 text-disconnected-light" />
                  </div>
                  <div>
                    <div className="font-medium">{address.label}</div>
                    <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                      {address.address}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-1">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-white"
                  onClick={() => onEdit(address.id)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => onDelete(address.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SavedAddressList;
