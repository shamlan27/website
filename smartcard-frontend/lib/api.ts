const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

// Helper function to get auth headers
const getHeaders = (includeAuth = false): HeadersInit => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
  
  if (includeAuth) {
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

export const authAPI = {
  // Register new user
  register: async (firstname: string, lastname: string, email: string, password: string, password_confirmation: string) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ firstname, lastname, email, password, password_confirmation })
      });
      
      console.log('Register response status:', response.status);
      console.log('Register response headers:', response.headers);
      
      const data = await response.json();
      console.log('Register response data:', data);
      
      if (response.ok && data.token) {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        // Dispatch custom event to update UI immediately
        window.dispatchEvent(new CustomEvent('auth-change'));
      }
      
      return data;
    } catch (error) {
      console.error('Register API error:', error);
      throw error;
    }
  },

  // Login user
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    
    if (response.ok && data.token) {
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      // Dispatch custom event to update UI immediately
      window.dispatchEvent(new CustomEvent('auth-change'));
    }
    
    return data;
  },

  // Get current user
  getUser: async () => {
    const response = await fetch(`${API_URL}/user`, {
      headers: getHeaders(true)
    });
    return response.json();
  },

  // Logout
  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    // Dispatch custom event to update UI immediately
    window.dispatchEvent(new CustomEvent('auth-change'));
  },

  // Check if user is logged in
  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token');
  },

  // Delete account
  deleteAccount: async (data: { code: string; password?: string }) => {
    const response = await fetch(`${API_URL}/user/delete-account`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(data)
    });
    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to delete account');
    }
    return responseData;
  },

  // Request account deletion (sends verification code)
  requestDeleteAccount: async () => {
    const response = await fetch(`${API_URL}/user/request-delete`, {
      method: 'POST',
      headers: getHeaders(true)
    });
    return response.json();
  },

  // Social login - redirect to backend OAuth provider
  socialLogin: (provider: 'google' | 'facebook') => {
    window.location.href = `${API_URL}/auth/${provider}`;
  },

  // Handle OAuth callback
  handleOAuthCallback: async (token: string, user: any) => {
    if (token) {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(user));
      // Dispatch custom event to update UI immediately
      window.dispatchEvent(new CustomEvent('auth-change'));
      return true;
    }
    return false;
  }
};

export const cardsAPI = {
  // Get all cards
  getAll: async () => {
    const response = await fetch(`${API_URL}/cards`, {
      headers: getHeaders(true)
    });
    return response.json();
  },

  // Create new card
  create: async (cardData: any) => {
    const response = await fetch(`${API_URL}/cards`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(cardData)
    });
    return response.json();
  }
};

// Order interfaces
export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface Order {
  id: number;
  order_id: string;
  user_id: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  items: OrderItem[];
  shipping_address: any;
  billing_address: any;
  payment_method: string;
  tracking_number?: string;
  cancellation_reason?: string;
  cancellation_comment?: string;
  refund_method?: string;
  refund_days?: number;
  created_at: string;
  updated_at: string;
}

export const ordersAPI = {
  // Get all orders for current user
  getAll: async () => {
    const response = await fetch(`${API_URL}/orders`, {
      headers: getHeaders(true)
    });
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  },

  // Get single order
  getById: async (orderId: string) => {
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      headers: getHeaders(true)
    });
    if (!response.ok) throw new Error('Failed to fetch order');
    return response.json();
  },

  // Create order (from checkout)
  create: async (orderData: {
    items: any[];
    shipping_address: any;
    billing_address: any;
    payment_method: string;
    total_amount: number;
  }) => {
    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify(orderData)
      });
      
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        throw new Error('Invalid response from server');
      }
      
      if (!response.ok) {
        const errorMessage = data?.message || data?.error || `Server error: ${response.status}`;
        throw new Error(errorMessage);
      }
      
      // Send order confirmation email (only if backend returns order)
      if (data.order && data.order.order_id) {
        try {
          await ordersAPI.sendOrderEmail(data.order.order_id);
        } catch (emailError) {
          console.error('Failed to send order email:', emailError);
          // Don't fail the order if email fails
        }
      }
      
      return data;
    } catch (error: any) {
      console.error('Create order error:', error);
      throw error;
    }
  },

  // Cancel order
  cancel: async (orderId: string, cancellationData: {
    reason: string;
    comment?: string;
    refund_method: string;
  }) => {
    const response = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(cancellationData)
    });
    if (!response.ok) throw new Error('Failed to cancel order');
    const data = await response.json();
    
    // Send cancellation email
    await ordersAPI.sendCancellationEmail(orderId);
    
    return data;
  },

  // Update tracking
  updateTracking: async (orderId: string, trackingNumber: string) => {
    const response = await fetch(`${API_URL}/orders/${orderId}/tracking`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify({ tracking_number: trackingNumber })
    });
    if (!response.ok) throw new Error('Failed to update tracking');
    return response.json();
  },

  // Send order confirmation email
  sendOrderEmail: async (orderId: string) => {
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}/send-invoice`, {
        method: 'POST',
        headers: getHeaders(true)
      });
      if (!response.ok) {
        console.warn('Failed to send order email');
      }
      return response.json();
    } catch (error) {
      console.error('Send order email error:', error);
      return { success: false };
    }
  },

  // Send cancellation email
  sendCancellationEmail: async (orderId: string) => {
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}/send-cancellation`, {
        method: 'POST',
        headers: getHeaders(true)
      });
      if (!response.ok) {
        console.warn('Failed to send cancellation email');
      }
      return response.json();
    } catch (error) {
      console.error('Send cancellation email error:', error);
      return { success: false };
    }
  }
};