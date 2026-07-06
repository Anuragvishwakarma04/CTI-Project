"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Store, Phone, Mail, MapPin, X } from 'lucide-react'
import { useRouter } from "next/navigation";
import Image from 'next/image';

export default function ShowroomCarsPage() {
    const { code } = useParams();
    const [cars, setCars] = useState<any[]>([]);
    const [showroom, setShowroom] = useState<any>(null);
    const [images, setImages] = useState<any>({ interior: [], exterior: [] });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'exterior' | 'interior'>('exterior');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalImageIndex, setModalImageIndex] = useState(0);

    const params = new URLSearchParams(window.location.search);
    const from = params.get("from");
    const router = useRouter();
    useEffect(() => {

        if (!code) return;

        const token = localStorage.getItem("token");


        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dealer/showrooms/${code}/cars?from=${from || ''}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setCars(data.data?.cars || []);
                setShowroom(data.data?.showroom || {});
                setImages(data.data?.images || { interior: [], exterior: [] });
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [code]);

    useEffect(() => {
        setCurrentIndex(0);
    }, [activeTab]);

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

            <div className="bg-white/80 max-w-7xl mx-auto backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Left: Profile & Info */}
                    <div className="flex items-center gap-4">
                        {/* Profile Image */}
                        <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-primary/20 flex-shrink-0">
                            {showroom?.profileImage ? (
                                <Image
                                    src={showroom.profileImage}
                                    alt={showroom?.name || 'Showroom'}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            ) : (
                                <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                                    <Store className="w-10 h-10 text-primary" />
                                </div>
                            )}
                        </div>

                        {/* Showroom Info */}
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {showroom?.name || "Showroom Name"}
                            </h1>
                            <p className="text-gray-600 flex items-center gap-1 mt-1">
                                <MapPin className="w-4 h-4" />
                                {showroom?.location || "Showroom Location"}
                            </p>
                        </div>
                    </div>

                    {/* Right: Contact Details */}
                    {showroom?.contactDetails && (
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {showroom.contactDetails.mobile && (
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <div className="bg-primary/10 p-2 rounded-lg">
                                        <Phone className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Phone</p>
                                        <p className="font-semibold text-gray-900 text-sm">{showroom.contactDetails.mobile}</p>
                                    </div>
                                </div>
                            )}
                            {showroom.contactDetails.email && (
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <div className="bg-primary/10 p-2 rounded-lg">
                                        <Mail className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Email</p>
                                        <p className="font-semibold text-gray-900 text-sm">{showroom.contactDetails.email}</p>
                                    </div>
                                </div>
                            )}
                            {showroom.contactDetails.fullAddress && (
                                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl sm:col-span-2">
                                    <div className="bg-primary/10 p-2 rounded-lg">
                                        <MapPin className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Address</p>
                                        <p className="font-semibold text-gray-900 text-sm">{showroom.contactDetails.fullAddress}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Showroom Images with Tabs */}
            {(images.exterior?.length > 0 || images.interior?.length > 0) && (
                <div className="bg-white/80 mt-3 max-w-7xl mx-auto backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Showroom Gallery</h2>
                    
                    {/* Tabs */}
                    <div className="flex gap-2 mb-6 border-b border-gray-200">
                        {images.exterior?.length > 0 && (
                            <button
                                onClick={() => { setActiveTab('exterior'); setCurrentIndex(0); }}
                                className={`px-6 py-3 font-semibold transition-all relative ${
                                    activeTab === 'exterior'
                                        ? 'text-primary'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Exterior
                                {activeTab === 'exterior' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                                )}
                            </button>
                        )}
                        {images.interior?.length > 0 && (
                            <button
                                onClick={() => { setActiveTab('interior'); setCurrentIndex(0); }}
                                className={`px-6 py-3 font-semibold transition-all relative ${
                                    activeTab === 'interior'
                                        ? 'text-primary'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Interior
                                {activeTab === 'interior' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                                )}
                            </button>
                        )}
                    </div>

                    {/* Slider */}
                    <div className="relative">
                        {(() => {
                            const currentImages = activeTab === 'exterior' ? images.exterior : images.interior;
                            const totalImages = currentImages?.length || 0;
                            
                            if (totalImages === 0) return null;

                            const openModal = (index: number) => {
                                setModalImageIndex(index);
                                setModalOpen(true);
                            };

                            // Show all images if 3 or less
                            if (totalImages <= 3) {
                                return (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {currentImages.map((img: any, idx: number) => (
                                            <div key={img.id}>
                                                <div 
                                                    className="relative h-64 rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition"
                                                    onClick={() => openModal(idx)}
                                                >
                                                    <Image
                                                        src={img.image_url}
                                                        alt={img.title || activeTab}
                                                        fill
                                                        className="object-cover"
                                                        unoptimized
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                );
                            }

                            const handlePrev = () => {
                                setCurrentIndex((prev) => {
                                    if (prev === 0) return totalImages - 3;
                                    return prev - 1;
                                });
                            };

                            const handleNext = () => {
                                setCurrentIndex((prev) => {
                                    if (prev >= totalImages - 3) return 0;
                                    return prev + 1;
                                });
                            };

                            return (
                                <>
                                    {/* Slider Container */}
                                    <div className="overflow-hidden">
                                        <div 
                                            className="flex transition-transform duration-500 ease-in-out"
                                            style={{ 
                                                transform: `translateX(-${currentIndex * 100 / 3}%)`,
                                            }}
                                        >
                                            {currentImages.map((img: any, idx: number) => (
                                                <div 
                                                    key={img.id} 
                                                    className="w-1/3 flex-shrink-0 px-2"
                                                >
                                                    <div 
                                                        className="relative h-64 rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition"
                                                        onClick={() => openModal(idx)}
                                                    >
                                                        <Image
                                                            src={img.image_url}
                                                            alt={img.title || activeTab}
                                                            fill
                                                            className="object-cover"
                                                            unoptimized
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Navigation Buttons */}
                                    <button
                                        onClick={handlePrev}
                                        className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 p-3 rounded-full shadow-xl transition z-10 border border-gray-200"
                                    >
                                        <ChevronLeft className="w-6 h-6 text-gray-900" />
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 p-3 rounded-full shadow-xl transition z-10 border border-gray-200"
                                    >
                                        <ChevronRight className="w-6 h-6 text-gray-900" />
                                    </button>

                                    {/* Indicators */}
                                    <div className="flex justify-center gap-2 mt-4">
                                        {currentImages.map((_: any, idx: number) => {
                                            const isInRange = idx >= currentIndex && idx < currentIndex + 3;
                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={() => setCurrentIndex(Math.max(0, Math.min(idx, totalImages - 3)))}
                                                    className={`h-2 rounded-full transition-all ${
                                                        isInRange
                                                            ? 'w-8 bg-primary'
                                                            : 'w-2 bg-gray-300 hover:bg-gray-400'
                                                    }`}
                                                />
                                            );
                                        })}
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                </div>
            )}

            {/* Cars Grid */}
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
                                <div className="h-48 w-full overflow-hidden bg-gray-200">
                                    {car.imageUrl ? (
                                        <img
                                            src={car.imageUrl}
                                            alt={car.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
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

            {/* Image Modal */}
            {modalOpen && (() => {
                const currentImages = activeTab === 'exterior' ? images.exterior : images.interior;
                const totalImages = currentImages?.length || 0;

                const handleModalPrev = () => {
                    setModalImageIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
                };

                const handleModalNext = () => {
                    setModalImageIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
                };

                return (
                    <div 
                        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                        onClick={() => setModalOpen(false)}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setModalOpen(false)}
                            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-3 rounded-full transition z-10"
                        >
                            <X className="w-6 h-6 text-white" />
                        </button>

                        {/* Image */}
                        <div 
                            className="relative w-full max-w-6xl h-[80vh]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={currentImages[modalImageIndex].image_url}
                                alt={currentImages[modalImageIndex].title || activeTab}
                                fill
                                className="object-contain"
                                unoptimized
                            />
                        </div>

                        {/* Navigation Buttons */}
                        {totalImages > 1 && (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleModalPrev(); }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full transition"
                                >
                                    <ChevronLeft className="w-8 h-8 text-white" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleModalNext(); }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full transition"
                                >
                                    <ChevronRight className="w-8 h-8 text-white" />
                                </button>
                            </>
                        )}

                        {/* Image Counter */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                            {modalImageIndex + 1} / {totalImages}
                        </div>
                    </div>
                );
            })()}
        </div>
    );
}