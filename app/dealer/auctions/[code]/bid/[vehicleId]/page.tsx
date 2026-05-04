"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { api, auth } from "@/lib/api";
import { numberToIndianWords } from "@/lib/utils";
import {
  ArrowLeft,
  Car,
  Gavel,
  Send,
  Clock,
  User,
  ChevronDown,
} from "lucide-react";
import { getDashboardRoute } from "@/utils/getDashboardRoute";

interface Bid {
  id: number;
  dealer: {
    id: string;
    name: string;
    business_name: string;
  };
  bid_amount: string;
  status: string;
  bid_time: string;
}

export default function BiddingPage() {
  const { code, vehicleId } = useParams();
  const router = useRouter();
  const { user } = useStore();
  const isDealer = user?.user_type === "dealer";
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [auction, setAuction] = useState<any>(null);
  const [vehicle, setVehicle] = useState<any>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [highestBid, setHighestBid] = useState<any>(null);
  const [totalBids, setTotalBids] = useState(0);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [activeImg, setActiveImg] = useState(0);
  const [specsOpen, setSpecsOpen] = useState(false);
  const [addInfoOpen, setAddInfoOpen] = useState(false);
  const [tick, setTick] = useState(0);
  // const intervalRef = useRef<any>(null)

  const [canRefresh, setCanRefresh] = useState(false);

  useEffect(() => {
    setCanRefresh(false);
    const timer = setTimeout(() => setCanRefresh(true), 30000);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    if (!canRefresh) return;
    setCanRefresh(false);
    fetchBids(); // ya jo bhi refresh karna hai
    setTimeout(() => setCanRefresh(true), 30000);
  };

  const isLive = (() => {
    if (!auction) return false;
    const now = Date.now();
    return (
      auction.status === "active" &&
      now >= new Date(auction.start_date).getTime() &&
      now <= new Date(auction.end_date).getTime()
    );
  })();

  const timeRemaining = (() => {
    if (!auction) return "00:00:00";
    const diff = new Date(auction.end_date).getTime() - Date.now();
    if (diff <= 0) return "00:00:00";
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  })();

  useEffect(() => {
    if (code && vehicleId) fetchAll();
  }, [code, vehicleId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [bids]);

  useEffect(() => {
    if (!isLive || !code || !vehicleId) return;

    const interval = setInterval(() => {
      fetchBids();
    }, 30000);

    return () => clearInterval(interval);
  }, [isLive, code, vehicleId]);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isLive]);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const token = auth.getToken();
      if (!token) {
        router.push("/login");
        return;
      }
      const res = await api.getBidders(
        code as string,
        vehicleId as string,
        token,
      );

      if (res.success) {
        const d = res.data;
        setAuction(d.auction);
        setVehicle(d.vehicle);
        setBids(d.bids || []);
        setHighestBid(d.highest_bid);
        setTotalBids(d.total_bids || 0);

        const basicVehicle = d.vehicle;

        const fullRes = await api.getCarDetails(basicVehicle.id);

        if (fullRes.success) {
          setVehicle(fullRes.data);
        } else {
          setVehicle(basicVehicle); // fallback
        }
      }
    } catch (err) {
      console.error("Failed to load:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBids = async () => {
    try {
      const token = auth.getToken();
      if (!token) return;
      const res = await api.getBidders(
        code as string,
        vehicleId as string,
        token,
      );
      console.log("FETCH BIDS");
      if (res.success) {
        const d = res.data;
        setBids(d.bids || []);
        setHighestBid(d.highest_bid);
        setTotalBids(d.total_bids || 0);
      }
    } catch (err) {
      console.error("Failed to fetch bids:", err);
    }
  };

  const handleBidSubmit = async () => {
    const amount = parseInt(bidAmount.replace(/,/g, ""));
    if (!amount || amount <= 0) {
      setError("Enter a valid bid amount");
      return;
    }
    try {
      setSubmitting(true);
      setError("");
      const token = auth.getToken();
      if (!token) {
        router.push("/login");
        return;
      }
      const res = await api.placeBid(
        code as string,
        vehicleId as string,
        amount,
        token,
      );
      if (res.success) {
        setBidAmount("");
        await fetchBids();
      } else {
        setError(res.message || "Failed to place bid");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  const handleAmountChange = (val: string) => {
    const clean = val.replace(/[^0-9]/g, "");
    if (clean.length > 10) return;
    setBidAmount(clean ? Number(clean).toLocaleString("en-IN") : "");
    if (error) setError("");
  };

  const rawAmount = parseInt(bidAmount.replace(/,/g, "") || "0");
  const highestBidAmount = highestBid ? Number(highestBid.bid_amount) : 0;
  const images: string[] = vehicle?.images?.map((img: any) => img.url) || [];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!vehicle || !auction) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500">Vehicle or auction not found.</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
        >
          Go Back
        </button>
      </div>
    );
  }

  const startingBid =
    bids?.length > 0 ? Number(bids[bids.length - 1].bid_amount) : 0;
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="max-w-6xl mx-auto px-4 py-5">
          {/* Back Button */}
          <button
            onClick={() => router.push(getDashboardRoute(user?.user_type))}
            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 transition text-sm mb-5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Auction
          </button>

          {/* Vehicle Title Row */}
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-blue-600 text-white font-bold text-sm px-3 py-1.5 rounded-md">
              #{vehicle.auction_number || vehicleId}
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {vehicle.brand} {vehicle.model}
            </h1>
            <span className="text-gray-400 font-medium text-base">
              | {vehicle.variant || vehicle.registration}
            </span>

            {isLive && (
              <div className="ml-auto flex items-center gap-1.5 bg-red-100 text-red-500 text-xs font-semibold px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                LIVE
              </div>
            )}
            <button
              onClick={handleRefresh}
              disabled={!canRefresh}
              className={`flex items-center justify-center w-8 h-8 rounded-full transition ${
                canRefresh
                  ? "bg-gray-100 hover:bg-gray-200 text-gray-600 cursor-pointer"
                  : "bg-gray-50 text-gray-300 cursor-not-allowed"
              }`}
              title={canRefresh ? "Refresh" : "Available in 30s"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5 items-start">
            {/* LEFT: Images + Specs */}
            <div className="space-y-3">
              {/* MAIN IMAGE */}
              <div className="relative w-full aspect-[4/3] max-h-[400px] rounded-2xl overflow-hidden bg-gray-100 group shadow-sm">
                {images.length > 0 ? (
                  <img
                    src={images[activeImg]}
                    alt="vehicle"
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Car className="w-16 h-16 text-gray-400" />
                  </div>
                )}

                {/* LEFT ARROW */}
                {images.length > 1 && (
                  <button
                    onClick={() =>
                      setActiveImg((prev) => (prev > 0 ? prev - 1 : prev))
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition"
                  >
                    ←
                  </button>
                )}

                {/* RIGHT ARROW */}
                {images.length > 1 && (
                  <button
                    onClick={() =>
                      setActiveImg((prev) =>
                        prev < images.length - 1 ? prev + 1 : prev,
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition"
                  >
                    →
                  </button>
                )}

                {/* IMAGE COUNT */}
                {images.length > 0 && (
                  <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    {activeImg + 1} / {images.length}
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="w-full max-w-[600px] overflow-hidden">
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {images.map((img: string, i: number) => (
                      <div
                        key={i}
                        onClick={() => setActiveImg(i)}
                        className={`ml-1 mt-1 min-w-[65px] h-[60px] rounded-lg overflow-hidden cursor-pointer transition-all duration-300 
                                ${
                                  activeImg === i
                                    ? "ring-2 ring-yellow-500 scale-105"
                                    : "opacity-80 hover:opacity-100 hover:scale-105"
                                }`}
                      >
                        <img
                          src={img}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Specs Accordion */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setSpecsOpen((o) => !o)}
                  className="w-full flex items-center justify-between px-4 py-3.5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
                >
                  Key Specifications
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform ${specsOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {specsOpen && (
                  <div className="px-4 pb-4 grid grid-cols-2 gap-3 border-t border-gray-100">
                    {/* {vehicle.make && <SpecItem label="Make" value={vehicle.make} />} */}
                    {vehicle.model && (
                      <SpecItem
                        label="Model"
                        value={`${vehicle.model} ${vehicle.variant || ""}`}
                      />
                    )}
                    {vehicle.year && (
                      <SpecItem label="Year" value={vehicle.year} />
                    )}
                    {vehicle.fuel_type && (
                      <SpecItem label="Fuel" value={vehicle.fuel_type} />
                    )}
                    {vehicle.km_driven && (
                      <SpecItem
                        label="KMs Run"
                        value={Number(vehicle.km_driven).toLocaleString(
                          "en-IN",
                        )}
                      />
                    )}
                    {vehicle.transmission && (
                      <SpecItem
                        label="Transmission"
                        value={vehicle.transmission}
                      />
                    )}
                    {/* {vehicle.engine_cc && <SpecItem label="Engine" value={`${vehicle.engine_cc} cc`} />} */}
                    {vehicle.color && (
                      <SpecItem label="Colour" value={vehicle.color} />
                    )}
                  </div>
                )}
              </div>

              {/* Additional Info Accordion */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setAddInfoOpen((o) => !o)}
                  className="w-full flex items-center justify-between px-4 py-3.5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
                >
                  Additional Information
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform ${addInfoOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {addInfoOpen && (
                  <div className="px-4 pb-4 grid grid-cols-2 gap-3 border-t border-gray-100 capitalize">
                    {vehicle.ownership && (
                      <SpecItem label="Owner" value={vehicle.ownership} />
                    )}
                    {vehicle.registration_number && (
                      <SpecItem
                        label="Registration"
                        value={vehicle.registration_number}
                      />
                    )}

                    {vehicle.has_insurance !== undefined && (
                      <SpecItem
                        label="Insurance"
                        value={
                          vehicle.has_insurance ? "Available" : "Not Available"
                        }
                      />
                    )}
                    {/* finance */}
                    {vehicle.has_finance == undefined && (
                      <SpecItem
                        label="Finance"
                        value={
                          vehicle.has_finance ? "Available" : "Not Available"
                        }
                      />
                    )}

                    {vehicle.body_type && (
                      <SpecItem label="Body Type" value={vehicle.body_type} />
                    )}

                    {vehicle.location && (
                      <SpecItem label="Location" value={vehicle.location} />
                    )}

                    {vehicle.insurance_expiry && (
                      <SpecItem
                        label="Insurance Expiry"
                        value={vehicle.insurance_expiry}
                      />
                    )}

                    {/* {vehicle.expected_selling_price && (
                      <SpecItem
                        label="Expected Price"
                        value={`₹${Number(vehicle.expected_selling_price).toLocaleString('en-IN')}`}
                      />
                    )} */}

                    {/* {vehicle.minimum_selling_price && (
                      <SpecItem
                        label="Min Price"
                        value={`₹${Number(vehicle.minimum_selling_price).toLocaleString('en-IN')}`}
                      />
                    )} */}

                    {/* {vehicle.reconditioning_cost && (
                      <SpecItem
                        label="Reconditioning"
                        value={`₹${Number(vehicle.reconditioning_cost).toLocaleString('en-IN')}`}
                      />
                    )}

                    {vehicle.accessories_cost && (
                      <SpecItem
                        label="Accessories Cost"
                        value={`₹${Number(vehicle.accessories_cost).toLocaleString('en-IN')}`}
                      />
                    )} */}

                    {/* {vehicle.other_expenses && (
                      <SpecItem
                        label="Other Expenses"
                        value={`₹${Number(vehicle.other_expenses).toLocaleString('en-IN')}`}
                      />
                    )} */}
                  </div>
                )}
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                {/* Title */}
                <p className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 bg-blue-600 rounded-full inline-block" />
                  Description
                </p>

                {/* Content */}
                <p className="text-sm text-gray-600 leading-relaxed text-justify">
                  {vehicle?.description
                    ? vehicle.description
                    : "No description provided for this vehicle."}
                </p>
              </div>
            </div>

            {/* RIGHT: Auction Panel */}
            <div className="space-y-3">
              {/* Countdown Timer */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-1">
                  Auction Ends In
                </p>
                <p
                  className={`font-mono text-5xl font-bold tracking-wider ${isLive ? "text-red-500" : "text-gray-400"}`}
                >
                  {timeRemaining}
                </p>
              </div>

              {/* Auction Rules */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 ">
                <p className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 bg-yellow-500 rounded-full inline-block" />
                  Auction Rules
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-400">Start Date</p>
                    <p className="text-sm font-bold text-gray-800">
                      {auction.start_date
                        ? new Date(auction.start_date).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">End Date</p>
                    <p className="text-sm font-bold text-gray-800 whitespace-nowrap">
                      {auction.end_date
                        ? new Date(auction.end_date).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </p>
                  </div>
                  {/* <div>
                    <p className="text-xs text-gray-400">Max Bids</p>
                    <p className="text-sm font-bold text-gray-800">{vehicle.minimum_selling_price|| '—'}</p>
                  </div> */}
                  {/* <div>
                    <p className="text-xs text-gray-400">Min Bid</p>
                    <p className="text-sm font-bold text-gray-800">
                      {startingBid > 0 ? `₹${startingBid.toLocaleString('en-IN')}` : '—'}
                    </p>
                  </div> */}
                </div>
              </div>

              {/* Current Highest Bid */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Current Highest Bid
                  <span className="text-green-500 font-normal  ml-1 capitalize ">
                    (
                    {highestBid
                      ? ` ${highestBid.dealer.name || highestBid.dealer.business_name}`
                      : "No bids yet"}
                    )
                  </span>
                </p>
                <p className="text-4xl font-bold text-gray-900 font-mono">
                  ₹
                  {highestBidAmount > 0
                    ? highestBidAmount.toLocaleString("en-IN")
                    : "0"}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500">
                    Participant Bids:{" "}
                    <span className="font-bold text-gray-800">{totalBids}</span>
                  </p>
                  {/* <div className="flex items-center gap-1.5 text-xs text-green-600 font-semibold">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  Viewing: <span className="font-bold">{auction.viewing_count || 0}</span>
                </div> */}
                </div>
              </div>

              {/* Bids Chat + Input */}
              <div className="bg-white rounded-xl border border-gray-200 flex flex-col">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-xl">
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    Live Bids
                  </div>
                  <span className="text-xs text-gray-400">
                    {totalBids} bid{totalBids !== 1 ? "s" : ""}
                  </span>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-[140px] max-h-[220px] bg-gray-50/50">
                  {bids.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-24 text-center">
                      <p className="text-sm text-gray-400 font-medium">
                        No bids placed yet.
                      </p>
                    </div>
                  ) : (
                    bids.map((bid, i) => {
                      const isMine = bid.dealer.id === user?.id;
                      const isHighest = highestBid && bid.id === highestBid.id;
                      const amount = Number(bid.bid_amount);
                      return (
                        <div
                          key={bid.id || i}
                          className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                        >
                          <div className="max-w-[80%]">
                            <div
                              className={`rounded-2xl px-3 py-2 ${
                                isMine
                                  ? "bg-blue-900 text-white rounded-br-sm"
                                  : "bg-white border border-gray-200 rounded-bl-sm"
                              } ${isHighest ? "ring-2 ring-green-400 ring-offset-1" : ""}`}
                            >
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <User
                                  className={`w-3 h-3 ${isMine ? "text-white/50" : "text-gray-400"}`}
                                />
                                <span
                                  className={`text-[10px] font-semibold ${isMine ? "text-white/70" : "text-gray-500"}`}
                                >
                                  {isMine ? "You" : bid.dealer.name}
                                </span>
                                {isHighest && (
                                  <span
                                    className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                                      isMine
                                        ? "bg-white/20 text-white"
                                        : "bg-green-100 text-green-700"
                                    }`}
                                  >
                                    HIGHEST
                                  </span>
                                )}
                              </div>
                              <p
                                className={`text-base font-bold font-mono ${isMine ? "text-white" : "text-gray-900"}`}
                              >
                                ₹{amount.toLocaleString("en-IN")}
                              </p>
                              <p
                                className={`text-[9px] mt-0.5 ${isMine ? "text-white/50" : "text-gray-400"}`}
                              >
                                {numberToIndianWords(amount)}
                              </p>
                            </div>
                            <p
                              className={`text-[9px] mt-1 px-1 text-gray-400 ${isMine ? "text-right" : ""}`}
                            >
                              {new Date(bid.bid_time).toLocaleTimeString(
                                "en-IN",
                                { hour: "2-digit", minute: "2-digit" },
                              )}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Bid Input */}
                <div className="p-3 border-t border-gray-100 bg-white rounded-b-xl">
                  {!isLive ? (
                    <p className="text-center text-sm text-gray-400 py-2 font-medium">
                      {new Date(auction.end_date).getTime() < Date.now()
                        ? "This auction has ended"
                        : "Bidding will start when the auction goes live"}
                    </p>
                  ) : !isDealer ? (
                    //SHOWROOM VIEW ONLY
                    <p className="text-center text-sm text-blue-600 py-2 font-semibold">
                      You are viewing this auction as showroom
                    </p>
                  ) : (
                    // ONLY DEALER CAN BID
                    <>
                      {rawAmount > 0 && (
                        <p className="text-xs text-blue-600 font-semibold mb-1.5 px-1">
                          {numberToIndianWords(rawAmount)}
                        </p>
                      )}

                      {error && (
                        <p className="text-xs text-red-500 mb-1.5 px-1">
                          {error}
                        </p>
                      )}

                      <div className="flex gap-2">
                        <div className="flex-1 relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
                            ₹
                          </span>
                          <input
                            type="text"
                            value={bidAmount}
                            onChange={(e) => handleAmountChange(e.target.value)}
                            onKeyDown={(e) =>
                              e.key === "Enter" &&
                              !submitting &&
                              handleBidSubmit()
                            }
                            placeholder="Enter bid amount"
                            className={`w-full pl-7 pr-3 py-2.5 border rounded-lg text-sm font-semibold outline-none transition-colors ${
                              error
                                ? "border-red-400"
                                : "border-gray-200 focus:border-blue-400"
                            }`}
                            disabled={submitting}
                          />
                        </div>

                        <button
                          onClick={handleBidSubmit}
                          disabled={submitting || !bidAmount}
                          className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-1.5 disabled:opacity-50 transition-colors"
                        >
                          {submitting ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Send className="w-3.5 h-3.5" />
                          )}
                          {submitting ? "Placing..." : "Place Bid"}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SpecItem({ label, value }: { label: string; value: any }) {
  return (
    <div className="pt-3">
      <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">
        {label}
      </p>
      <p className="text-sm font-semibold text-gray-800 mt-0.5">{value}</p>
    </div>
  );
}
