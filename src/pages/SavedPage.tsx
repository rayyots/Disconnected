
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Plus } from "lucide-react";
import { toast } from "sonner";
import SavedAddressForm, { SavedAddress } from "@/components/address/SavedAddressForm";
import SavedAddressList from "@/components/address/SavedAddressList";
import BottomNavBar from "@/components/BottomNavBar";

const SavedPage = () => {
  const navigate = useNavigate();
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  // Handle saving a new address
  const handleSaveAddress = (newAddress: Omit<SavedAddress, 'id'>) => {
    if (editingAddressId) {
      // Update existing address
      setSavedAddresses(prev => 
        prev.map(addr => 
          addr.id === editingAddressId 
            ? { ...newAddress, id: editingAddressId } 
            : addr
        )
      );
      toast.success("Address updated successfully");
    } else {
      // Add new address
      const id = `addr_${Date.now()}`;
      setSavedAddresses(prev => [...prev, { ...newAddress, id }]);
      toast.success("Address saved successfully");
    }
    setShowAddressForm(false);
    setEditingAddressId(null);
  };
  
  // Handle editing an address
  const handleEditAddress = (id: string) => {
    const addressToEdit = savedAddresses.find(addr => addr.id === id);
    if (addressToEdit) {
      setEditingAddressId(id);
      setShowAddressForm(true);
    }
  };
  
  // Handle deleting an address
  const handleDeleteAddress = (id: string) => {
    setSavedAddresses(prev => prev.filter(addr => addr.id !== id));
    toast.success("Address removed");
  };
  
  // Handle selecting an address for ride
  const handleSelectAddress = (address: SavedAddress) => {
    navigate('/home', { state: { selectedAddress: address } });
  };

  return (
    <div className="min-h-screen flex flex-col bg-disconnected-dark pb-16">
      <main className="flex-1 overflow-auto pt-4 px-4">
        <h1 className="text-xl font-bold mb-4 text-center">Saved Addresses</h1>
        
        {showAddressForm ? (
          <Card className="glass-card">
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-4">
                {editingAddressId ? 'Edit Address' : 'Add New Address'}
              </h3>
              <SavedAddressForm 
                onSave={handleSaveAddress}
                onCancel={() => {
                  setShowAddressForm(false);
                  setEditingAddressId(null);
                }}
              />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Your Addresses</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddressForm(true)}
                className="border-disconnected-light text-disconnected-light hover:bg-disconnected-light/10"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Address
              </Button>
            </div>
            
            <Card className="glass-card">
              <CardContent className="p-4">
                <SavedAddressList 
                  addresses={savedAddresses}
                  onEdit={handleEditAddress}
                  onDelete={handleDeleteAddress}
                  onSelect={handleSelectAddress}
                />
              </CardContent>
            </Card>
            
            {savedAddresses.length > 0 && (
              <Button
                className="w-full bg-disconnected-light text-disconnected-dark hover:bg-disconnected-light/90 mt-4"
                onClick={() => navigate('/home')}
              >
                Continue to Ride
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </main>
      
      <BottomNavBar />
    </div>
  );
};

export default SavedPage;
