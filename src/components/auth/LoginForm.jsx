import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearAuthError } from '../../redux/slices/authSlice';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [clientError, setClientError] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setClientError('');

        if (!email.trim()) {
            setClientError('Please enter your email address');
            return;
        }
        if (!password) {
            setClientError('Please enter your password');
            return;
        }

        try {
            await dispatch(loginUser({ email: email.trim(), password })).unwrap();
            toast.success("Welcome back to HopIn!");
            navigate('/');
        } catch (err) {
            // error is stored in redux state
        }
    };

    return (
        <div className="w-full max-w-md mx-auto glass-3 rounded-4xl p-8 sm:p-10 border border-white/80 shadow-2xl animate-fade-in">
            <div className="text-center mb-8">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF7A59] to-[#E8532E] flex items-center justify-center text-white mx-auto mb-3 shadow-[0_8px_24px_rgba(255,122,89,0.35)]">
                    <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-extrabold text-[#3B2A2A] font-display">Welcome Back</h2>
                <p className="text-sm text-[#7A6A6A] mt-1.5 font-medium">Log in to book your ride and track trips</p>
            </div>

            {(error || clientError) && (
                <div className="mb-6 p-4 rounded-2xl bg-[#FFE1E8] border border-[#FFD0DC] flex items-start gap-3 text-sm text-[#E11D48] animate-fade-in">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <span className="font-semibold">{clientError || error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="label" htmlFor="login-email">Email Address</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#A39494]">
                            <Mail className="w-5 h-5" />
                        </div>
                        <input
                            id="login-email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (error) dispatch(clearAuthError());
                            }}
                            className="input pl-11"
                            style={{ paddingLeft: '3rem' }}
                            autoComplete="email"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="label" htmlFor="login-password">Password</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#A39494]">
                            <Lock className="w-5 h-5" />
                        </div>
                        <input
                            id="login-password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (error) dispatch(clearAuthError());
                            }}
                            className="input pl-11 pr-11"
                            style={{ paddingLeft: '3rem', paddingRight: '3rem' }}
                            autoComplete="current-password"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#A39494] hover:text-[#5C4A4A]"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-full h-12 text-base font-bold shadow-[0_8px_24px_rgba(255,122,89,0.35)] mt-2"
                >
                    {loading ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            Sign In to HopIn
                            <ArrowRight className="w-4 h-4 ml-1" />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-[#7A6A6A]">
                Don't have an account yet?{' '}
                <Link to="/register" className="font-bold text-[#E8532E] hover:underline">
                    Create a free account
                </Link>
            </div>
        </div>
    );
}
