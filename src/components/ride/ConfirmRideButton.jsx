import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { bookRide, addRideStops } from '../../redux/slices/rideSlice';
import { ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';

export default function ConfirmRideButton({ onBookingConfirmed }) {
    const dispatch = useDispatch();
    const { pickup, destination, route } = useSelector((state) => state.map);
    const {
        selectedTier,
        estimates,
        bookingLoading,
        bookingSuccess,
        appliedPromo,
        plannedStops
    } = useSelector((state) => state.ride);

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
    const totalFare = finalFare;

    const handleConfirm = async () => {
        if (!pickup?.address || !pickup?.latitude) {
            toast.error("Please specify a pickup location");
            return;
        }

        if (!destination?.address || !destination?.latitude) {
            toast.error("Please specify your drop-off destination");
            return;
        }

        try {
            const ridePayload = {
                pickupAddress: pickup.address,
                pickupLatitude: pickup.latitude,
                pickupLongitude: pickup.longitude,
                dropoffAddress: destination.address,
                dropoffLatitude: destination.latitude,
                dropoffLongitude: destination.longitude,
                rideType: selectedTier,
                distanceKm,
                estimatedFare: finalFare,
                estimatedDurationMin: durationMin
            };

            const createdRide = await dispatch(bookRide(ridePayload)).unwrap();

            // If rider added planned stops, persist them to backend route
            if (plannedStops && plannedStops.length > 0) {
                const formattedStops = plannedStops.map((s, idx) => ({
                    address: s.address,
                    latitude: s.latitude,
                    longitude: s.longitude,
                    sequence: idx + 1
                }));
                await dispatch(addRideStops({
                    rideId: createdRide.id,
                    stops: formattedStops
                })).unwrap();
            }

            toast.success("Ride requested! Searching for nearby HopIn drivers...");
            if (onBookingConfirmed) {
                onBookingConfirmed(createdRide);
            }
        } catch (err) {
            toast.error(err || "Failed to confirm ride booking");
        }
    };

    return (
        <button
            type="button"
            onClick={handleConfirm}
            disabled={bookingLoading || !destination}
            className="btn btn-primary btn-lg w-full h-14 rounded-2xl flex items-center justify-between px-6 shadow-[0_8px_28px_rgba(255,122,89,0.35)] transition-all hover:shadow-[0_4px_16px_rgba(255,122,89,0.30)] active:scale-[0.98] disabled:opacity-50"
        >
            {bookingLoading ? (
                <div className="flex items-center justify-center w-full gap-2 text-white font-bold">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Assigning Nearby Driver...</span>
                </div>
            ) : bookingSuccess ? (
                <div className="flex items-center justify-center w-full gap-2 text-white font-bold">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                    <span>Ride Confirmed!</span>
                </div>
            ) : (
                <>
                    <div className="flex items-center gap-2">
                        <span className="font-extrabold text-lg">Confirm HopIn</span>
                        <ArrowRight className="w-4 h-4 opacity-80" />
                    </div>
                    <span className="font-display font-extrabold text-xl tracking-tight bg-white/20 px-3 py-1 rounded-xl">
                        ${totalFare.toFixed(2)}
                    </span>
                </>
            )}
        </button>
    );
}
