import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedTier } from '../../redux/slices/rideSlice';
import { Check, Users, Clock } from 'lucide-react';

const TIER_CARDS = [
    {
        type: 'SEDAN',
        name: 'HopIn Sedan',
        emoji: '🚗',
        desc: 'Comfortable 4-door everyday ride',
        capacity: 4,
        defaultEta: '3 min',
        basePrice: '$14.50'
    },
    {
        type: 'HATCHBACK',
        name: 'HopIn Mini',
        emoji: '🚙',
        desc: 'Affordable compact city trips',
        capacity: 4,
        defaultEta: '4 min',
        basePrice: '$11.20'
    },
    {
        type: 'SUV',
        name: 'HopIn XL',
        emoji: '🚐',
        desc: 'Spacious 6-seater for luggage',
        capacity: 6,
        defaultEta: '5 min',
        basePrice: '$22.00'
    },
    {
        type: 'AUTO',
        name: 'HopIn Auto',
        emoji: '🛺',
        desc: 'Quick transit through traffic',
        capacity: 3,
        defaultEta: '2 min',
        basePrice: '$8.50'
    }
];

export default function RideTypeSelector() {
    const dispatch = useDispatch();
    const { selectedTier, estimates, loadingEstimates } = useSelector((state) => state.ride);

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-[#5C4A4A] uppercase tracking-wider">
                    Choose Vehicle Type
                </label>
                <span className="text-xs text-[#7A6A6A]">
                    {loadingEstimates ? 'Updating fares...' : 'Fares include local taxes'}
                </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {TIER_CARDS.map((card) => {
                    const isSelected = selectedTier === card.type;
                    const estimate = estimates?.find((e) => e.rideType === card.type);
                    const displayFare = estimate ? `$${estimate.estimatedFare.toFixed(2)}` : card.basePrice;
                    const displayEta = estimate?.eta || card.defaultEta;

                    return (
                        <div
                            key={card.type}
                            onClick={() => dispatch(setSelectedTier(card.type))}
                            className={`p-3.5 rounded-2xl cursor-pointer transition-all flex flex-col justify-between relative ${
                                isSelected
                                    ? 'bg-gradient-to-br from-[#FFF3EE] to-[#FFE3D8] border-2 border-[#FF7A59] shadow-[0_8px_24px_rgba(255,122,89,0.25)] -translate-y-0.5'
                                    : 'glass-1 border border-white/70 hover:bg-white/80 hover:-translate-y-0.5'
                            }`}
                        >
                            {/* Selected Badge */}
                            {isSelected && (
                                <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-[#FF7A59] text-white flex items-center justify-center shadow-sm">
                                    <Check className="w-3 h-3 stroke-[3]" />
                                </div>
                            )}

                            <div>
                                <div className="text-3xl mb-1.5">{card.emoji}</div>
                                <h4 className="font-bold text-sm text-[#3B2A2A] font-display">
                                    {card.name.replace('HopIn ', '')}
                                </h4>
                                <div className="flex items-center gap-2 text-[11px] text-[#7A6A6A] mt-0.5">
                                    <span className="flex items-center gap-0.5">
                                        <Clock className="w-3 h-3 text-[#FF7A59]" /> {displayEta}
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-0.5">
                                        <Users className="w-3 h-3" /> {card.capacity}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-3 pt-2 border-t border-[#E8DFDF]/60 flex items-baseline justify-between">
                                <span className="font-extrabold text-base text-[#3B2A2A] font-display">
                                    {displayFare}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
