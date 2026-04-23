const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export interface DealerFilters {
  search?: string;
  city?: string;
  sort?: 'rating' | 'total_cars' | 'followers' | 'newest';
  per_page?: number;
  page?: number;
}

export const dealersApi = {
  async getAll(filters: DealerFilters = {}, token?: string) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });

    const headers: any = { 'Accept': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/api/dealers?${params}`, { headers });

    if (!res.ok) throw new Error('Failed to fetch dealers');
    return res.json();
  },

  async getById(id: string, token?: string) {
    const headers: any = { 'Accept': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/api/dealers/${id}`, { headers });
    if (!res.ok) throw new Error('Failed to fetch dealer');
    return res.json();
  },

  async follow(dealerCode: string, token: string) {
    const res = await fetch(`${API_BASE_URL}/api/dealers/${dealerCode}/follow`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    if (!res.ok) throw new Error('Failed to follow dealer');
    return res.json();
  },

  async unfollow(dealerCode: string, token: string) {
    const res = await fetch(`${API_BASE_URL}/api/dealers/${dealerCode}/follow`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    if (!res.ok) throw new Error('Failed to unfollow dealer');
    return res.json();
  },

  async getReviews(dealerCode: string) {
    const res = await fetch(`${API_BASE_URL}/api/dealers/${dealerCode}/reviews`, {
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) throw new Error('Failed to fetch reviews');
    return res.json();
  },

  async addReview(dealerCode: string, token: string, data: { order_id: number; rating: number; review?: string }) {
    const res = await fetch(`${API_BASE_URL}/api/dealers/${dealerCode}/reviews`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to submit review');
    return res.json();
  },
};
