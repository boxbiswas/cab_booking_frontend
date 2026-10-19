import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDestination } from '../../redux/slices/mapSlice';
import LocationSearch from './LocationSearch';
import { Navigation, Plane, Building2, ShoppingBag, Laptop } from 'lucide-react';

export default function DestinationSelector() {
    const dispatch = useDispatch();
    const { destination } = useSelector((state) => state.map);

    const popularShortcuts = [
        { label: "Airport", icon: Plane, place: { address: 'Indira Gandhi International Airport, Terminal 3, New Delhi', shortName: 'IGI Airport T3', latitude: 28.5562, longitude: 77.1000 } },
        { label: "Cyber City", icon: Laptop, place: { address: 'DLF Cyber City, Sector 24, Gurugram, Haryana', shortName: 'Cyber City', latitude: 28.4950, longitude: 77.0895 } },
        { label: "India Gate", icon: Building2, place: { address: 'India Gate, Rajpath, India Gate, New Delhi', shortName: 'India Gate', latitude: 28.6129, longitude: 77.2295 } },
        { label: "City Mall", icon: ShoppingBag, place: { address: 'Select Citywalk Mall, Saket District Centre, New Delhi', shortName: 'Select Citywalk', latitude: 28.5284, longitude: 77.2189 } },
    ];

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#5C4A4A] flex items-center gap-1.5 uppercase tracking-wider">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#3B2A2A] ring-2 ring-[#E8DFDF]" />
                    Drop-off Destination
                </label>
            </div>

            <LocationSearch
                placeholder="Where to? (e.g. Airport, Mall)..."
                value={destination}
                onSelect={(place) => dispatch(setDestination(place))}
                icon={Navigation}
                accentColor="text-[#3B2A2A]"
            />

            {/* Quick shortcuts */}
            {!destination && (
                <div className="flex items-center gap-2 mt-2.5 overflow-x-auto pb-1 no-scrollbar">
                    <span className="text-[11px] font-bold text-[#A39494] shrink-0">Popular:</span>
                    {popularShortcuts.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => dispatch(setDestination(item.place))}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold glass-1 hover:bg-white/90 text-[#5C4A4A] border border-white/60 shrink-0 transition-transform active:scale-95"
                            >
                                <Icon className="w-3 h-3 text-[#FF7A59]" />
                                {item.label}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
