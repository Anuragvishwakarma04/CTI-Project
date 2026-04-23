'use client';

import { useState, useEffect } from 'react';
import { MapPin, X, Search } from 'lucide-react';
import { auth } from '@/lib/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export default function LocationSelector() {
  const [showModal, setShowModal] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const [popularCities, setPopularCities] = useState<any[]>([]);
  const [allCities, setAllCities] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const { name } = auth.getCity();
    setSelectedCity(name);
  }, []);

  useEffect(() => {
    if (showModal) {
      fetchPopularCities();
      fetchAllCities();
    }
  }, [showModal]);

  const fetchPopularCities = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/popular-cities`);
      const data = await res.json();
      if (data.success) {
        setPopularCities(data.cities || []);
      }
    } catch (error) {
      console.error('Failed to fetch cities');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCities = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/cities`);
      const data = await res.json();
      if (data.success) {
        setAllCities(data.cities || []);
      }
    } catch (error) {
      console.error('Failed to fetch all cities');
    }
  };

  const filteredCities = search
    ? allCities.filter(city => 
        city.name.toLowerCase().includes(search.toLowerCase()) ||
        city.state.toLowerCase().includes(search.toLowerCase())
      )
    : allCities;

  const handleSelectCity = async (city: any) => {
    const cityName = city.name || city;
    const cityId = city.id;
    setSelectedCity(cityName);
    setShowModal(false);
    setSearch('');

    // Save to localStorage
    auth.setCity(cityId, cityName);

    // Show alert
    setAlertMessage(`Location updated to ${cityName}`);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);

    // If user is logged in, update city via API
    const token = auth.getToken();
    if (token && cityId) {
      try {
        await fetch(`${API_BASE_URL}/api/update-city`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ city_id: cityId }),
        });
      } catch (error) {
        console.error('Failed to update city');
      }
    }
  };

  return (
    <>
      {showAlert && (
        <div className="fixed top-4 right-4 z-[60] animate-slide-in">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-2xl p-5 flex items-start gap-4 min-w-[320px] max-w-md">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-white text-lg mb-1">Location Updated!</p>
              <p className="text-white/90 text-sm">{alertMessage}</p>
              <div className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white/60 rounded-full animate-progress"></div>
              </div>
            </div>
            <button 
              onClick={() => setShowAlert(false)} 
              className="text-white/80 hover:text-white transition p-1 hover:bg-white/10 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 text-sm text-gray-700 hover:text-primary-600 font-medium transition"
      >
        <MapPin className="w-4 h-4" />
        <span>{selectedCity}</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold">Select Your City</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search city..."
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {search ? (
                filteredCities.length > 0 ? (
                  <>
                    <h3 className="text-lg font-semibold mb-4">Search Results ({filteredCities.length})</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {filteredCities.map((city) => (
                        <button
                          key={city.id}
                          onClick={() => handleSelectCity(city)}
                          className="p-4 rounded-lg border-2 border-gray-200 hover:border-primary-300 transition text-left"
                        >
                          <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5" />
                            <div>
                              <p className="font-medium">{city.name}</p>
                              <p className="text-xs text-gray-500">{city.state}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">No cities found</div>
                )
              ) : (
                <>
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">Popular Cities</h3>
                    {loading ? (
                      <div className="text-center py-8 text-gray-500">Loading...</div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {popularCities.map((city) => (
                          <button
                            key={city.id || city}
                            onClick={() => handleSelectCity(city)}
                            className={`p-4 rounded-lg border-2 transition ${
                              selectedCity === (city.name || city)
                                ? 'border-primary-600 bg-primary-50'
                                : 'border-gray-200 hover:border-primary-300'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <MapPin className="w-5 h-5" />
                              <span className="font-medium">{city.name || city}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">All Cities ({allCities.length})</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {allCities.slice(0, 40).map((city) => (
                        <button
                          key={city.id}
                          onClick={() => handleSelectCity(city)}
                          className="p-3 rounded-lg border hover:border-primary-300 transition text-left"
                        >
                          <p className="font-medium text-sm">{city.name}</p>
                          <p className="text-xs text-gray-500">{city.state}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
