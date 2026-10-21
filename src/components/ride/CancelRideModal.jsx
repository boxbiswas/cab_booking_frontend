import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cancelRide, closeCancelModal } from '../../redux/slices/rideSlice';
import { X, AlertTriangle, ShieldAlert, Clock, Check, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

export default function CancelRideModal() {
    const dispatch = useDispatch();
    const { cancelModalOpen, cancellingRide, currentRide } = useSelector((state) => state.ride);

    const [selectedReason, setSelectedReason] = useState("Driver is taking too long to arrive");
    const [customReason, setCustomReason] = useState("");

    if (!cancelModalOpen || !currentRide) return null;

    // Standard cancellation reasons
    const REASONS = [
        "Driver is taking too long to arrive",
        "Driver is heading in the wrong direction",
        "Wrong pickup or destination location",
        "Change of plans / No longer need ride",
        "Found alternative ride / transportation",
        "Other"
    ];

    // Determine whether a cancellation fee applies
    // Free if still REQUESTED or within 2 minutes of driver acceptance
    const isDriverAssigned = currentRide.status === 'ACCEPTED' || currentRide.status === 'DRIVER_ARRIVING';
    let feeApplies = false;
    if (isDriverAssigned && currentRide.acceptedAt) {
        const elapsedMin = (Date.now() - new Date(currentRide.acceptedAt).getTime()) / 60000;
        feeApplies = elapsedMin > 2;
    } else if (isDriverAssigned && !currentRide.acceptedAt) {
        feeApplies = false;
    }

    const handleConfirmCancel = async () => {
        const finalReason = selectedReason === "Other" && customReason.trim()
            ? customReason.trim()
            : selectedReason;

        try {
            const res = await dispatch(cancelRide({
                rideId: currentRide.id,
                reason: finalReason
            })).unwrap();

            if (res.cancellationFee > 0) {
                toast.warning(`Ride cancelled. A $${res.cancellationFee.toFixed(2)} cancellation fee was applied.`);
            } else {
                toast.info("Ride cancelled without any fee.");
            }
        } catch (error) {
            toast.error(typeof error === 'string' ? error : "Failed to cancel ride");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-white/80 overflow-hidden animate-sheet-up">
                {/* Header */}
                <div className="p-5 bg-gradient-to-br from-[#FFF5F2] to-[#FFEBE5] border-b border-[#FFD6CA] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#DC2626] text-white flex items-center justify-center shadow-md">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-extrabold text-lg text-[#3B2A2A] font-display">
                                Cancel Ride?
                            </h3>
                            <p className="text-xs text-[#7A6A6A]">
                                Please tell us why you are cancelling
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => dispatch(closeCancelModal())}
                        disabled={cancellingRide}
                        className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#7A6A6A] flex items-center justify-center transition-all shadow-xs"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-4">
                    {/* Cancellation Fee Policy Notice */}
                    {feeApplies ? (
                        <div className="p-3.5 rounded-2xl bg-[#FEE2E2] border border-[#FCA5A5] flex items-start gap-3">
                            <ShieldAlert className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />
                            <div className="text-xs">
                                <p className="font-extrabold text-[#DC2626]">Cancellation Fee Notice ($5.00)</p>
                                <p className="text-[#991B1B] mt-0.5 leading-relaxed">
                                    Your driver has been en route for more than 2 minutes. A $5.00 cancellation fee applies to compensate the driver for their time.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="p-3.5 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-start gap-3">
                            <Clock className="w-5 h-5 text-[#059669] shrink-0 mt-0.5" />
                            <div className="text-xs">
                                <p className="font-extrabold text-[#059669]">Free Cancellation</p>
                                <p className="text-[#065F46] mt-0.5">
                                    No fee will be charged for cancelling at this stage.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Reasons list */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[#5C4A4A] uppercase tracking-wider block">
                            Select Reason:
                        </label>
                        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                            {REASONS.map((reason) => (
                                <button
                                    key={reason}
                                    type="button"
                                    onClick={() => setSelectedReason(reason)}
                                    className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between ${
                                        selectedReason === reason
                                            ? 'bg-[#FFF3EE] border-[#FF7A59] text-[#E8532E] shadow-xs'
                                            : 'bg-white border-[#E8DFDF] text-[#5C4A4A] hover:bg-gray-50'
                                    }`}
                                >
                                    <span>{reason}</span>
                                    {selectedReason === reason && (
                                        <Check className="w-4 h-4 text-[#FF7A59]" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {selectedReason === "Other" && (
                            <div className="pt-2 animate-fade-in">
                                <input
                                    type="text"
                                    value={customReason}
                                    onChange={(e) => setCustomReason(e.target.value)}
                                    placeholder="Please describe your reason..."
                                    className="input text-xs w-full"
                                    maxLength={150}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-5 bg-gray-50 border-t border-[#E8DFDF] flex items-center justify-end gap-2.5">
                    <button
                        type="button"
                        onClick={() => dispatch(closeCancelModal())}
                        disabled={cancellingRide}
                        className="btn btn-secondary btn-sm text-xs"
                    >
                        Keep My Ride
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirmCancel}
                        disabled={cancellingRide}
                        className="btn bg-[#DC2626] hover:bg-[#B91C1C] text-white btn-sm text-xs flex items-center gap-1.5 shadow-md shadow-red-200"
                    >
                        {cancellingRide ? (
                            <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Cancelling...</span>
                            </>
                        ) : (
                            <span>Confirm Cancellation</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
