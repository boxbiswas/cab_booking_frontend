import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchSupportTickets,
    createSupportTicket,
    closeSupportModal
} from '../../redux/slices/rideSlice';
import {
    LifeBuoy,
    CreditCard,
    Package,
    UserX,
    Navigation,
    HelpCircle,
    X,
    Send,
    Clock,
    CheckCircle2,
    AlertCircle,
    Loader2,
    MessageSquare,
    ChevronRight
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function CustomerSupportModal() {
    const dispatch = useDispatch();
    const {
        supportModalOpen,
        supportTickets,
        supportLoading,
        ticketSubmitting,
        historyRides
    } = useSelector((state) => state.ride);

    const [activeTab, setActiveTab] = useState('create'); // 'create' | 'tickets'
    const [category, setCategory] = useState('PAYMENT');
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [selectedRideId, setSelectedRideId] = useState('');

    useEffect(() => {
        if (supportModalOpen) {
            dispatch(fetchSupportTickets());
        }
    }, [supportModalOpen, dispatch]);

    if (!supportModalOpen) return null;

    const CATEGORIES = [
        { id: 'PAYMENT', label: 'Payment & Billing', icon: CreditCard, desc: 'Overcharged, failed Stripe payment, double debit' },
        { id: 'LOST_ITEM', label: 'Lost Item in Cab', icon: Package, desc: 'Forgot phone, wallet, bag, or keys in driver vehicle' },
        { id: 'DRIVER_ISSUE', label: 'Driver Behavior', icon: UserX, desc: 'Reckless driving, professionalism, vehicle cleanliness' },
        { id: 'RIDE_ISSUE', label: 'Route or Fare Issue', icon: Navigation, desc: 'Wrong pickup/dropoff, detour, unexpected toll' },
        { id: 'OTHER', label: 'General Help', icon: HelpCircle, desc: 'Account questions, promotions, app feedback' }
    ];

    const handleSubmitTicket = async (e) => {
        e.preventDefault();

        if (!subject.trim()) {
            toast.warning("Please provide a ticket subject");
            return;
        }

        if (!description.trim()) {
            toast.warning("Please describe your issue in detail");
            return;
        }

        try {
            await dispatch(createSupportTicket({
                category,
                subject: subject.trim(),
                description: description.trim(),
                rideId: selectedRideId || undefined
            })).unwrap();

            toast.success("Support ticket created! An agent will review it shortly.");
            setSubject('');
            setDescription('');
            setSelectedRideId('');
            setActiveTab('tickets');
        } catch (error) {
            toast.error(typeof error === 'string' ? error : "Failed to create support ticket");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-white/80 overflow-hidden animate-sheet-up">
                {/* Header */}
                <div className="p-5 bg-gradient-to-r from-[#FFF5F2] to-[#FFEBE5] border-b border-[#FFD6CA] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF7A59] to-[#E8532E] text-white flex items-center justify-center shadow-md">
                            <LifeBuoy className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-extrabold text-lg text-[#3B2A2A] font-display">
                                HopIn Customer Support
                            </h3>
                            <p className="text-xs text-[#7A6A6A]">
                                Fast assistance for payments, lost items, and rides
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => dispatch(closeSupportModal())}
                        className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 text-[#7A6A6A] flex items-center justify-center transition-all shadow-xs"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100 bg-gray-50/70 p-1.5 gap-1.5">
                    <button
                        type="button"
                        onClick={() => setActiveTab('create')}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                            activeTab === 'create'
                                ? 'bg-white text-[#E8532E] shadow-xs'
                                : 'text-[#7A6A6A] hover:text-[#3B2A2A]'
                        }`}
                    >
                        Create New Ticket
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('tickets')}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                            activeTab === 'tickets'
                                ? 'bg-white text-[#E8532E] shadow-xs'
                                : 'text-[#7A6A6A] hover:text-[#3B2A2A]'
                        }`}
                    >
                        <span>My Tickets</span>
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#FF7A59]/15 text-[#E8532E] font-extrabold">
                            {supportTickets.length}
                        </span>
                    </button>
                </div>

                {/* Body Content */}
                <div className="p-5 max-h-[70vh] overflow-y-auto">
                    {activeTab === 'create' ? (
                        <form onSubmit={handleSubmitTicket} className="space-y-4">
                            {/* Category Selector */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-[#5C4A4A] uppercase tracking-wider block">
                                    Issue Category:
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {CATEGORIES.map((cat) => {
                                        const Icon = cat.icon;
                                        const isSelected = category === cat.id;
                                        return (
                                            <button
                                                key={cat.id}
                                                type="button"
                                                onClick={() => setCategory(cat.id)}
                                                className={`p-2.5 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                                                    isSelected
                                                        ? 'bg-[#FFF3EE] border-[#FF7A59] ring-1 ring-[#FF7A59]'
                                                        : 'bg-white border-gray-200 hover:bg-gray-50'
                                                }`}
                                            >
                                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                                    isSelected ? 'bg-[#FF7A59] text-white' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                    <Icon className="w-3.5 h-3.5" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className={`text-xs font-bold ${isSelected ? 'text-[#E8532E]' : 'text-gray-800'}`}>
                                                        {cat.label}
                                                    </p>
                                                    <p className="text-[10px] text-gray-500 truncate">
                                                        {cat.desc}
                                                    </p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Optional Linked Ride */}
                            {historyRides.length > 0 && (
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-[#5C4A4A] uppercase tracking-wider block">
                                        Related Ride (Optional):
                                    </label>
                                    <select
                                        value={selectedRideId}
                                        onChange={(e) => setSelectedRideId(e.target.value)}
                                        className="input text-xs w-full"
                                    >
                                        <option value="">-- None / General Account Issue --</option>
                                        {historyRides.slice(0, 10).map((r) => (
                                            <option key={r.id} value={r.id}>
                                                {new Date(r.createdAt).toLocaleDateString()} - {r.dropoffAddress?.substring(0, 30)}... (${parseFloat(r.finalFare || r.estimatedFare).toFixed(2)})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Subject */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-[#5C4A4A] uppercase tracking-wider block">
                                    Subject:
                                </label>
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="e.g. Left sunglasses in white Dzire cab"
                                    className="input text-xs w-full"
                                    maxLength={100}
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-[#5C4A4A] uppercase tracking-wider block">
                                    Detailed Description:
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Provide as much detail as possible to help us resolve this quickly..."
                                    rows={4}
                                    className="input text-xs w-full resize-none"
                                    maxLength={1000}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={ticketSubmitting}
                                className="btn btn-primary btn-sm w-full py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-orange-200"
                            >
                                {ticketSubmitting ? (
                                    <>
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        <span>Submitting Ticket...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-3.5 h-3.5" />
                                        <span>Submit Support Request</span>
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <div className="space-y-3">
                            {supportLoading ? (
                                <div className="py-8 text-center text-gray-400 text-xs">
                                    <Loader2 className="w-6 h-6 mx-auto animate-spin mb-2 text-[#FF7A59]" />
                                    Loading your tickets...
                                </div>
                            ) : supportTickets.length === 0 ? (
                                <div className="py-10 text-center text-gray-400 text-xs border border-dashed rounded-2xl">
                                    <LifeBuoy className="w-8 h-8 mx-auto mb-2 opacity-30 text-gray-400" />
                                    No support tickets created yet
                                </div>
                            ) : (
                                supportTickets.map((t) => {
                                    const isResolved = t.status === 'RESOLVED' || t.status === 'CLOSED';
                                    return (
                                        <div
                                            key={t.id}
                                            className="p-3.5 rounded-2xl bg-white border border-[#E8DFDF] space-y-2.5 text-xs shadow-xs"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-gray-100 text-gray-700 font-mono">
                                                        {t.category}
                                                    </span>
                                                    <span className="text-[11px] text-[#A39494]">
                                                        {new Date(t.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>

                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                    isResolved
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : t.status === 'IN_PROGRESS'
                                                        ? 'bg-amber-100 text-amber-700'
                                                        : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                    {t.status.replace('_', ' ')}
                                                </span>
                                            </div>

                                            <div>
                                                <h4 className="font-bold text-sm text-[#3B2A2A]">
                                                    {t.subject}
                                                </h4>
                                                <p className="text-[#5C4A4A] text-xs mt-0.5 whitespace-pre-wrap leading-relaxed">
                                                    {t.description}
                                                </p>
                                            </div>

                                            {/* Support Admin Response */}
                                            {t.adminResponse && (
                                                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                                                    <div className="flex items-center gap-1.5 font-bold text-emerald-800 mb-1">
                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                        <span>HopIn Support Response:</span>
                                                    </div>
                                                    <p className="text-emerald-900 leading-relaxed">
                                                        {t.adminResponse}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
