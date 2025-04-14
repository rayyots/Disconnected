
import { useState, useEffect } from 'react';
import { updateUserDataUsage } from "@/firebase/rides";

interface UseDataUsageProps {
  userId: string | null;
  initialUsedData: number;
}

const useDataUsage = ({ userId, initialUsedData }: UseDataUsageProps) => {
  const [totalData, setTotalData] = useState(500); // 500 MB data balance
  const [usedData, setUsedData] = useState(initialUsedData);

  // Simulate data usage - start from the moment the app loads
  useEffect(() => {
    if (!userId) return;
    
    const interval = setInterval(async () => {
      const dataIncrement = 0.5; // 0.5 MB every 30 seconds
      
      setUsedData(prev => {
        const newValue = prev + dataIncrement;
        
        // Update user data in Firebase
        if (userId) {
          updateUserDataUsage(userId, dataIncrement);
        }
        
        return newValue;
      });
    }, 30000);
    
    return () => clearInterval(interval);
  }, [userId]);

  return {
    totalData,
    usedData,
    setUsedData
  };
};

export default useDataUsage;
