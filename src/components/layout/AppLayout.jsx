import React from 'react';
import Navbar from './Navbar';
import MobileBottomNav from './MobileBottomNav';
import CustomerSupportModal from '../support/CustomerSupportModal';
import PaymentMethodsModal from '../payment/PaymentMethodsModal';

// Main application layout with ambient mesh background blobs, navbar, and mobile bottom navigation
// Globally mounts CustomerSupportModal and PaymentMethodsModal so they can be opened from any page
export default function AppLayout({ children }) {
    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col font-sans">
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#FF7A59]/35 blur-3xl" />
                <div className="absolute top-1/3 -right-28 w-96 h-96 rounded-full bg-[#FF9EB5]/35 blur-3xl" />
                <div className="absolute -bottom-32 left-1/3 w-96 h-96 rounded-full bg-[#FFC46B]/30 blur-3xl" />
            </div>

            <Navbar />

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-8">
                {children}
            </main>

            <MobileBottomNav />

            <CustomerSupportModal />
            <PaymentMethodsModal />
        </div>
    );
}


