"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, ChevronLeft, Store } from 'lucide-react'
import { useRouter } from "next/navigation";

export default function ShowroomCarsPage() {
    const { code } = useParams();
    const [cars, setCars] = useState<any[]>([]);
    const [showroom, setShowroom] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const params = new URLSearchParams(window.location.search);
    const from = params.get("from");
    const router = useRouter();
    useEffect(() => {

        if (!code) return;

        const token = localStorage.getItem("token");


        fetch(`https://ctiapp.morbustech.com/api/dealer/showrooms/${code}/cars`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setCars(data.data?.cars || []);
                setShowroom(data.data?.showroom || {});
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [code]);
    // const capitalizeWords = (str: string = "") =>
    //     str
    //         .split(" ")
    //         .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    //         .join(" ");

    if (loading) {
        return <div className="flex flex-col items-center justify-center h-[300px]">
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-500 animate-pulse">Loading Cars...</p>
        </div>
    }

    return (

        <div className="max-w-7xl mx-auto p-6">

            {/* BACK BUTTON  */}
            <button
                onClick={() => {
                    if (from === "showrooms") {
                        router.push("/dealer/dashboard?section=showrooms");
                    } else {
                        router.push("/dealer/dashboard");
                    }
                }}
                className="flex items-center text-lg gap-2  text-gray-600 hover:text-primary mb-4 transition"
            >
                <ChevronLeft className="w-5 h-5" />
                Back
            </button>

            <div className="bg-white/80 max-w-7xl mx-auto  backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200 p-6">

                <div className="max-w-7xl mx-auto  flex items-center gap-4 ml-6 ">

                    {/* LEFT → Icon */}
                    <div className="bg-primary/10 p-3 rounded-xl ">
                        <Store className="w-8 h-8 text-primary " />
                    </div>

                    {/* RIGHT → Content */}
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 ">
                            {/* {capitalizeWords(showroom?.name)} */}
                            {showroom?.name || "Showroom Name"}
                        </h1>
                        <p className="text-gray-600 ">
                            {/* {capitalizeWords(showroom?.location)} */}
                            {showroom?.location || "Showroom Location"}
                        </p>
                    </div>

                </div>
            </div>

            {/*  Cars Grid */}

            <div className="bg-white/80 mt-3 max-w-7xl mx-auto backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200 p-6">

                {cars.length === 0 ? (

                    //  NO CARS CARD
                    <div className="flex flex-col items-center justify-center h-[250px] text-center">
                        <div className="text-5xl mb-3">🚗</div>
                        <p className="text-gray-500 text-lg font-medium">No Cars Available</p>
                        <p className="text-sm text-gray-400">This showroom has no listings yet</p>
                    </div>

                ) : (

                    <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {cars.map((car) => (
                            <div
                                key={car.vehicleId}
                                className="bg-white rounded-xl shadow-sm hover:shadow-xl transition border overflow-hidden"
                            >

                                {/* Image */}
                                <div className="h-48 w-full overflow-hidden">
                                    <img
                                        src={
                                            car.imageUrl ||
                                            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200"
                                        }
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Content */}
                                <div className="p-4 space-y-2">

                                    <h2 className="font-bold text-lg text-gray-900">
                                        {car.name}
                                    </h2>

                                    {/* <p className="text-sm text-gray-500">
                                        {car.brand} • {car.model} • {car.variant}
                                    </p> */}

                                    <p className="text-primary font-semibold text-lg">
                                        ₹{car.price}
                                    </p>

                                    <div className="text-sm text-gray-600 space-y-1">
                                        <p>📅 Year: {car.year}</p>
                                        <p>🚗 KM: {car.kmDriven}</p>
                                        <p>⛽ Fuel: {car.fuelType}</p>
                                        <p>⚙️ Transmission: {car.transmission}</p>
                                        <p>🎨 Color: {car.color}</p>
                                        <p>👤 Owner: {car.ownership}</p>
                                        <p>📍 {car.location}</p>
                                    </div>

                                    <div className="border-t pt-2 text-xs text-gray-400">
                                        Listed on: {car.listedDate}
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