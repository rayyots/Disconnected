
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { getUserData, User } from '@/services/api';
import { toast } from 'sonner';

interface DataContextType {
  hasMobileData: boolean;
  dataSimulationActive: boolean;
  totalData: number;
  usedData: number;
  dataActivationTime: number | null;
  userData: User | null;
  setHasMobileData: (value: boolean) => void;
  setDataSimulationActive: (value: boolean) => void;
  setTotalData: (value: number) => void;
  setUsedData: (value: number) => void;
  resetUsedData: () => void;
  incrementUsedData: (amount: number) => void;
  setUserData: (user: User | null) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const [hasMobileData, setHasMobileData] = useState<boolean>(false);
  const [dataSimulationActive, setDataSimulationActive] = useState<boolean>(false);
  const [totalData, setTotalData] = useState<number>(500);
  const [usedData, setUsedData] = useState<number>(0);
  const [dataActivationTime, setDataActivationTime] = useState<number | null>(null);
  const [userData, setUserData] = useState<User | null>(null);

  // Check for data status from navigation state
  useEffect(() => {
    if (location.state) {
      const { hasMobileData: hasData, dataSimulationActive: isActive, dataActivationTime: activationTime } = 
        location.state as { 
          hasMobileData?: boolean; 
          dataSimulationActive?: boolean;
          dataActivationTime?: number;
        };
      
      if (hasData !== undefined) setHasMobileData(hasData);
      if (isActive !== undefined) setDataSimulationActive(isActive);
      if (activationTime !== undefined) setDataActivationTime(activationTime);
    }
  }, [location.state]);

  // Fetch user data when context loads
  useEffect(() => {
    const fetchUserData = async () => {
      const phoneNumber = localStorage.getItem('phoneNumber');
      if (phoneNumber) {
        try {
          const response = await getUserData(phoneNumber);
          if (response.success && response.data?.user) {
            setUserData(response.data.user);
            setTotalData(response.data.user.dataBalance);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, []);

  const resetUsedData = () => {
    setUsedData(0);
  };

  const incrementUsedData = (amount: number) => {
    if (dataSimulationActive) {
      setUsedData(prev => {
        const newUsed = prev + amount;
        if (newUsed >= totalData) {
          toast.error("Data limit reached!");
          return totalData;
        }
        return newUsed;
      });
    }
  };

  return (
    <DataContext.Provider
      value={{
        hasMobileData,
        dataSimulationActive,
        totalData,
        usedData,
        dataActivationTime,
        userData,
        setHasMobileData,
        setDataSimulationActive,
        setTotalData,
        setUsedData,
        resetUsedData,
        incrementUsedData,
        setUserData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
