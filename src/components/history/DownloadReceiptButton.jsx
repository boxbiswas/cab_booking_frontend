import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { emailRideReceipt } from '../../redux/slices/rideSlice';
import { Printer, Mail, Check, Loader2, Send } from 'lucide-react';
import { toast } from 'react-toastify';

export default function DownloadReceiptButton({ ride, receipt, variant = 'full' }) {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { emailSending } = useSelector((state) => state.ride);

    const [showEmailInput, setShowEmailInput] = useState(false);
    const [targetEmail, setTargetEmail] = useState(user?.email || '');
    const [emailSentSuccess, setEmailSentSuccess] = useState(false);

    const rideId = ride?.id || receipt?.rideId;

    const handlePrintOrPdf = () => {
        window.print();
    };

    const handleSendEmail = async (e) => {
        e?.preventDefault();
        if (!rideId) {
            toast.error("Ride identifier missing");
            return;
        }

        const emailToSend = targetEmail.trim() || user?.email;
        if (!emailToSend || !emailToSend.includes('@')) {
            toast.error("Please provide a valid email address");
            return;
        }

        try {
            const res = await dispatch(emailRideReceipt({ rideId, targetEmail: emailToSend })).unwrap();
            setEmailSentSuccess(true);
            toast.success(res?.message || `Receipt sent to ${emailToSend}!`);
            setTimeout(() => {
                setShowEmailInput(false);
                setEmailSentSuccess(false);
            }, 2500);
        } catch (err) {
            toast.error(err || "Failed to deliver receipt email");
        }
    };

    if (variant === 'compact') {
        return (
            <div className="flex items-center gap-1.5 print:hidden">
                <button
                    type="button"
                    onClick={handlePrintOrPdf}
                    title="Print / Save PDF"
                    className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#3B2A2A] transition-colors"
                >
                    <Printer className="w-3.5 h-3.5 text-[#FF7A59]" />
                </button>

                <button
                    type="button"
                    onClick={() => setShowEmailInput(!showEmailInput)}
                    title="Email Receipt"
                    className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#3B2A2A] transition-colors"
                >
                    <Mail className="w-3.5 h-3.5 text-[#FF7A59]" />
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-2 w-full print:hidden">
            <div className="flex items-center gap-2">
                {/* Print / Save PDF Button */}
                <button
                    type="button"
                    onClick={handlePrintOrPdf}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-white border border-gray-200 font-bold text-xs text-[#3B2A2A] hover:bg-gray-50 transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                >
                    <Printer className="w-4 h-4 text-[#FF7A59]" />
                    <span>Print / PDF</span>
                </button>

                {/* Email Delivery Toggle Button */}
                <button
                    type="button"
                    onClick={() => setShowEmailInput(!showEmailInput)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-[#FFF3EE] border border-[#FFD6CA] font-bold text-xs text-[#E8532E] hover:bg-[#FFEBE5] transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                >
                    <Mail className="w-4 h-4 text-[#FF7A59]" />
                    <span>Email Receipt</span>
                </button>
            </div>

            {/* Email input drawer */}
            {showEmailInput && (
                <form
                    onSubmit={handleSendEmail}
                    className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-2 animate-fade-in"
                >
                    <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-[#5C4A4A]">Send Receipt to Email</label>
                        <button
                            type="button"
                            onClick={() => setShowEmailInput(false)}
                            className="text-[10px] text-gray-400 hover:text-gray-600 font-medium"
                        >
                            Cancel
                        </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <input
                            type="email"
                            value={targetEmail}
                            onChange={(e) => setTargetEmail(e.target.value)}
                            placeholder="rider@example.com"
                            required
                            className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF7A59]"
                        />

                        <button
                            type="submit"
                            disabled={emailSending || emailSentSuccess}
                            className="px-3 py-1.5 rounded-xl bg-[#FF7A59] text-white text-xs font-bold hover:bg-[#E8532E] transition-colors flex items-center gap-1 disabled:opacity-60 shadow-sm"
                        >
                            {emailSending ? (
                                <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    <span>Sending</span>
                                </>
                            ) : emailSentSuccess ? (
                                <>
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Sent!</span>
                                </>
                            ) : (
                                <>
                                    <Send className="w-3.5 h-3.5" />
                                    <span>Send</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
