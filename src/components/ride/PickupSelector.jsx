import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPickup } from '../../redux/slices/mapSlice';
import LocationSearch from './LocationSearch';
import { MapPin, Navigation, Crosshair } from 'lucide-react';
import { toast } from 'react-toastify';

export default function PickupSelector() {
    const dispatch = useDispatch();
    const { pickup } = useSelector((state) => state.map);
    const [locating, setLocating] = useState(false);

    const handleUseCurrentLocation = async () => {
        setLocating(true);

        const tryIpGeolocation = async () => {
            try {
                let res = await fetch('https://ipapi.co/json/');
                if (!res.ok) {
                    res = await fetch('https://ipwho.is/');
                }
                const data = await res.json();
                const lat = data.latitude || data.lat;
                const lon = data.longitude || data.lon;
                const city = data.city || data.region || 'India';
                const country = data.country_name || data.country || 'India';

                if (lat && lon) {
                    dispatch(setPickup({
                        address: `${city}, ${data.region || ''}, ${country}`.replace(/,\s*,/, ','),
                        shortName: `${city} (Network Area)`,
                        latitude: parseFloat(lat),
                        longitude: parseFloat(lon)
                    }));
                    toast.success(`Located in ${city} via Network Location`);
                    return true;
                }
            } catch (err) {
                console.warn("IP Geolocation fallback error:", err);
            }
            return false;
        };

        if (!navigator.geolocation) {
            const ok = await tryIpGeolocation();
            if (!ok) toast.info("Using default central pickup point in India");
            setLocating(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`, {
                        headers: { 'Accept-Language': 'en' }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        const shortName = data.address?.road || data.address?.suburb || data.address?.neighbourhood || data.display_name?.split(',')[0] || "Current Location";
                        dispatch(setPickup({
                            address: data.display_name || "Current GPS Location",
                            shortName,
                            latitude,
                            longitude
                        }));
                    } else {
                        dispatch(setPickup({
                            address: "Current GPS Location",
                            shortName: "My Location",
                            latitude,
                            longitude
                        }));
                    }
                } catch {
                    dispatch(setPickup({
                        address: "Current GPS Location",
                        shortName: "My Location",
                        latitude,
                        longitude
                    }));
                } finally {
                    setLocating(false);
                    toast.success("Pickup set to your current GPS position");
                }
            },
            async (error) => {
                console.warn("Browser GPS unavailable/denied:", error.message);
                const ok = await tryIpGeolocation();
                if (!ok) {
                    toast.info("Using default central pickup point in India");
                }
                setLocating(false);
            },
            { timeout: 6000, enableHighAccuracy: false }
        );
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#5C4A4A] flex items-center gap-1.5 uppercase tracking-wider">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF7A59] ring-2 ring-[#FFC9B5]" />
                    Pickup Location
                </label>
                <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    disabled={locating}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#E8532E] hover:underline"
                >
                    <Crosshair className={`w-3.5 h-3.5 ${locating ? 'animate-spin' : ''}`} />
                    {locating ? 'Detecting GPS...' : 'Locate Me'}
                </button>
            </div>

            <LocationSearch
                placeholder="Enter pickup address..."
                value={pickup}
                onSelect={(place) => dispatch(setPickup(place))}
                icon={MapPin}
                accentColor="text-[#FF7A59]"
            />
        </div>
    );
}
