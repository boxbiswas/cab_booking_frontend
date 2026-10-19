import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchPlaces, clearSuggestions } from '../../redux/slices/mapSlice';
import { Search, MapPin, X, Loader2 } from 'lucide-react';

export default function LocationSearch({
    placeholder = "Search street, landmark, or city...",
    value,
    onSelect,
    icon: CustomIcon = Search,
    accentColor = "text-[#FF7A59]"
}) {
    const [searchTerm, setSearchTerm] = useState(value?.shortName || value?.address || '');
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const dispatch = useDispatch();
    const { suggestions, isSearching } = useSelector((state) => state.map);

    // Sync input when value prop changes externally
    useEffect(() => {
        if (value?.shortName || value?.address) {
            setSearchTerm(value.shortName || value.address);
        }
    }, [value]);

    // Debounced search query
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchTerm.trim().length >= 2 && isOpen) {
                dispatch(searchPlaces(searchTerm.trim()));
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, isOpen, dispatch]);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (place) => {
        setSearchTerm(place.shortName || place.address);
        setIsOpen(false);
        dispatch(clearSuggestions());
        onSelect(place);
    };

    const handleClear = () => {
        setSearchTerm('');
        setIsOpen(false);
        dispatch(clearSuggestions());
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <div className="relative flex items-center">
                <div className={`absolute left-3.5 flex items-center pointer-events-none ${accentColor}`}>
                    <CustomIcon className="w-5 h-5" />
                </div>
                <input
                    type="text"
                    placeholder={placeholder}
                    value={searchTerm}
                    onFocus={() => setIsOpen(true)}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setIsOpen(true);
                    }}
                    className="input pl-11 pr-10 text-sm font-medium"
                />
                <div className="absolute right-3 flex items-center">
                    {isSearching ? (
                        <Loader2 className="w-4 h-4 text-[#FF7A59] animate-spin" />
                    ) : searchTerm ? (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="text-[#A39494] hover:text-[#3B2A2A]"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    ) : null}
                </div>
            </div>

            {/* Suggestions Dropdown */}
            {isOpen && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 glass-3 rounded-2xl p-2 shadow-2xl z-50 max-h-60 overflow-y-auto border border-white/80 animate-fade-in">
                    <p className="text-[10px] uppercase font-bold text-[#A39494] px-3 py-1 tracking-wider">
                        Suggested Locations
                    </p>
                    {suggestions.map((place) => (
                        <button
                            key={place.id}
                            type="button"
                            onClick={() => handleSelect(place)}
                            className="w-full text-left px-3 py-2.5 rounded-xl flex items-start gap-3 hover:bg-white/80 transition-colors group"
                        >
                            <div className="w-7 h-7 rounded-lg bg-[#FFF3EE] flex items-center justify-center text-[#FF7A59] shrink-0 mt-0.5 group-hover:bg-[#FF7A59] group-hover:text-white transition-colors">
                                <MapPin className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-[#3B2A2A] truncate">
                                    {place.shortName || place.address.split(',')[0]}
                                </p>
                                <p className="text-xs text-[#7A6A6A] truncate">
                                    {place.address}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
