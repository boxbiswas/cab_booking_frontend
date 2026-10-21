import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import RouteDisplay from './RouteDisplay';
import { Crosshair, Plus, Minus } from 'lucide-react';

export default function MapView({
    pickup,
    destination,
    route,
    driverLocation,
    driverName,
    className = "w-full h-full min-h-[300px] rounded-3xl overflow-hidden shadow-glass border border-white/70"
}) {
    const center = pickup?.latitude && pickup?.longitude
        ? [pickup.latitude, pickup.longitude]
        : [28.6139, 77.2090];

    return (
        <div className={`relative ${className}`}>
            <MapContainer
                center={center}
                zoom={13}
                zoomControl={false}
                scrollWheelZoom={true}
                className="w-full h-full z-0"
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <RouteDisplay
                    pickup={pickup}
                    destination={destination}
                    route={route}
                    driverLocation={driverLocation}
                    driverName={driverName}
                />
            </MapContainer>

            <div className="absolute inset-0 pointer-events-none rounded-3xl shadow-[inset_0_0_24px_rgba(59,42,42,0.06)]" />
        </div>
    );
}
