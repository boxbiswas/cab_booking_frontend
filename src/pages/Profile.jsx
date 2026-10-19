import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AppLayout from '../components/layout/AppLayout';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileEditForm from '../components/profile/ProfileEditForm';
import ProfileStats from '../components/profile/ProfileStats';
import api from '../https/axios';
import { CreditCard, Plus, Shield, MapPin, Sparkles, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';

export default function Profile() {
    const { user } = useSelector((state) => state.auth);
    const [isEditing, setIsEditing] = useState(false);
    const [profileStats, setProfileStats] = useState({ rides: 0, paymentMethods: 0, emergencyContacts: 0 });
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [loadingStats, setLoadingStats] = useState(true);

    // Fetch deep profile metadata (rides count, payment methods, etc.)
    useEffect(() => {
        const fetchProfileDetails = async () => {
            try {
                const res = await api.get('/profile');
                if (res.data?.user) {
                    setProfileStats({
                        rides: res.data.user._count?.rides || 0,
                        paymentMethods: res.data.user._count?.paymentMethods || 0,
                        emergencyContacts: res.data.user._count?.emergencyContacts || 0
                    });
                    setPaymentMethods(res.data.user.paymentMethods || []);
                }
            } catch (err) {
                console.error("Error loading profile stats:", err);
            } finally {
                setLoadingStats(false);
            }
        };

        fetchProfileDetails();
    }, [user]);

    return (
        <AppLayout>
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Profile Header Subcomponent */}
                <ProfileHeader
                    user={user}
                    isEditing={isEditing}
                    onToggleEdit={() => setIsEditing(!isEditing)}
                />

                {/* Edit Form Subcomponent (toggled) */}
                {isEditing && (
                    <ProfileEditForm
                        user={user}
                        onClose={() => setIsEditing(false)}
                    />
                )}

                {/* Profile Statistics Subcomponent */}
                <ProfileStats stats={profileStats} />

                {/* Saved Payment Methods Section */}
                <div className="card glass-2 border border-white/70">
                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E8DFDF]/60">
                        <div>
                            <h3 className="text-xl font-bold text-[#3B2A2A] font-display">Payment Methods</h3>
                            <p className="text-xs text-[#7A6A6A]">Manage vaulted cards and UPI accounts for fast checkout</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => toast.info("Payment gateway integration configured in Day 8")}
                            className="btn btn-secondary btn-sm"
                        >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Method
                        </button>
                    </div>

                    {paymentMethods.length > 0 ? (
                        <div className="space-y-3">
                            {paymentMethods.map((pm) => (
                                <div key={pm.id} className="p-4 rounded-2xl glass-1 flex items-center justify-between border border-white/60">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#E8532E] shadow-sm">
                                            <CreditCard className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm text-[#3B2A2A]">{pm.displayLabel || "Credit Card"}</p>
                                            <p className="text-xs text-[#7A6A6A] uppercase">{pm.type}</p>
                                        </div>
                                    </div>
                                    {pm.isDefault && (
                                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#FFE3D8] text-[#E8532E]">
                                            Default
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-6 px-4 rounded-2xl glass-1 border border-dashed border-[#E8DFDF]">
                            <CreditCard className="w-8 h-8 text-[#FF9171] mx-auto mb-2 opacity-70" />
                            <p className="font-bold text-sm text-[#3B2A2A]">No payment methods added yet</p>
                            <p className="text-xs text-[#7A6A6A] mt-1 max-w-sm mx-auto">
                                You can securely add credit cards or UPI accounts when completing your first ride.
                            </p>
                        </div>
                    )}
                </div>

                {/* Safety & Emergency SOS Section */}
                <div className="card glass-2 border border-white/70">
                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E8DFDF]/60">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-[#FFE0E0] text-[#DC2626] flex items-center justify-center font-bold">
                                <Shield className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[#3B2A2A] font-display">Safety & Emergency SOS</h3>
                                <p className="text-xs text-[#7A6A6A]">Add trusted contacts to receive live GPS telemetry during SOS alerts</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => toast.info("Emergency contact management configured in Day 12")}
                            className="btn btn-secondary btn-sm"
                        >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Contact
                        </button>
                    </div>

                    <p className="text-xs text-[#7A6A6A] leading-relaxed">
                        When an emergency alert is triggered during a ride, HopIn immediately streams your active coordinates, driver details, and route progress to your designated emergency contacts.
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
