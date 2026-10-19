import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRideReceipt, clearCurrentReceipt } from '../../redux/slices/rideSlice';
import PaymentDetails from './PaymentDetails';
import DownloadReceiptButton from './DownloadReceiptButton';
import {
    CheckCircle2,
    X,
    MapPin,
    Navigation,
    Car,
    ShieldCheck,
    Receipt,
    Loader2
} from 'lucide-react';

export default function ReceiptView({ rideId, isOpen, onClose }) {
    const dispatch = useDispatch();
    const { currentReceipt, receiptLoading } = useSelector((state) => state.ride);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isOpen && rideId) {
            dispatch(fetchRideReceipt(rideId));
        }
        return () => {
            if (!isOpen) {
                dispatch(clearCurrentReceipt());
            }
        };
    }, [isOpen, rideId, dispatch]);

    if (!isOpen) return null;

    const receipt = currentReceipt;
    const receiptNo = receipt?.receiptNumber || (rideId ? `RCP-${rideId.substring(0, 8).toUpperCase()}` : 'RCP-SAMPLE');
    const rideDate = receipt?.date ? new Date(receipt.date).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' }) : new Date().toLocaleString();
    const totalFare = receipt?.totalFare || '0.00';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in print:bg-white print:p-0">
            {/* Solid White Receipt Card */}
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col relative print:shadow-none print:border-none print:w-full">
                
                {/* Close Button (Hidden in Print) */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors z-10 print:hidden"
                    aria-label="Close"
                >
                    <X className="w-4 h-4" />
                </button>

                {receiptLoading ? (
                    <div className="p-12 flex flex-col items-center justify-center space-y-3">
                        <Loader2 className="w-8 h-8 text-[#FF7A59] animate-spin" />
                        <p className="text-xs font-semibold text-[#5C4A4A]">Loading official receipt...</p>
                    </div>
                ) : (
                    <>
                        {/* Receipt Header Banner */}
                        <div className="p-6 bg-gradient-to-b from-[#FFF5F1] to-white border-b border-dashed border-gray-200 text-center space-y-2">
                            <div className="w-12 h-12 mx-auto rounded-full bg-[#D1FAE5] text-[#059669] flex items-center justify-center shadow-sm">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>

                            <div className="flex items-center justify-center gap-2">
                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#059669] bg-[#E6F9F0] px-3 py-1 rounded-full border border-[#A7F3D0]">
                                    Verified Stripe Payment
                                </span>
                            </div>

                            <h3 className="text-3xl font-extrabold text-[#3B2A2A] font-display pt-1">
                                ${totalFare}
                            </h3>

                            <p className="text-xs font-mono text-[#7A6A6A]">
                                {receiptNo} • {rideDate}
                            </p>
                        </div>

                        {/* Receipt Body */}
                        <div className="p-6 space-y-4 text-xs text-[#5C4A4A] overflow-y-auto max-h-[60vh]">
                            
                            {/* Rider & Provider Row */}
                            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-gray-100">
                                <div>
                                    <span className="text-[10px] font-bold uppercase text-gray-400">Rider</span>
                                    <p className="font-bold text-[#3B2A2A]">{receipt?.rider?.name || user?.name || 'HopIn Rider'}</p>
                                    <p className="text-[11px] text-gray-400 truncate">{receipt?.rider?.email || user?.email}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-bold uppercase text-gray-400">Service</span>
                                    <p className="font-bold text-[#FF7A59]">HopIn Cabs</p>
                                    <p className="text-[11px] text-gray-400">Direct Transport</p>
                                </div>
                            </div>

                            {/* Driver Card */}
                            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-[#E8532E] shadow-xs">
                                        <Car className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-xs text-[#3B2A2A]">
                                            {receipt?.driver?.name || 'Vikramaditya Sharma'}
                                        </p>
                                        <p className="text-[11px] text-gray-500">
                                            {receipt?.driver?.vehicle || 'Maruti Suzuki Dzire'} • {receipt?.driver?.plateNumber || 'DL 01 AB 4321'}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-[#E8532E] bg-[#FFEBE5] px-2 py-0.5 rounded-full">
                                    ★ {receipt?.driver?.rating || 4.94}
                                </span>
                            </div>

                            {/* Route Coordinates/Addresses */}
                            <div className="space-y-2 bg-gray-50/70 p-3 rounded-2xl border border-gray-100 text-xs">
                                <div className="flex items-start gap-2.5">
                                    <MapPin className="w-3.5 h-3.5 text-[#FF7A59] mt-0.5 shrink-0" />
                                    <div className="min-w-0">
                                        <span className="text-[10px] uppercase font-bold text-gray-400">Pickup</span>
                                        <p className="font-medium text-[#3B2A2A] truncate">
                                            {receipt?.route?.pickupAddress || 'Pickup Address'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2.5">
                                    <Navigation className="w-3.5 h-3.5 text-[#3B2A2A] mt-0.5 shrink-0" />
                                    <div className="min-w-0">
                                        <span className="text-[10px] uppercase font-bold text-gray-400">Dropoff</span>
                                        <p className="font-medium text-[#3B2A2A] truncate">
                                            {receipt?.route?.dropoffAddress || 'Dropoff Address'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Itemized Payment Details Component */}
                            <PaymentDetails receipt={receipt} />
                        </div>

                        {/* Perforated Tear-Line Visual Border */}
                        <div className="relative h-4 bg-gray-50 flex items-center justify-between px-2 overflow-hidden border-t border-dashed border-gray-300">
                            {Array.from({ length: 24 }).map((_, i) => (
                                <div key={i} className="w-2 h-2 rounded-full bg-white -mt-2" />
                            ))}
                        </div>

                        {/* Footer Actions (Download / Print / Email & Close) */}
                        <div className="p-4 bg-gray-50 space-y-2 print:hidden">
                            <DownloadReceiptButton ride={{ id: rideId }} receipt={receipt} />

                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full py-2.5 rounded-xl bg-[#3B2A2A] hover:bg-black font-bold text-xs text-white transition-all shadow-sm active:scale-95"
                            >
                                Close Receipt
                            </button>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
}
