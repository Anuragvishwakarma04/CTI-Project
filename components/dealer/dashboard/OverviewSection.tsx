'use client';

import { Car, MessageSquare } from 'lucide-react';

interface OverviewSectionProps {
  dashboardStats: any;
  recentInquiries: any[];
}

export default function OverviewSection({ dashboardStats, recentInquiries }: OverviewSectionProps) {
  return (
    <div className="space-y-6">
      {/* Stock Summary */}
      <div className="card p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Car className="w-5 h-5 text-primary" />
          Stock Summary
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-3xl font-bold text-primary mb-1">{dashboardStats.totalCars || 0}</p>
            <p className="text-sm text-gray-600">Total Stock</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-3xl font-bold text-green-600 mb-1">{dashboardStats.activeCars || 0}</p>
            <p className="text-sm text-gray-600">Active</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-3xl font-bold text-orange-600 mb-1">{dashboardStats.pendingApproval || 0}</p>
            <p className="text-sm text-gray-600">Pending</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-3xl font-bold text-blue-600 mb-1">{dashboardStats.soldCars || 0}</p>
            <p className="text-sm text-gray-600">Sold</p>
          </div>
        </div>
      </div>

      {/* Recent Inquiries */}
      <div className="card p-6">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          Recent Inquiries
        </h4>
        {recentInquiries.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No inquiries yet</p>
        ) : (
          <div className="space-y-3">
            {recentInquiries.map((inquiry) => (
              <div key={inquiry.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{inquiry.customerName}</p>
                  <p className="text-xs text-gray-500">{inquiry.customerMobile}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(inquiry.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded ${
                  inquiry.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  inquiry.status === 'contacted' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {inquiry.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
