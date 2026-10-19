import React from 'react';
import { User, ShieldCheck, Mail, Phone, Calendar, Edit3 } from 'lucide-react';

export default function ProfileHeader({ user, isEditing, onToggleEdit }) {
    const formattedJoinDate = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        : 'Recently';

    return (
        <div className="card glass-2 relative overflow-hidden border border-white/70 shadow-glass">
            {/* Ambient Background Gradient Accent */}
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-gradient-to-bl from-[#FF7A59]/20 to-[#FF9EB5]/10 blur-2xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative">
                {/* Avatar */}
                <div className="relative group shrink-0">
                    {user?.profileImage ? (
                        <img
                            src={user.profileImage}
                            alt={user.name}
                            className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-white/80 shadow-[0_8px_24px_rgba(255,122,89,0.25)]"
                        />
                    ) : (
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-[#FF7A59] to-[#E8532E] flex items-center justify-center text-white font-extrabold text-3xl sm:text-4xl shadow-[0_8px_24px_rgba(255,122,89,0.3)] ring-4 ring-white/80">
                            {user?.name ? user.name[0].toUpperCase() : 'U'}
                        </div>
                    )}

                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                        <div className="w-6 h-6 rounded-full bg-[#059669] flex items-center justify-center text-white" title="Verified Rider">
                            <ShieldCheck className="w-3.5 h-3.5" />
                        </div>
                    </div>
                </div>

                {/* Info */}
                <div className="flex-1 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <div className="flex items-center justify-center sm:justify-start gap-2.5">
                                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#3B2A2A] font-display">
                                    {user?.name || "Rider"}
                                </h2>
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#DCF7EC] text-[#059669]">
                                    Verified
                                </span>
                            </div>
                            <p className="text-sm font-medium text-[#7A6A6A] mt-0.5">HopIn Personal Account</p>
                        </div>

                        {/* Edit Button */}
                        <button
                            type="button"
                            onClick={onToggleEdit}
                            className={`btn btn-sm ${
                                isEditing ? 'btn-secondary text-[#5C4A4A]' : 'btn-primary'
                            }`}
                        >
                            <Edit3 className="w-4 h-4 mr-1.5" />
                            {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                        </button>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 pt-4 border-t border-[#E8DFDF]/60">
                        <div className="flex items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm text-[#5C4A4A]">
                            <Mail className="w-4 h-4 text-[#FF7A59]" />
                            <span className="truncate">{user?.email}</span>
                        </div>
                        <div className="flex items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm text-[#5C4A4A]">
                            <Phone className="w-4 h-4 text-[#FF7A59]" />
                            <span>{user?.phone || 'Not provided'}</span>
                        </div>
                        <div className="flex items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm text-[#5C4A4A]">
                            <Calendar className="w-4 h-4 text-[#FF7A59]" />
                            <span>Member since {formattedJoinDate}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
