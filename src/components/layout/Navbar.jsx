import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/slices/authSlice';
import { markNotificationsRead, clearNotifications, openSupportModal } from '../../redux/slices/rideSlice';
import { openPaymentMethodsModal, openEarningsModal } from '../../redux/slices/paymentSlice';
import { Car, User, LogOut, ChevronDown, ChevronRight, Bell, Shield, Clock, Check, CheckCircle2, CreditCard, TrendingUp, LifeBuoy } from 'lucide-react';
import { toast } from 'react-toastify';

export default function Navbar() {
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const { notifications = [], unreadCount = 0 } = useSelector((state) => state.ride);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await dispatch(logoutUser()).unwrap();
            toast.success("Logged out successfully");
            navigate('/login');
        } catch (err) {
            toast.error(err || "Failed to log out");
        }
    };

    return (
        <header className="sticky top-0 z-50 px-4 sm:px-6 py-3">
            <nav className="max-w-7xl mx-auto glass-1 rounded-2xl px-4 sm:px-6 h-16 flex items-center justify-between">
                {/* Brand Logo */}
                <Link to="/" className="flex items-center gap-2.5 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF7A59] to-[#E8532E] flex items-center justify-center text-white shadow-[0_4px_16px_rgba(255,122,89,0.35)] transition-transform group-hover:scale-105">
                        <Car className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-extrabold text-2xl tracking-tight text-[#3B2A2A] font-display">
                        Hop<span className="text-[#FF7A59]">In</span>
                    </span>
                </Link>

                {/* Center Nav Links (when authenticated) */}
                {isAuthenticated && (
                    <div className="hidden md:flex items-center gap-1.5 glass-1 rounded-xl px-2 py-1">
                        <Link
                            to="/"
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${location.pathname === '/'
                                ? 'bg-[#FF7A59] text-white shadow-[0_4px_14px_rgba(255,122,89,0.30)]'
                                : 'text-[#5C4A4A] hover:text-[#3B2A2A] hover:bg-white/50'
                                }`}
                        >
                            Book a Ride
                        </Link>
                        <Link
                            to="/history"
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${location.pathname === '/history'
                                ? 'bg-[#FF7A59] text-white shadow-[0_4px_14px_rgba(255,122,89,0.30)]'
                                : 'text-[#5C4A4A] hover:text-[#3B2A2A] hover:bg-white/50'
                                }`}
                        >
                            Ride History
                        </Link>
                        <Link
                            to="/profile"
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${location.pathname === '/profile'
                                ? 'bg-[#FF7A59] text-white shadow-[0_4px_14px_rgba(255,122,89,0.30)]'
                                : 'text-[#5C4A4A] hover:text-[#3B2A2A] hover:bg-white/50'
                                }`}
                        >
                            My Profile
                        </Link>
                    </div>
                )}

                {/* Right Area */}
                <div className="flex items-center gap-3">
                    {isAuthenticated ? (
                        <>
                            {/* Day 12 Customer Support Button */}
                            <button
                                type="button"
                                onClick={() => dispatch(openSupportModal())}
                                title="Customer Support"
                                className="w-10 h-10 rounded-xl glass-2 flex items-center justify-center text-[#5C4A4A] hover:text-[#FF7A59] hover:bg-white/80 transition-all"
                            >
                                <LifeBuoy className="w-4 h-4" />
                            </button>

                            {/* Interactive In-App Notifications Drawer */}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setNotificationsOpen(!notificationsOpen);
                                        if (!notificationsOpen && unreadCount > 0) {
                                            dispatch(markNotificationsRead());
                                        }
                                    }}
                                    title="In-App Notifications"
                                    className="w-10 h-10 rounded-xl glass-2 flex items-center justify-center text-[#5C4A4A] hover:text-[#FF7A59] hover:bg-white/80 transition-all relative"
                                >
                                    <Bell className="w-4 h-4" />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[16px] h-[16px] px-1 rounded-full bg-[#FF7A59] text-white text-[9px] font-extrabold ring-2 ring-white animate-pulse">
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                </button>

                                {notificationsOpen && (
                                    <div
                                        className="absolute right-0 mt-2.5 w-[calc(100vw-2rem)] max-w-sm sm:w-96 bg-white rounded-3xl p-4 shadow-[0_24px_60px_rgba(59,42,42,0.18)] z-50 animate-sheet-up border border-[#E8DFDF]"
                                        onMouseLeave={() => setNotificationsOpen(false)}
                                    >
                                        <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-[#E8DFDF]/60">
                                            <div className="flex items-center gap-1.5">
                                                <span className="w-2 h-2 rounded-full bg-[#FF7A59]" />
                                                <h4 className="font-bold text-sm text-[#3B2A2A] font-display">Live Notifications</h4>
                                            </div>
                                            {notifications.length > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => dispatch(clearNotifications())}
                                                    className="text-[11px] font-semibold text-[#A39494] hover:text-[#E8532E]"
                                                >
                                                    Clear All
                                                </button>
                                            )}
                                        </div>

                                        <div className="max-h-80 overflow-y-auto space-y-2 pr-0.5">
                                            {notifications.length === 0 ? (
                                                <div className="py-7 text-center text-[#A39494] text-xs">
                                                    <Bell className="w-6 h-6 mx-auto mb-1.5 opacity-40" />
                                                    No ride alerts yet
                                                </div>
                                            ) : (
                                                notifications.map((n) => (
                                                    <div
                                                        key={n.id}
                                                        className={`p-2.5 rounded-2xl glass-1 border text-xs transition-all ${!n.read
                                                            ? 'border-l-4 border-l-[#FF7A59] border-white/70 bg-white/70 shadow-sm'
                                                            : 'border-white/50 opacity-80'
                                                            }`}
                                                    >
                                                        <div className="flex items-start justify-between gap-2">
                                                            <span className="font-bold text-[#3B2A2A]">{n.title}</span>
                                                            <span className="text-[10px] text-[#A39494] shrink-0 font-mono">
                                                                {n.timestamp ? new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                                                            </span>
                                                        </div>
                                                        <p className="text-[#5C4A4A] mt-0.5 font-medium">{n.message}</p>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* User Dropdown */}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2.5 p-1.5 rounded-xl glass-2 hover:bg-white/80 transition-all"
                                >
                                    {user?.profileImage ? (
                                        <img
                                            src={user.profileImage}
                                            alt={user.name}
                                            className="w-8 h-8 rounded-lg object-cover ring-1 ring-white"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#FFB199] to-[#FF9EB5] flex items-center justify-center text-white font-bold text-sm">
                                            {user?.name ? user.name[0].toUpperCase() : 'U'}
                                        </div>
                                    )}
                                    <span className="hidden sm:inline font-semibold text-sm text-[#3B2A2A] max-w-[120px] truncate">
                                        {user?.name || "Rider"}
                                    </span>
                                    <ChevronDown className="w-4 h-4 text-[#7A6A6A]" />
                                </button>

                                {/* Dropdown Menu (Solid Opaque Card - No Map Bleed-through) */}
                                {dropdownOpen && (
                                    <div
                                        className="absolute right-0 mt-2.5 w-[calc(100vw-2rem)] max-w-xs sm:w-80 bg-white rounded-3xl p-3 shadow-[0_24px_60px_rgba(59,42,42,0.18)] z-50 animate-sheet-up border border-[#E8DFDF]"
                                        onMouseLeave={() => setDropdownOpen(false)}
                                    >
                                        {/* User Identity Header Card */}
                                        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#FFF5F0] via-[#FFEEE6] to-[#FFF8F5] border border-[#FFD6CA] mb-2.5 shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    {user?.profileImage ? (
                                                        <img
                                                            src={user.profileImage}
                                                            alt={user.name}
                                                            className="w-11 h-11 rounded-xl object-cover ring-2 ring-white shadow-sm"
                                                        />
                                                    ) : (
                                                        <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#FF7A59] to-[#E8532E] flex items-center justify-center text-white font-extrabold text-base shadow-sm">
                                                            {user?.name ? user.name[0].toUpperCase() : 'U'}
                                                        </div>
                                                    )}
                                                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#059669] ring-2 ring-white" title="Active" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <h4 className="font-extrabold text-sm text-[#3B2A2A] font-display truncate">
                                                            {user?.name || "Rider"}
                                                        </h4>
                                                        <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-[#FF7A59]/15 text-[#E8532E]">
                                                            Rider
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-[#7A6A6A] truncate mt-0.5" title={user?.email}>
                                                        {user?.email}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Phone / Verified Badge */}
                                            {user?.phone && (
                                                <div className="mt-2.5 pt-2 border-t border-[#FFD6CA]/60 flex items-center justify-between text-[11px] text-[#7A6A6A]">
                                                    <span className="font-mono font-medium">{user.phone}</span>
                                                    <span className="inline-flex items-center gap-1 font-semibold text-[#059669]">
                                                        <CheckCircle2 className="w-3 h-3" /> Verified
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Navigation Rows */}
                                        <div className="space-y-1">
                                            <Link
                                                to="/profile"
                                                onClick={() => setDropdownOpen(false)}
                                                className="flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold text-[#5C4A4A] hover:text-[#3B2A2A] hover:bg-[#FFF3EE] transition-all group"
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-7 h-7 rounded-lg bg-[#FFF3EE] group-hover:bg-white flex items-center justify-center text-[#FF7A59] transition-colors shadow-sm">
                                                        <User className="w-3.5 h-3.5" />
                                                    </div>
                                                    <span>Profile & Settings</span>
                                                </div>
                                                <ChevronRight className="w-3.5 h-3.5 text-[#C9BDBD] group-hover:text-[#FF7A59] transition-colors" />
                                            </Link>

                                            <Link
                                                to="/"
                                                onClick={() => setDropdownOpen(false)}
                                                className="flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold text-[#5C4A4A] hover:text-[#3B2A2A] hover:bg-[#FFF3EE] transition-all group"
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-7 h-7 rounded-lg bg-[#FFF3EE] group-hover:bg-white flex items-center justify-center text-[#FF7A59] transition-colors shadow-sm">
                                                        <Car className="w-3.5 h-3.5" />
                                                    </div>
                                                    <span>Book a Ride</span>
                                                </div>
                                                <ChevronRight className="w-3.5 h-3.5 text-[#C9BDBD] group-hover:text-[#FF7A59] transition-colors" />
                                            </Link>

                                            {/* Ride History (Day 9) */}
                                            <Link
                                                to="/history"
                                                onClick={() => setDropdownOpen(false)}
                                                className="flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold text-[#5C4A4A] hover:text-[#3B2A2A] hover:bg-[#FFF3EE] transition-all group"
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-7 h-7 rounded-lg bg-[#FFF3EE] group-hover:bg-white flex items-center justify-center text-[#FF7A59] transition-colors shadow-sm">
                                                        <Clock className="w-3.5 h-3.5" />
                                                    </div>
                                                    <span>My Ride History</span>
                                                </div>
                                                <ChevronRight className="w-3.5 h-3.5 text-[#C9BDBD] group-hover:text-[#FF7A59] transition-colors" />
                                            </Link>

                                            {/* Saved Payment Methods (Day 8) */}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setDropdownOpen(false);
                                                    dispatch(openPaymentMethodsModal());
                                                }}
                                                className="w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold text-[#5C4A4A] hover:text-[#3B2A2A] hover:bg-[#FFF3EE] transition-all group text-left"
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-7 h-7 rounded-lg bg-[#FFF3EE] group-hover:bg-white flex items-center justify-center text-[#FF7A59] transition-colors shadow-sm">
                                                        <CreditCard className="w-3.5 h-3.5" />
                                                    </div>
                                                    <span>Payment Methods</span>
                                                </div>
                                                <ChevronRight className="w-3.5 h-3.5 text-[#C9BDBD] group-hover:text-[#FF7A59] transition-colors" />
                                            </button>

                                            {/* Day 12 Customer Support */}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setDropdownOpen(false);
                                                    dispatch(openSupportModal());
                                                }}
                                                className="w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold text-[#5C4A4A] hover:text-[#3B2A2A] hover:bg-[#FFF3EE] transition-all group text-left"
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-7 h-7 rounded-lg bg-[#FFF3EE] group-hover:bg-white flex items-center justify-center text-[#FF7A59] transition-colors shadow-sm">
                                                        <LifeBuoy className="w-3.5 h-3.5" />
                                                    </div>
                                                    <span>Customer Support</span>
                                                </div>
                                                <ChevronRight className="w-3.5 h-3.5 text-[#C9BDBD] group-hover:text-[#FF7A59] transition-colors" />
                                            </button>
                                        </div>

                                        {/* Subtle Divider */}
                                        <div className="my-1.5 border-t border-[#E8DFDF]" />

                                        {/* Log Out Action */}
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-2xl text-xs font-bold text-[#E11D48] hover:bg-[#FFE1E8]/70 transition-all"
                                        >
                                            <div className="w-7 h-7 rounded-lg bg-[#FFE1E8] flex items-center justify-center text-[#E11D48]">
                                                <LogOut className="w-3.5 h-3.5" />
                                            </div>
                                            <span>Log Out</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                to="/login"
                                className="px-4 py-2 rounded-xl text-sm font-semibold text-[#3B2A2A] hover:bg-white/60 transition-all"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/register"
                                className="btn btn-primary btn-sm rounded-xl"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
}
