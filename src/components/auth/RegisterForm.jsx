import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearAuthError } from '../../redux/slices/authSlice';
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';
import { registerSchema } from '../../utils/validation';

export default function RegisterForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [clientError, setClientError] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setClientError('');

        if (password !== confirmPassword) {
            const msg = 'Passwords do not match';
            setClientError(msg);
            toast.error(msg);
            return;
        }

        const validation = registerSchema.safeParse({
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            password
        });

        if (!validation.success) {
            const firstError = validation.error.issues?.[0]?.message || 'Invalid input';
            setClientError(firstError);
            toast.error(firstError);
            return;
        }

        try {
            await dispatch(registerUser({
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim(),
                password
            })).unwrap();

            toast.success("Registration successful! Please log in.");
            navigate('/login');
        } catch (err) {
            // error handled via Redux state
        }
    };

    return (
        <div className="w-full max-w-md mx-auto glass-3 rounded-4xl p-8 sm:p-10 border border-white/80 shadow-2xl animate-fade-in">
            <div className="text-center mb-8">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF7A59] to-[#E8532E] flex items-center justify-center text-white mx-auto mb-3 shadow-[0_8px_24px_rgba(255,122,89,0.35)]">
                    <User className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-extrabold text-[#3B2A2A] font-display">Create Account</h2>
                <p className="text-sm text-[#7A6A6A] mt-1.5 font-medium">Join HopIn and start riding with ease</p>
            </div>

            {(error || clientError) && (
                <div className="mb-6 p-4 rounded-2xl bg-[#FFE1E8] border border-[#FFD0DC] flex items-start gap-3 text-sm text-[#E11D48] animate-fade-in">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <span className="font-semibold">{clientError || error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="label" htmlFor="register-name">Full Name</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#A39494]">
                            <User className="w-5 h-5" />
                        </div>
                        <input
                            id="register-name"
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (error) dispatch(clearAuthError());
                            }}
                            className="input pl-11"
                            style={{ paddingLeft: '3rem' }}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="label" htmlFor="register-email">Email Address</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#A39494]">
                            <Mail className="w-5 h-5" />
                        </div>
                        <input
                            id="register-email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (error) dispatch(clearAuthError());
                            }}
                            className="input pl-11"
                            style={{ paddingLeft: '3rem' }}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="label" htmlFor="register-phone">Phone Number</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#A39494]">
                            <Phone className="w-5 h-5" />
                        </div>
                        <input
                            id="register-phone"
                            type="tel"
                            placeholder="+1 (555) 123-4567"
                            value={phone}
                            onChange={(e) => {
                                setPhone(e.target.value);
                                if (error) dispatch(clearAuthError());
                            }}
                            className="input pl-11"
                            style={{ paddingLeft: '3rem' }}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="label" htmlFor="register-password">Password</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#A39494]">
                            <Lock className="w-5 h-5" />
                        </div>
                        <input
                            id="register-password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Minimum 6 characters"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (error) dispatch(clearAuthError());
                            }}
                            className="input pl-11 pr-11"
                            style={{ paddingLeft: '3rem', paddingRight: '3rem' }}
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

                <div>
                    <label className="label" htmlFor="register-confirm-password">Confirm Password</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#A39494]">
                            <Lock className="w-5 h-5" />
                        </div>
                        <input
                            id="register-confirm-password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Re-enter password"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                if (error) dispatch(clearAuthError());
                            }}
                            className="input pl-11 pr-11"
                            style={{ paddingLeft: '3rem', paddingRight: '3rem' }}
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-full h-12 text-base font-bold shadow-[0_8px_24px_rgba(255,122,89,0.35)] mt-4"
                >
                    {loading ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            Create HopIn Account
                            <ArrowRight className="w-4 h-4 ml-1" />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-[#7A6A6A]">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-[#E8532E] hover:underline">
                    Sign In
                </Link>
            </div>
        </div>
    );
}
