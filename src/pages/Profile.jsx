import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AppLayout from '../components/layout/AppLayout';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileEditForm from '../components/profile/ProfileEditForm';
import ProfileStats from '../components/profile/ProfileStats';
import { openPaymentMethodsModal } from '../redux/slices/paymentSlice';
import api from '../https/axios';
import {
    CreditCard,
    Plus,
    Shield,
    MapPin,
    Sparkles,
    AlertCircle,
    Trash2,
    UserPlus,
    Phone,
    Heart,
    X,
    Loader2
} from 'lucide-react';
import {
    fetchEmergencyContacts,
    addEmergencyContact,
    deleteEmergencyContact
} from '../redux/slices/rideSlice';
import { toast } from 'react-toastify';
import { nameSchema, phoneSchema } from '../utils/validation';

export default function Profile() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { emergencyContacts = [], contactsLoading } = useSelector((state) => state.ride);
    const [isEditing, setIsEditing] = useState(false);
    const [profileStats, setProfileStats] = useState({ rides: 0, paymentMethods: 0, emergencyContacts: 0 });
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [loadingStats, setLoadingStats] = useState(true);

    // Form state for adding a new emergency contact
    const [showAddContact, setShowAddContact] = useState(false);
    const [newContactName, setNewContactName] = useState('');
    const [newContactPhone, setNewContactPhone] = useState('');
    const [newContactRel, setNewContactRel] = useState('Family');
    const [addingContact, setAddingContact] = useState(false);

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
        dispatch(fetchEmergencyContacts());
    }, [user, dispatch]);

    const handleCreateContact = async (e) => {
        e.preventDefault();
        const nameVal = nameSchema.safeParse(newContactName.trim());
        if (!nameVal.success) {
            toast.error(nameVal.error.issues?.[0]?.message || "Invalid contact name");
            return;
        }

        const phoneVal = phoneSchema.safeParse(newContactPhone.trim());
        if (!phoneVal.success) {
            toast.error(phoneVal.error.issues?.[0]?.message || "Invalid contact phone number");
            return;
        }

        setAddingContact(true);
        try {
            await dispatch(addEmergencyContact({
                name: newContactName.trim(),
                phone: newContactPhone.trim(),
                relationship: newContactRel
            })).unwrap();

            toast.success(`Emergency contact "${newContactName}" saved`);
            setNewContactName('');
            setNewContactPhone('');
            setShowAddContact(false);
            setProfileStats(prev => ({ ...prev, emergencyContacts: prev.emergencyContacts + 1 }));
        } catch (err) {
            toast.error(typeof err === 'string' ? err : "Failed to add emergency contact");
        } finally {
            setAddingContact(false);
        }
    };

    const handleDeleteContact = async (contactId) => {
        try {
            await dispatch(deleteEmergencyContact(contactId)).unwrap();
            toast.info("Emergency contact removed");
            setProfileStats(prev => ({ ...prev, emergencyContacts: Math.max(0, prev.emergencyContacts - 1) }));
        } catch (err) {
            toast.error(typeof err === 'string' ? err : "Failed to remove emergency contact");
        }
    };

    return (
        <AppLayout>
            <div className="max-w-4xl mx-auto space-y-6">
                <ProfileHeader
                    user={user}
                    isEditing={isEditing}
                    onToggleEdit={() => setIsEditing(!isEditing)}
                />

                {isEditing && (
                    <ProfileEditForm
                        user={user}
                        onClose={() => setIsEditing(false)}
                    />
                )}

                <ProfileStats stats={profileStats} loading={loadingStats} />

                <div className="card glass-2 border border-white/70">
                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E8DFDF]/60">
                        <div>
                            <h3 className="text-xl font-bold text-[#3B2A2A] font-display">Payment Methods</h3>
                            <p className="text-xs text-[#7A6A6A]">Manage vaulted cards and UPI accounts for fast checkout</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => dispatch(openPaymentMethodsModal())}
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
                            <button
                                type="button"
                                onClick={() => dispatch(openPaymentMethodsModal())}
                                className="mt-3 btn btn-primary btn-sm"
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                Add Saved Method
                            </button>
                        </div>
                    )}
                </div>

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
                            onClick={() => setShowAddContact(!showAddContact)}
                            className="btn btn-secondary btn-sm"
                        >
                            <Plus className="w-4 h-4 mr-1" />
                            {showAddContact ? "Cancel" : "Add Contact"}
                        </button>
                    </div>

                    {/* Inline Add Emergency Contact Form */}
                    {showAddContact && (
                        <form onSubmit={handleCreateContact} className="p-4 rounded-2xl bg-[#FFF8F6] border border-[#FFD6CA] mb-4 space-y-3 animate-fade-in">
                            <div className="flex items-center justify-between pb-2 border-b border-[#FFD6CA]/60">
                                <h4 className="font-bold text-xs text-[#3B2A2A] uppercase tracking-wider flex items-center gap-1.5">
                                    <UserPlus className="w-3.5 h-3.5 text-[#FF7A59]" />
                                    <span>New Trusted Contact</span>
                                </h4>
                                <button
                                    type="button"
                                    onClick={() => setShowAddContact(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={newContactName}
                                        onChange={(e) => setNewContactName(e.target.value)}
                                        placeholder="e.g. Priya Sharma"
                                        className="input text-xs w-full py-1.5"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        value={newContactPhone}
                                        onChange={(e) => setNewContactPhone(e.target.value)}
                                        placeholder="+919876543210"
                                        className="input text-xs w-full py-1.5"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                                        Relationship
                                    </label>
                                    <select
                                        value={newContactRel}
                                        onChange={(e) => setNewContactRel(e.target.value)}
                                        className="input text-xs w-full py-1.5"
                                    >
                                        <option value="Family">Family</option>
                                        <option value="Parent">Parent</option>
                                        <option value="Spouse">Spouse</option>
                                        <option value="Sibling">Sibling</option>
                                        <option value="Friend">Friend</option>
                                        <option value="Colleague">Colleague</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-1">
                                <button
                                    type="button"
                                    onClick={() => setShowAddContact(false)}
                                    className="btn btn-secondary btn-sm text-xs py-1"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={addingContact}
                                    className="btn btn-primary btn-sm text-xs py-1 flex items-center gap-1.5"
                                >
                                    {addingContact ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                                    <span>Save Emergency Contact</span>
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Contacts List */}
                    {emergencyContacts.length > 0 ? (
                        <div className="space-y-2.5">
                            {emergencyContacts.map((c) => (
                                <div key={c.id} className="p-3.5 rounded-2xl glass-1 border border-white/60 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center shadow-xs">
                                            <Heart className="w-4 h-4 fill-current" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-sm text-[#3B2A2A]">{c.name}</h4>
                                                <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-[#FFE3D8] text-[#E8532E]">
                                                    {c.relationship}
                                                </span>
                                            </div>
                                            <p className="text-xs text-[#7A6A6A] font-mono mt-0.5">{c.phone}</p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleDeleteContact(c.id)}
                                        className="w-8 h-8 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 flex items-center justify-center transition-colors"
                                        title="Remove contact"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-6 px-4 rounded-2xl glass-1 border border-dashed border-[#E8DFDF]">
                            <Shield className="w-8 h-8 text-[#DC2626] mx-auto mb-2 opacity-60" />
                            <p className="font-bold text-sm text-[#3B2A2A]">No emergency contacts designated</p>
                            <p className="text-xs text-[#7A6A6A] mt-1 max-w-sm mx-auto">
                                Add family members or close friends who should receive immediate GPS alerts if an emergency SOS is triggered during a ride.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
