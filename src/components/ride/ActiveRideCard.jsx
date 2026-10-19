import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    resetBookingState,
    acceptRide,
    declineRide,
    updateRideStatus,
    toggleDriverAvailability,
    getRideDetails,
    openReviewModal,
    openDriverProfileModal
} from '../../redux/slices/rideSlice';
import {
    openPaymentModal,
    openReceiptModal,
    openEarningsModal,
    simulateVerifiedPayment
} from '../../redux/slices/paymentSlice';
import PaymentModal from '../payment/PaymentModal';
import ReceiptModal from '../payment/ReceiptModal';
import { clearDestination } from '../../redux/slices/mapSlice';
import {
    Car,
    Star,
    Phone,
    Shield,
    CheckCircle2,
    Clock,
    MapPin,
    Navigation,
    UserCheck,
    AlertCircle,
    ChevronDown,
    ChevronUp,
    Play,
    Check,
    X,
    Radio,
    CreditCard,
    Receipt,
    Lock,
    TrendingUp
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function ActiveRideCard({ ride }) {
    const dispatch = useDispatch();
    const { driverAvailability, statusUpdating, driverLocation } = useSelector((state) => state.ride);
    const [showSimulationTools, setShowSimulationTools] = useState(false);
    const [autoMatchCountdown, setAutoMatchCountdown] = useState(4);

    const status = ride?.status || 'REQUESTED';

    // Auto-match simulation timer if ride is currently in REQUESTED status
    useEffect(() => {
        if (status !== 'REQUESTED' || !ride?.id) return;

        if (autoMatchCountdown > 0) {
            const timer = setTimeout(() => {
                setAutoMatchCountdown((prev) => prev - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (autoMatchCountdown === 0) {
            // Auto accept ride via backend endpoint
            dispatch(acceptRide({ rideId: ride.id }))
                .unwrap()
                .then(() => toast.success("HopIn driver accepted your ride request!"))
                .catch((err) => console.warn("Auto-match accept:", err));
        }
    }, [status, ride?.id, autoMatchCountdown, dispatch]);

    // Live polling to keep ride status synchronized with backend
    useEffect(() => {
        if (!ride?.id || status === 'COMPLETED' || status === 'CANCELLED') return;

        const interval = setInterval(() => {
            dispatch(getRideDetails(ride.id));
        }, 5000);

        return () => clearInterval(interval);
    }, [ride?.id, status, dispatch]);

    // Handle Manual Accept
    const handleAccept = async () => {
        if (!ride?.id) return;
        try {
            await dispatch(acceptRide({ rideId: ride.id })).unwrap();
            toast.success("Driver accepted the ride request!");
        } catch (error) {
            toast.error(typeof error === 'string' ? error : "Could not accept ride");
        }
    };

    // Handle Manual Decline
    const handleDecline = async () => {
        if (!ride?.id) return;
        try {
            await dispatch(declineRide(ride.id)).unwrap();
            toast.info("Ride request was declined by driver. Remains open for other drivers.");
        } catch (error) {
            toast.error("Decline action failed");
        }
    };

    // Handle Status Transition
    const handleStatusTransition = async (nextStatus) => {
        if (!ride?.id) return;
        try {
            await dispatch(updateRideStatus({ rideId: ride.id, status: nextStatus })).unwrap();
            toast.success(`Ride status updated to ${nextStatus.replace('_', ' ')}`);
        } catch (error) {
            toast.error(typeof error === 'string' ? error : "Status transition rejected by backend");
        }
    };

    // Test Double Accept / Multiple Driver Race Condition Prevention
    const handleTestRaceCondition = async () => {
        if (!ride?.id) return;
        try {
            await dispatch(acceptRide({
                rideId: ride.id,
                driverData: { driverName: "Second Driver (Competitor)" }
            })).unwrap();
            toast.warning("Warning: Multiple accept was not blocked.");
        } catch (error) {
            toast.success(`Prevention verified! Backend blocked with: "${error}"`);
        }
    };

    // Handle Booking Reset / Another Ride
    const handleBookAnother = () => {
        dispatch(resetBookingState());
        dispatch(clearDestination());
    };

    // Status step progress timeline definition
    const STEPS = [
        { key: 'REQUESTED', label: 'Requested' },
        { key: 'ACCEPTED', label: 'Assigned' },
        { key: 'DRIVER_ARRIVING', label: 'Arriving' },
        { key: 'IN_PROGRESS', label: 'On Trip' },
        { key: 'COMPLETED', label: 'Completed' }
    ];

    const currentStepIndex = STEPS.findIndex((s) => s.key === status);

    return (
        <div className="card glass-3 border border-white/80 shadow-2xl p-6 sm:p-7 space-y-6 animate-sheet-up">
            {/* Live Progress Stepper */}
            <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#7A6A6A]">
                    <span>Ride Status</span>
                    <span className="text-[#FF7A59] font-extrabold">{status.replace('_', ' ')}</span>
                </div>

                <div className="grid grid-cols-5 gap-1.5 items-center">
                    {STEPS.map((step, idx) => {
                        const isDone = currentStepIndex >= idx && status !== 'CANCELLED';
                        const isCurrent = currentStepIndex === idx && status !== 'CANCELLED';

                        return (
                            <div key={step.key} className="space-y-1">
                                <div
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                        isCurrent
                                            ? 'bg-[#FF7A59] animate-pulse'
                                            : isDone
                                            ? 'bg-[#FF7A59]'
                                            : 'bg-[#E8DFDF]'
                                    }`}
                                />
                                <p
                                    className={`text-[10px] text-center font-bold truncate ${
                                        isCurrent
                                            ? 'text-[#FF7A59]'
                                            : isDone
                                            ? 'text-[#3B2A2A]'
                                            : 'text-[#A39494]'
                                    }`}
                                >
                                    {step.label}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Status Header Banner */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E8DFDF]/60">
                <div className="flex items-center gap-2.5">
                    {status === 'REQUESTED' ? (
                        <span className="w-3.5 h-3.5 rounded-full bg-[#FF7A59] animate-ping" />
                    ) : status === 'COMPLETED' ? (
                        <CheckCircle2 className="w-5 h-5 text-[#059669]" />
                    ) : (
                        <span className="w-3.5 h-3.5 rounded-full bg-[#0891B2] animate-pulse" />
                    )}

                    <div>
                        <h3 className="font-extrabold text-xl text-[#3B2A2A] font-display">
                            {status === 'REQUESTED' && "Connecting with nearby driver..."}
                            {status === 'ACCEPTED' && "Driver Assigned!"}
                            {status === 'DRIVER_ARRIVING' && "Driver Arriving at Pickup!"}
                            {status === 'IN_PROGRESS' && "Trip in Progress"}
                            {status === 'COMPLETED' && "You've Arrived!"}
                            {status === 'CANCELLED' && "Ride Cancelled"}
                        </h3>
                        <p className="text-xs text-[#7A6A6A] font-medium flex items-center gap-1.5 flex-wrap">
                            {status === 'REQUESTED' && `Auto-matching in ${autoMatchCountdown}s...`}
                            {status === 'ACCEPTED' && (
                                <>
                                    <span>Driver en route to pickup</span>
                                    {driverLocation?.remainingEtaMin && (
                                        <span className="font-bold text-[#E8532E]">• ETA: {driverLocation.remainingEtaMin} min</span>
                                    )}
                                </>
                            )}
                            {status === 'DRIVER_ARRIVING' && "Driver has arrived at pickup location!"}
                            {status === 'IN_PROGRESS' && (
                                <>
                                    <span>On trip to destination</span>
                                    {driverLocation?.remainingEtaMin && (
                                        <span className="font-bold text-[#0891B2]">• {driverLocation.remainingEtaMin} min left</span>
                                    )}
                                    {driverLocation?.speedKmh && (
                                        <span className="text-[11px] text-[#A39494]">({driverLocation.speedKmh} km/h)</span>
                                    )}
                                </>
                            )}
                            {status === 'COMPLETED' && "Thank you for riding with HopIn"}
                            {status === 'CANCELLED' && "This booking was cancelled"}
                        </p>
                    </div>
                </div>

                <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                        status === 'COMPLETED'
                            ? 'bg-[#D1FAE5] text-[#059669]'
                            : status === 'CANCELLED'
                            ? 'bg-[#FEE2E2] text-[#DC2626]'
                            : 'bg-[#FFEBE5] text-[#E8532E]'
                    }`}
                >
                    {ride?.rideType || 'SEDAN'}
                </span>
            </div>

            {/* Searching Radar State for REQUESTED */}
            {status === 'REQUESTED' && (
                <div className="p-5 rounded-2xl bg-[#FFF8F6] border border-[#FFD6CA] flex flex-col items-center justify-center text-center space-y-3">
                    <div className="relative w-14 h-14 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full bg-[#FF7A59]/20 animate-ping" />
                        <div className="w-10 h-10 rounded-full bg-[#FF7A59] text-white flex items-center justify-center shadow-md">
                            <Radio className="w-5 h-5 animate-pulse" />
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-[#3B2A2A]">Searching within 3 km</h4>
                        <p className="text-xs text-[#7A6A6A]">Matching with available drivers nearby</p>
                    </div>
                    <div className="flex gap-2 w-full pt-1">
                        <button
                            type="button"
                            onClick={handleAccept}
                            disabled={statusUpdating}
                            className="btn btn-primary btn-sm flex-1 text-xs"
                        >
                            Accept as Driver Now
                        </button>
                        <button
                            type="button"
                            onClick={() => handleStatusTransition('CANCELLED')}
                            disabled={statusUpdating}
                            className="btn btn-secondary btn-sm text-xs text-[#DC2626]"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Assigned Driver Details Card (Shown once ACCEPTED or in progress) */}
            {status !== 'REQUESTED' && status !== 'CANCELLED' && (
                <div className="p-4 rounded-2xl glass-1 border border-white/70 flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                        <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#FF7A59] to-[#E8532E] flex items-center justify-center text-white text-xl font-bold shadow-sm">
                            {ride?.driverName ? ride.driverName[0] : 'V'}
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <h4 className="font-bold text-base text-[#3B2A2A] font-display">
                                    {ride?.driverName || "Vikramaditya Sharma"}
                                </h4>
                                <button
                                    type="button"
                                    onClick={() => dispatch(openDriverProfileModal(ride))}
                                    className="flex items-center gap-0.5 text-xs font-bold text-[#C9871A] bg-[#FFF8E8] hover:bg-[#FEEFC3] px-2 py-0.5 rounded-md transition-colors"
                                    title="View Driver Profile & Reviews"
                                >
                                    <Star className="w-3 h-3 fill-current" /> {ride?.driverRating ? Number(ride.driverRating).toFixed(2) : "4.94"}
                                    <span className="text-[10px] text-gray-400 font-normal ml-0.5">Reviews</span>
                                </button>
                            </div>
                            <p className="text-xs text-[#5C4A4A] mt-0.5 font-medium">
                                {ride?.driverVehicle || "Maruti Suzuki Dzire (Pearl White)"}
                            </p>
                            <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-[#3B2A2A] text-white tracking-widest">
                                {ride?.driverPlateNumber || "DL 01 AB 4321"}
                            </span>
                        </div>
                    </div>

                    <a
                        href={`tel:${ride?.driverPhone || '+919876543210'}`}
                        className="w-11 h-11 rounded-2xl glass-2 flex items-center justify-center text-[#E8532E] hover:bg-white transition-all shadow-sm"
                        title="Call Driver"
                    >
                        <Phone className="w-5 h-5" />
                    </a>
                </div>
            )}

            {/* Trip Route Summary */}
            <div className="space-y-3 text-xs sm:text-sm text-[#5C4A4A] bg-white/50 p-3.5 rounded-2xl border border-white/60">
                <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#FF7A59] shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                        <span className="text-[10px] uppercase font-bold text-[#A39494]">Pickup</span>
                        <p className="font-semibold text-[#3B2A2A] truncate">{ride?.pickupAddress}</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <Navigation className="w-4 h-4 text-[#3B2A2A] shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                        <span className="text-[10px] uppercase font-bold text-[#A39494]">Destination</span>
                        <p className="font-semibold text-[#3B2A2A] truncate">{ride?.dropoffAddress}</p>
                    </div>
                </div>
            </div>

            {/* Day 8 Payment Status Banner for Completed Rides */}
            {status === 'COMPLETED' && (
                <div className="space-y-2 animate-fade-in">
                    {ride?.payment?.status === 'SUCCEEDED' ? (
                        <div className="p-4 rounded-2xl bg-[#E6F9F0] border border-[#A7F3D0] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-[#D1FAE5] text-[#059669] flex items-center justify-center">
                                    <CheckCircle2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-extrabold text-xs text-[#059669]">Payment Verified & Completed</p>
                                    <p className="text-[11px] text-[#047857]">
                                        Recorded in PostgreSQL • Ref: {ride.payment.providerPaymentId?.substring(0, 15)}...
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                                {!ride?.review ? (
                                    <button
                                        type="button"
                                        onClick={() => dispatch(openReviewModal(ride))}
                                        className="px-3.5 py-2 rounded-xl bg-gradient-to-tr from-[#FF7A59] to-[#E8532E] text-xs font-extrabold text-white shadow-sm flex items-center gap-1.5 transition-all hover:scale-102"
                                    >
                                        <Star className="w-3.5 h-3.5 fill-current" />
                                        <span>Rate Driver</span>
                                    </button>
                                ) : (
                                    <span className="px-2.5 py-1.5 rounded-xl bg-[#FFF8E8] border border-[#FDE68A] text-xs font-bold text-[#D97706] flex items-center gap-1">
                                        <Star className="w-3.5 h-3.5 fill-current" />
                                        <span>Rated {ride.review.rating}★</span>
                                    </span>
                                )}
                                <button
                                    type="button"
                                    onClick={() => dispatch(openReceiptModal())}
                                    className="px-3.5 py-2 rounded-xl bg-white border border-[#A7F3D0] text-xs font-extrabold text-[#059669] hover:bg-[#D1FAE5] shadow-sm flex items-center gap-1.5 transition-all"
                                >
                                    <Receipt className="w-3.5 h-3.5" />
                                    <span>Receipt</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 rounded-2xl bg-[#FFF6F3] border border-[#FFD6CA] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-[#FFEBE5] text-[#E8532E] flex items-center justify-center">
                                    <AlertCircle className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-extrabold text-xs text-[#E8532E]">Payment Pending</p>
                                    <p className="text-[11px] text-[#7A6A6A]">Complete ride payment with Stripe</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => dispatch(openPaymentModal())}
                                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF7A59] to-[#E8532E] text-white text-xs font-extrabold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
                            >
                                <CreditCard className="w-3.5 h-3.5" />
                                <span>Pay ${parseFloat(ride?.finalFare || ride?.estimatedFare || 14.50).toFixed(2)}</span>
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Trip Fare & Action Footer */}
            <div className="pt-2 border-t border-[#E8DFDF]/60 flex items-center justify-between">
                <div>
                    <span className="text-[10px] uppercase font-bold text-[#A39494]">Total Fare</span>
                    <p className="font-display font-extrabold text-2xl text-[#3B2A2A]">
                        ${parseFloat(ride?.finalFare || ride?.estimatedFare || 14.50).toFixed(2)}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {status === 'COMPLETED' ? (
                        <>
                            {ride?.payment?.status !== 'SUCCEEDED' ? (
                                <button
                                    type="button"
                                    onClick={() => dispatch(openPaymentModal())}
                                    className="btn btn-primary btn-sm flex items-center gap-1.5"
                                >
                                    <Lock className="w-3.5 h-3.5" />
                                    <span>Pay Now</span>
                                </button>
                            ) : null}
                            <button
                                type="button"
                                onClick={handleBookAnother}
                                className="btn btn-secondary btn-sm"
                            >
                                Book Another Ride
                            </button>
                        </>
                    ) : status === 'CANCELLED' ? (
                        <button
                            type="button"
                            onClick={handleBookAnother}
                            className="btn btn-primary btn-sm"
                        >
                            Book Another Ride
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => handleStatusTransition('CANCELLED')}
                            disabled={status === 'IN_PROGRESS' || statusUpdating}
                            className="btn btn-secondary btn-sm text-[#DC2626] border-red-200 hover:bg-red-50"
                        >
                            Cancel Ride
                        </button>
                    )}
                </div>
            </div>

            {/* Day 5 & Day 8 Simulation Panel (For Testing Transitions, Acceptance & Stripe Payments) */}
            <div className="pt-3 border-t border-dashed border-[#E8DFDF]">
                <button
                    type="button"
                    onClick={() => setShowSimulationTools(!showSimulationTools)}
                    className="w-full flex items-center justify-between text-xs font-bold text-[#7A6A6A] hover:text-[#3B2A2A] py-1"
                >
                    <span className="flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-[#FF7A59]" />
                        Simulation & Payment Tester (Days 5–8)
                    </span>
                    {showSimulationTools ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showSimulationTools && (
                    <div className="mt-3 p-3.5 rounded-2xl bg-[#3B2A2A]/5 border border-[#3B2A2A]/10 space-y-3.5 text-xs">
                        {/* Driver Online Toggle */}
                        <div className="flex items-center justify-between pb-2 border-b border-black/5">
                            <span className="font-semibold text-[#5C4A4A]">Driver Availability:</span>
                            <button
                                type="button"
                                onClick={() => dispatch(toggleDriverAvailability(!driverAvailability))}
                                className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                                    driverAvailability
                                        ? 'bg-[#D1FAE5] text-[#059669]'
                                        : 'bg-[#F3F4F6] text-[#6B7280]'
                                }`}
                            >
                                {driverAvailability ? '● Online (Accepting)' : '○ Offline'}
                            </button>
                        </div>

                        {/* Lifecycle Transition Buttons */}
                        <div className="space-y-1.5">
                            <span className="font-semibold text-[#5C4A4A] block">Lifecycle Transitions:</span>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                                <button
                                    type="button"
                                    onClick={handleAccept}
                                    disabled={status !== 'REQUESTED' || statusUpdating}
                                    className="px-2 py-1.5 rounded-lg bg-white border border-gray-200 font-bold text-[#3B2A2A] hover:bg-gray-50 disabled:opacity-40"
                                >
                                    1. Accept Ride
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleStatusTransition('DRIVER_ARRIVING')}
                                    disabled={status !== 'ACCEPTED' || statusUpdating}
                                    className="px-2 py-1.5 rounded-lg bg-white border border-gray-200 font-bold text-[#3B2A2A] hover:bg-gray-50 disabled:opacity-40"
                                >
                                    2. Driver Arriving
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleStatusTransition('IN_PROGRESS')}
                                    disabled={status !== 'DRIVER_ARRIVING' || statusUpdating}
                                    className="px-2 py-1.5 rounded-lg bg-white border border-gray-200 font-bold text-[#3B2A2A] hover:bg-gray-50 disabled:opacity-40"
                                >
                                    3. Start Trip
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleStatusTransition('COMPLETED')}
                                    disabled={status !== 'IN_PROGRESS' || statusUpdating}
                                    className="px-2 py-1.5 rounded-lg bg-white border border-gray-200 font-bold text-[#059669] hover:bg-gray-50 disabled:opacity-40"
                                >
                                    4. Complete Ride
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDecline}
                                    disabled={status !== 'REQUESTED' || statusUpdating}
                                    className="px-2 py-1.5 rounded-lg bg-white border border-gray-200 font-bold text-[#D97706] hover:bg-gray-50 disabled:opacity-40"
                                >
                                    Decline Request
                                </button>
                                <button
                                    type="button"
                                    onClick={handleTestRaceCondition}
                                    className="px-2 py-1.5 rounded-lg bg-amber-50 border border-amber-200 font-bold text-[#B45309] hover:bg-amber-100"
                                    title="Verify that two drivers cannot accept the same ride"
                                >
                                    Test Double-Accept
                                </button>
                            </div>
                        </div>

                        {/* Day 8 Stripe Payments Simulation */}
                        <div className="pt-2 border-t border-black/5 space-y-1.5">
                            <span className="font-semibold text-[#5C4A4A] block">Day 8 Stripe Payment Simulation:</span>
                            <div className="grid grid-cols-2 gap-1.5">
                                <button
                                    type="button"
                                    onClick={async () => {
                                        try {
                                            await dispatch(simulateVerifiedPayment({
                                                rideId: ride.id,
                                                amount: ride.finalFare || ride.estimatedFare || 14.50,
                                                outcome: 'success'
                                            })).unwrap();
                                            toast.success("Webhook verified! Payment recorded in PostgreSQL.");
                                            dispatch(getRideDetails(ride.id));
                                        } catch (err) {
                                            toast.error(typeof err === 'string' ? err : 'Webhook test failed');
                                        }
                                    }}
                                    className="px-2 py-1.5 rounded-lg bg-[#E6F9F0] border border-[#A7F3D0] font-bold text-[#059669] hover:bg-[#D1FAE5] flex items-center justify-center gap-1"
                                >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Simulate Webhook Pay</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={async () => {
                                        try {
                                            await dispatch(simulateVerifiedPayment({
                                                rideId: ride.id,
                                                amount: ride.finalFare || ride.estimatedFare || 14.50,
                                                outcome: 'failed'
                                            })).unwrap();
                                            toast.info("Card decline webhook processed.");
                                        } catch (err) {
                                            toast.error("Failure webhook simulation error");
                                        }
                                    }}
                                    className="px-2 py-1.5 rounded-lg bg-red-50 border border-red-200 font-bold text-red-600 hover:bg-red-100 flex items-center justify-center gap-1"
                                >
                                    <X className="w-3.5 h-3.5" />
                                    <span>Simulate Decline</span>
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={() => dispatch(openEarningsModal())}
                                className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-white border border-gray-200 text-[#3B2A2A] font-bold hover:bg-gray-50 flex items-center justify-center gap-1.5"
                            >
                                <TrendingUp className="w-3.5 h-3.5 text-[#059669]" />
                                <span>View Driver Earnings Report (Day 8)</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            <PaymentModal ride={ride} />
            <ReceiptModal ride={ride} />
        </div>
    );
}
