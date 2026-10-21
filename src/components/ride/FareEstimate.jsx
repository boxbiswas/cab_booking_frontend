import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    validatePromoCode,
    clearAppliedPromo,
    openStopsModal
} from '../../redux/slices/rideSlice';
import {
    Tag,
    Sparkles,
    Navigation,
    Clock,
    Plus,
    X,
    Check,
    Loader2,
    Route,
    Percent
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function FareEstimate() {
    const dispatch = useDispatch();
    const { route } = useSelector((state) => state.map);
    const {
        selectedTier,
        estimates,
        loadingEstimates,
        appliedPromo,
        promoLoading,
        promoError,
        plannedStops
    } = useSelector((state) => state.ride);

    const [promoInput, setPromoInput] = useState('');

    const activeEstimate = estimates?.find((e) => e.rideType === selectedTier);

    // Additional distance and time from planned intermediate stops
    const stopsAddedDistKm = (plannedStops?.length || 0) * 2.5;
    const stopsAddedTimeMin = (plannedStops?.length || 0) * 6;

    const distanceKm = Number(((route?.distanceKm || 5.2) + stopsAddedDistKm).toFixed(1));
    const durationMin = (route?.durationMin || 14) + stopsAddedTimeMin;

    const baseFare = activeEstimate?.breakdown?.baseFare || 4.00;
    const distanceCharge = Number((distanceKm * (activeEstimate?.breakdown?.distanceCharge ? activeEstimate.breakdown.distanceCharge / (route?.distanceKm || 5.2) : 1.75)).toFixed(2));
    const timeCharge = Number((durationMin * 0.35).toFixed(2));
    const subtotalFare = Number((baseFare + distanceCharge + timeCharge).toFixed(2));

    const discountAmount = appliedPromo?.discountAmount || 0;
    const finalFare = Math.max(2.50, Number((subtotalFare - discountAmount).toFixed(2)));

    const handleApplyPromo = async (e) => {
        e.preventDefault();
        const code = promoInput.trim().toUpperCase();
        if (!code) {
            toast.warning("Please enter a promo code");
            return;
        }

        try {
            const res = await dispatch(validatePromoCode({
                code,
                rideFare: subtotalFare
            })).unwrap();

            toast.success(`Promo "${res.promotion?.code}" applied! You save $${res.discountAmount.toFixed(2)}.`);
            setPromoInput('');
        } catch (error) {
            toast.error(typeof error === 'string' ? error : "Invalid promo code");
        }
    };

    return (
        <div className="card glass-2 border border-white/70 p-4 sm:p-5 space-y-3.5">
            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-[#E8DFDF]/60">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#059669]" />
                    <h3 className="font-bold text-sm text-[#3B2A2A] font-display">Fare Breakdown</h3>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#7A6A6A]">
                    <span className="flex items-center gap-1">
                        <Navigation className="w-3.5 h-3.5 text-[#FF7A59]" /> {distanceKm} km
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#FF7A59]" /> {durationMin} min
                    </span>
                </div>
            </div>

            {loadingEstimates ? (
                <div className="space-y-3 animate-fade-in py-1">
                    <div className="flex justify-between items-center">
                        <div className="h-4 skeleton w-28" />
                        <div className="h-4 skeleton w-14" />
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="h-4 skeleton w-36" />
                        <div className="h-4 skeleton w-14" />
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="h-4 skeleton w-32" />
                        <div className="h-4 skeleton w-14" />
                    </div>
                    <div className="pt-3 border-t border-dashed border-[#E8DFDF] flex justify-between items-center">
                        <div className="h-6 skeleton w-28" />
                        <div className="h-8 skeleton w-24" />
                    </div>
                </div>
            ) : (
                <>
                    {/* Line Items */}
                    <div className="space-y-2 text-xs sm:text-sm text-[#5C4A4A]">
                        <div className="flex items-center justify-between">
                            <span>Base Tier Rate</span>
                            <span className="font-semibold text-[#3B2A2A]">${baseFare.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Distance Fare ({distanceKm} km)</span>
                            <span className="font-semibold text-[#3B2A2A]">${distanceCharge.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Estimated Travel Time ({durationMin} min)</span>
                            <span className="font-semibold text-[#3B2A2A]">${timeCharge.toFixed(2)}</span>
                        </div>

                        {/* Planned Stops Line */}
                        {plannedStops?.length > 0 && (
                            <div className="flex items-center justify-between text-xs text-[#0891B2] font-semibold bg-[#ECFEFF] px-2 py-1 rounded-lg">
                                <span className="flex items-center gap-1">
                                    <Route className="w-3 h-3" />
                                    <span>{plannedStops.length} Intermediary Stop(s)</span>
                                </span>
                                <span>+{stopsAddedDistKm} km</span>
                            </div>
                        )}

                        {/* Applied Promo Code Discount Line */}
                        {appliedPromo && (
                            <div className="flex items-center justify-between text-xs text-[#059669] font-bold bg-[#ECFDF5] px-2 py-1 rounded-lg border border-[#A7F3D0]">
                                <span className="flex items-center gap-1">
                                    <Percent className="w-3 h-3" />
                                    <span>Promo ({appliedPromo.code}):</span>
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span>-${discountAmount.toFixed(2)}</span>
                                    <button
                                        type="button"
                                        onClick={() => dispatch(clearAppliedPromo())}
                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                        title="Remove promo code"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Multi-Stop & Promo Code Actions */}
                    <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        {/* Multi-Stop Trigger */}
                        <button
                            type="button"
                            onClick={() => dispatch(openStopsModal())}
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#FF7A59] hover:text-[#E8532E] transition-colors self-start"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span>{plannedStops?.length > 0 ? `Manage Stops (${plannedStops.length})` : "+ Add Intermediate Stop"}</span>
                        </button>

                        {/* Promo Code Input / Indicator */}
                        {!appliedPromo ? (
                            <form onSubmit={handleApplyPromo} className="flex items-center gap-1.5 w-full sm:w-auto">
                                <div className="relative flex-1 sm:w-36">
                                    <input
                                        type="text"
                                        value={promoInput}
                                        onChange={(e) => setPromoInput(e.target.value)}
                                        placeholder="Promo Code"
                                        className="input text-xs py-1 px-2.5 uppercase font-mono tracking-wider w-full"
                                        maxLength={15}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={promoLoading}
                                    className="btn btn-secondary btn-sm text-xs py-1 px-2.5 font-bold shrink-0"
                                >
                                    {promoLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Apply"}
                                </button>
                            </form>
                        ) : (
                            <span className="text-[11px] font-bold text-[#059669] flex items-center gap-1">
                                <Check className="w-3 h-3" /> {appliedPromo.description || "Discount Applied"}
                            </span>
                        )}
                    </div>

                    {promoError && (
                        <p className="text-[11px] text-red-500 font-medium">
                            {promoError}
                        </p>
                    )}

                    {/* Total Fare Display */}
                    <div className="pt-3 border-t border-dashed border-[#E8DFDF] flex items-center justify-between">
                        <div>
                            <span className="block text-xs font-bold text-[#7A6A6A] uppercase tracking-wider">Estimated Total</span>
                            <span className="text-[11px] text-[#A39494]">Guaranteed upfront price</span>
                        </div>
                        <div className="text-right">
                            {appliedPromo && (
                                <span className="text-xs line-through text-gray-400 mr-2 font-semibold">
                                    ${subtotalFare.toFixed(2)}
                                </span>
                            )}
                            <span className="font-display font-extrabold text-2xl sm:text-3xl text-[#3B2A2A] text-transparent bg-clip-text bg-gradient-to-r from-[#3B2A2A] to-[#E8532E]">
                                ${finalFare.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
