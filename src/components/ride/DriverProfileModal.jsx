import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDriverReviews, fetchDriverRating, closeDriverProfileModal } from '../../redux/slices/rideSlice';
import {
    Star,
    X,
    Car,
    ShieldCheck,
    CheckCircle2,
    Calendar,
    Phone,
    Award,
    Loader2,
    MessageSquare,
    User
} from 'lucide-react';

export default function DriverProfileModal() {
    const dispatch = useDispatch();
    const {
        driverProfileModalOpen,
        driverProfileData,
        driverReviews = [],
        driverRatingData = { averageRating: 4.94, totalReviews: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } },
        reviewsLoading
    } = useSelector((state) => state.ride);

    const driverId = driverProfileData?.id || 'drv-sim-001';
    const driverName = driverProfileData?.name || 'Vikramaditya Sharma';
    const driverVehicle = driverProfileData?.vehicle || driverProfileData?.driverVehicle || 'Maruti Suzuki Dzire (Pearl White)';
    const driverPlate = driverProfileData?.plateNumber || driverProfileData?.driverPlateNumber || 'DL 01 AB 4321';
    const driverPhone = driverProfileData?.phone || '+91 98765 43210';

    useEffect(() => {
        if (driverProfileModalOpen) {
            dispatch(fetchDriverReviews(driverId));
            dispatch(fetchDriverRating(driverId));
        }
    }, [driverProfileModalOpen, driverId, dispatch]);

    if (!driverProfileModalOpen) return null;

    const avgRating = Number(driverRatingData?.averageRating || 4.94).toFixed(2);
    const totalReviews = driverRatingData?.totalReviews || driverReviews.length || 0;
    const distribution = driverRatingData?.distribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            {/* Modal Card */}
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh] animate-sheet-up">
                
                {/* Header Profile Hero */}
                <div className="p-6 bg-gradient-to-br from-[#FFF5F1] via-[#FFEEE6] to-white border-b border-gray-100 relative">
                    <button
                        type="button"
                        onClick={() => dispatch(closeDriverProfileModal())}
                        className="absolute right-4 top-4 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-gray-600 transition-colors shadow-xs z-10"
                        aria-label="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FF7A59] to-[#E8532E] text-white flex items-center justify-center font-extrabold text-2xl shadow-md">
                                {driverName[0]}
                            </div>
                            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#059669] text-white flex items-center justify-center text-[10px] ring-2 ring-white" title="Verified Driver">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                            </span>
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                                <h3 className="font-extrabold text-lg text-[#3B2A2A] font-display truncate">
                                    {driverName}
                                </h3>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#059669]/10 text-[#059669]">
                                    <ShieldCheck className="w-3 h-3" /> Top Rated
                                </span>
                            </div>

                            <p className="text-xs text-[#5C4A4A] mt-0.5 truncate font-medium">
                                {driverVehicle} • {driverPlate}
                            </p>

                            <p className="text-[11px] text-gray-500 font-mono mt-1 flex items-center gap-1">
                                <Phone className="w-3 h-3 text-[#059669]" /> {driverPhone}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Rating & Distribution Breakdown Banner */}
                <div className="p-5 bg-white border-b border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                    
                    {/* Big Average Rating Display */}
                    <div className="text-center sm:text-left sm:border-r sm:border-gray-100 sm:pr-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Overall Rating
                        </span>
                        <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                            <span className="text-4xl font-extrabold text-[#3B2A2A] font-display">
                                {avgRating}
                            </span>
                            <div className="space-y-0.5">
                                <div className="flex items-center text-[#F59E0B]">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star
                                            key={s}
                                            className={`w-3.5 h-3.5 ${s <= Math.round(Number(avgRating)) ? 'fill-[#F59E0B]' : 'text-gray-200'}`}
                                        />
                                    ))}
                                </div>
                                <p className="text-[11px] text-gray-400 font-medium">
                                    {totalReviews} verified reviews
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Star Breakdown Bars */}
                    <div className="sm:col-span-2 space-y-1 text-xs">
                        {[5, 4, 3, 2, 1].map((star) => {
                            const count = distribution[star] || 0;
                            const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : (star === 5 ? 100 : 0);
                            return (
                                <div key={star} className="flex items-center gap-2 text-gray-500 text-[11px]">
                                    <span className="w-3 font-bold">{star}</span>
                                    <Star className="w-2.5 h-2.5 fill-[#F59E0B] text-[#F59E0B] -ml-1 shrink-0" />
                                    <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-[#F59E0B] transition-all duration-500"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <span className="w-7 text-right text-[10px] text-gray-400 font-mono">{count}</span>
                                </div>
                            );
                        })}
                    </div>

                </div>

                {/* Reviews List Header & Feed */}
                <div className="p-5 flex-1 overflow-y-auto space-y-3">
                    <div className="flex items-center justify-between pb-1">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                            <MessageSquare className="w-3.5 h-3.5 text-[#FF7A59]" />
                            <span>Recent Rider Feedback ({driverReviews.length})</span>
                        </h4>
                    </div>

                    {reviewsLoading ? (
                        <div className="py-12 flex flex-col items-center justify-center space-y-2 text-gray-400">
                            <Loader2 className="w-6 h-6 animate-spin text-[#FF7A59]" />
                            <span className="text-xs font-semibold">Loading reviews...</span>
                        </div>
                    ) : driverReviews.length === 0 ? (
                        <div className="py-10 text-center space-y-2 text-gray-400">
                            <Award className="w-8 h-8 mx-auto opacity-30 text-[#FF7A59]" />
                            <p className="text-xs font-medium text-gray-500">
                                No written reviews yet
                            </p>
                            <p className="text-[11px] text-gray-400">
                                Be the first rider to leave feedback after your completed trip!
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {driverReviews.map((rev) => (
                                <div
                                    key={rev.id}
                                    className="p-3.5 rounded-2xl bg-gray-50/80 border border-gray-100 space-y-2 text-xs transition-all hover:bg-gray-50"
                                >
                                    {/* Reviewer Header */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {rev.rider?.profileImage ? (
                                                <img
                                                    src={rev.rider.profileImage}
                                                    alt={rev.rider.name}
                                                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-white"
                                                />
                                            ) : (
                                                <div className="w-7 h-7 rounded-lg bg-[#FFD6CA] text-[#E8532E] flex items-center justify-center font-bold text-[11px]">
                                                    {rev.rider?.name ? rev.rider.name[0].toUpperCase() : 'R'}
                                                </div>
                                            )}
                                            <div>
                                                <span className="font-bold text-[#3B2A2A] block">
                                                    {rev.rider?.name || 'HopIn Rider'}
                                                </span>
                                                <span className="text-[10px] text-gray-400 font-mono">
                                                    {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Stars */}
                                        <div className="flex items-center text-[#F59E0B]">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star
                                                    key={s}
                                                    className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-[#F59E0B]' : 'text-gray-200'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Written Feedback Text */}
                                    {rev.feedback ? (
                                        <p className="text-[#5C4A4A] text-xs leading-relaxed pl-9">
                                            "{rev.feedback}"
                                        </p>
                                    ) : (
                                        <p className="text-gray-400 italic text-[11px] pl-9">
                                            Rated {rev.rating} stars without written comments.
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                    <button
                        type="button"
                        onClick={() => dispatch(closeDriverProfileModal())}
                        className="w-full py-2.5 rounded-xl bg-[#3B2A2A] hover:bg-black font-bold text-xs text-white transition-all shadow-xs active:scale-95"
                    >
                        Done
                    </button>
                </div>

            </div>
        </div>
    );
}
