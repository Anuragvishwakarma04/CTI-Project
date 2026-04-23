'use client';

import { Calendar, Clock, Phone, Mail } from 'lucide-react';

interface AppointmentsSectionProps {
  appointments: any[];
  loading: boolean;
  onConfirm: (id: number) => void;
}

export default function AppointmentsSection({ appointments, loading, onConfirm }: AppointmentsSectionProps) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="card p-12 text-center">
        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No appointments yet</h3>
        <p className="text-gray-600">Customer test drive requests will appear here</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {appointments.map((appointment) => (
        <div key={appointment.id} className="card p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-bold">{appointment.vehicle?.name || 'Showroom Visit'}</h3>
              <p className="text-sm text-gray-600">Customer: {appointment.customer?.name || 'N/A'}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              appointment.status === 'confirmed' ? 'bg-green-100 text-green-700' :
              appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {appointment.status}
            </span>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Calendar className="w-4 h-4" />
              <span>{new Date(appointment.appointment_date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Clock className="w-4 h-4" />
              <span>{appointment.appointment_time}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Phone className="w-4 h-4" />
              <span>{appointment.customer?.phone || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Mail className="w-4 h-4" />
              <span>{appointment.customer?.email || 'N/A'}</span>
            </div>
          </div>
          {appointment.customer_message && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs font-semibold text-gray-700 mb-1">Customer Message:</p>
              <p className="text-sm text-gray-800">{appointment.customer_message}</p>
            </div>
          )}
          {appointment.status === 'pending' && (
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => onConfirm(appointment.id)}
                className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
              >
                Confirm Appointment
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
