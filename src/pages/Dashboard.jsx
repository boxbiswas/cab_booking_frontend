import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AppLayout from '../components/layout/AppLayout';
import MapView from '../components/ride/MapView';
import PickupSelector from '../components/ride/PickupSelector';
import DestinationSelector from '../components/ride/DestinationSelector';
import RideTypeSelector from '../components/ride/RideTypeSelector';
import FareEstimate from '../components/ride/FareEstimate';
import ConfirmRideButton from '../components/ride/ConfirmRideButton';
import ActiveRideCard from '../components/ride/ActiveRideCard';

import { calculateRoute, setPickup, setDestination } from '../redux/slices/mapSlice';
import { fetchFareEstimates, setCurrentRide, setDriverLocation, addNotification, getRideDetails, setSelectedTier } from '../redux/slices/rideSlice';
import { setVerifiedPayment, openReceiptModal } from '../redux/slices/paymentSlice';
import RatingModal from '../components/ride/RatingModal';
import DriverProfileModal from '../components/ride/DriverProfileModal';
import CancelRideModal from '../components/ride/CancelRideModal';
import EmergencySosModal from '../components/ride/EmergencySosModal';
import MultiStopModal from '../components/ride/MultiStopModal';
import PaymentModal from '../components/payment/PaymentModal';
import ReceiptModal from '../components/payment/ReceiptModal';
import { getSocket, joinRideRoom, leaveRideRoom } from '../socket';
import { Sparkles, Car } from 'lucide-react';
import { toast } from 'react-toastify';

export default function Dashboard() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { pickup, destination, route } = useSelector((state) => state.map);
    const { currentRide, bookingSuccess, driverLocation } = useSelector((state) => state.ride);
    const processedPaymentKeys = useRef(new Set());

    // Auto-detect rider location on startup (browser GPS if granted, else network IP)
    useEffect(() => {
        let detected = false;
        if (typeof window !== 'undefined' && 'geolocation' in navigator && 'permissions' in navigator) {
            navigator.permissions.query({ name: 'geolocation' }).then((status) => {
                if (status.state === 'granted') {
                    navigator.geolocation.getCurrentPosition((pos) => {
                        detected = true;
                        dispatch(setPickup({
                            address: "Current Location",
                            shortName: "My GPS Location",
                            latitude: pos.coords.latitude,
                            longitude: pos.coords.longitude
                        }));
                    }, null, { timeout: 6000, enableHighAccuracy: false });
                }
            }).catch(() => { });
        }

        // If not already resolved by GPS, detect city via network IP
        setTimeout(() => {
            if (!detected) {
                fetch('https://ipapi.co/json/')
                    .then(r => r.json())
                    .then(data => {
                        const lat = data.latitude || data.lat;
                        const lon = data.longitude || data.lon;
                        const city = data.city || data.region;
                        if (lat && lon && city) {
                            dispatch(setPickup({
                                address: `${city}, ${data.region || ''}, ${data.country_name || 'India'}`.replace(/,\s*,/, ','),
                                shortName: `${city} (Area)`,
                                latitude: parseFloat(lat),
                                longitude: parseFloat(lon)
                            }));
                        }
                    })
                    .catch(() => { });
            }
        }, 1200);
    }, [dispatch]);

    // Check for rebooked route stored in sessionStorage from Ride History (Day 9)
    useEffect(() => {
        try {
            const rebookData = sessionStorage.getItem('hopin_rebook_route');
            if (rebookData) {
                const parsed = JSON.parse(rebookData);
                if (parsed.pickup) {
                    dispatch(setPickup({
                        address: parsed.pickup.address,
                        shortName: parsed.pickup.address.split(',')[0] || 'Pickup',
                        latitude: parsed.pickup.lat,
                        longitude: parsed.pickup.lng
                    }));
                }
                if (parsed.dropoff) {
                    dispatch(setDestination({
                        address: parsed.dropoff.address,
                        shortName: parsed.dropoff.address.split(',')[0] || 'Destination',
                        latitude: parsed.dropoff.lat,
                        longitude: parsed.dropoff.lng
                    }));
                }
                if (parsed.rideType) {
                    dispatch(setSelectedTier(parsed.rideType));
                }
                sessionStorage.removeItem('hopin_rebook_route');
            }
        } catch { }
    }, [dispatch]);

    // Auto-calculate route when pickup and destination are selected
    useEffect(() => {
        if (pickup?.latitude && destination?.latitude) {
            dispatch(calculateRoute({ pickup, destination }));
        }
    }, [pickup, destination, dispatch]);

    // Auto-calculate fare estimates when route distance/duration are available
    useEffect(() => {
        if (route?.distanceKm && route?.durationMin) {
            dispatch(fetchFareEstimates({
                distanceKm: route.distanceKm,
                durationMin: route.durationMin
            }));
        }
    }, [route, dispatch]);

    // Real-Time Socket.IO event listeners for live ride tracking and alerts
    useEffect(() => {
        if (!currentRide?.id) return;

        joinRideRoom(currentRide.id, user?.id);
        const socket = getSocket();

        const handleStatusUpdate = ({ status, ride }) => {
            if (ride) {
                dispatch(setCurrentRide(ride));
            }
        };

        const handleLocationUpdate = (loc) => {
            dispatch(setDriverLocation(loc));
        };

        const handleNotification = (notif) => {
            dispatch(addNotification(notif));
            toast.info(`${notif.title}: ${notif.message}`, {
                icon: notif.type === 'arriving' ? '📍' : (notif.type === 'completed' ? '🏁' : '🚗')
            });
        };

        const handlePaymentSuccess = ({ rideId, payment }) => {
            if (rideId === currentRide?.id && payment) {
                const paymentKey = `${rideId}_${payment.id || payment.amount}`;
                if (processedPaymentKeys.current.has(paymentKey)) {
                    return;
                }
                processedPaymentKeys.current.add(paymentKey);

                dispatch(getRideDetails(rideId));
                dispatch(setVerifiedPayment(payment));
                dispatch(openReceiptModal());
                toast.success(`Payment verified! $${payment.amount} recorded in PostgreSQL.`, {
                    toastId: `payment-${paymentKey}`,
                    icon: '💳'
                });
            }
        };

        const handlePaymentFailed = ({ message }) => {
            toast.error(`Payment failed: ${message}`);
        };

        socket.on('ride_status_update', handleStatusUpdate);
        socket.on('driver_location_update', handleLocationUpdate);
        socket.on('notification', handleNotification);
        socket.on('payment_success', handlePaymentSuccess);
        socket.on('payment_failed', handlePaymentFailed);

        return () => {
            socket.off('ride_status_update', handleStatusUpdate);
            socket.off('driver_location_update', handleLocationUpdate);
            socket.off('notification', handleNotification);
            socket.off('payment_success', handlePaymentSuccess);
            socket.off('payment_failed', handlePaymentFailed);
            leaveRideRoom(currentRide.id);
        };
    }, [currentRide?.id, user?.id, dispatch]);

    const [mobileView, setMobileView] = useState('booking');

    return (
        <AppLayout>
            <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3B2A2A] font-display">
                            Hey {user?.name?.split(' ')[0] || 'Rider'}, ready to ride?
                        </h1>
                        <p className="text-xs sm:text-sm text-[#7A6A6A]">
                            Choose your pickup and destination to calculate routes and live fares.
                        </p>
                    </div>

                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-1 border border-white/70 self-start sm:self-auto">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#059669] animate-pulse" />
                        <span className="text-xs font-semibold text-[#3B2A2A]">Interactive Map Online</span>
                    </div>
                </div>

                <div className="flex lg:hidden items-center p-1 bg-white/70 backdrop-blur-md rounded-2xl border border-white/80 shadow-xs">
                    <button
                        type="button"
                        onClick={() => setMobileView('booking')}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                            mobileView === 'booking'
                                ? 'bg-[#FF7A59] text-white shadow-[0_4px_12px_rgba(255,122,89,0.3)]'
                                : 'text-[#7A6A6A] hover:text-[#3B2A2A]'
                        }`}
                    >
                        <Car className="w-4 h-4" />
                        <span>{currentRide && bookingSuccess ? 'Ride Status' : 'Plan Ride'}</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setMobileView('map')}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 relative ${
                            mobileView === 'map'
                                ? 'bg-[#FF7A59] text-white shadow-[0_4px_12px_rgba(255,122,89,0.3)]'
                                : 'text-[#7A6A6A] hover:text-[#3B2A2A]'
                        }`}
                    >
                        <span className="w-2 h-2 rounded-full bg-[#FF7A59]" />
                        <span>Live Map</span>
                        {driverLocation?.latitude && (
                            <span className="w-2 h-2 rounded-full bg-[#059669] animate-ping" />
                        )}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className={`lg:col-span-5 space-y-5 ${mobileView === 'booking' ? 'block' : 'hidden lg:block'}`}>
                        {currentRide && bookingSuccess ? (
                            <ActiveRideCard
                                ride={currentRide}
                                onViewMap={() => setMobileView('map')}
                            />
                        ) : (
                            <div className="card glass-3 border border-white/80 shadow-2xl p-5 sm:p-6 space-y-5 animate-fade-in">
                                <div className="flex items-center justify-between pb-3 border-b border-[#E8DFDF]/60">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF7A59] to-[#E8532E] flex items-center justify-center text-white shadow-sm">
                                            <Car className="w-4 h-4" />
                                        </div>
                                        <h2 className="text-xl font-bold text-[#3B2A2A] font-display">
                                            Plan Your Ride
                                        </h2>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setMobileView('map')}
                                        className="lg:hidden text-[11px] font-bold text-[#FF7A59] bg-[#FFF3EE] px-2.5 py-1 rounded-full border border-[#FFC9B5] flex items-center gap-1"
                                    >
                                        <span>View Map</span>
                                        <span>→</span>
                                    </button>
                                </div>

                                <PickupSelector />
                                <DestinationSelector />
                                <RideTypeSelector />
                                {destination && <FareEstimate />}
                                <ConfirmRideButton />
                            </div>
                        )}
                    </div>

                    <div className={`lg:col-span-7 h-[420px] sm:h-[500px] lg:h-[620px] sticky top-24 rounded-3xl overflow-hidden shadow-2xl border border-white/80 relative ${mobileView === 'map' ? 'block' : 'hidden lg:block'}`}>
                        <MapView
                            pickup={pickup}
                            destination={destination}
                            route={route}
                            driverLocation={driverLocation}
                            driverName={currentRide?.driverName}
                            className="w-full h-full"
                        />

                        <div className="lg:hidden absolute bottom-4 left-4 right-4 z-10 flex justify-center">
                            <button
                                type="button"
                                onClick={() => setMobileView('booking')}
                                className="px-5 py-2.5 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-gray-200 text-xs font-extrabold text-[#3B2A2A] hover:bg-white flex items-center gap-2 active:scale-95 transition-all"
                            >
                                <Car className="w-4 h-4 text-[#FF7A59]" />
                                <span>{currentRide && bookingSuccess ? 'View Ride Details' : 'Back to Booking'}</span>
                            </button>
                        </div>
                    </div>
                </div>

                <RatingModal />
                <DriverProfileModal />
                <CancelRideModal />
                <EmergencySosModal />
                <MultiStopModal />
                <PaymentModal ride={currentRide} />
                <ReceiptModal ride={currentRide} />
            </div>
        </AppLayout>
    );
}
