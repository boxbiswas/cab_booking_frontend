import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    closeEarningsModal,
    fetchDriverEarnings
} from '../../redux/slices/paymentSlice';
import {
    DollarSign,
    Car,
    TrendingUp,
    CheckCircle2,
    X,
    ExternalLink,
    MapPin,
    Calendar,
    Award
} from 'lucide-react';

export default function DriverEarningsModal() {
    const dispatch = useDispatch();
    const { isEarningsModalOpen, driverEarnings, loading } = useSelector((state) => state.payment);

    useEffect(() => {
        if (isEarningsModalOpen) {
            dispatch(fetchDriverEarnings());
        }
    }, [isEarningsModalOpen, dispatch]);

    if (!isEarningsModalOpen) return null;

    const summary = driverEarnings?.summary;
    const driver = driverEarnings?.driver;
    const trips = driverEarnings?.trips || [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="px-6 py-5 bg-gradient-to-r from-[#059669] to-[#047857] text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shadow-inner">
                            <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-extrabold text-lg font-display">Driver Earnings Record</h3>
                            <p className="text-xs text-white/80">Completed Ride Payments & Driver Share Breakdown (Day 8)</p>
                        </div>
                    </div>
                    <button
                        onClick={() => dispatch(closeEarningsModal())}
                        className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors text-white"
                        aria-label="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 overflow-y-auto">
                    
                    {/* Driver Profile Bar */}
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-[#D1FAE5] text-[#059669] flex items-center justify-center font-bold text-lg">
                                {driver?.name?.charAt(0) || 'D'}
                            </div>
                            <div>
                                <h4 className="font-bold text-base text-[#3B2A2A]">{driver?.name || 'Vikramaditya Sharma'}</h4>
                                <p className="text-xs text-[#7A6A6A]">{driver?.vehicle || 'Maruti Suzuki Dzire'} • {driver?.plateNumber || 'DL 01 AB 4321'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#059669] bg-[#E6F9F0] px-3 py-1.5 rounded-full border border-[#A7F3D0] flex items-center gap-1">
                                <Award className="w-3.5 h-3.5" />
                                {driver?.rating || 4.94} Rating
                            </span>
                        </div>
                    </div>

                    {/* Stat Metrics Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="p-3.5 rounded-2xl bg-[#FFF6F3] border border-[#FFD6CA]">
                            <span className="text-[10px] font-bold uppercase text-[#7A6A6A]">Gross Fares</span>
                            <p className="text-xl font-extrabold text-[#3B2A2A] font-display pt-0.5">
                                ${summary?.totalGrossFares?.toFixed(2) || '0.00'}
                            </p>
                            <span className="text-[10px] text-[#A39494]">Rider Payments</span>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-[#FFF6F3] border border-[#FFD6CA]">
                            <span className="text-[10px] font-bold uppercase text-[#7A6A6A]">Platform Fee</span>
                            <p className="text-xl font-extrabold text-[#E8532E] font-display pt-0.5">
                                -${summary?.platformFees?.toFixed(2) || '0.00'}
                            </p>
                            <span className="text-[10px] text-[#E8532E]">15% commission</span>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-[#E6F9F0] border border-[#A7F3D0]">
                            <span className="text-[10px] font-bold uppercase text-[#059669]">Net Payout</span>
                            <p className="text-xl font-extrabold text-[#059669] font-display pt-0.5">
                                ${summary?.netDriverEarnings?.toFixed(2) || '0.00'}
                            </p>
                            <span className="text-[10px] text-[#059669] font-semibold">85% Driver Share</span>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200">
                            <span className="text-[10px] font-bold uppercase text-[#7A6A6A]">Completed</span>
                            <p className="text-xl font-extrabold text-[#3B2A2A] font-display pt-0.5">
                                {summary?.totalCompletedRides || 0}
                            </p>
                            <span className="text-[10px] text-[#A39494]">Paid Trips</span>
                        </div>
                    </div>

                    {/* Completed Trips Breakdown List */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h5 className="font-extrabold text-sm text-[#3B2A2A]">
                                Completed Trip Earnings Log ({trips.length})
                            </h5>
                            <span className="text-xs text-[#7A6A6A]">Live from PostgreSQL</span>
                        </div>

                        {trips.length === 0 ? (
                            <div className="p-6 rounded-2xl bg-gray-50 text-center text-xs text-[#7A6A6A]">
                                No completed ride earnings recorded yet. Complete and pay for a ride to record driver earnings!
                            </div>
                        ) : (
                            <div className="space-y-2.5">
                                {trips.map((trip) => (
                                    <div
                                        key={trip.rideId}
                                        className="p-4 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50/70 transition-all space-y-2"
                                    >
                                        <div className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-[#3B2A2A]">{trip.riderName}</span>
                                                <span className="text-[10px] text-[#A39494] flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(trip.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <span className="font-extrabold text-sm text-[#059669]">+${trip.netEarnings?.toFixed(2)}</span>
                                                <span className="text-[10px] text-[#A39494] block">Fare: ${trip.grossFare?.toFixed(2)}</span>
                                            </div>
                                        </div>

                                        <div className="text-[11px] text-[#5C4A4A] space-y-0.5">
                                            <p className="truncate">📍 <span className="font-semibold">{trip.pickup?.split(',')[0]}</span> → {trip.dropoff?.split(',')[0]}</p>
                                        </div>

                                        <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-[10px]">
                                            <span className="text-[#059669] font-bold flex items-center gap-1">
                                                <CheckCircle2 className="w-3 h-3" />
                                                Verified ({trip.paymentMethod})
                                            </span>
                                            <span className="text-[#A39494]">
                                                {trip.distanceKm} km • Platform cut: ${trip.platformFee?.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end">
                    <button
                        type="button"
                        onClick={() => dispatch(closeEarningsModal())}
                        className="py-2.5 px-6 rounded-xl bg-[#3B2A2A] hover:bg-black text-white font-bold text-xs transition-all shadow-sm"
                    >
                        Close
                    </button>
                </div>

            </div>
        </div>
    );
}
