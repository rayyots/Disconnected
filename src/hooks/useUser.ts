
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

interface User {
  name: string;
  email?: string;
  phone?: string;
  dataUsed: number;
  [key: string]: any;
}

const useUser = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication and get user data
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userData = localStorage.getItem('user');
    const userIdFromStorage = localStorage.getItem('userId');
    
    if (!isAuthenticated || !userData) {
      navigate('/auth');
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      if (userIdFromStorage) {
        setUserId(userIdFromStorage);
      }
      
      setIsLoading(false);
    } catch (e) {
      console.error("Error parsing user data", e);
      navigate('/auth');
    }
  }, [navigate]);

  // Update user in local storage
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return {
    user,
    userId,
    isLoading,
    updateUser
  };
};

export default useUser;
