const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export interface AppointmentData {
  dealer_code: string;
  vehicle_id?: string;
  appointment_date: string;
  appointment_time: string;
  customer_message?: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
}

export const appointmentsApi = {
  async create(token: string, data: AppointmentData) {
    const res = await fetch(`${API_BASE_URL}/api/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create appointment');
    return res.json();
  },

  async getAll(token: string) {
    console.log('Appointments API - Fetching from:', `${API_BASE_URL}/api/appointments`);
    console.log('Appointments API - Token:', token ? 'Present' : 'Missing');
    try {
      const res = await fetch(`${API_BASE_URL}/api/appointments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      console.log('Appointments API - Response status:', res.status);
      const data = await res.json();
      console.log('Appointments API - Response data:', data);
      return data;
    } catch (error) {
      console.error('Appointments API - Fetch error:', error);
      return { success: false, message: 'Failed to fetch appointments', appointments: [] };
    }
  },

  async reschedule(token: string, id: number, date: string, time: string) {
    const res = await fetch(`${API_BASE_URL}/api/appointments/${id}/reschedule`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify({ appointment_date: date, appointment_time: time }),
    });
    if (!res.ok) throw new Error('Failed to reschedule appointment');
    return res.json();
  },

  async cancel(token: string, id: number) {
    const res = await fetch(`${API_BASE_URL}/api/appointments/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    if (!res.ok) throw new Error('Failed to cancel appointment');
    return res.json();
  },

  async getDealerAppointments(token: string, status?: string) {
    const url = status 
      ? `${API_BASE_URL}/api/dealer/appointments?status=${status}`
      : `${API_BASE_URL}/api/dealer/appointments`;
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    if (!res.ok) throw new Error('Failed to fetch dealer appointments');
    return res.json();
  },
};
