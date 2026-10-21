import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    triggerEmergency,
    closeEmergencyModal,
    fetchEmergencyContacts
} from '../../redux/slices/rideSlice';
import {
    ShieldAlert,
    AlertOctagon,
    PhoneCall,
    MapPin,
    X,
    CheckCircle2,
    Users,
    Radio,
    Loader2
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function EmergencySosModal() {
    const dispatch = useDispatch();
    const {
        emergencyModalOpen,
        emergencyLoading,
        activeEmergencyAlert,
        emergencyContacts,
        currentRide
    } = useSelector((state) => state.ride);

    const [alertSent, setAlertSent] = useState(false);
    const [alertDetails, setAlertDetails] = useState(null);

    // Load saved emergency contacts when modal is opened
    useEffect(() => {
        if (emergencyModalOpen) {
            dispatch(fetchEmergencyContacts());
        }
    }, [emergencyModalOpen, dispatch]);

    if (!emergencyModalOpen || !currentRide) return null;

    const handleTriggerSos = async () => {
        // Read current location or fallback to ride pickup/driver location
        let lat = currentRide.pickupLatitude || 28.5355;
        let lng = currentRide.pickupLongitude || 77.3910;

        if (navigator.geolocation) {
            try {
                const pos = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3000 });
                });
                lat = pos.coords.latitude;
                lng = pos.coords.longitude;
            } catch {
                // Fallback coordinates
            }
        }

        try {
            const res = await dispatch(triggerEmergency({
                rideId: currentRide.id,
                latitude: lat,
                longitude: lng
            })).unwrap();

            setAlertSent(true);
            setAlertDetails(res);
            toast.error("EMERGENCY SOS ACTIVATED: Safety alerts and telemetry dispatched!", {
                autoClose: 10000
            });
        } catch (error) {
            toast.error(typeof error === 'string' ? error : "Failed to broadcast emergency SOS");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-2 border-red-300 overflow-hidden animate-sheet-up">
                {/* Header */}
                <div className="p-5 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner animate-pulse">
                            <ShieldAlert className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-extrabold text-xl font-display tracking-tight text-white">
                                Emergency Safety SOS
                            </h3>
                            <p className="text-xs text-red-100">
                                24/7 HopIn Rider Protection & Live Telemetry
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setAlertSent(false);
                            dispatch(closeEmergencyModal());
                        }}
                        className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body Content */}
                <div className="p-6 space-y-5">
                    {alertSent ? (
                        <div className="space-y-4 animate-fade-in">
                            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md shrink-0">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-extrabold text-sm text-red-900">
                                        Emergency SOS Dispatched
                                    </h4>
                                    <p className="text-xs text-red-700">
                                        Alert ID: {alertDetails?.alert?.id?.substring(0, 12)}...
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl glass-1 border border-gray-200 space-y-2 text-xs">
                                <div className="flex items-center justify-between font-semibold text-gray-700">
                                    <span className="flex items-center gap-1.5">
                                        <Users className="w-4 h-4 text-red-500" />
                                        Contacts Notified:
                                    </span>
                                    <span className="font-bold text-red-600">
                                        {alertDetails?.contactsNotified || emergencyContacts.length || 0} Contacts
                                    </span>
                                </div>
                                <div className="flex items-center justify-between font-semibold text-gray-700">
                                    <span className="flex items-center gap-1.5">
                                        <Radio className="w-4 h-4 text-emerald-600" />
                                        Provider Dispatch:
                                    </span>
                                    <span className="font-bold text-emerald-600">
                                        {alertDetails?.emergencyServicesNotified ? "Connected (112 Police)" : "Internal Telemetry Active"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between font-semibold text-gray-700">
                                    <span className="flex items-center gap-1.5">
                                        <MapPin className="w-4 h-4 text-red-500" />
                                        Shared Coordinates:
                                    </span>
                                    <span className="font-mono text-gray-900">
                                        {alertDetails?.alert?.latitude?.toFixed(4)}, {alertDetails?.alert?.longitude?.toFixed(4)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 text-center">
                            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                                Pressing the SOS button instantly streams your real-time GPS location, driver details (<strong className="text-gray-900">{currentRide.driverName || "Driver"}</strong>, <strong className="text-gray-900">{currentRide.driverPlateNumber || "Vehicle"}</strong>), and route telemetry to your configured emergency contacts and the safety response center.
                            </p>

                            {/* Prominent SOS Trigger Button */}
                            <div className="py-2 flex justify-center">
                                <button
                                    type="button"
                                    onClick={handleTriggerSos}
                                    disabled={emergencyLoading}
                                    className="w-40 h-40 rounded-full bg-gradient-to-tr from-red-600 via-rose-600 to-red-700 text-white font-black text-xl tracking-wider shadow-[0_0_35px_rgba(220,38,38,0.55)] hover:shadow-[0_0_50px_rgba(220,38,38,0.75)] active:scale-95 transition-all flex flex-col items-center justify-center gap-1 border-4 border-white ring-4 ring-red-300"
                                >
                                    {emergencyLoading ? (
                                        <>
                                            <Loader2 className="w-8 h-8 animate-spin" />
                                            <span className="text-xs uppercase tracking-normal">Sending...</span>
                                        </>
                                    ) : (
                                        <>
                                            <AlertOctagon className="w-10 h-10 animate-bounce" />
                                            <span>SOS</span>
                                            <span className="text-[10px] font-bold uppercase tracking-normal text-red-100">
                                                Press for Help
                                            </span>
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Saved Contacts summary */}
                            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200 text-left">
                                <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-1">
                                    <span className="flex items-center gap-1.5">
                                        <Users className="w-3.5 h-3.5 text-red-600" />
                                        Designated Emergency Contacts ({emergencyContacts.length})
                                    </span>
                                </div>
                                {emergencyContacts.length > 0 ? (
                                    <div className="text-[11px] text-gray-500 space-y-0.5">
                                        {emergencyContacts.map((c) => (
                                            <div key={c.id} className="flex justify-between">
                                                <span className="font-semibold text-gray-700">{c.name} ({c.relationship})</span>
                                                <span className="font-mono">{c.phone}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-[11px] text-gray-400">
                                        No specific contacts configured. Alert will be routed to the HopIn 24/7 Security Operations Center.
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Quick Call Emergency Helplines */}
                    <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-gray-100">
                        <a
                            href="tel:112"
                            className="btn bg-gray-900 hover:bg-black text-white btn-sm flex items-center justify-center gap-1.5 text-xs py-2.5 rounded-xl shadow-sm"
                        >
                            <PhoneCall className="w-3.5 h-3.5 text-red-400" />
                            <span>Call Police (112)</span>
                        </a>
                        <a
                            href="tel:+918001234567"
                            className="btn bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 btn-sm flex items-center justify-center gap-1.5 text-xs py-2.5 rounded-xl shadow-sm"
                        >
                            <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Safety Helpline</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
