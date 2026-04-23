'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import dynamic from 'next/dynamic';

const AddVehicleContent = dynamic(() => import('@/app/dealer/add-vehicle/page'), { ssr: false });

export default function CustomerAddListingPage() {
  const router = useRouter();
  const { user } = useStore();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null;

  return <AddVehicleContent />;
}
