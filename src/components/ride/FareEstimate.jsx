import React from 'react';
import { useSelector } from 'react-redux';
import { Tag, Sparkles, Navigation, Clock, Info } from 'lucide-react';

export default function FareEstimate() {
    const { route } = useSelector((state) => state.map);
    const { selectedTier, estimates, loadingEstimates } = useSelector((state) => state.ride);

    const activeEstimate = estimates?.find((e) => e.rideType === selectedTier);

    const distanceKm = route?.distanceKm || 5.2;
    const durationMin = route?.durationMin || 14;

    const baseFare = activeEstimate?.breakdown?.baseFare || 4.00;
    const distanceCharge = activeEstimate?.breakdown?.distanceCharge || Number((distanceKm * 1.75).toFixed(2));
    const timeCharge = activeEstimate?.breakdown?.timeCharge || Number((durationMin * 0.35).toFixed(2));
    const totalFare = activeEstimate?.estimatedFare || Number((baseFare + distanceCharge + timeCharge).toFixed(2));

    return (
        <div className="card glass-2 border border-white/70 p-4 sm:p-5 space-y-3.5">
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

            {/* Line Item Charges */}
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
            </div>

            {/* Total Row separated by dashed divider */}
            <div className="pt-3 border-t border-dashed border-[#E8DFDF] flex items-center justify-between">
                <div>
                    <span className="block text-xs font-bold text-[#7A6A6A] uppercase tracking-wider">Estimated Total</span>
                    <span className="text-[11px] text-[#A39494]">Guaranteed upfront price</span>
                </div>
                <div className="text-right">
                    <span className="font-display font-extrabold text-2xl sm:text-3xl text-[#3B2A2A] text-transparent bg-clip-text bg-gradient-to-r from-[#3B2A2A] to-[#E8532E]">
                        ${totalFare.toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
    );
}
