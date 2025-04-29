
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Settings, LogOut, CreditCard, Bell, HelpCircle, Calendar, Shield, User, MapPin } from "lucide-react";
import { toast } from "sonner";
import DataUsageIndicator from "@/components/DataUsageIndicator";
import BottomNavBar from "@/components/BottomNavBar";
import { getUserData } from "@/services/api";
import { useData } from "@/context/DataContext";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { userData, totalData, usedData } = useData();
  const [loading, setLoading] = useState(true);
  
  // Fetch user data on component mount
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
        await getUserData(phoneNumber);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user profile");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('phoneNumber');
    toast.success("Logged out successfully");
    navigate('/');
  };
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!userData || !userData.username) return "U";
    
    const nameParts = userData.username.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return nameParts[0][0].toUpperCase();
  };
  
  const profileSections = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Personal Information', action: () => navigate('/profile/edit') },
        { icon: CreditCard, label: 'Payment Methods', action: () => toast.info("Coming soon") },
        { icon: MapPin, label: 'Saved Places', action: () => navigate('/saved') },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { icon: Bell, label: 'Notifications', action: () => toast.info("Coming soon") },
        { icon: Settings, label: 'App Settings', action: () => toast.info("Coming soon") },
        { icon: Calendar, label: 'Scheduled Rides', action: () => toast.info("Coming soon") },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help Center', action: () => toast.info("Coming soon") },
        { icon: Shield, label: 'Safety Center', action: () => toast.info("Coming soon") },
      ]
    }
  ];
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-disconnected-dark">
        <p className="text-white">Loading profile...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-disconnected-dark pb-16">
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
          <h1 className="text-lg font-medium">Profile</h1>
          <div className="w-10"></div> {/* Placeholder for symmetry */}
        </div>
      </header>
      
      <main className="flex-1 overflow-auto p-4 space-y-4">
        <Card className="glass-card overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-disconnected-light/80 to-disconnected-light/40 p-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16 border-2 border-white">
                  <AvatarImage src="" alt="Profile" />
                  <AvatarFallback className="bg-disconnected-dark/50 text-white text-xl">{getUserInitials()}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold text-white">{userData?.username || "New User"}</h2>
                  <p className="text-white/80">{userData?.email || "No email provided"}</p>
                  <div className="flex items-center mt-1">
                    <p className="text-xs bg-white/20 px-2 py-0.5 rounded-full text-white">⭐ 4.94 Rating</p>
                    <span className="mx-2 text-white/50">•</span>
                    <p className="text-xs text-white/90">Member since 2025</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <DataUsageIndicator 
                totalData={totalData} 
                usedData={usedData}
                className="mb-4" 
              />
              
              <Button variant="outline" className="w-full border-disconnected-light text-disconnected-light hover:bg-disconnected-light/10">
                Upgrade Data Plan
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          {profileSections.map((section, index) => (
            <Card key={index} className="glass-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ul>
                  {section.items.map((item, itemIndex) => {
                    const Icon = item.icon;
                    return (
                      <li key={itemIndex} className="border-t border-border first:border-0">
                        <button
                          onClick={item.action}
                          className="w-full p-4 flex items-center justify-between text-left hover:bg-disconnected-light/5 transition-colors"
                        >
                          <div className="flex items-center">
                            <Icon className="h-5 w-5 mr-3 text-disconnected-light" />
                            <span>{item.label}</span>
                          </div>
                          <span className="text-muted-foreground">›</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          ))}
          
          <Button 
            variant="ghost" 
            className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-2" />
            Sign Out
          </Button>
        </div>
      </main>
      
      <BottomNavBar />
    </div>
  );
};

export default ProfilePage;
