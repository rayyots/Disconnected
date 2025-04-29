
// This file contains functions to interact with our backend API

// Base URL for our API (would be different in production)
const API_BASE_URL = 'http://localhost:5000/api';

// Interface for API responses
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// User interface for proper typing
export interface User {
  id: string;
  phoneNumber: string;
  email?: string;
  username?: string;
  dataBalance: number;
  rides: any[];
  hasOwnData: boolean;
}

// Function to handle API requests
async function apiRequest<T>(
  endpoint: string, 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any
): Promise<ApiResponse<T>> {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    }
  };
  
  // For GET requests with query parameters
  let url = `${API_BASE_URL}${endpoint}`;
  if (method === 'GET' && data) {
    const params = new URLSearchParams();
    for (const key in data) {
      params.append(key, data[key]);
    }
    url += `?${params.toString()}`;
  } else if (data) {
    // For non-GET requests, add data to body
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Something went wrong'
      };
    }

    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('API request failed:', error);
    return {
      success: false,
      error: 'Network error occurred'
    };
  }
}

// Auth APIs
export async function verifyPhone(phoneNumber: string, code: string): Promise<ApiResponse<{user: User}>> {
  const response = await apiRequest<{user: User}>('/auth/verify', 'POST', { phoneNumber, code });
  if (response.success && response.data?.user) {
    // Store the phone number in localStorage for future use
    localStorage.setItem('phoneNumber', phoneNumber);
  }
  return response;
}

// User APIs
export async function setDataPreference(phoneNumber: string, hasOwnData: boolean) {
  return apiRequest('/users/data-preference', 'POST', { phoneNumber, hasOwnData });
}

export async function updateUserProfile(phoneNumber: string, userData: {
  username?: string;
  email?: string;
}) {
  return apiRequest<{user: User}>('/users/profile', 'POST', { 
    phoneNumber,
    ...userData
  });
}

// Ride APIs
export async function completeRide(phoneNumber: string, ride: any) {
  return apiRequest('/rides/complete', 'POST', { phoneNumber, ride });
}

// Get ride history with proper typing
export interface RideHistoryItem {
  id: string;
  pickupLocation: string;
  dropoffLocation: string;
  distance: number;
  duration: number;
  baseFare: number;
  dataUsed: number;
  dataCost: number;
  totalCost: number;
  paymentMethod: string;
  date: string;
}

export interface RideHistoryResponse {
  rides: RideHistoryItem[];
}

export async function getRideHistory(phoneNumber: string) {
  return apiRequest<RideHistoryResponse>('/rides/history', 'GET', { phoneNumber });
}

// Get user data
export async function getUserData(phoneNumber: string) {
  return apiRequest<{user: User}>('/users/data', 'GET', { phoneNumber });
}

// Note: In a real application, we would add proper error handling,
// retry logic, authentication tokens, etc.
