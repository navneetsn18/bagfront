const API_BASE_URL = 'http://localhost:8000';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: Omit<RequestInit, 'body'> & { body?: any } = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Prepare the config
    const config: RequestInit = {
      method: options.method || 'GET',
      headers: {
        ...options.headers,
        'Content-Type': 'application/json', // Ensure this is always last to override any other Content-Type
      },
    };
    
    // Handle body serialization
    if (options.body !== undefined) {
      if (typeof options.body === 'object' && !(options.body instanceof FormData)) {
        config.body = JSON.stringify(options.body);
      } else {
        config.body = options.body;
      }
    }

    console.log('🚀 API Request:', {
      method: config.method || 'GET',
      url,
      headers: config.headers,
      originalBody: options.body,
      serializedBody: config.body,
      bodyType: typeof config.body,
      contentType: config.headers?.['Content-Type']
    });

    const response = await fetch(url, config);
    
    console.log('📡 API Response:', {
      status: response.status,
      statusText: response.statusText,
      url: response.url
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      console.error('❌ API Error:', error);
      
      // Handle FastAPI validation errors
      if (error.detail && Array.isArray(error.detail)) {
        console.error('🔍 Validation Details:', JSON.stringify(error.detail, null, 2));
        const validationErrors = error.detail.map((err: any) => 
          `${err.loc?.join('.')} - ${err.msg} (input: ${JSON.stringify(err.input)})`
        ).join(', ');
        throw new Error(`Validation Error: ${validationErrors}`);
      }
      
      throw new Error(error.detail || error.message || 'An error occurred');
    }

    const data = await response.json();
    console.log('✅ API Success:', data);
    return data;
  }

  private getAuthHeaders(token: string) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
  }

  async createUser(userData: { email: string; name: string; password: string }, token: string) {
    return this.request('/users', {
      method: 'POST',
      headers: this.getAuthHeaders(token),
      body: userData,
    });
  }

  // Baggage endpoints
  async createBaggage(baggageData: any, token: string) {
    return this.request('/baggage', {
      method: 'POST',
      headers: this.getAuthHeaders(token),
      body: baggageData,
    });
  }

  async trackBaggage(query: string, queryType: 'baggage_id' | 'pnr') {
    return this.request('/track', {
      method: 'POST',
      body: { query, queryType },
    });
  }

  async scanBaggage(baggageId: string, token: string) {
    return this.request(`/scan/${baggageId}`, {
      method: 'POST',
      headers: this.getAuthHeaders(token),
    });
  }

  async updateBaggage(baggageId: string, updateData: any, token: string) {
    return this.request(`/baggage/${baggageId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(token),
      body: updateData,
    });
  }

  // Flight endpoints
  async getFlights() {
    return this.request('/flights');
  }

  async getFlightBaggage(flightNumber: string, token: string) {
    return this.request(`/flight/${flightNumber}/baggage`, {
      headers: this.getAuthHeaders(token),
    });
  }

  // Dashboard endpoints
  async getDashboardStats(token: string) {
    return this.request('/dashboard/stats', {
      headers: this.getAuthHeaders(token),
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);