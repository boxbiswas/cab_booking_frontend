import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/slices/authSlice';
import { Car, User, LogOut, ChevronDown, Bell, Shield, Clock } from 'lucide-react';
import { toast } from 'react-toastify';

export default function Navbar() {
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [dropdownOpen, setDropdownOpen] = useState(false);

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
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                location.pathname === '/'
                                    ? 'bg-[#FF7A59] text-white shadow-[0_4px_14px_rgba(255,122,89,0.30)]'
                                    : 'text-[#5C4A4A] hover:text-[#3B2A2A] hover:bg-white/50'
                            }`}
                        >
                            Book a Ride
                        </Link>
                        <Link
                            to="/profile"
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                location.pathname === '/profile'
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
                            {/* Notification Icon */}
                            <button
                                type="button"
                                title="Notifications"
                                className="w-10 h-10 rounded-xl glass-2 flex items-center justify-center text-[#5C4A4A] hover:text-[#FF7A59] hover:bg-white/80 transition-all relative"
                            >
                                <Bell className="w-4 h-4" />
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#FF7A59] ring-2 ring-white"></span>
                            </button>

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

                                {/* Dropdown Menu */}
                                {dropdownOpen && (
                                    <div
                                        className="absolute right-0 mt-2 w-56 glass-3 rounded-2xl p-2 shadow-2xl z-50 animate-fade-in"
                                        onMouseLeave={() => setDropdownOpen(false)}
                                    >
                                        <div className="px-3 py-2 border-b border-[#E8DFDF]/60 mb-1">
                                            <p className="text-xs font-semibold text-[#A39494] uppercase tracking-wider">Signed in as</p>
                                            <p className="text-sm font-bold text-[#3B2A2A] truncate">{user?.email}</p>
                                        </div>

                                        <Link
                                            to="/profile"
                                            onClick={() => setDropdownOpen(false)}
                                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-[#5C4A4A] hover:text-[#3B2A2A] hover:bg-white/70 transition-colors"
                                        >
                                            <User className="w-4 h-4 text-[#FF7A59]" />
                                            Profile & Settings
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-[#E11D48] hover:bg-[#FFE1E8]/60 transition-colors mt-1"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Log Out
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
