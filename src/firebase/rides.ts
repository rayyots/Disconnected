
import { db } from "./config";
import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp, setDoc } from "firebase/firestore";

// Interface for Ride data
export interface Ride {
  id: string;
  userId: string;
  driverId: string | null;
  status: 'searching' | 'matched' | 'arriving' | 'inProgress' | 'completed' | 'cancelled';
  pickupLocation: string;
  dropoffLocation: string;
  pickupCoordinates?: {
    lat: number;
    lng: number;
  };
  dropoffCoordinates?: {
    lat: number;
    lng: number;
  };
  distance: number;
  duration: number;
  baseFare: number;
  dataUsed: number;
  dataCost: number;
  totalCost: number;
  paymentMethod: 'cash' | 'card';
  createdAt: any;
  startedAt: any | null;
  completedAt: any | null;
}

// Create a new ride request
export const createRideRequest = async (
  userId: string,
  pickup: string,
  dropoff: string,
  paymentMethod: 'cash' | 'card'
): Promise<string | null> => {
  try {
    // In a real app, we would calculate these based on actual coordinates
    const distance = Math.round(Math.random() * 8 + 2); // 2-10 km
    const duration = Math.round(distance * 3 + (Math.random() * 10)); // ~3 min per km plus variation
    const baseFare = parseFloat((distance * 2).toFixed(2)); // ~2 EGP per km
    
    const rideData = {
      userId,
      driverId: null,
      status: 'searching',
      pickupLocation: pickup,
      dropoffLocation: dropoff,
      distance,
      duration,
      baseFare,
      dataUsed: 0,
      dataCost: 0,
      totalCost: baseFare,
      paymentMethod,
      createdAt: serverTimestamp(),
      startedAt: null,
      completedAt: null
    };
    
    const rideRef = await addDoc(collection(db, "rides"), rideData);
    return rideRef.id;
  } catch (error) {
    console.error("Error creating ride request", error);
    return null;
  }
};

// Assign a driver to a ride
export const assignDriverToRide = async (
  rideId: string,
  driverId: string
): Promise<boolean> => {
  try {
    await updateDoc(doc(db, "rides", rideId), {
      driverId,
      status: 'matched'
    });
    
    return true;
  } catch (error) {
    console.error("Error assigning driver", error);
    return false;
  }
};

// Update ride status
export const updateRideStatus = async (
  rideId: string,
  status: 'searching' | 'matched' | 'arriving' | 'inProgress' | 'completed' | 'cancelled',
  additionalData: any = {}
): Promise<boolean> => {
  try {
    const updateData: any = { status, ...additionalData };
    
    if (status === 'inProgress') {
      updateData.startedAt = serverTimestamp();
    } else if (status === 'completed') {
      updateData.completedAt = serverTimestamp();
    }
    
    await updateDoc(doc(db, "rides", rideId), updateData);
    return true;
  } catch (error) {
    console.error("Error updating ride status", error);
    return false;
  }
};

// Update ride data usage
export const updateRideDataUsage = async (
  rideId: string,
  dataUsed: number
): Promise<boolean> => {
  try {
    const dataCost = parseFloat((dataUsed * 0.01).toFixed(2)); // 0.01 EGP per MB
    
    // Get current ride to calculate total cost
    const rideDoc = await getDoc(doc(db, "rides", rideId));
    
    if (!rideDoc.exists()) {
      return false;
    }
    
    const ride = rideDoc.data() as Ride;
    const totalCost = parseFloat((ride.baseFare + dataCost).toFixed(2));
    
    await updateDoc(doc(db, "rides", rideId), {
      dataUsed,
      dataCost,
      totalCost
    });
    
    return true;
  } catch (error) {
    console.error("Error updating ride data usage", error);
    return false;
  }
};

// Update user's data usage
export const updateUserDataUsage = async (
  userId: string,
  additionalDataUsed: number
): Promise<boolean> => {
  try {
    // Get current user data
    const userDoc = await getDoc(doc(db, "users", userId));
    
    if (!userDoc.exists()) {
      return false;
    }
    
    const userData = userDoc.data();
    const currentDataUsed = userData.dataUsed || 0;
    const newDataUsed = currentDataUsed + additionalDataUsed;
    
    await updateDoc(doc(db, "users", userId), {
      dataUsed: newDataUsed
    });
    
    // Update localStorage user data
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      user.dataUsed = newDataUsed;
      localStorage.setItem('user', JSON.stringify(user));
    }
    
    return true;
  } catch (error) {
    console.error("Error updating user data usage", error);
    return false;
  }
};
