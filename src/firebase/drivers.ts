
import { db } from "./config";
import { collection, query, getDocs, doc, getDoc, updateDoc, where, limit as firestoreLimit } from "firebase/firestore";

// Interface for Driver data
export interface Driver {
  id: string;
  name: string;
  phoneNumber: string;
  avatar?: string;
  rating: number;
  carModel: string;
  licensePlate: string;
  currentLocation: {
    lat: number;
    lng: number;
  };
  available: boolean;
  status: 'available' | 'busy' | 'offline';
}

// Fetch available drivers near a location
export const getAvailableDrivers = async (
  pickupLocation: string,
  limitCount: number = 5
): Promise<Driver[]> => {
  try {
    // In a real app, we would filter by location proximity
    // For this demo, we'll just get the first 5 available drivers
    const driversRef = collection(db, "drivers");
    const q = query(
      driversRef,
      where("status", "==", "available"),
      where("available", "==", true),
      firestoreLimit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const drivers: Driver[] = [];
    
    querySnapshot.forEach((doc) => {
      drivers.push({
        id: doc.id,
        ...doc.data()
      } as Driver);
    });
    
    return drivers;
  } catch (error) {
    console.error("Error fetching available drivers", error);
    return [];
  }
};

// Get a specific driver by ID
export const getDriverById = async (driverId: string): Promise<Driver | null> => {
  try {
    const driverDoc = await getDoc(doc(db, "drivers", driverId));
    
    if (!driverDoc.exists()) {
      return null;
    }
    
    return {
      id: driverDoc.id,
      ...driverDoc.data()
    } as Driver;
  } catch (error) {
    console.error("Error fetching driver", error);
    return null;
  }
};

// Update driver status
export const updateDriverStatus = async (
  driverId: string,
  status: 'available' | 'busy' | 'offline'
): Promise<boolean> => {
  try {
    await updateDoc(doc(db, "drivers", driverId), {
      status,
      available: status === 'available'
    });
    
    return true;
  } catch (error) {
    console.error("Error updating driver status", error);
    return false;
  }
};
