import React from 'react';
import Navbar from './Navbar';

export default function AppLayout({ children }) {
    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col font-sans">
            {/* Ambient Background Mesh Blobs per DESIGN.md Section 3.4 */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                {/* Coral Top-Left Blob */}
                <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#FF7A59]/35 blur-3xl" />
                {/* Rose Center-Right Blob */}
                <div className="absolute top-1/3 -right-28 w-96 h-96 rounded-full bg-[#FF9EB5]/35 blur-3xl" />
                {/* Golden Bottom-Center Blob */}
                <div className="absolute -bottom-32 left-1/3 w-96 h-96 rounded-full bg-[#FFC46B]/30 blur-3xl" />
            </div>

            {/* Navigation Header */}
            <Navbar />

            {/* Main Content Area */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
                {children}
            </main>
        </div>
    );
}
