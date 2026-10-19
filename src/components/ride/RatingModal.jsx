import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitRideReview, closeReviewModal } from '../../redux/slices/rideSlice';
import { Star, X, Car, ThumbsUp, Sparkles, Loader2, Heart, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';

const QUICK_TAGS = [
    "Clean Car 🚗",
    "Smooth Driving 🛡️",
    "Courteous Driver 🤝",
    "On-Time Arrival ⏱️",
    "Fast Route 📍",
    "Pleasant Conversation 💬"
];

const RATING_LABELS = {
    1: { label: "Disappointing", color: "text-red-500", desc: "Did not meet expectations" },
    2: { label: "Could Be Better", color: "text-amber-500", desc: "A few issues occurred" },
    3: { label: "Good", color: "text-yellow-500", desc: "Standard satisfactory trip" },
    4: { label: "Great", color: "text-emerald-500", desc: "Enjoyable and smooth ride" },
    5: { label: "Exceptional!", color: "text-[#FF7A59]", desc: "Outstanding service & hospitality" }
};

export default function RatingModal() {
    const dispatch = useDispatch();
    const { activeReviewModalRide, reviewSubmitting } = useSelector((state) => state.ride);

    const [rating, setRating] = useState(5);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);

    if (!activeReviewModalRide) return null;

    const ride = activeReviewModalRide;
    const driverName = ride.driverName || 'Vikramaditya Sharma';
    const driverVehicle = ride.driverVehicle || 'Maruti Suzuki Dzire (Pearl White)';
    const driverPlate = ride.driverPlateNumber || 'DL 01 AB 4321';

    const currentDisplayRating = hoveredRating || rating;
    const ratingInfo = RATING_LABELS[currentDisplayRating] || RATING_LABELS[5];

    const toggleTag = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const handleSubmit = async (e) => {
        e?.preventDefault();
        if (!rating || rating < 1 || rating > 5) {
            toast.error("Please select a 1 to 5 star rating");
            return;
        }

        // Combine selected quick tags with written feedback
        let fullFeedback = feedback.trim();
        if (selectedTags.length > 0) {
            const tagsString = selectedTags.join(', ');
            fullFeedback = fullFeedback ? `${tagsString} • ${fullFeedback}` : tagsString;
        }

        try {
            const res = await dispatch(submitRideReview({
                rideId: ride.id,
                rating,
                feedback: fullFeedback
            })).unwrap();

            toast.success(res?.message || "Thank you for rating your driver!", {
                icon: '⭐'
            });
            dispatch(closeReviewModal());
        } catch (err) {
            toast.error(err || "Failed to submit rating");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            {/* Modal Card */}
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col relative animate-sheet-up">
                
                {/* Close Button */}
                <button
                    type="button"
                    onClick={() => dispatch(closeReviewModal())}
                    className="absolute right-4 top-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors z-10"
                    aria-label="Close"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Header Banner */}
                <div className="p-6 bg-gradient-to-b from-[#FFF5F1] to-white border-b border-gray-100 text-center space-y-3">
                    <div className="relative inline-block">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FF7A59] to-[#E8532E] text-white flex items-center justify-center font-extrabold text-2xl shadow-[0_8px_20px_rgba(255,122,89,0.3)] mx-auto">
                            {driverName[0]}
                        </div>
                        <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#059669] text-white flex items-center justify-center text-[10px] ring-2 ring-white" title="Verified Driver">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                        </span>
                    </div>

                    <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF7A59] bg-[#FFF3EE] px-2.5 py-0.5 rounded-full border border-[#FFD6CA]">
                            Post-Ride Rating
                        </span>
                        <h3 className="text-xl font-extrabold text-[#3B2A2A] font-display mt-1">
                            How was your trip with {driverName.split(' ')[0]}?
                        </h3>
                        <p className="text-xs text-gray-500">
                            {driverVehicle} • {driverPlate}
                        </p>
                    </div>

                    {/* Interactive 1 to 5 Star Rating Row */}
                    <div className="pt-2">
                        <div className="flex items-center justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => {
                                const isFilled = (hoveredRating ? hoveredRating >= star : rating >= star);
                                return (
                                    <button
                                        key={star}
                                        type="button"
                                        onMouseEnter={() => setHoveredRating(star)}
                                        onMouseLeave={() => setHoveredRating(0)}
                                        onClick={() => setRating(star)}
                                        className="p-1 text-3xl focus:outline-none transition-transform hover:scale-120 active:scale-95 group"
                                        title={`${star} Star${star > 1 ? 's' : ''}`}
                                    >
                                        <Star
                                            className={`w-9 h-9 transition-colors ${isFilled
                                                ? 'fill-[#F59E0B] text-[#F59E0B] drop-shadow-[0_2px_8px_rgba(245,158,11,0.35)]'
                                                : 'text-gray-300 hover:text-gray-400'
                                                }`}
                                        />
                                    </button>
                                );
                            })}
                        </div>

                        {/* Dynamic Rating Feedback Label */}
                        <div className="mt-2 text-center">
                            <span className={`text-sm font-extrabold ${ratingInfo.color} font-display`}>
                                {ratingInfo.label}
                            </span>
                            <p className="text-[11px] text-gray-400">
                                {ratingInfo.desc}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Feedback Body Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    
                    {/* Quick Compliment Tags */}
                    <div>
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-2">
                            What went well? (Optional)
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                            {QUICK_TAGS.map((tag) => {
                                const isSelected = selectedTags.includes(tag);
                                return (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => toggleTag(tag)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${isSelected
                                            ? 'bg-[#FF7A59] text-white shadow-xs'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {tag}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Optional Written Feedback */}
                    <div className="space-y-1">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">
                            <span>Written Feedback</span>
                            <span className="text-[10px] text-gray-400 font-normal">Optional</span>
                        </label>
                        <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Share any highlights or tips for future riders..."
                            rows={3}
                            maxLength={500}
                            className="w-full p-3 text-xs rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF7A59] focus:bg-white text-[#3B2A2A] resize-none transition-all placeholder:text-gray-400"
                        />
                        <div className="text-right text-[10px] text-gray-400">
                            {feedback.length}/500
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => dispatch(closeReviewModal())}
                            className="py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 font-bold text-xs text-gray-600 transition-all flex-1"
                        >
                            Maybe Later
                        </button>

                        <button
                            type="submit"
                            disabled={reviewSubmitting}
                            className="py-3 px-4 rounded-xl bg-gradient-to-tr from-[#FF7A59] to-[#E8532E] hover:from-[#E8532E] hover:to-[#D13C1A] font-bold text-xs text-white transition-all shadow-[0_4px_16px_rgba(255,122,89,0.35)] flex items-center justify-center gap-1.5 flex-2 disabled:opacity-60 active:scale-95"
                        >
                            {reviewSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Submitting...</span>
                                </>
                            ) : (
                                <>
                                    <ThumbsUp className="w-4 h-4" />
                                    <span>Submit Rating</span>
                                </>
                            )}
                        </button>
                    </div>

                </form>

            </div>
        </div>
    );
}
