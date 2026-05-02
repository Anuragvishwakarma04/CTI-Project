"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getDashboardRoute } from "@/utils/getDashboardRoute";
import { ArrowLeft } from "lucide-react";
import { useStore } from "@/store/useStore";

export default function AuctionVehiclesPage() {
  const { code } = useParams();
  const router = useRouter();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useStore();

  useEffect(() => {
    if (!code) return;

    const fetchVehicles = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `https://ctiapp.morbustech.com/api/auctions/${code}/vehicles`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          },
        );

        const data = await res.json();
        console.log("VEHICLES:", data);

        setVehicles(data.vehicles || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [code]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6">
          <button
            onClick={() => router.push("/showroom/dashboard?section=auctions")}
            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 transition text-sm mb-5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Auction
          </button>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Select Vehicle</h1>
            <p className="text-sm text-gray-500">
              Choose a vehicle to view live auction
            </p>
          </div>

          {vehicles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No vehicles found 🚗</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6   mx-auto">
              {vehicles.map((v) => (
                <div
                  key={v.vehicle_id}
                  onClick={() =>
                    router.push(`/dealer/auctions/${code}/bid/${v.vehicle_id}`)
                  }
                  className="group relative bg-white border border-gray-200 rounded-2xl 
              p-5 cursor-pointer transition-all duration-300 
              hover:shadow-2xl hover:-translate-y-1 hover:border-primary/40"
                >
                  <div className="mt-5">
                    <span className="absolute top-2 right-3 text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-500">
                      {v.brand}
                    </span>
                  </div>

                  <h2 className="font-bold text-lg text-gray-900 group-hover:text-primary transition">
                    {/* {v.brand} {v.model} */} {v.name}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    {v.variant || "Variant not available"}
                  </p>

                  {/* Divider */}
                  <div className="my-3 border-t"></div>

                  <p className="text-xl font-bold text-primary">
                    ₹{v.reserve_price || "N/A"}
                  </p>

                  <div className="mt-4">
                    <button
                      className="w-full flex items-center justify-between px-4 py-2 rounded-xl 
                                bg-gradient-to-r from-blue-600 to-indigo-800 
                                text-white text-sm font-semibold transition-transform"
                    >
                      <span>Tap to view auction</span>
                      <span className="text-lg group-hover:translate-x-1 transition">
                        →
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
