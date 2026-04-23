'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Phone, Mail, Edit } from 'lucide-react';

interface DealerProfileHeaderProps {
  user: any;
}

export default function DealerProfileHeader({ user }: DealerProfileHeaderProps) {
  const router = useRouter();

  return (
    <div className="card p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24">
          <Image
            src={user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200'}
            alt={user.name}
            fill
            className="rounded-full object-cover ring-4 ring-primary-100"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
            {user.business_name || user.name}
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-gray-600 mb-2">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span className="text-sm sm:text-base">{user.phone}</span>
            </div>
            {user.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span className="text-sm sm:text-base">{user.email}</span>
              </div>
            )}
          </div>
          <span className="inline-block px-3 sm:px-4 py-1.5 bg-secondary-100 text-secondary-700 rounded-lg text-xs sm:text-sm font-semibold">
            {user.user_type === 'showroom' ? '🏢 Verified Showroom' : '🏪 Verified Dealer'}
          </span>
        </div>
        <button 
          onClick={() => router.push('/edit-profile')} 
          className="btn-secondary flex items-center gap-2 text-sm px-4 py-2"
        >
          <Edit className="w-4 h-4" />
          Edit
        </button>
      </div>
    </div>
  );
}
