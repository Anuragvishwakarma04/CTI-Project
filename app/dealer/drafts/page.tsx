'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { api, auth } from '@/lib/api';
import { FileText, Edit, Clock, AlertCircle } from 'lucide-react';

interface DraftVehicle {
  id: number;
  vehicle_id: string;
  brand: string;
  model: string;
  year: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function DraftsPage() {
  const router = useRouter();
  const { user } = useStore();
  const [drafts, setDrafts] = useState<DraftVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.user_type !== 'dealer') {
      router.push('/login');
      return;
    }
    fetchDrafts();
  }, [user, router]);

  const fetchDrafts = async () => {
    try {
      setLoading(true);
      const token = auth.getToken();
      if (!token) throw new Error('Not authenticated');

      const response = await api.getVehicles(token, 'draft');
      if (response.success) {
        setDrafts(response.data || []);
      } else {
        throw new Error(response.message || 'Failed to fetch drafts');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (vehicleId: string) => {
    router.push(`/dealer/add-vehicle?draft=${vehicleId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Draft Vehicles</h1>
          <p className="text-gray-600">Continue editing your incomplete listings</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading drafts...</p>
          </div>
        ) : drafts.length === 0 ? (
          <div className="card p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No drafts found</h3>
            <p className="text-gray-600 mb-6">Start adding a new vehicle to create a draft</p>
            <button
              onClick={() => router.push('/dealer/add-vehicle')}
              className="btn-primary"
            >
              Add New Vehicle
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {drafts.map((draft) => (
              <div key={draft.id} className="card p-6 hover:shadow-lg transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {draft.brand} {draft.model}
                      </h3>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
                        Draft
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Year: {draft.year}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Last updated: {formatDate(draft.updated_at)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2 font-mono">
                      ID: {draft.vehicle_id}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(draft.vehicle_id)}
                      className="btn-primary flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Continue Editing
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
