const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export interface Brand {
  id: number;
  brand_name: string;
}

export interface Model {
  id: number;
  model_name: string;
}

export interface Variant {
  id: number;
  variant_name: string;
  model_id: number;
  body_type: { id: number; type_name: string };
  fuel_type: { id: number; fuel_type: string };
  transmission: { id: number; transmission_type: string };
  status?: string;
  features?: string[];
}

export const vehicleMasters = {
  async getBrands(): Promise<{ success: boolean; data: Brand[]; count: number }> {
    const res = await fetch(`${API_BASE_URL}/api/vehicle-masters/brands`, {
      headers: { 'Accept': 'application/json' },
    });
    return res.json();
  },

  async getModelsByBrand(brandId: number): Promise<{ 
    success: boolean; 
    brand: Brand; 
    data: Model[]; 
    count: number 
  }> {
    const res = await fetch(`${API_BASE_URL}/api/vehicle-masters/brands/${brandId}/models`, {
      headers: { 'Accept': 'application/json' },
    });
    return res.json();
  },

  async getVariantsByModel(modelId: number): Promise<{ 
    success: boolean; 
    model: { id: number; model_name: string; brand: Brand }; 
    data: Variant[]; 
    count: number 
  }> {
    const res = await fetch(`${API_BASE_URL}/api/vehicle-masters/models/${modelId}/variants`, {
      headers: { 'Accept': 'application/json' },
    });
    return res.json();
  },
};
