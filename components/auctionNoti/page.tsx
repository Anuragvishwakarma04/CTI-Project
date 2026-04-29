'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Gavel, Clock, ArrowRight, X } from 'lucide-react';
import { auth } from '@/lib/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export default function AuctionBanner() {
  const router = useRouter();
  const [auctions, setAuctions] = useState<any[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [tick, setTick] = useState(0);
  const [user, setUser] = useState<any>(null);

  // Only show for dealer
  useEffect(() => {
    const savedUser = auth.getUser();
    if (savedUser && (savedUser.user_type === 'dealer')) {
      setUser(savedUser);
    }
  }, []); 

  // Fetch upcoming/live auctions
  useEffect(() => {
    if (!user) return;
    const fetchAuctions = async () => {
      try {
        const token = auth.getToken();
        const headers: any = { 'Accept': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const res = await fetch(`${API_BASE_URL}/api/auctions?category=fresh&per_page=5`, { headers });
        const data = await res.json();
        if (data.success) {
          const list = data.auctions || data.data || [];
          // Only show upcoming or live auctions
          const relevant = list.filter((a: any) => {
            const now = Date.now();
            const start = new Date(a.start_date).getTime();
            const end = new Date(a.end_date).getTime();
            return now <= end; // not ended
          });
          setAuctions(relevant);
        }
      } catch (err) {
        console.error('AuctionBanner fetch error:', err);
      }
    };
    fetchAuctions();
  }, [user]);

  // Countdown tick every second
  useEffect(() => {
    if (auctions.length === 0) return;
    const interval = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [auctions]);

  if (!user || auctions.length === 0) return null;

  const visibleAuctions = auctions.filter(a => !dismissed.includes(a.auction_code));
  if (visibleAuctions.length === 0) return null;

  const getStatus = (a: any) => {
    const now = Date.now();
    const start = new Date(a.start_date).getTime();
    const end = new Date(a.end_date).getTime();
    if (now >= start && now <= end) return 'live';
    if (now < start) return 'upcoming';
    return 'ended';
  };

  const getCountdown = (a: any) => {
    const now = Date.now();
    const status = getStatus(a);
    const target = status === 'live'
      ? new Date(a.end_date).getTime()
      : new Date(a.start_date).getTime();
    const diff = target - now;
    if (diff <= 0) return status === 'upcoming' ? 'Starting now!' : 'Ended';
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    if (h > 24) {
      const d = Math.floor(h / 24);
      return `${d}d ${h % 24}h ${m}m`;
    }
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full">
      {visibleAuctions.slice(0, 3).map((auction) => {
        const status = getStatus(auction);
        const countdown = getCountdown(auction);
        const isLive = status === 'live';
        const isStartingSoon = status === 'upcoming' &&
          new Date(auction.start_date).getTime() - Date.now() < 5 * 60 * 1000; // within 5 mins

        return (
          <div
            key={auction.auction_code}
            className={`relative rounded-2xl shadow-2xl border overflow-hidden transition-all ${
              isLive
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 border-green-500 text-white'
                : isStartingSoon
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 border-orange-400 text-white'
                : 'bg-white border-gray-200 text-gray-900'
            }`}
          >
            {/* Dismiss button */}
            <button
              onClick={() => setDismissed(d => [...d, auction.auction_code])}
              className={`absolute top-2 right-2 p-1 rounded-full transition ${
                isLive || isStartingSoon
                  ? 'hover:bg-white/20 text-white'
                  : 'hover:bg-gray-100 text-gray-400'
              }`}
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <div className="p-4 pr-8">
              {/* Header */}
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isLive ? 'bg-white/20' : isStartingSoon ? 'bg-white/20' : 'bg-amber-100'
                }`}>
                  <Gavel className={`w-4 h-4 ${isLive || isStartingSoon ? 'text-white' : 'text-amber-600'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {isLive && (
                      <span className="flex items-center text-red-500 gap-1 text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                        LIVE
                      </span>
                    )}
                    {isStartingSoon && !isLive && (
                      <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">
                        STARTING SOON
                      </span>
                    )}
                    {!isLive && !isStartingSoon && (
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                        UPCOMING
                      </span>
                    )}
                  </div>
                  <p className={`text-sm font-bold truncate mt-0.5 ${
                    isLive || isStartingSoon ? 'text-white' : 'text-gray-900'
                  }`}>
                    {auction.title}
                  </p>
                </div>
              </div>

              {/* Countdown */}
              <div className={`flex items-center gap-1.5 mb-3 ${
                isLive || isStartingSoon ? 'text-white/90' : 'text-gray-600'
              }`}>
                <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="text-xs font-medium">
                  {isLive ? 'Ends in: ' : 'Starts in: '}
                </span>
                <span className={`font-mono font-bold text-sm ${
                  isLive ? 'text-white' : isStartingSoon ? 'text-white' : 'text-red-500'
                }`}>
                  {countdown}
                </span>
              </div>

              {/* Vehicles count */}
              <div className={`text-xs mb-3 ${
                isLive || isStartingSoon ? 'text-white/70' : 'text-gray-500'
              }`}>
                {auction.total_vehicles} vehicle{auction.total_vehicles !== 1 ? 's' : ''} in auction
              </div>

              {/* CTA Button */}
              <button
                onClick={() => router.push(`/dealer/auctions/${auction.auction_code}`)}
                className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-sm font-bold transition-all ${
                  isLive
                    ? 'bg-white text-green-600 hover:bg-green-50'
                    : isStartingSoon
                    ? 'bg-white text-orange-600 hover:bg-orange-50'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isLive ? 'Join Auction Now' : isStartingSoon ? 'Get Ready' : 'View Auction'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}