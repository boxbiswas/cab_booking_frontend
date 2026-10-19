import React, { useEffect } from 'react';
import { useMap, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Custom Map Markers matching DESIGN.md Section 9
const createPickupIcon = () => {
    return L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
            <div style="
                width: 24px;
                height: 24px;
                background: #FF7A59;
                border: 3px solid #FFFFFF;
                border-radius: 50%;
                box-shadow: 0 4px 12px rgba(232, 83, 46, 0.4);
                display: flex;
                align-items: center;
                justify-content: center;
            ">
                <div style="width: 6px; height: 6px; background: #FFFFFF; border-radius: 50%;"></div>
            </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });
};

const createDestinationIcon = () => {
    return L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
            <div style="
                width: 24px;
                height: 24px;
                background: #3B2A2A;
                border: 3px solid #FFFFFF;
                border-radius: 50%;
                box-shadow: 0 4px 12px rgba(59, 42, 42, 0.4);
                display: flex;
                align-items: center;
                justify-content: center;
            ">
                <div style="width: 6px; height: 6px; background: #FFFFFF; border-radius: 50%;"></div>
            </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });
};

// Live Driver Marker matching DESIGN.md Section 9 & 10:
// "driver is a coral car icon in a white circle with a pulsing ring, linear interpolation"
const createDriverIcon = (heading = 0) => {
    return L.divIcon({
        className: 'custom-driver-marker',
        html: `
            <div style="position: relative; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
                <div style="position: absolute; inset: 0; border-radius: 50%; background: rgba(255, 122, 89, 0.35); animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
                <div style="
                    width: 32px;
                    height: 32px;
                    background: #FFFFFF;
                    border: 2.5px solid #FF7A59;
                    border-radius: 50%;
                    box-shadow: 0 4px 14px rgba(232, 83, 46, 0.35);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transform: rotate(${heading}deg);
                    transition: transform 0.6s ease-out;
                ">
                    <span style="font-size: 16px; line-height: 1;">🚗</span>
                </div>
            </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });
};

export default function RouteDisplay({ pickup, destination, route, driverLocation, driverName }) {
    const map = useMap();

    // Auto-fit bounds whenever pickup or destination changes
    useEffect(() => {
        if (!map) return;

        if (pickup?.latitude && destination?.latitude) {
            const points = [
                [pickup.latitude, pickup.longitude],
                [destination.latitude, destination.longitude]
            ];
            if (driverLocation?.latitude && driverLocation?.longitude) {
                points.push([driverLocation.latitude, driverLocation.longitude]);
            }
            const bounds = L.latLngBounds(points);
            map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15 });
        } else if (pickup?.latitude) {
            map.setView([pickup.latitude, pickup.longitude], 14);
        }
    }, [map, pickup, destination, route]);

    const polylineCoords = route?.coordinates && route.coordinates.length > 0
        ? route.coordinates
        : (pickup?.latitude && destination?.latitude ? [
            [pickup.latitude, pickup.longitude],
            [destination.latitude, destination.longitude]
        ] : []);

    return (
        <>
            {/* Pickup Marker */}
            {pickup?.latitude && (
                <Marker position={[pickup.latitude, pickup.longitude]} icon={createPickupIcon()}>
                    <Popup>
                        <div className="font-sans text-xs">
                            <span className="font-bold text-[#FF7A59]">Pickup:</span> {pickup.shortName || pickup.address}
                        </div>
                    </Popup>
                </Marker>
            )}

            {/* Destination Marker */}
            {destination?.latitude && (
                <Marker position={[destination.latitude, destination.longitude]} icon={createDestinationIcon()}>
                    <Popup>
                        <div className="font-sans text-xs">
                            <span className="font-bold text-[#3B2A2A]">Destination:</span> {destination.shortName || destination.address}
                        </div>
                    </Popup>
                </Marker>
            )}

            {/* Live Animated Driver Car Marker */}
            {driverLocation?.latitude && driverLocation?.longitude && (
                <Marker
                    position={[driverLocation.latitude, driverLocation.longitude]}
                    icon={createDriverIcon(driverLocation.heading || 0)}
                >
                    <Popup>
                        <div className="font-sans text-xs space-y-0.5">
                            <p className="font-bold text-[#E8532E]">{driverName || 'HopIn Driver'}</p>
                            <p className="text-[11px] text-[#5C4A4A]">
                                {driverLocation.speedKmh ? `${driverLocation.speedKmh} km/h • ` : ''}
                                ETA: {driverLocation.remainingEtaMin || 3} min
                            </p>
                        </div>
                    </Popup>
                </Marker>
            )}

            {/* Route Polyline (Brand coral gradient styled path) */}
            {polylineCoords.length > 0 && (
                <>
                    {/* Shadow outline */}
                    <Polyline
                        positions={polylineCoords}
                        pathOptions={{ color: '#E8532E', weight: 6, opacity: 0.3 }}
                    />
                    {/* Core route line */}
                    <Polyline
                        positions={polylineCoords}
                        pathOptions={{ color: '#FF7A59', weight: 4, opacity: 0.95 }}
                    />
                </>
            )}
        </>
    );
}
