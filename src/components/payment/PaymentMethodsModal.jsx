import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    closePaymentMethodsModal,
    fetchPaymentMethods,
    addPaymentMethod,
    deletePaymentMethod
} from '../../redux/slices/paymentSlice';
import {
    CreditCard,
    Plus,
    Trash2,
    X,
    Check,
    Smartphone,
    Wallet,
    Shield,
    Loader2
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function PaymentMethodsModal() {
    const dispatch = useDispatch();
    const { isPaymentMethodsModalOpen, paymentMethods } = useSelector((state) => state.payment);

    const [isAddingNew, setIsAddingNew] = useState(false);
    const [cardType, setCardType] = useState('CARD');
    const [cardLabel, setCardLabel] = useState('Visa •••• 4242');
    const [isDefault, setIsDefault] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (isPaymentMethodsModalOpen) {
            dispatch(fetchPaymentMethods());
        }
    }, [isPaymentMethodsModalOpen, dispatch]);

    if (!isPaymentMethodsModalOpen) return null;

    const handleAddMethod = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            await dispatch(addPaymentMethod({
                type: cardType,
                displayLabel: cardLabel,
                isDefault
            })).unwrap();
            toast.success("Payment method saved to PostgreSQL!", { icon: '💳' });
            setIsAddingNew(false);
            setCardLabel('Visa •••• 4242');
        } catch (err) {
            toast.error(typeof err === 'string' ? err : "Could not save payment method");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await dispatch(deletePaymentMethod(id)).unwrap();
            toast.info("Payment method removed.");
        } catch (err) {
            toast.error("Failed to remove payment method");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-6 py-5 bg-[#3B2A2A] text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-[#FF7A59]" />
                        </div>
                        <div>
                            <h3 className="font-extrabold text-lg font-display">Saved Payment Methods</h3>
                            <p className="text-xs text-white/70">Manage your cards & UPI handles</p>
                        </div>
                    </div>
                    <button
                        onClick={() => dispatch(closePaymentMethodsModal())}
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
                        aria-label="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                    {/* List of saved methods */}
                    <div className="space-y-2.5">
                        {paymentMethods.length === 0 ? (
                            <div className="p-6 rounded-2xl bg-gray-50 border border-dashed border-gray-300 text-center space-y-1">
                                <CreditCard className="w-8 h-8 text-gray-400 mx-auto" />
                                <p className="text-xs font-semibold text-[#5C4A4A]">No saved payment methods yet</p>
                                <p className="text-[11px] text-[#A39494]">Add your credit/debit card or UPI for 1-click ride bookings.</p>
                            </div>
                        ) : (
                            paymentMethods.map((m) => (
                                <div
                                    key={m.id}
                                    className="p-4 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50/70 transition-all flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-[#FFF6F3] text-[#E8532E] flex items-center justify-center">
                                            {m.type === 'UPI' ? <Smartphone className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-xs text-[#3B2A2A]">{m.displayLabel || `${m.type} Method`}</p>
                                            <p className="text-[10px] text-[#7A6A6A]">
                                                {m.provider.toUpperCase()} • {m.type}
                                                {m.isDefault && (
                                                    <span className="ml-2 font-bold text-[#059669] bg-[#D1FAE5] px-2 py-0.5 rounded-full">
                                                        Default
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleDelete(m.id)}
                                        className="w-8 h-8 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 flex items-center justify-center transition-colors"
                                        title="Delete payment method"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Add New Method Form */}
                    {isAddingNew ? (
                        <form onSubmit={handleAddMethod} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3 animate-fade-in">
                            <h4 className="text-xs font-bold text-[#3B2A2A] uppercase">Add New Method</h4>
                            
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => { setCardType('CARD'); setCardLabel('Visa •••• 4242'); }}
                                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                                        cardType === 'CARD'
                                            ? 'border-[#FF7A59] bg-[#FFF3EE] text-[#E8532E]'
                                            : 'border-gray-200 bg-white text-[#7A6A6A]'
                                    }`}
                                >
                                    Credit / Debit Card
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setCardType('UPI'); setCardLabel('user@okhdfcbank'); }}
                                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                                        cardType === 'UPI'
                                            ? 'border-[#FF7A59] bg-[#FFF3EE] text-[#E8532E]'
                                            : 'border-gray-200 bg-white text-[#7A6A6A]'
                                    }`}
                                >
                                    UPI ID
                                </button>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-[#7A6A6A] uppercase">Display Label</label>
                                <input
                                    type="text"
                                    value={cardLabel}
                                    onChange={(e) => setCardLabel(e.target.value)}
                                    placeholder="e.g. Visa •••• 4242 or user@upi"
                                    required
                                    className="w-full mt-1 px-3 py-2 rounded-xl bg-white border border-gray-300 text-xs font-semibold text-[#3B2A2A] focus:outline-none focus:ring-2 focus:ring-[#FF7A59]"
                                />
                            </div>

                            <div className="flex items-center gap-2 pt-1">
                                <input
                                    type="checkbox"
                                    id="modalIsDefaultCheckbox"
                                    checked={isDefault}
                                    onChange={(e) => setIsDefault(e.target.checked)}
                                    className="w-3.5 h-3.5 text-[#FF7A59] rounded"
                                />
                                <label htmlFor="modalIsDefaultCheckbox" className="text-xs text-[#5C4A4A] cursor-pointer">
                                    Set as default payment method
                                </label>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 py-2.5 rounded-xl bg-[#FF7A59] hover:bg-[#E8532E] text-white font-bold text-xs shadow transition-all flex items-center justify-center gap-1.5"
                                >
                                    {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                                    <span>Save Method</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsAddingNew(false)}
                                    className="py-2.5 px-4 rounded-xl bg-white border border-gray-200 text-xs font-bold text-[#5C4A4A] hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setIsAddingNew(true)}
                            className="w-full py-3 rounded-2xl border-2 border-dashed border-[#FFC9B5] hover:border-[#FF7A59] bg-[#FFF8F6] text-xs font-bold text-[#E8532E] transition-all flex items-center justify-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add New Payment Method</span>
                        </button>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-[#7A6A6A]">
                    <span className="flex items-center gap-1">
                        <Shield className="w-3.5 h-3.5 text-[#059669]" />
                        Stored securely in PostgreSQL
                    </span>
                    <button
                        type="button"
                        onClick={() => dispatch(closePaymentMethodsModal())}
                        className="font-bold text-[#3B2A2A] hover:underline"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
