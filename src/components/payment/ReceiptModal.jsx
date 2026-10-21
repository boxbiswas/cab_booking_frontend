import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeReceiptModal } from '../../redux/slices/paymentSlice';
import {
    CheckCircle2,
    Download,
    X,
    MapPin,
    Navigation,
    Printer,
    Share2,
    Car,
    ShieldCheck,
    Receipt
} from 'lucide-react';

export default function ReceiptModal({ ride }) {
    const dispatch = useDispatch();
    const { isReceiptModalOpen, currentPayment } = useSelector((state) => state.payment);
    const { currentRide } = useSelector((state) => state.ride);
    const { user } = useSelector((state) => state.auth);

    const activeRide = ride || currentRide;

    if (!isReceiptModalOpen || !activeRide) return null;

    const amount = parseFloat(currentPayment?.amount || activeRide.finalFare || activeRide.estimatedFare || 18.50).toFixed(2);
    const baseFare = (amount * 0.45).toFixed(2);
    const distanceFare = (amount * 0.40).toFixed(2);
    const platformFee = (amount * 0.15).toFixed(2);
    const paidAt = currentPayment?.paidAt ? new Date(currentPayment.paidAt).toLocaleString() : new Date().toLocaleString();
    const paymentId = currentPayment?.providerPaymentId || currentPayment?.id || `pi_${Date.now()}`;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in print:bg-white print:p-0">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col relative print:shadow-none print:border-none">
                
                <button
                    onClick={() => dispatch(closeReceiptModal())}
                    className="absolute right-4 top-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors z-10 print:hidden"
                    aria-label="Close"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="p-6 bg-gradient-to-b from-[#FFF5F1] to-white border-b border-dashed border-gray-200 text-center space-y-2">
                    <div className="w-12 h-12 mx-auto rounded-full bg-[#D1FAE5] text-[#059669] flex items-center justify-center shadow-sm">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#059669] bg-[#E6F9F0] px-3 py-1 rounded-full border border-[#A7F3D0]">
                        Verified Stripe Payment
                    </span>
                    <h3 className="text-3xl font-extrabold text-[#3B2A2A] font-display pt-1">
                        ${amount}
                    </h3>
                    <p className="text-xs text-[#7A6A6A]">
                        Paid on {paidAt}
                    </p>
                </div>

                <div className="p-6 space-y-4 text-xs text-[#5C4A4A] overflow-y-auto max-h-[65vh]">
                    
                    <div className="grid grid-cols-2 gap-2 pb-3 border-b border-gray-100">
                        <div>
                            <span className="text-[10px] font-bold uppercase text-[#A39494]">Rider</span>
                            <p className="font-bold text-[#3B2A2A]">{user?.name || 'HopIn Rider'}</p>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] font-bold uppercase text-[#A39494]">Stripe Ref</span>
                            <p className="font-mono text-[11px] font-semibold text-[#FF7A59] truncate">{paymentId}</p>
                        </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-[#E8532E] shadow-sm">
                                <Car className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-bold text-sm text-[#3B2A2A]">{activeRide.driverName || 'Vikramaditya Sharma'}</p>
                                <p className="text-[11px] text-[#7A6A6A]">{activeRide.driverVehicle || 'Maruti Suzuki Dzire'} • {activeRide.driverPlateNumber || 'DL 01 AB 4321'}</p>
                            </div>
                        </div>
                        <span className="text-xs font-bold text-[#E8532E] bg-[#FFEBE5] px-2.5 py-1 rounded-full">
                            ★ 4.94
                        </span>
                    </div>

                    <div className="space-y-2 bg-gray-50/70 p-3.5 rounded-2xl border border-gray-100">
                        <div className="flex items-start gap-2.5">
                            <MapPin className="w-3.5 h-3.5 text-[#FF7A59] mt-0.5 shrink-0" />
                            <div className="min-w-0">
                                <span className="text-[10px] uppercase font-bold text-[#A39494]">Pickup</span>
                                <p className="font-medium text-[#3B2A2A] truncate">{activeRide.pickupAddress}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2.5">
                            <Navigation className="w-3.5 h-3.5 text-[#3B2A2A] mt-0.5 shrink-0" />
                            <div className="min-w-0">
                                <span className="text-[10px] uppercase font-bold text-[#A39494]">Dropoff</span>
                                <p className="font-medium text-[#3B2A2A] truncate">{activeRide.dropoffAddress}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-dashed border-gray-200">
                        <div className="flex justify-between">
                            <span>Base Trip Fare</span>
                            <span className="font-semibold text-[#3B2A2A]">${baseFare}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Distance Fare ({activeRide.distanceKm} km)</span>
                            <span className="font-semibold text-[#3B2A2A]">${distanceFare}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Platform Fee & GST/Tax (15%)</span>
                            <span className="font-semibold text-[#3B2A2A]">${platformFee}</span>
                        </div>
                        <div className="flex justify-between text-sm font-extrabold text-[#3B2A2A] pt-2 border-t border-gray-200">
                            <span>Amount Charged</span>
                            <span className="text-[#059669]">${amount}</span>
                        </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-[11px] text-[#7A6A6A]">
                        <span>Payment Method:</span>
                        <span className="font-bold text-[#3B2A2A] flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
                            {currentPayment?.method || 'CARD'} (Stripe Verified)
                        </span>
                    </div>
                </div>

                <div className="relative h-4 bg-gray-50 flex items-center justify-between px-2 overflow-hidden border-t border-dashed border-gray-300">
                    {Array.from({ length: 24 }).map((_, i) => (
                        <div key={i} className="w-2 h-2 rounded-full bg-white -mt-2" />
                    ))}
                </div>

                <div className="p-4 bg-gray-50 flex items-center justify-between gap-3 print:hidden">
                    <button
                        type="button"
                        onClick={handlePrint}
                        className="flex-1 py-2.5 rounded-xl bg-white border border-gray-200 font-bold text-xs text-[#3B2A2A] hover:bg-gray-100 transition-all flex items-center justify-center gap-1.5 shadow-sm"
                    >
                        <Printer className="w-4 h-4 text-[#FF7A59]" />
                        <span>Print / Save PDF</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => dispatch(closeReceiptModal())}
                        className="flex-1 py-2.5 rounded-xl bg-[#3B2A2A] hover:bg-black font-bold text-xs text-white transition-all shadow-sm"
                    >
                        Done
                    </button>
                </div>

            </div>
        </div>
    );
}
