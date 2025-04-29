
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

interface DataContextType {
  hasMobileData: boolean;
  dataSimulationActive: boolean;
  totalData: number;
  usedData: number;
  dataActivationTime: number | null;
  setHasMobileData: (value: boolean) => void;
  setDataSimulationActive: (value: boolean) => void;
  setTotalData: (value: number) => void;
  setUsedData: (value: number) => void;
  resetUsedData: () => void;
  incrementUsedData: (amount: number) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const [hasMobileData, setHasMobileData] = useState<boolean>(false);
  const [dataSimulationActive, setDataSimulationActive] = useState<boolean>(false);
  const [totalData, setTotalData] = useState<number>(500);
  const [usedData, setUsedData] = useState<number>(0);
  const [dataActivationTime, setDataActivationTime] = useState<number | null>(null);

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

  const resetUsedData = () => {
    setUsedData(0);
  };

  const incrementUsedData = (amount: number) => {
    if (dataSimulationActive) {
      setUsedData(prev => {
        if (prev < totalData) {
          return prev + amount;
        }
        return prev;
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
        setHasMobileData,
        setDataSimulationActive,
        setTotalData,
        setUsedData,
        resetUsedData,
        incrementUsedData
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
