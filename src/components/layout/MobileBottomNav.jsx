import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { openPaymentMethodsModal } from '../../redux/slices/paymentSlice';
import { openSupportModal } from '../../redux/slices/rideSlice';
import { Car, Clock, CreditCard, User, LifeBuoy } from 'lucide-react';

export default function MobileBottomNav() {
    const location = useLocation();
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.auth);
    const { currentRide } = useSelector((state) => state.ride);

    // Only display on authenticated rider views
    if (!isAuthenticated) return null;

    const navItems = [
        {
            name: 'Book',
            path: '/',
            icon: Car,
            hasBadge: currentRide && currentRide.status !== 'COMPLETED' && currentRide.status !== 'CANCELLED'
        },
        {
            name: 'Trips',
            path: '/history',
            icon: Clock,
            hasBadge: false
        },
        {
            name: 'Support',
            action: () => dispatch(openSupportModal()),
            icon: LifeBuoy,
            hasBadge: false
        },
        {
            name: 'Profile',
            path: '/profile',
            icon: User,
            hasBadge: false
        }
    ];

    return (
        <nav
            aria-label="Mobile Bottom Navigation"
            className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-xl border-t border-[#E8DFDF]/80 shadow-[0_-8px_30px_rgba(59,42,42,0.08)] px-2 py-1.5 mobile-safe-bottom"
        >
            <div className="flex items-center justify-around max-w-md mx-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.path && location.pathname === item.path;

                    if (item.action) {
                        return (
                            <button
                                key={item.name}
                                type="button"
                                onClick={item.action}
                                className="flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all relative text-[#7A6A6A] hover:text-[#FF7A59] active:scale-95 min-w-[60px]"
                            >
                                <Icon className="w-5 h-5 mb-0.5" />
                                <span className="text-[10px] font-bold font-display">{item.name}</span>
                            </button>
                        );
                    }

                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all relative min-w-[60px] active:scale-95 ${
                                isActive
                                    ? 'text-[#FF7A59]'
                                    : 'text-[#7A6A6A] hover:text-[#FF7A59]'
                            }`}
                        >
                            <div className="relative">
                                <Icon className="w-5 h-5 mb-0.5" />
                                {item.hasBadge && (
                                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#059669] ring-2 ring-white animate-pulse" />
                                )}
                            </div>
                            <span className={`text-[10px] font-display ${isActive ? 'font-extrabold' : 'font-bold'}`}>
                                {item.name}
                            </span>
                            {isActive && (
                                <span className="w-4 h-0.5 rounded-full bg-[#FF7A59] mt-0.5" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
