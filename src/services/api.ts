const API_BASE_URL = 'http://localhost:5000/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface User {
  id: string;
  phoneNumber: string;
  email?: string;
  username?: string;
  dataBalance: number;
  hasOwnData: boolean;
  savedAddresses: SavedAddress[];
}

export interface SavedAddress {
  _id: string;
  label: string;
  address: string;
  type: 'home' | 'work' | 'other';
}

export interface RideHistoryItem {
  _id: string;
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

async function apiRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: Record<string, unknown>
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('token');
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token || ''
    }
  };

  let url = `${API_BASE_URL}${endpoint}`;
  
  if (method === 'GET' && data) {
    const params = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    url += `?${params.toString()}`;
  } else if (data && method !== 'GET') {
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

    return { success: true, data: result };
  } catch (error) {
    console.error('API request failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Network error' 
    };
  }
}

// Auth APIs
export const authApi = {
  verifyPhone: (phoneNumber: string) => 
    apiRequest<{ message: string }>('/auth/verify', 'POST', { phoneNumber }),
  login: (phoneNumber: string, code: string) =>
    apiRequest<{ user: User; token: string }>('/auth/login', 'POST', { phoneNumber, code })
};

// User APIs
export const userApi = {
  get: () => apiRequest<{ user: User }>('/users/data'),
  updateDataPreference: (hasOwnData: boolean) =>
    apiRequest<User>('/users/data-preference', 'POST', { hasOwnData }),
  addresses: {
    get: () => apiRequest<{ addresses: SavedAddress[] }>('/users/addresses'),
    create: (address: Omit<SavedAddress, '_id'>) =>
      apiRequest<{ addresses: SavedAddress[] }>('/users/addresses', 'POST', address),
    delete: (id: string) =>
      apiRequest<{ addresses: SavedAddress[] }>(`/users/addresses/${id}`, 'DELETE')
  }
};

// Ride APIs
export const rideApi = {
  complete: (ride: Omit<RideHistoryItem, '_id' | 'date'>) =>
    apiRequest<RideHistoryItem>('/rides/complete', 'POST', {
      ...ride,
      date: new Date().toISOString()
    }),
  getHistory: () => apiRequest<{ rides: RideHistoryItem[] }>('/rides/history')
};