'use client';

import { useState } from 'react';
import { Calendar, Clock, Phone, User, Car } from 'lucide-react';

interface CustomerAppointmentsTabProps {
  appointments: any[];
  loading: boolean;
  onReschedule: (appointment: any) => void;
  onCancel: (id: number) => void;
}

export default function CustomerAppointmentsTab({ 
  appointments, 
  loading, 
  onReschedule, 
  onCancel 
}: CustomerAppointmentsTabProps) {
  const [appointmentFilter, setAppointmentFilter] = useState('all');

  const filteredAppointments = appointments.filter(apt => 
    appointmentFilter === 'all' ? true :
    appointmentFilter === 'upcoming' ? apt.status === 'confirmed' :
    appointmentFilter === 'pending' ? apt.status === 'pending' :
    apt.status === 'cancelled'
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">My Appointments</h3>
        <span className="text-sm text-gray-600">{appointments.length} Total</span>
      </div>
      
      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {['all', 'upcoming', 'pending', 'cancelled'].map((filter) => (
          <button 
            key={filter}
            onClick={() => setAppointmentFilter(filter)} 
            className={`px-4 py-2 rounded-lg font-medium transition ${
              appointmentFilter === filter ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="text-center py-16 text-gray-600">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-12 h-12 text-gray-400" />
          </div>
          <p className="text-xl font-semibold mb-2">No {appointmentFilter !== 'all' ? appointmentFilter : ''} appointments</p>
          <p className="text-sm">Book a test drive to see your appointments here</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredAppointments.map((appointment) => (
            <div key={appointment.id} className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="bg-gradient-to-r from-primary-50 to-blue-50 p-4 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <Car className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-gray-900">
                          {appointment.vehicle?.name || 'Showroom Visit'}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {appointment.dealer?.business_name || appointment.dealer?.name}
                        </p>
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${
                    appointment.status === 'confirmed' ? 'bg-green-500 text-white' :
                    appointment.status === 'pending' ? 'bg-yellow-400 text-gray-900' :
                    appointment.status === 'cancelled' ? 'bg-red-500 text-white' :
                    'bg-gray-300 text-gray-700'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
              </div>
              
              <div className="p-5">
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Date</p>
                      <p className="font-bold text-gray-900">
                        {new Date(appointment.appointment_date).toLocaleDateString('en-US', { 
                          weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Time</p>
                      <p className="font-bold text-gray-900">{appointment.appointment_time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Contact</p>
                      <p className="font-bold text-gray-900">{appointment.dealer?.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Dealer</p>
                      <p className="font-bold text-gray-900">{appointment.dealer?.name}</p>
                    </div>
                  </div>
                </div>
                
                {appointment.customer_message && (
                  <div className="mb-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border-l-4 border-primary-500">
                    <p className="text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Your Message</p>
                    <p className="text-sm text-gray-800">{appointment.customer_message}</p>
                  </div>
                )}
                
                {appointment.dealer_notes && (
                  <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-l-4 border-blue-500">
                    <p className="text-xs font-bold text-blue-700 mb-1 uppercase tracking-wide">Dealer Notes</p>
                    <p className="text-sm text-blue-900">{appointment.dealer_notes}</p>
                  </div>
                )}
                
                {appointment.status !== 'cancelled' && (
                  <div className="flex gap-3 pt-2">
                    <button 
                      onClick={() => onReschedule(appointment)} 
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-primary-500 to-blue-600 hover:from-primary-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    >
                      <Calendar className="w-4 h-4" />
                      Reschedule
                    </button>
                    <button 
                      onClick={() => onCancel(appointment.id)} 
                      className="flex-1 py-3 px-4 bg-white border-2 border-red-500 text-red-600 hover:bg-red-50 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
