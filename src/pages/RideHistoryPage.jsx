import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { fetchRideHistory, openReviewModal, openDriverProfileModal } from '../redux/slices/rideSlice';
import AppLayout from '../components/layout/AppLayout';
import RideHistoryCard from '../components/history/RideHistoryCard';
import RideDetails from '../components/history/RideDetails';
import ReceiptView from '../components/history/ReceiptView';
import RatingModal from '../components/ride/RatingModal';
import DriverProfileModal from '../components/ride/DriverProfileModal';
import {
    Car,
    Clock,
    Search,
    DollarSign,
    MapPin,
    CheckCircle2,
    XCircle,
    ArrowUpDown,
    RotateCcw,
    RefreshCw,
    SlidersHorizontal,
    Navigation,
    Loader2
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function RideHistoryPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        historyRides = [],
        historyStats = { totalRides: 0, completedRides: 0, cancelledRides: 0, totalSpent: 0, totalDistanceKm: 0 },
        historyLoading,
        error
    } = useSelector((state) => state.ride);

    const [statusFilter, setStatusFilter] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRide, setSelectedRide] = useState(null);
    const [receiptRideId, setReceiptRideId] = useState(null);

    // Fetch rides on filter/search change
    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(fetchRideHistory({
                status: statusFilter,
                search: searchTerm
            }));
        }, 300);

        return () => clearTimeout(timer);
    }, [dispatch, statusFilter, searchTerm]);

    const handleRefresh = () => {
        dispatch(fetchRideHistory({
            status: statusFilter,
            search: searchTerm
        }));
        toast.info("Refreshed ride history");
    };

    const handleRebook = (ride) => {
        try {
            sessionStorage.setItem('hopin_rebook_route', JSON.stringify({
                pickup: {
                    address: ride.pickupAddress,
                    lat: Number(ride.pickupLatitude),
                    lng: Number(ride.pickupLongitude)
                },
                dropoff: {
                    address: ride.dropoffAddress,
                    lat: Number(ride.dropoffLatitude),
                    lng: Number(ride.dropoffLongitude)
                },
                rideType: ride.rideType
            }));
            toast.info("Route loaded. Confirm pickup and destination on the map!");
            navigate('/');
        } catch {
            navigate('/');
        }
    };

    return (
        <AppLayout>
            <div className="space-y-6 max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs text-gray-400 font-medium mb-1">
                            <Link to="/" className="hover:text-[#FF7A59] transition-colors">Dashboard</Link>
                            <span>/</span>
                            <span className="text-[#3B2A2A] font-semibold">Ride History</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3B2A2A] font-display">
                            My Ride History
                        </h1>
                        <p className="text-xs sm:text-sm text-[#7A6A6A] mt-0.5">
                            Track all your past trips, download verified receipts, and rebook favorite routes.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleRefresh}
                            disabled={historyLoading}
                            className="p-2.5 rounded-2xl bg-white border border-gray-200 text-[#5C4A4A] hover:text-[#FF7A59] hover:border-[#FF7A59]/40 shadow-xs transition-all active:scale-95 flex items-center gap-1.5 text-xs font-bold"
                            title="Refresh rides"
                        >
                            <RefreshCw className={`w-4 h-4 ${historyLoading ? 'animate-spin text-[#FF7A59]' : ''}`} />
                            <span className="hidden sm:inline">Refresh</span>
                        </button>

                        <Link
                            to="/"
                            className="py-2.5 px-4 rounded-2xl bg-gradient-to-tr from-[#FF7A59] to-[#E8532E] text-white font-bold text-xs shadow-[0_4px_16px_rgba(255,122,89,0.3)] hover:scale-102 transition-all flex items-center gap-1.5"
                        >
                            <Car className="w-4 h-4" />
                            <span>Book New Ride</span>
                        </Link>
                    </div>
                </div>

                {/* Lifetime Rider Statistics Banner */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                    {/* Total Rides */}
                    <div className="p-4 rounded-3xl bg-white border border-gray-100 shadow-xs flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-2xl bg-[#FFF3EE] text-[#FF7A59] flex items-center justify-center shrink-0">
                            <Car className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Rides</span>
                            <p className="text-xl sm:text-2xl font-extrabold text-[#3B2A2A] font-display">
                                {historyStats.totalRides || 0}
                            </p>
                        </div>
                    </div>

                    {/* Completed */}
                    <div className="p-4 rounded-3xl bg-white border border-gray-100 shadow-xs flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-2xl bg-[#E6F9F0] text-[#059669] flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Completed</span>
                            <p className="text-xl sm:text-2xl font-extrabold text-[#059669] font-display">
                                {historyStats.completedRides || 0}
                            </p>
                        </div>
                    </div>

                    {/* Total Spent */}
                    <div className="p-4 rounded-3xl bg-white border border-gray-100 shadow-xs flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-2xl bg-[#FFF8E6] text-[#D97706] flex items-center justify-center shrink-0">
                            <DollarSign className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Spent</span>
                            <p className="text-xl sm:text-2xl font-extrabold text-[#3B2A2A] font-display">
                                ${Number(historyStats.totalSpent || 0).toFixed(2)}
                            </p>
                        </div>
                    </div>

                    {/* Distance Covered */}
                    <div className="p-4 rounded-3xl bg-white border border-gray-100 shadow-xs flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-2xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center shrink-0">
                            <Navigation className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Distance</span>
                            <p className="text-xl sm:text-2xl font-extrabold text-[#3B2A2A] font-display">
                                {Number(historyStats.totalDistanceKm || 0).toFixed(1)} <span className="text-xs text-gray-400 font-sans font-normal">km</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filters & Search Control Bar */}
                <div className="bg-white rounded-3xl p-3 sm:p-4 border border-gray-100 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
                    
                    {/* Status Filter Tabs */}
                    <div className="flex items-center gap-1.5 p-1 bg-gray-50 rounded-2xl w-full md:w-auto">
                        {[
                            { key: 'ALL', label: 'All Trips' },
                            { key: 'COMPLETED', label: 'Completed' },
                            { key: 'CANCELLED', label: 'Cancelled' }
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => setStatusFilter(tab.key)}
                                className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all ${statusFilter === tab.key
                                    ? 'bg-white text-[#3B2A2A] shadow-xs'
                                    : 'text-gray-500 hover:text-[#3B2A2A]'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full md:w-80">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search pickup, dropoff, driver..."
                            className="w-full pl-10 pr-4 py-2 text-xs rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF7A59] focus:bg-white transition-all text-[#3B2A2A]"
                            style={{ paddingLeft: '2.5rem' }}
                        />
                        {searchTerm && (
                            <button
                                type="button"
                                onClick={() => setSearchTerm('')}
                                className="text-[10px] text-gray-400 hover:text-gray-600 font-bold absolute right-3 top-1/2 -translate-y-1/2"
                            >
                                Clear
                            </button>
                        )}
                    </div>

                </div>

                {/* Content Section: History Cards Grid or Empty State */}
                {historyLoading && historyRides.length === 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 animate-fade-in">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="card glass-2 p-5 border border-white/70 space-y-3.5">
                                <div className="flex justify-between items-center">
                                    <div className="h-5 skeleton w-24 rounded-full" />
                                    <div className="h-4 skeleton w-16 rounded-md" />
                                </div>
                                <div className="space-y-2">
                                    <div className="h-3.5 skeleton w-full rounded-md" />
                                    <div className="h-3.5 skeleton w-4/5 rounded-md" />
                                </div>
                                <div className="pt-3 border-t border-[#E8DFDF]/60 flex justify-between items-center">
                                    <div className="h-6 skeleton w-20 rounded-md" />
                                    <div className="h-7 skeleton w-24 rounded-xl" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : historyRides.length === 0 ? (
                    <div className="bg-white rounded-3xl p-10 sm:p-12 border border-gray-100 shadow-xs text-center max-w-lg mx-auto space-y-4 animate-fade-in">
                        <div className="w-16 h-16 rounded-3xl bg-[#FFF3EE] text-[#FF7A59] flex items-center justify-center mx-auto shadow-inner">
                            <Car className="w-8 h-8" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-extrabold text-lg text-[#3B2A2A] font-display">
                                No rides found
                            </h3>
                            <p className="text-xs text-[#7A6A6A]">
                                {searchTerm
                                    ? `No rides match your search query "${searchTerm}". Try another search.`
                                    : statusFilter !== 'ALL'
                                        ? `You have no ${statusFilter.toLowerCase()} rides yet.`
                                        : "You haven't taken any rides with HopIn yet. Book your first ride now!"}
                            </p>
                        </div>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#FF7A59] hover:bg-[#E8532E] text-white font-bold text-xs shadow-md transition-all active:scale-95"
                        >
                            <Car className="w-4 h-4" />
                            <span>Book a Ride</span>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                        {historyRides.map((ride) => (
                            <RideHistoryCard
                                key={ride.id}
                                ride={ride}
                                onSelectRide={(r) => setSelectedRide(r)}
                                onViewReceipt={(id) => setReceiptRideId(id)}
                                onRebook={(r) => handleRebook(r)}
                                onRateRide={(r) => dispatch(openReviewModal(r))}
                                onViewDriver={(r) => dispatch(openDriverProfileModal(r))}
                            />
                        ))}
                    </div>
                )}

                <RideDetails
                    ride={selectedRide}
                    isOpen={!!selectedRide}
                    onClose={() => setSelectedRide(null)}
                    onViewReceipt={(id) => {
                        setSelectedRide(null);
                        setReceiptRideId(id);
                    }}
                    onRateRide={(r) => dispatch(openReviewModal(r))}
                    onViewDriver={(r) => dispatch(openDriverProfileModal(r))}
                />

                <ReceiptView
                    rideId={receiptRideId}
                    isOpen={!!receiptRideId}
                    onClose={() => setReceiptRideId(null)}
                />

                <RatingModal />
                <DriverProfileModal />
            </div>
        </AppLayout>
    );
}
