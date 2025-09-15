// API configuration and helper functions
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api';
// console.log('🌐 API Base URL:', API_BASE_URL);

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  return !!token;
};

// Set auth token in localStorage
export const setAuthToken = (token: string) => {
  localStorage.setItem('auth_token', token);
};

// Remove auth token
export const removeAuthToken = () => {
  localStorage.removeItem('auth_token');
};

// API request wrapper with auth
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const url = `${API_BASE_URL}${endpoint}`;
  // console.log('🚀 API Request:', url);
  
  const config: RequestInit = {
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  // console.log('📤 Request config:', config);

  try {
    const response = await fetch(url, config);
        // console.log('📥 Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      if (response.status === 401) {
        // Unauthorized - redirect to login
        removeAuthToken();
        window.location.href = '/login';
        return;
      }
      const error = await response.json().catch(() => ({ 
        message: `HTTP ${response.status}: ${response.statusText}` 
      }));
      // console.error('❌ API Error:', error);
      throw new Error(error.message || 'API request failed');
    }

    const result = await response.json();
    // console.log('✅ API Success:', result);
    return result;
  } catch (error) {
    // console.error('💥 Request failed:', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      // Network error - backend is likely down
      removeAuthToken(); // Clear invalid token
      throw new Error('سرور در دسترس نیست - لطفاً بعداً تلاش کنید');
    }
    throw error;
  }
};

// Authentication API
export const authAPI = {
  register: async (data: { email: string; password: string; name: string }) => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (response.success && response.data?.token) {
      setAuthToken(response.data.token);
    }
    
    return response;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (response.success && response.data?.token) {
      setAuthToken(response.data.token);
    }
    
    return response;
  },

  logout: () => {
    removeAuthToken();
    window.location.href = '/login';
  },

  getProfile: async () => {
    return apiRequest('/users/profile', {
      method: 'GET',
    });
  },

  updateProfile: async (data: { name?: string; email?: string; habits?: string; profilePicture?: string }) => {
    return apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// Tasks API
export const tasksAPI = {
  getAll: async (params?: { status?: string; priority?: string; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    // Convert priority to uppercase for backend compatibility if present
    if (params?.priority && params?.priority !== 'all') {
      searchParams.set('priority', params.priority.toUpperCase());
    }
    if (params?.search) searchParams.set('search', params.search);
    
    const queryString = searchParams.toString();
    const endpoint = `/tasks${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiRequest(endpoint);
    
    // Convert priorities back to lowercase for frontend consistency
    if (response.success && response.data) {
      response.data = response.data.map((task: any) => ({
        ...task,
        priority: task.priority?.toLowerCase() || 'medium'
      }));
    }
    
    return response;
  },

  create: async (data: { title: string; description?: string; priority: string; dueDate?: string; notifyAt?: string }) => {
    // Convert priority to uppercase for backend compatibility
    const apiData = {
      ...data,
      priority: data.priority.toUpperCase()
    };
    
    const response = await apiRequest('/tasks', {
      method: 'POST',
      body: JSON.stringify(apiData),
    });
    
    // Convert priority back to lowercase for frontend consistency
    if (response.success && response.data) {
      response.data.priority = response.data.priority.toLowerCase();
    }
    
    return response;
  },

  update: async (id: string, data: Partial<{ title: string; description?: string; priority: string; dueDate?: string; notifyAt?: string; isCompleted: boolean }>) => {
    // Convert priority to uppercase for backend compatibility if present
    const apiData = { ...data };
    if (apiData.priority) {
      apiData.priority = apiData.priority.toUpperCase();
    }
    
    const response = await apiRequest(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(apiData),
    });
    
    // Convert priority back to lowercase for frontend consistency
    if (response.success && response.data) {
      response.data.priority = response.data.priority.toLowerCase();
    }
    
    return response;
  },

  delete: async (id: string) => {
    return apiRequest(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },

  toggleComplete: async (id: string) => {
    const response = await apiRequest(`/tasks/${id}/toggle`, {
      method: 'PATCH',
    });
    
    // Convert priority back to lowercase for frontend consistency
    if (response.success && response.data) {
      response.data.priority = response.data.priority?.toLowerCase() || 'medium';
    }
    
    return response;
  },
};

// Notes API  
export const notesAPI = {
  getAll: async () => {
    return apiRequest('/notes');
  },

  create: async (data: { topic: string }) => {
    return apiRequest('/notes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: { topic: string }) => {
    return apiRequest(`/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/notes/${id}`, {
      method: 'DELETE',
    });
  },

  addEntry: async (topicId: string, data: { content: string }) => {
    return apiRequest(`/notes/${topicId}/entries`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  deleteEntry: async (topicId: string, entryId: string) => {
    return apiRequest(`/notes/${topicId}/entries/${entryId}`, {
      method: 'DELETE',
    });
  },
};

// User API
export const userAPI = {
  getProfile: async () => {
    return apiRequest('/users/profile');
  },

  updateProfile: async (data: { name?: string; habits?: string; profilePicture?: string }) => {
    return apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    return apiRequest('/users/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Journal API
export const journalAPI = {
  getAll: async () => {
    return apiRequest('/journal');
  },

  create: async (data: { content: string }) => {
    return apiRequest('/journal', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: { content: string }) => {
    return apiRequest(`/journal/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/journal/${id}`, {
      method: 'DELETE',
    });
  },
};

// Admin API
export const adminAPI = {
  getUsers: async () => {
    return apiRequest('/admin/users');
  },

  getStats: async () => {
    return apiRequest('/admin/stats');
  },

  getActivities: async () => {
    return apiRequest('/admin/activities');
  },

  deleteUser: async (id: string) => {
    return apiRequest(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  },

  updateUserRole: async (id: string, role: 'USER' | 'ADMIN') => {
    return apiRequest(`/admin/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  },
};

// Telegram Settings API
export const telegramAPI = {
  getSettings: async () => {
    return apiRequest('/users/telegram-settings');
  },

  updateSettings: async (data: { telegramBotToken: string; telegramUserId: string }) => {
    return apiRequest('/users/telegram-settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  testConnection: async () => {
    return apiRequest('/users/test-telegram', {
      method: 'POST',
    });
  },
};
