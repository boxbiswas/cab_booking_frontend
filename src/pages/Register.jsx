import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AuthHero from '../components/auth/AuthHero';
import RegisterForm from '../components/auth/RegisterForm';

export default function Register() {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    // If already logged in, redirect to home
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="min-h-screen relative flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
            {/* Ambient Background Mesh Blobs per DESIGN.md */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#FF7A59]/35 blur-3xl" />
                <div className="absolute top-1/3 -right-28 w-96 h-96 rounded-full bg-[#FF9EB5]/35 blur-3xl" />
                <div className="absolute -bottom-32 left-1/3 w-96 h-96 rounded-full bg-[#FFC46B]/30 blur-3xl" />
            </div>

            <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                {/* Left Side: Brand Story & Highlights */}
                <AuthHero
                    title={
                        <>
                            Get started with <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF7A59] to-[#E8532E]">
                                effortless rides.
                            </span>
                        </>
                    }
                    subtitle="Create your HopIn account in seconds and unlock effortless rides, real-time trip tracking, and transparent upfront pricing."
                />

                {/* Right Side: Register Form Subcomponent */}
                <div>
                    <RegisterForm />
                </div>
            </div>
        </div>
    );
}
