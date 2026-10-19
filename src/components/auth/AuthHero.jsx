import React from 'react';
import { Car, ShieldCheck, MapPin, Sparkles } from 'lucide-react';

export default function AuthHero({ title, subtitle, highlights = [] }) {
    const defaultHighlights = [
        { icon: MapPin, text: "Seamless live GPS route tracking" },
        { icon: ShieldCheck, text: "Safe rides with real-time SOS protection" },
        { icon: Sparkles, text: "Instant fare estimates with zero hidden fees" }
    ];

    const displayHighlights = highlights.length > 0 ? highlights : defaultHighlights;

    return (
        <div className="hidden lg:flex flex-col justify-between p-10 lg:p-12 glass-2 rounded-4xl border border-white/70 relative overflow-hidden shadow-2xl">
            {/* Ambient inner soft glow */}
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br from-[#FF7A59]/25 to-[#FF9EB5]/20 blur-2xl pointer-events-none" />

            <div>
                {/* Brand Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF3EE] border border-[#FFC9B5]/70 text-[#E8532E] text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
                    <Car className="w-3.5 h-3.5" />
                    Hop in. Go anywhere.
                </div>

                <h1 className="font-extrabold text-4xl lg:text-5xl text-[#3B2A2A] leading-[1.15] tracking-tight font-display mb-4">
                    {title || (
                        <>
                            Your modern ride, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF7A59] to-[#E8532E]">
                                just a tap away.
                            </span>
                        </>
                    )}
                </h1>

                <p className="text-base lg:text-lg text-[#5C4A4A] leading-relaxed max-w-md">
                    {subtitle || "HopIn redefines urban mobility with warm translucent interfaces, fair transparent pricing, and instant driver matching."}
                </p>
            </div>

            {/* Highlights List */}
            <div className="space-y-4 my-8">
                {displayHighlights.map((item, idx) => {
                    const IconComponent = item.icon;
                    return (
                        <div key={idx} className="flex items-center gap-3.5 p-3 rounded-2xl glass-1 border border-white/60">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF7A59] to-[#E8532E] flex items-center justify-center text-white shadow-sm shrink-0">
                                <IconComponent className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-semibold text-[#3B2A2A]">{item.text}</span>
                        </div>
                    );
                })}
            </div>

            {/* Testimonial / Trust Footer */}
            <div className="pt-6 border-t border-[#E8DFDF]/60 flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-[#FFC46B] text-lg font-bold">★</span>
                        ))}
                    </div>
                    <p className="text-xs font-semibold text-[#7A6A6A]">Loved by riders across the city</p>
                </div>

                <div className="flex -space-x-2">
                    <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Rider 1" />
                    <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Rider 2" />
                    <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="Rider 3" />
                </div>
            </div>
        </div>
    );
}
