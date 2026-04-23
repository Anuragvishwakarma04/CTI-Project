const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

console.log('API_BASE_URL:', API_BASE_URL); // Debug log

// API Client
export const api = {
  // Send OTP
  async sendOTP(phone: string, type: 'customer' | 'dealer' | 'showroom') {
    const res = await fetch(`${API_BASE_URL}/api/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, type }),
    });
    return res.json();
  },

  // Verify OTP
  async verifyOTP(phone: string, otp: string, type: 'customer' | 'dealer' | 'showroom', dealerCode?: string) {
    const body: any = { phone, otp, type };
    if (dealerCode) body.dealer_code = dealerCode;
    const res = await fetch(`${API_BASE_URL}/api/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return res.json();
  },

  // Complete Profile
  async completeProfile(data: any) {
    const res = await fetch(`${API_BASE_URL}/api/complete-profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Get Profile
  async getProfile(token: string) {
    const res = await fetch(`${API_BASE_URL}/api/profile`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return res.json();
  },

  // Update Profile
  async updateProfile(token: string, data: any) {
    const res = await fetch(`${API_BASE_URL}/api/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Update Location
  async updateCity(token: string, cityId: number) {
    const res = await fetch(`${API_BASE_URL}/api/update-city`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ city_id: cityId }),
    });
    return res.json();
  },

  // Logout
  async logout(token: string) {
    const res = await fetch(`${API_BASE_URL}/api/logout`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return res.json();
  },

  // Vehicle API - Update Draft (for editing)
  async updateVehicleDraft(token: string, vehicleId: string, data: any) {
    const res = await fetch(`${API_BASE_URL}/api/vehicles/${vehicleId}/draft`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    const json = await res.json();
    if (!res.ok) {
      console.error('Draft Update Error:', res.status, json);
      return json;
    }
    return json;
  },

  // Vehicle API - Step 1: Vehicle Details (Creates Draft)
  async createVehicleStep1(token: string, data: any) {
    const res = await fetch(`${API_BASE_URL}/api/vehicles/step1`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    const json = await res.json();
    
    if (!res.ok) {
      console.error('API Error:', res.status, json);
      return json; // Return error response with validation errors
    }
    
    return json;
  },

  // Vehicle API - Step 2: Financial Information
  async updateVehicleStep2(token: string, vehicleId: string, data: any) {
    const res = await fetch(`${API_BASE_URL}/api/vehicles/${vehicleId}/draft`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return res.json();
  },

  // Vehicle API - Update Draft with Files (for documents)
  async updateVehicleDraftWithFiles(token: string, vehicleId: string, formData: FormData) {
    const res = await fetch(`${API_BASE_URL}/api/vehicles/${vehicleId}/draft`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: formData,
    });
    
    const json = await res.json();
    if (!res.ok) {
      console.error('Draft Update Error:', res.status, json);
      return json;
    }
    return json;
  },

  // Vehicle API - Step 3: Legal & Documents
  async updateVehicleStep3(token: string, vehicleId: string, formData: FormData) {
    const res = await fetch(`${API_BASE_URL}/api/vehicles/${vehicleId}/step3`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: formData,
    });
    
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return res.json();
  },

  // Vehicle API - Step 4: Media & Listing (Final - Changes to Pending)
  async updateVehicleStep4(token: string, vehicleId: string, formData: FormData) {
    const res = await fetch(`${API_BASE_URL}/api/vehicles/${vehicleId}/step4`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: formData,
    });
    
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return res.json();
  },

  // Get Vehicle Details
  async getVehicle(token: string, vehicleId: string) {
    const res = await fetch(`${API_BASE_URL}/api/vehicles/${vehicleId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return res.json();
  },

  // Get All Vehicles (Dealer's vehicles)
  async getVehicles(token: string, status?: string, page?: number) {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (page) params.append('page', page.toString());
    
    const url = `${API_BASE_URL}/api/vehicles${params.toString() ? '?' + params.toString() : ''}`;
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return res.json();
  },

  // Get My Listings (Showroom - for auction vehicle selection)
  async getMyListings(token: string, status?: string, page?: number, perPage?: number) {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (page) params.append('page', page.toString());
    if (perPage) params.append('per_page', perPage.toString());
    const url = `${API_BASE_URL}/api/my-listings${params.toString() ? '?' + params.toString() : ''}`;
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
    });
    return res.json();
  },

  // Delete Vehicle (Draft only)
  async deleteVehicle(token: string, vehicleId: string) {
    const res = await fetch(`${API_BASE_URL}/api/vehicles/${vehicleId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return res.json();
  },

  // Mark Vehicle as Sold
  async markVehicleAsSold(token: string, vehicleId: string, data: { sold_price: number; sold_to?: string; sold_notes?: string }) {
    const res = await fetch(`${API_BASE_URL}/api/vehicles/${vehicleId}/mark-sold`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Toggle Vehicle Active/Inactive
  async toggleVehicleActive(token: string, vehicleId: string) {
    const res = await fetch(`${API_BASE_URL}/api/vehicles/${vehicleId}/toggle-active`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return res.json();
  },

  // Update Vehicle Status (active/inactive) - DEPRECATED, use toggleVehicleActive instead
  async updateVehicleStatus(token: string, vehicleId: string, status: string) {
    // For backward compatibility, map old status calls to new endpoints
    if (status === 'inactive' || status === 'hidden') {
      return this.toggleVehicleActive(token, vehicleId);
    }
    const res = await fetch(`${API_BASE_URL}/api/vehicles/${vehicleId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  // Edit Vehicle
  async editVehicle(token: string, vehicleId: string, formData: FormData) {
    const res = await fetch(`${API_BASE_URL}/api/vehicles/${vehicleId}/edit`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });
    return res.json();
  },

  // Get Auctions (Public - for dealers)
  async getAuctions(token?: string) {
    const headers: Record<string, string> = { 'Accept': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE_URL}/api/auctions`, { headers });
    return res.json();
  },

  // Get Auction Detail
  async getAuctionDetail(code: string, token?: string) {
    const headers: Record<string, string> = { 'Accept': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE_URL}/api/auctions/${code}`, { headers });
    return res.json();
  },

  // Get Auction Vehicles
  async getAuctionVehicles(code: string, token?: string) {
    const headers: Record<string, string> = { 'Accept': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE_URL}/api/auctions/${code}/vehicles`, { headers });
    return res.json();
  },

  // Get Auction Participants (Showroom only)
  async getAuctionParticipants(code: string, token: string) {
    const res = await fetch(`${API_BASE_URL}/api/auctions/${code}/participants`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return res.json();
  },

  // Join Auction
  async joinAuction(code: string, token: string) {
    const res = await fetch(`${API_BASE_URL}/api/auctions/${code}/join`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ terms_accepted: true }),
    });
    return res.json();
  },

  // Place Bid
  async placeBid(auctionCode: string, vehicleId: string, bidAmount: number, token: string) {
    const res = await fetch(`${API_BASE_URL}/api/auctions/bids`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ auction_code: auctionCode, vehicle_id: vehicleId, bid_amount: bidAmount }),
    });
    return res.json();
  },

  // Get Bidders
  async getBidders(code: string, vehicleId: string, token: string) {
    const res = await fetch(`${API_BASE_URL}/api/auctions/${code}/vehicles/${vehicleId}/bidders`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return res.json();
  },

  // Create Auction (Showroom)
  async createAuction(token: string, data: {
    title: string;
    description: string;
    terms_and_conditions: string;
    start_date: string;
    end_date: string;
    vehicle_ids: string[];
    reserve_prices: number[];
  }) {
    const res = await fetch(`${API_BASE_URL}/api/auctions`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Get My Auction Listings (Showroom)
  async getMyAuctionListings(token: string) {
    const res = await fetch(`${API_BASE_URL}/api/auctions/my`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return res.json();
  },

  // Update Auction Status (Showroom)
  async updateAuctionStatus(auctionCode: string, status: string, token: string) {
    const res = await fetch(`${API_BASE_URL}/api/auctions/${auctionCode}/status`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  // Remove Vehicles from Auction (Showroom)
  async removeVehiclesFromAuction(auctionCode: string, vehicleIds: string[], token: string) {
    const res = await fetch(`${API_BASE_URL}/api/auctions/${auctionCode}/vehicles`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ vehicle_ids: vehicleIds }),
    });
    return res.json();
  },

  // Add Vehicles to Auction (Showroom)
  async addVehiclesToAuction(auctionCode: string, vehicles: { vehicle_id: string; reserve_price: number }[], token: string) {
    const res = await fetch(`${API_BASE_URL}/api/auctions/${auctionCode}/vehicles`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        vehicle_ids: vehicles.map(v => v.vehicle_id),
        reserve_prices: vehicles.map(v => v.reserve_price),
      }),
    });
    return res.json();
  },

  // Get Car Listings (Public)
  async getCarListings(params?: {
    city?: string;
    brand?: string;
    fuel_type?: string;
    transmission?: string;
    min_price?: number;
    max_price?: number;
    sort_by?: string;
  }, token?: string) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });
    }
    const url = `${API_BASE_URL}/api/cars/listings${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(url, { headers });
    return res.json();
  },

  // Get Car Details (Public)
  async getCarDetails(vehicleId: string) {
    const res = await fetch(`${API_BASE_URL}/api/cars/${vehicleId}`);
    return res.json();
  },

  // Get Vehicle Brands
  async getVehicleBrands() {
    const res = await fetch(`${API_BASE_URL}/api/vehicle-masters/brands`);
    return res.json();
  },

  // Get Vehicle Models by Brand ID
  async getVehicleModels(brandId: number) {
    const res = await fetch(`${API_BASE_URL}/api/vehicle-masters/brands/${brandId}/models`);
    return res.json();
  },

  // Get Favorites (Customer)
  async getFavorites(token: string) {
    const res = await fetch(`${API_BASE_URL}/api/favorites`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return res.json();
  },

  // Remove from Favorites (Customer)
  async removeFromFavorites(token: string, vehicleId: string) {
    const res = await fetch(`${API_BASE_URL}/api/cars/${vehicleId}/favorite`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return res.json();
  },

  // Garage APIs
  // Add Vehicle to Garage (Customer)
  async addGarageVehicle(token: string, formData: FormData) {
    const res = await fetch(`${API_BASE_URL}/api/garage/vehicles`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    return res.json();
  },

  // Get Garage Vehicles (Customer)
  async getGarageVehicles(token: string) {
    const res = await fetch(`${API_BASE_URL}/api/garage/vehicles`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return res.json();
  },

  // Get Garage Vehicle Details (Customer)
  async getGarageVehicle(token: string, vehicleId: string) {
    const res = await fetch(`${API_BASE_URL}/api/garage/vehicles/${vehicleId}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return res.json();
  },

  // Update Garage Vehicle (Customer)
  async updateGarageVehicle(token: string, vehicleId: string, formData: FormData) {
    const res = await fetch(`${API_BASE_URL}/api/garage/vehicles/${vehicleId}/update`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    return res.json();
  },

  // Delete Garage Vehicle (Customer)
  async deleteGarageVehicle(token: string, vehicleId: string) {
    const res = await fetch(`${API_BASE_URL}/api/garage/vehicles/${vehicleId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return res.json();
  },
};

// Token Management
export const auth = {
  setToken(token: string) {
    localStorage.setItem('auth_token', token);
  },

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  removeToken() {
    localStorage.removeItem('auth_token');
  },

  setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  },

  getUser(): any | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  removeUser() {
    localStorage.removeItem('user');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  clear() {
    this.removeToken();
    this.removeUser();
  },

  setCity(cityId: number, cityName: string) {
    localStorage.setItem('city_id', cityId.toString());
    localStorage.setItem('city_name', cityName);
  },

  getCity(): { id: number | null; name: string } {
    const id = localStorage.getItem('city_id');
    const name = localStorage.getItem('city_name');
    return { id: id ? parseInt(id) : null, name: name || 'Mumbai' };
  },
};
