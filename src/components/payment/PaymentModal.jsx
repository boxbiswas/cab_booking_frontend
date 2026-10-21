import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    closePaymentModal,
    createPaymentIntent,
    simulateVerifiedPayment,
    fetchPaymentMethods,
    addPaymentMethod
} from '../../redux/slices/paymentSlice';
import { getRideDetails } from '../../redux/slices/rideSlice';
import {
    CreditCard,
    Shield,
    CheckCircle2,
    Lock,
    X,
    Smartphone,
    Wallet,
    AlertCircle,
    Loader2,
    Check,
    Plus,
    Building2
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function PaymentModal({ ride }) {
    const dispatch = useDispatch();
    const { isPaymentModalOpen, paymentMethods, intent, processingPayment, error } = useSelector((state) => state.payment);
    const { currentRide } = useSelector((state) => state.ride);
    const { user } = useSelector((state) => state.auth);

    const activeRide = ride || currentRide;

    // Payment tab state
    const [selectedTab, setSelectedTab] = useState('CARD');
    const [selectedSavedId, setSelectedSavedId] = useState(null);

    // Form inputs for new card
    const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
    const [cardExpiry, setCardExpiry] = useState('12/28');
    const [cardCvc, setCardCvc] = useState('123');
    const [cardholderName, setCardholderName] = useState(user?.name || 'Rider');
    const [saveCard, setSaveCard] = useState(true);

    // Form input for UPI
    const [upiId, setUpiId] = useState(`${user?.email?.split('@')[0] || 'rider'}@okaxis`);

    // Fetch saved payment methods on modal open
    useEffect(() => {
        if (isPaymentModalOpen) {
            dispatch(fetchPaymentMethods());
        }
    }, [isPaymentModalOpen, dispatch]);

    // Set default saved payment method if available
    useEffect(() => {
        if (paymentMethods.length > 0 && !selectedSavedId) {
            const defaultMethod = paymentMethods.find(m => m.isDefault) || paymentMethods[0];
            setSelectedSavedId(defaultMethod.id);
        }
    }, [paymentMethods, selectedSavedId]);

    if (!isPaymentModalOpen || !activeRide) return null;

    const amount = parseFloat(activeRide.finalFare || activeRide.estimatedFare || 18.50).toFixed(2);
    const baseFare = (amount * 0.45).toFixed(2);
    const distanceFare = (amount * 0.40).toFixed(2);
    const platformFee = (amount * 0.15).toFixed(2);

    // Handle Payment Submission
    const handlePay = async (outcome = 'success') => {
        try {
            // 1. Create payment intent if not already created
            let activeIntentId = intent?.paymentIntentId;
            if (!activeIntentId) {
                const intentRes = await dispatch(createPaymentIntent({
                    rideId: activeRide.id,
                    method: selectedTab === 'SAVED' ? 'CARD' : selectedTab,
                    currency: 'USD'
                })).unwrap();
                activeIntentId = intentRes.paymentIntentId;
            }

            // 2. Save card if user requested
            if (selectedTab === 'CARD' && saveCard) {
                const last4 = cardNumber.replace(/\s+/g, '').slice(-4) || '4242';
                dispatch(addPaymentMethod({
                    type: 'CARD',
                    displayLabel: `Visa ending in ${last4}`,
                    isDefault: paymentMethods.length === 0
                }));
            }

            // 3. Dispatch verified webhook simulation
            await dispatch(simulateVerifiedPayment({
                rideId: activeRide.id,
                amount,
                paymentIntentId: activeIntentId,
                outcome
            })).unwrap();

            if (outcome === 'success') {
                toast.success("Payment verified! Receipt generated.", { icon: '💳' });
                dispatch(getRideDetails(activeRide.id));
            } else {
                toast.error("Payment declined by card issuer.");
            }
        } catch (err) {
            toast.error(typeof err === 'string' ? err : "Payment processing failed");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
                
                <div className="px-6 py-5 bg-gradient-to-r from-[#FF7A59] to-[#E8532E] text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                            <Lock className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-extrabold text-lg font-display">HopIn Secure Checkout</h3>
                            <p className="text-xs text-white/80">Stripe 256-Bit SSL Encrypted Payment</p>
                        </div>
                    </div>
                    <button
                        onClick={() => dispatch(closePaymentModal())}
                        className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors text-white"
                        aria-label="Close modal"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-6">

                    <div className="p-4 rounded-2xl bg-[#FFF6F3] border border-[#FFD6CA] flex items-center justify-between">
                        <div>
                            <span className="text-[11px] font-bold uppercase text-[#7A6A6A]">Ride to {activeRide.dropoffAddress?.split(',')[0]}</span>
                            <h4 className="text-2xl font-extrabold text-[#3B2A2A] font-display">${amount}</h4>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FFEBE5] text-[#E8532E] border border-[#FFC9B5]">
                            {activeRide.rideType || 'SEDAN'}
                        </span>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[#5C4A4A] uppercase tracking-wide">
                            Select Payment Method
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            <button
                                type="button"
                                onClick={() => setSelectedTab('CARD')}
                                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                                    selectedTab === 'CARD'
                                        ? 'border-[#FF7A59] bg-[#FFF3EE] text-[#E8532E] shadow-sm font-bold'
                                        : 'border-gray-200 bg-white text-[#5C4A4A] hover:bg-gray-50'
                                }`}
                            >
                                <CreditCard className="w-5 h-5" />
                                <span className="text-xs">Card</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setSelectedTab('UPI')}
                                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                                    selectedTab === 'UPI'
                                        ? 'border-[#FF7A59] bg-[#FFF3EE] text-[#E8532E] shadow-sm font-bold'
                                        : 'border-gray-200 bg-white text-[#5C4A4A] hover:bg-gray-50'
                                }`}
                            >
                                <Smartphone className="w-5 h-5" />
                                <span className="text-xs">UPI / GPay</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setSelectedTab('WALLET')}
                                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                                    selectedTab === 'WALLET'
                                        ? 'border-[#FF7A59] bg-[#FFF3EE] text-[#E8532E] shadow-sm font-bold'
                                        : 'border-gray-200 bg-white text-[#5C4A4A] hover:bg-gray-50'
                                }`}
                            >
                                <Wallet className="w-5 h-5" />
                                <span className="text-xs">Wallet</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setSelectedTab('SAVED')}
                                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 relative ${
                                    selectedTab === 'SAVED'
                                        ? 'border-[#FF7A59] bg-[#FFF3EE] text-[#E8532E] shadow-sm font-bold'
                                        : 'border-gray-200 bg-white text-[#5C4A4A] hover:bg-gray-50'
                                }`}
                            >
                                {paymentMethods.length > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#059669] text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                                        {paymentMethods.length}
                                    </span>
                                )}
                                <Building2 className="w-5 h-5" />
                                <span className="text-xs">Saved</span>
                            </button>
                        </div>
                    </div>

                    {selectedTab === 'CARD' && (
                        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3 animate-fade-in">
                            <div>
                                <label className="text-[11px] font-bold text-[#7A6A6A] uppercase">Cardholder Name</label>
                                <input
                                    type="text"
                                    value={cardholderName}
                                    onChange={(e) => setCardholderName(e.target.value)}
                                    placeholder="Name on Card"
                                    className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-white border border-gray-300 text-sm font-semibold text-[#3B2A2A] focus:outline-none focus:ring-2 focus:ring-[#FF7A59]"
                                />
                            </div>

                            <div>
                                <label className="text-[11px] font-bold text-[#7A6A6A] uppercase">Card Number</label>
                                <div className="relative mt-1">
                                    <input
                                        type="text"
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(e.target.value)}
                                        placeholder="4242 •••• •••• 4242"
                                        maxLength={19}
                                        className="w-full pl-3.5 pr-20 py-2.5 rounded-xl bg-white border border-gray-300 text-sm font-semibold text-[#3B2A2A] focus:outline-none focus:ring-2 focus:ring-[#FF7A59] font-mono"
                                        style={{ paddingRight: '5.5rem' }}
                                    />
                                    <span className="absolute right-3 top-2.5 text-xs font-bold text-[#FF7A59] bg-[#FFF3EE] px-2 py-0.5 rounded">
                                        VISA / MC
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[11px] font-bold text-[#7A6A6A] uppercase">Expires</label>
                                    <input
                                        type="text"
                                        value={cardExpiry}
                                        onChange={(e) => setCardExpiry(e.target.value)}
                                        placeholder="MM/YY"
                                        maxLength={5}
                                        className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-white border border-gray-300 text-sm font-semibold text-[#3B2A2A] focus:outline-none focus:ring-2 focus:ring-[#FF7A59] font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold text-[#7A6A6A] uppercase">CVC / CVV</label>
                                    <input
                                        type="password"
                                        value={cardCvc}
                                        onChange={(e) => setCardCvc(e.target.value)}
                                        placeholder="•••"
                                        maxLength={4}
                                        className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-white border border-gray-300 text-sm font-semibold text-[#3B2A2A] focus:outline-none focus:ring-2 focus:ring-[#FF7A59] font-mono"
                                    />
                                </div>
                            </div>

                            <div className="pt-2 flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="saveCardCheckbox"
                                    checked={saveCard}
                                    onChange={(e) => setSaveCard(e.target.checked)}
                                    className="w-4 h-4 text-[#FF7A59] rounded focus:ring-[#FF7A59]"
                                />
                                <label htmlFor="saveCardCheckbox" className="text-xs text-[#5C4A4A] cursor-pointer">
                                    Save this card securely in PostgreSQL for 1-click rides
                                </label>
                            </div>
                        </div>
                    )}

                    {selectedTab === 'UPI' && (
                        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3 animate-fade-in">
                            <span className="text-xs font-semibold text-[#5C4A4A]">Fast UPI Payment:</span>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={upiId}
                                    onChange={(e) => setUpiId(e.target.value)}
                                    placeholder="username@okhdfcbank"
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-300 text-sm font-semibold text-[#3B2A2A] focus:outline-none focus:ring-2 focus:ring-[#FF7A59]"
                                />
                            </div>
                            <div className="flex gap-2">
                                {['@okaxis', '@okhdfcbank', '@paytm', '@ybl'].map((suf) => (
                                    <button
                                        key={suf}
                                        type="button"
                                        onClick={() => setUpiId(`${user?.email?.split('@')[0] || 'rider'}${suf}`)}
                                        className="text-[11px] px-2 py-1 rounded-lg bg-white border border-gray-200 font-medium text-[#7A6A6A] hover:text-[#3B2A2A]"
                                    >
                                        {suf}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {selectedTab === 'WALLET' && (
                        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3 animate-fade-in">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#FFEBE5] flex items-center justify-center text-[#E8532E]">
                                        <Wallet className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-[#3B2A2A]">HopIn Digital Cash Balance</p>
                                        <p className="text-[11px] text-[#059669] font-semibold">Available: $85.00</p>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-[#059669]">Eligible</span>
                            </div>
                        </div>
                    )}

                    {selectedTab === 'SAVED' && (
                        <div className="space-y-2 animate-fade-in">
                            {paymentMethods.length === 0 ? (
                                <div className="p-4 rounded-2xl bg-gray-50 border border-dashed border-gray-300 text-center space-y-2">
                                    <p className="text-xs text-[#7A6A6A]">No saved payment methods yet.</p>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedTab('CARD')}
                                        className="text-xs font-bold text-[#FF7A59] hover:underline"
                                    >
                                        + Add a New Card
                                    </button>
                                </div>
                            ) : (
                                paymentMethods.map((m) => (
                                    <div
                                        key={m.id}
                                        onClick={() => setSelectedSavedId(m.id)}
                                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                                            selectedSavedId === m.id
                                                ? 'border-[#FF7A59] bg-[#FFF6F3]'
                                                : 'border-gray-200 bg-white hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-[#3B2A2A]">
                                                <CreditCard className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-[#3B2A2A]">{m.displayLabel || `${m.type} Method`}</p>
                                                <p className="text-[10px] text-[#7A6A6A]">Vaulted Provider: {m.provider.toUpperCase()}</p>
                                            </div>
                                        </div>
                                        {m.isDefault && (
                                            <span className="text-[10px] font-bold text-[#059669] bg-[#D1FAE5] px-2 py-0.5 rounded-full">
                                                Default
                                            </span>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    <div className="space-y-1.5 text-xs text-[#7A6A6A] pt-2 border-t border-gray-100">
                        <div className="flex justify-between">
                            <span>Base Ride Fare</span>
                            <span className="font-semibold text-[#3B2A2A]">${baseFare}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Distance Fare ({activeRide.distanceKm} km)</span>
                            <span className="font-semibold text-[#3B2A2A]">${distanceFare}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Platform Fee & State Taxes (15%)</span>
                            <span className="font-semibold text-[#3B2A2A]">${platformFee}</span>
                        </div>
                        <div className="flex justify-between text-sm font-extrabold text-[#3B2A2A] pt-1 border-t border-gray-200">
                            <span>Total Charge</span>
                            <span className="text-[#E8532E]">${amount}</span>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100 space-y-2">
                    <button
                        type="button"
                        onClick={() => handlePay('success')}
                        disabled={processingPayment}
                        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF7A59] to-[#E8532E] text-white font-extrabold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                        {processingPayment ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Verifying via Stripe Webhook...</span>
                            </>
                        ) : (
                            <>
                                <Lock className="w-4 h-4" />
                                <span>Pay ${amount} with Stripe</span>
                            </>
                        )}
                    </button>

                    <div className="flex items-center justify-center pt-1 text-[11px] text-[#A39494] gap-1.5">
                        <Shield className="w-3 h-3 text-[#059669]" />
                        <span>PCI-DSS Compliant • 256-Bit SSL Encrypted</span>
                    </div>
                </div>

            </div>
        </div>
    );
}
