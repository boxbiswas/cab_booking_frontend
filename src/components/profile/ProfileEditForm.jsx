import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../../redux/slices/authSlice';
import { User, Phone, Image, Check, X, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';

export default function ProfileEditForm({ user, onClose }) {
    const [name, setName] = useState(user?.name || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [profileImage, setProfileImage] = useState(user?.profileImage || '');
    const [formError, setFormError] = useState('');

    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.auth);

    const handleSave = async (e) => {
        e.preventDefault();
        setFormError('');

        if (!name.trim()) {
            setFormError('Name cannot be empty');
            return;
        }

        try {
            await dispatch(updateProfile({
                name: name.trim(),
                phone: phone.trim(),
                profileImage: profileImage.trim() || null
            })).unwrap();

            toast.success("Profile updated successfully!");
            onClose();
        } catch (err) {
            setFormError(err || "Failed to update profile");
        }
    };

    return (
        <div className="card glass-3 border border-white/80 shadow-xl mt-6 animate-fade-in">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#E8DFDF]/60">
                <div>
                    <h3 className="text-xl font-bold text-[#3B2A2A] font-display">Edit Profile</h3>
                    <p className="text-xs text-[#7A6A6A]">Update your personal contact details</p>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    className="w-8 h-8 rounded-full glass-1 flex items-center justify-center text-[#7A6A6A] hover:text-[#3B2A2A]"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {formError && (
                <div className="mb-4 p-3 rounded-xl bg-[#FFE1E8] border border-[#FFD0DC] flex items-center gap-2 text-xs font-semibold text-[#E11D48]">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="label" htmlFor="edit-name">Full Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A39494]">
                                <User className="w-4 h-4" />
                            </div>
                            <input
                                id="edit-name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input pl-10"
                                style={{ paddingLeft: '2.5rem' }}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="label" htmlFor="edit-phone">Phone Number</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A39494]">
                                <Phone className="w-4 h-4" />
                            </div>
                            <input
                                id="edit-phone"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="input pl-10"
                                style={{ paddingLeft: '2.5rem' }}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="label" htmlFor="edit-avatar">Profile Image URL (Optional)</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A39494]">
                            <Image className="w-4 h-4" />
                        </div>
                        <input
                            id="edit-avatar"
                            type="url"
                            placeholder="https://example.com/photo.jpg"
                            value={profileImage}
                            onChange={(e) => setProfileImage(e.target.value)}
                            className="input pl-10"
                            style={{ paddingLeft: '2.5rem' }}
                        />
                    </div>
                    <p className="text-xs text-[#A39494] mt-1">Provide a direct image URL to update your avatar</p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-secondary btn-sm"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary btn-sm flex items-center gap-1.5"
                    >
                        <Check className="w-4 h-4" />
                        <span>{loading ? "Saving..." : "Save Changes"}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
