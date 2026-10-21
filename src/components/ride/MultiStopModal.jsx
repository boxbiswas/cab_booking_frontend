import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    closeStopsModal,
    addPlannedStop,
    removePlannedStop,
    addRideStops
} from '../../redux/slices/rideSlice';
import {
    MapPin,
    Plus,
    Trash2,
    X,
    Navigation,
    Route,
    Loader2,
    CheckCircle2
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function MultiStopModal() {
    const dispatch = useDispatch();
    const { stopsModalOpen, plannedStops, currentRide, stopsLoading, currentRideStops } = useSelector((state) => state.ride);

    const [newAddress, setNewAddress] = useState("");
    const [newShortName, setNewShortName] = useState("");

    if (!stopsModalOpen) return null;

    // Popular quick intermediate waypoint presets
    const PRESETS = [
        { name: "Coffee Shop / Cafe", address: "Blue Tokai Coffee, Saket Community Centre, New Delhi", lat: 28.5280, lng: 77.2180 },
        { name: "ATM / Bank Stop", address: "HDFC Bank ATM, Sector 29 Market, Gurugram", lat: 28.4680, lng: 77.0630 },
        { name: "Metro Station", address: "Hauz Khas Metro Station (Gate 2), New Delhi", lat: 28.5432, lng: 77.2065 },
        { name: "Convenience Store", address: "24SEVEN Store, DLF Phase 2, Gurugram", lat: 28.4890, lng: 77.0870 }
    ];

    const handleAddStopLocally = (item) => {
        const address = item?.address || newAddress.trim();
        const shortName = item?.name || newShortName.trim() || address.split(',')[0];
        const latitude = item?.lat || 28.5300 + (Math.random() * 0.02);
        const longitude = item?.lng || 77.2100 + (Math.random() * 0.02);

        if (!address) {
            toast.warning("Please enter a stop address");
            return;
        }

        dispatch(addPlannedStop({
            address,
            shortName,
            latitude,
            longitude
        }));

        setNewAddress("");
        setNewShortName("");
        toast.success(`Stop added: ${shortName}`);
    };

    // If ride is already booked, persist directly to backend POST /rides/:id/stops
    const handleSaveToActiveRide = async () => {
        if (!currentRide?.id) {
            dispatch(closeStopsModal());
            return;
        }

        if (plannedStops.length === 0) {
            toast.warning("No new stops to add");
            return;
        }

        try {
            const formattedStops = plannedStops.map((s, idx) => ({
                address: s.address,
                latitude: s.latitude,
                longitude: s.longitude,
                sequence: (currentRideStops?.length || 0) + idx + 1
            }));

            const res = await dispatch(addRideStops({
                rideId: currentRide.id,
                stops: formattedStops
            })).unwrap();

            toast.success(`Route updated! New fare: $${res.updatedFare?.toFixed(2)} (${res.newDistanceKm} km)`);
            dispatch(closeStopsModal());
        } catch (error) {
            toast.error(typeof error === 'string' ? error : "Failed to add stops to active ride");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-white/80 overflow-hidden animate-sheet-up">
                {/* Header */}
                <div className="p-5 bg-gradient-to-r from-[#FFF5F2] to-[#FFEBE5] border-b border-[#FFD6CA] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF7A59] to-[#E8532E] text-white flex items-center justify-center shadow-md">
                            <Route className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-extrabold text-lg text-[#3B2A2A] font-display">
                                Multi-Stop Route Planner
                            </h3>
                            <p className="text-xs text-[#7A6A6A]">
                                Add intermediate stops along your ride
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => dispatch(closeStopsModal())}
                        className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 text-[#7A6A6A] flex items-center justify-center transition-all shadow-xs"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
                    {/* Input new stop */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[#5C4A4A] uppercase tracking-wider block">
                            Add Waypoint:
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newAddress}
                                onChange={(e) => setNewAddress(e.target.value)}
                                placeholder="Enter stop address or location..."
                                className="input text-xs flex-1"
                            />
                            <button
                                type="button"
                                onClick={() => handleAddStopLocally()}
                                className="btn btn-primary btn-sm px-3.5 flex items-center gap-1 text-xs"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add</span>
                            </button>
                        </div>
                    </div>

                    {/* Quick Presets */}
                    <div>
                        <span className="text-[11px] font-bold text-[#A39494] block mb-1.5 uppercase">
                            Quick Suggestions:
                        </span>
                        <div className="grid grid-cols-2 gap-1.5">
                            {PRESETS.map((p, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => handleAddStopLocally(p)}
                                    className="p-2 rounded-xl text-left bg-[#FFF9F6] border border-[#FFE0D6] hover:bg-[#FFEBE5] text-[11px] font-semibold text-[#5C4A4A] flex items-center gap-1.5 transition-colors"
                                >
                                    <MapPin className="w-3.5 h-3.5 text-[#FF7A59] shrink-0" />
                                    <span className="truncate">{p.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Ordered Stops List */}
                    <div className="space-y-2 pt-2 border-t border-gray-100">
                        <label className="text-xs font-bold text-[#5C4A4A] uppercase tracking-wider flex items-center justify-between">
                            <span>Ordered Stops ({plannedStops.length + (currentRideStops?.length || 0)})</span>
                            <span className="text-[11px] text-[#A39494] font-normal">+2.5 km & 6 min per stop</span>
                        </label>

                        {/* Existing active ride stops */}
                        {currentRideStops && currentRideStops.length > 0 && (
                            <div className="space-y-1.5 mb-2">
                                <span className="text-[10px] font-bold text-emerald-600 uppercase">Confirmed on Ride:</span>
                                {currentRideStops.map((s, idx) => (
                                    <div key={s.id || idx} className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                                                {s.sequence || idx + 1}
                                            </span>
                                            <span className="text-gray-800 font-medium truncate">{s.address}</span>
                                        </div>
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Planned stops */}
                        {plannedStops.length === 0 && (!currentRideStops || currentRideStops.length === 0) ? (
                            <div className="py-6 text-center text-gray-400 text-xs border border-dashed rounded-2xl">
                                <Route className="w-7 h-7 mx-auto mb-1 opacity-40 text-gray-400" />
                                No intermediate stops added yet
                            </div>
                        ) : (
                            <div className="space-y-1.5">
                                {plannedStops.map((stop, idx) => (
                                    <div
                                        key={idx}
                                        className="p-2.5 rounded-xl bg-white border border-[#E8DFDF] flex items-center justify-between text-xs shadow-xs"
                                    >
                                        <div className="flex items-center gap-2 min-w-0">
                                            <span className="w-5 h-5 rounded-full bg-[#FF7A59] text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                                                {(currentRideStops?.length || 0) + idx + 1}
                                            </span>
                                            <span className="text-[#3B2A2A] font-semibold truncate">
                                                {stop.address}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => dispatch(removePlannedStop(idx))}
                                            className="w-7 h-7 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 flex items-center justify-center transition-colors shrink-0"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 bg-gray-50 border-t border-[#E8DFDF] flex items-center justify-between">
                    <span className="text-xs text-[#7A6A6A]">
                        {currentRide?.id ? "Will update driver route and fare" : "Fare will update automatically"}
                    </span>

                    <button
                        type="button"
                        onClick={currentRide?.id ? handleSaveToActiveRide : () => dispatch(closeStopsModal())}
                        disabled={stopsLoading}
                        className="btn btn-primary btn-sm text-xs px-4"
                    >
                        {stopsLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <span>Done ({plannedStops.length} stops)</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
