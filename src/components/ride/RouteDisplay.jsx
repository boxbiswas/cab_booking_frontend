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

export default function RouteDisplay({ pickup, destination, route }) {
    const map = useMap();

    // Auto-fit bounds whenever pickup or destination changes
    useEffect(() => {
        if (!map) return;

        if (pickup?.latitude && destination?.latitude) {
            const bounds = L.latLngBounds([
                [pickup.latitude, pickup.longitude],
                [destination.latitude, destination.longitude]
            ]);
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
