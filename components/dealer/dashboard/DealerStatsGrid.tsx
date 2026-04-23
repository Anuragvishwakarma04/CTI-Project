'use client';

import { Car, Eye, MessageSquare, Users } from 'lucide-react';

interface DealerStatsGridProps {
  stats: {
    totalCars: number;
    totalViews: number;
    totalInquiries: number;
    followers: number;
  } | null;
  loading: boolean;
}

export default function DealerStatsGrid({ stats, loading }: DealerStatsGridProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!stats) return null;

  const statItems = [
    { icon: Car, value: stats.totalCars || 0, label: 'Total Cars', color: 'text-primary' },
    { icon: Eye, value: stats.totalViews || 0, label: 'Total Views', color: 'text-blue-600' },
    { icon: MessageSquare, value: stats.totalInquiries || 0, label: 'Inquiries', color: 'text-purple-600' },
    { icon: Users, value: stats.followers || 0, label: 'Followers', color: 'text-secondary' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <div key={index} className="card p-4 sm:p-6 hover:shadow-lg transition">
            <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${item.color} mb-2 sm:mb-3`} />
            <p className="text-2xl sm:text-3xl font-bold mb-1">{item.value}</p>
            <p className="text-gray-600 text-xs sm:text-sm">{item.label}</p>
          </div>
        );
      })}
    </div>
  );
}
