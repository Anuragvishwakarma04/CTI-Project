const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export interface GarageVehicle {
  id: number;
  vehicle_number: string;
  brand?: string;
  model?: string;
  year?: number;
  registration_date?: string;
  insurance_expiry?: string;
  pollution_expiry?: string;
  has_warranty: boolean;
  warranty_expiry?: string;
  last_service_date?: string;
  next_service_date?: string;
  notes?: string;
  vehicle_image?: string;
  created_at: string;
}

export interface GarageResponse {
  success: boolean;
  vehicles: GarageVehicle[];
}

export const garageApi = {
  async getAll(token: string): Promise<GarageResponse> {
    const res = await fetch(`${API_BASE_URL}/api/garage/vehicles`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return res.json();
  },

  async create(token: string, data: Partial<GarageVehicle> | FormData): Promise<{ success: boolean; vehicle: GarageVehicle; message: string }> {
    const headers: any = { 'Authorization': `Bearer ${token}` };
    if (!(data instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }
    const res = await fetch(`${API_BASE_URL}/api/garage/vehicles`, {
      method: 'POST',
      headers,
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
    return res.json();
  },

  async update(token: string, id: number, data: Partial<GarageVehicle>): Promise<{ success: boolean; vehicle: GarageVehicle; message: string }> {
    const res = await fetch(`${API_BASE_URL}/api/garage/vehicles/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async delete(token: string, id: number): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE_URL}/api/garage/vehicles/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return res.json();
  },
};
