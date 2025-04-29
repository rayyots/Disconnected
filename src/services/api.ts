
// This file contains functions to interact with our backend API

// Base URL for our API (would be different in production)
const API_BASE_URL = 'http://localhost:5000/api';

// Interface for API responses
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Function to handle API requests
async function apiRequest<T>(
  endpoint: string, 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });

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
export async function verifyPhone(phoneNumber: string, code: string) {
  return apiRequest('/auth/verify', 'POST', { phoneNumber, code });
}

// User APIs
export async function setDataPreference(phoneNumber: string, hasOwnData: boolean) {
  return apiRequest('/users/data-preference', 'POST', { phoneNumber, hasOwnData });
}

// Ride APIs
export async function completeRide(phoneNumber: string, ride: any) {
  return apiRequest('/rides/complete', 'POST', { phoneNumber, ride });
}

// New function to get ride history
export async function getRideHistory(phoneNumber: string) {
  return apiRequest('/rides/history', 'GET', { phoneNumber });
}

// Note: In a real application, we would add proper error handling,
// retry logic, authentication tokens, etc.
