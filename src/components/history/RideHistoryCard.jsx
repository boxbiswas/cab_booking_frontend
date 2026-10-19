import React from 'react';
import {
    MapPin,
    Navigation,
    Car,
    Clock,
    Calendar,
    ChevronRight,
    Receipt,
    CheckCircle2,
    AlertCircle,
    RotateCcw,
    Star
} from 'lucide-react';

export default function RideHistoryCard({ ride, onSelectRide, onViewReceipt, onRebook, onRateRide, onViewDriver }) {
    if (!ride) return null;

    const isCompleted = ride.status === 'COMPLETED';
    const isCancelled = ride.status === 'CANCELLED';

    const fare = Number(ride.payment?.amount || ride.finalFare || ride.estimatedFare || 15.00).toFixed(2);
    const dateFormatted = new Date(ride.createdAt).toLocaleString([], {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const getStatusBadge = () => {
        if (isCompleted) {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E6F9F0] text-[#059669] border border-[#A7F3D0]">
                    <CheckCircle2 className="w-3 h-3" /> Completed
                </span>
            );
        }
        if (isCancelled) {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA]">
                    <AlertCircle className="w-3 h-3" /> Cancelled
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-600 border border-blue-200">
                <Clock className="w-3 h-3" /> {ride.status}
            </span>
        );
    };

    return (
        <div className="bg-white rounded-3xl border border-gray-200/90 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group p-5 space-y-4">
            
            {/* Top Bar: Date, Ride Tier, Status */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#FFF3EE] text-[#FF7A59] flex items-center justify-center">
                        <Car className="w-3.5 h-3.5" />
                    </div>
                    <div>
                        <span className="font-extrabold text-xs text-[#3B2A2A]">{ride.rideType || 'SEDAN'}</span>
                        <p className="text-[10px] text-gray-400 font-mono">{dateFormatted}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {getStatusBadge()}
                </div>
            </div>

            {/* Route Addresses */}
            <div className="space-y-2 text-xs">
                {/* Pickup */}
                <div className="flex items-start gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF7A59] mt-1 shrink-0 ring-2 ring-[#FF7A59]/30" />
                    <div className="min-w-0 flex-1">
                        <span className="text-[10px] uppercase font-bold text-gray-400">Pickup</span>
                        <p className="font-semibold text-xs text-[#3B2A2A] truncate">{ride.pickupAddress}</p>
                    </div>
                </div>

                {/* Vertical connector */}
                <div className="border-l-2 border-dashed border-gray-300 ml-1 h-2" />

                {/* Dropoff */}
                <div className="flex items-start gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#3B2A2A] mt-1 shrink-0 ring-2 ring-black/20" />
                    <div className="min-w-0 flex-1">
                        <span className="text-[10px] uppercase font-bold text-gray-400">Dropoff</span>
                        <p className="font-semibold text-xs text-[#3B2A2A] truncate">{ride.dropoffAddress}</p>
                    </div>
                </div>
            </div>

            {/* Middle Info: Driver, Distance & Fare */}
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <div className="min-w-0">
                    <button
                        type="button"
                        onClick={() => onViewDriver && onViewDriver(ride)}
                        className="text-xs font-bold text-[#3B2A2A] hover:text-[#FF7A59] transition-colors truncate block text-left"
                        title="View Driver Profile & Reviews"
                    >
                        {ride.driverName || 'Vikramaditya Sharma'}
                    </button>
                    <p className="text-[11px] text-gray-400 truncate">
                        {ride.distanceKm} km • {ride.actualDurationMin || ride.estimatedDurationMin || 18} min
                    </p>
                </div>

                <div className="text-right shrink-0">
                    <p className="text-base font-extrabold text-[#3B2A2A] font-display">
                        ${fare}
                    </p>
                    <p className="text-[10px] font-bold text-[#059669]">
                        {ride.payment?.status === 'SUCCEEDED' || isCompleted ? 'Paid' : 'Pending'}
                    </p>
                </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-1.5 flex-wrap">
                <button
                    type="button"
                    onClick={() => onSelectRide(ride)}
                    className="flex-1 min-w-[90px] py-2 px-3 rounded-xl bg-gray-50 hover:bg-gray-100 font-bold text-xs text-[#3B2A2A] transition-all flex items-center justify-center gap-1 active:scale-95"
                >
                    <span>Details</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#FF7A59] transition-colors" />
                </button>

                {isCompleted && (
                    <>
                        {ride.review ? (
                            <span className="py-1.5 px-2.5 rounded-xl bg-[#FFF8E8] border border-[#FDE68A] text-xs font-bold text-[#D97706] flex items-center gap-1" title="Your Rating">
                                <Star className="w-3.5 h-3.5 fill-current" />
                                <span>{ride.review.rating}★</span>
                            </span>
                        ) : (
                            <button
                                type="button"
                                onClick={() => onRateRide && onRateRide(ride)}
                                className="py-2 px-3 rounded-xl bg-[#FFF3EE] hover:bg-[#FFEBE5] font-bold text-xs text-[#E8532E] border border-[#FFD6CA] transition-all flex items-center gap-1 active:scale-95 shadow-xs"
                                title="Rate this Driver"
                            >
                                <Star className="w-3.5 h-3.5 fill-current" />
                                <span>Rate</span>
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={() => onViewReceipt(ride.id)}
                            className="py-2 px-2.5 rounded-xl bg-white hover:bg-gray-50 font-bold text-xs text-gray-700 border border-gray-200 transition-all flex items-center gap-1 active:scale-95"
                            title="View Receipt"
                        >
                            <Receipt className="w-3.5 h-3.5 text-[#FF7A59]" />
                            <span className="hidden sm:inline">Receipt</span>
                        </button>
                    </>
                )}

                <button
                    type="button"
                    onClick={() => onRebook(ride)}
                    className="py-2 px-2.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 font-bold text-xs text-gray-600 transition-all flex items-center gap-1 active:scale-95"
                    title="Rebook this route"
                >
                    <RotateCcw className="w-3.5 h-3.5 text-[#FF7A59]" />
                    <span className="hidden sm:inline">Rebook</span>
                </button>
            </div>

        </div>
    );
}
