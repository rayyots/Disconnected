
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { useData } from "@/context/DataContext";
import { updateUserProfile, getUserData } from "@/services/api";

const ProfileEditPage = () => {
  const navigate = useNavigate();
  const { userData, setTotalData } = useData();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const phoneNumber = localStorage.getItem('phoneNumber');
      if (!phoneNumber) {
        toast.error("User not logged in");
        navigate('/auth');
        return;
      }
      
      try {
        const response = await getUserData(phoneNumber);
        if (response.success && response.data?.user) {
          setFormData({
            username: response.data.user.username || '',
            email: response.data.user.email || '',
            phoneNumber: response.data.user.phoneNumber || phoneNumber
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const phoneNumber = localStorage.getItem('phoneNumber');
      if (!phoneNumber) {
        toast.error("User not logged in");
        navigate('/auth');
        return;
      }
      
      const response = await updateUserProfile(phoneNumber, formData);
      if (response.success) {
        toast.success("Profile updated successfully");
        navigate('/profile');
      } else {
        toast.error(response.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while updating your profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-disconnected-dark">
        <p className="text-white">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-disconnected-dark">
      <header className="sticky top-0 z-10 bg-disconnected-dark/80 backdrop-blur-sm border-b border-border p-4">
        <div className="flex justify-between items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground hover:text-white"
            onClick={handleBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-medium">Edit Profile</h1>
          <div className="w-10"></div> {/* Placeholder for symmetry */}
        </div>
      </header>
      
      <main className="flex-1 overflow-auto p-4">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">Phone number cannot be changed</p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-disconnected-light text-disconnected-dark hover:bg-disconnected-light/90"
                disabled={saving}
              >
                {saving ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ProfileEditPage;
