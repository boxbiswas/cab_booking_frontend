import React from 'react';
import { useNavigate } from 'react-router-dom';
import PaymentDetails from './PaymentDetails';
import DownloadReceiptButton from './DownloadReceiptButton';
import {
    X,
    MapPin,
    Navigation,
    Car,
    Clock,
    Calendar,
    Phone,
    ShieldCheck,
    AlertCircle,
    CheckCircle2,
    RotateCcw,
    Receipt,
    ChevronRight,
    Star,
    MessageSquare
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function RideDetails({ ride, isOpen, onClose, onViewReceipt, onRateRide, onViewDriver }) {
    const navigate = useNavigate();

    if (!isOpen || !ride) return null;

    const isCompleted = ride.status === 'COMPLETED';
    const isCancelled = ride.status === 'CANCELLED';

    const getStatusBadge = () => {
        if (isCompleted) {
            return (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#E6F9F0] text-[#059669] border border-[#A7F3D0]">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                </span>
            );
        }
        if (isCancelled) {
            return (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA]">
                    <AlertCircle className="w-3.5 h-3.5" /> Cancelled
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-200">
                <Clock className="w-3.5 h-3.5" /> {ride.status}
            </span>
        );
    };

    const handleRebook = () => {
        // Pre-fill route into session for Dashboard re-booking
        try {
            sessionStorage.setItem('hopin_rebook_route', JSON.stringify({
                pickup: {
                    address: ride.pickupAddress,
                    lat: Number(ride.pickupLatitude),
                    lng: Number(ride.pickupLongitude)
                },
                dropoff: {
                    address: ride.dropoffAddress,
                    lat: Number(ride.dropoffLatitude),
                    lng: Number(ride.dropoffLongitude)
                },
                rideType: ride.rideType
            }));
            toast.info("Route loaded. Confirm your pickup & dropoff to rebook!");
            onClose();
            navigate('/');
        } catch {
            navigate('/');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                            <h3 className="font-extrabold text-base text-[#3B2A2A] font-display">
                                Trip Details
                            </h3>
                            <span className="text-[10px] font-mono font-semibold text-gray-400">
                                #{ride.id.substring(0, 8)}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-[#FF7A59]" />
                            {new Date(ride.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {getStatusBadge()}
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-5 overflow-y-auto text-xs text-[#5C4A4A]">
                    
                    {/* Route Card */}
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-3">
                        <div className="flex items-start gap-3">
                            <div className="w-3 h-3 rounded-full bg-[#FF7A59] mt-1 shrink-0 ring-4 ring-[#FF7A59]/20" />
                            <div className="min-w-0 flex-1">
                                <span className="text-[10px] uppercase font-bold text-gray-400">Pickup Location</span>
                                <p className="font-semibold text-xs text-[#3B2A2A] mt-0.5">{ride.pickupAddress}</p>
                            </div>
                        </div>

                        <div className="border-l-2 border-dashed border-gray-300 ml-1.5 h-3" />

                        <div className="flex items-start gap-3">
                            <div className="w-3 h-3 rounded-full bg-[#3B2A2A] mt-1 shrink-0 ring-4 ring-black/10" />
                            <div className="min-w-0 flex-1">
                                <span className="text-[10px] uppercase font-bold text-gray-400">Destination</span>
                                <p className="font-semibold text-xs text-[#3B2A2A] mt-0.5">{ride.dropoffAddress}</p>
                            </div>
                        </div>

                        {/* Distance & Vehicle Badge */}
                        <div className="pt-2.5 border-t border-gray-200/80 flex items-center justify-between text-xs text-gray-500 font-medium">
                            <span>Distance: <strong className="text-[#3B2A2A]">{ride.distanceKm} km</strong></span>
                            <span>Vehicle: <strong className="text-[#FF7A59]">{ride.rideType}</strong></span>
                            <span>Duration: <strong className="text-[#3B2A2A]">{ride.actualDurationMin || ride.estimatedDurationMin || 18} min</strong></span>
                        </div>
                    </div>

                    {/* Driver Card */}
                    <div className="p-3.5 rounded-2xl bg-white border border-gray-200 flex items-center justify-between shadow-xs">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF7A59] to-[#E8532E] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                                <Car className="w-5 h-5" />
                            </div>
                            <div>
                                <button
                                    type="button"
                                    onClick={() => onViewDriver && onViewDriver(ride)}
                                    className="font-bold text-xs text-[#3B2A2A] hover:text-[#FF7A59] transition-colors text-left block"
                                    title="View Driver Profile & Reviews"
                                >
                                    {ride.driverName || 'Vikramaditya Sharma'}
                                </button>
                                <p className="text-[11px] text-gray-500">
                                    {ride.driverVehicle || 'Maruti Suzuki Dzire'} • {ride.driverPlateNumber || 'DL 01 AB 4321'}
                                </p>
                                {ride.driverPhone && (
                                    <p className="text-[10px] text-gray-400 font-mono mt-0.5 flex items-center gap-1">
                                        <Phone className="w-2.5 h-2.5 text-[#059669]" /> {ride.driverPhone}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="text-right">
                            <button
                                type="button"
                                onClick={() => onViewDriver && onViewDriver(ride)}
                                className="text-xs font-bold text-[#E8532E] bg-[#FFEBE5] hover:bg-[#FFDDD3] px-2.5 py-1 rounded-full transition-colors inline-flex items-center gap-1"
                                title="Click to view driver rating & reviews"
                            >
                                <Star className="w-3 h-3 fill-current text-[#E8532E]" />
                                <span>{ride.driverRating ? Number(ride.driverRating).toFixed(2) : "4.94"}</span>
                            </button>
                            <p className="text-[10px] text-gray-400 mt-1 font-medium">Verified Driver</p>
                        </div>
                    </div>

                    {/* Trip Review & Rating Section (Day 10 - UC-09) */}
                    {isCompleted && (
                        <div className="p-3.5 rounded-2xl bg-[#FFF8F5] border border-[#FFD6CA] space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-[#3B2A2A] flex items-center gap-1.5">
                                    <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                                    <span>Rider Review</span>
                                </span>

                                {ride.review ? (
                                    <div className="flex items-center text-[#F59E0B]">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star
                                                key={s}
                                                className={`w-3.5 h-3.5 ${s <= ride.review.rating ? 'fill-[#F59E0B]' : 'text-gray-200'}`}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onClose();
                                            onRateRide && onRateRide(ride);
                                        }}
                                        className="py-1 px-3 rounded-xl bg-gradient-to-tr from-[#FF7A59] to-[#E8532E] text-white text-[11px] font-bold shadow-xs hover:scale-102 transition-all flex items-center gap-1"
                                    >
                                        <Star className="w-3 h-3 fill-current" />
                                        <span>Rate Driver Now</span>
                                    </button>
                                )}
                            </div>

                            {ride.review ? (
                                <div className="space-y-1">
                                    <p className="text-[#5C4A4A] italic text-xs">
                                        "{ride.review.feedback || 'No written feedback provided.'}"
                                    </p>
                                    <p className="text-[10px] text-gray-400 font-mono">
                                        Submitted on {new Date(ride.review.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-[#7A6A6A] text-[11px]">
                                    You haven't reviewed this ride yet. Share your experience to help the community!
                                </p>
                            )}
                        </div>
                    )}

                    {/* Cancellation Notice if Cancelled */}
                    {isCancelled && (
                        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 space-y-1">
                            <div className="flex items-center gap-1.5 font-bold">
                                <AlertCircle className="w-4 h-4 text-red-600" />
                                <span>Ride Cancelled</span>
                            </div>
                            <p className="text-[11px] text-red-600">
                                Reason: <strong>{ride.cancellationReason || 'Cancelled by rider before pickup'}</strong>
                            </p>
                            {ride.cancelledAt && (
                                <p className="text-[10px] text-red-400 font-mono">
                                    Cancelled at: {new Date(ride.cancelledAt).toLocaleTimeString()}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Trip Timeline */}
                    <div className="space-y-2">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                            Activity Timeline
                        </h4>
                        <div className="space-y-2 p-3 bg-gray-50 rounded-2xl border border-gray-100 text-[11px]">
                            <div className="flex justify-between items-center text-gray-600">
                                <span className="flex items-center gap-1.5">
                                    <Clock className="w-3 h-3 text-[#FF7A59]" /> Trip Requested
                                </span>
                                <span className="font-mono text-gray-400">
                                    {new Date(ride.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>

                            {ride.acceptedAt && (
                                <div className="flex justify-between items-center text-gray-600">
                                    <span className="flex items-center gap-1.5">
                                        <CheckCircle2 className="w-3 h-3 text-[#059669]" /> Driver Assigned
                                    </span>
                                    <span className="font-mono text-gray-400">
                                        {new Date(ride.acceptedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            )}

                            {ride.startedAt && (
                                <div className="flex justify-between items-center text-gray-600">
                                    <span className="flex items-center gap-1.5">
                                        <Car className="w-3 h-3 text-[#FF7A59]" /> Trip Started
                                    </span>
                                    <span className="font-mono text-gray-400">
                                        {new Date(ride.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            )}

                            {ride.completedAt && (
                                <div className="flex justify-between items-center text-gray-600">
                                    <span className="flex items-center gap-1.5">
                                        <ShieldCheck className="w-3 h-3 text-[#059669]" /> Trip Completed
                                    </span>
                                    <span className="font-mono text-gray-400">
                                        {new Date(ride.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Payment Details Section */}
                    <div className="pt-2 border-t border-gray-100">
                        <PaymentDetails ride={ride} />
                    </div>

                </div>

                {/* Footer Action Bar */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-2">
                    {isCompleted && (
                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                                onViewReceipt(ride.id);
                            }}
                            className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-[#FFF3EE] border border-[#FFD6CA] font-bold text-xs text-[#E8532E] hover:bg-[#FFEBE5] transition-all flex items-center justify-center gap-1.5 shadow-xs"
                        >
                            <Receipt className="w-4 h-4 text-[#FF7A59]" />
                            <span>View Official Receipt</span>
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={handleRebook}
                        className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-[#FF7A59] hover:bg-[#E8532E] font-bold text-xs text-white transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                    >
                        <RotateCcw className="w-4 h-4" />
                        <span>Rebook Route</span>
                    </button>
                </div>

            </div>
        </div>
    );
}
