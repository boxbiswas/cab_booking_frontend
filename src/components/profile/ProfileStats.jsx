import React from 'react';
import { Car, CreditCard, Shield, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProfileStats({ stats, loading }) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="card glass-2 p-5 border border-white/70 space-y-4">
                        <div className="flex items-start justify-between">
                            <div className="space-y-2">
                                <div className="h-3.5 skeleton w-20" />
                                <div className="h-8 skeleton w-14" />
                            </div>
                            <div className="w-10 h-10 skeleton rounded-2xl" />
                        </div>
                        <div className="pt-3 border-t border-[#E8DFDF]/60 flex justify-between">
                            <div className="h-3 skeleton w-24" />
                            <div className="h-3 skeleton w-4" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    const totalRides = stats?.rides || 0;
    const paymentMethodsCount = stats?.paymentMethods || 0;
    const emergencyContactsCount = stats?.emergencyContacts || 0;

    const statCards = [
        {
            title: "Total Rides",
            value: totalRides,
            subtext: "Completed journeys",
            icon: Car,
            color: "from-[#FF7A59] to-[#E8532E]",
            link: "/history"
        },
        {
            title: "Payment Methods",
            value: paymentMethodsCount,
            subtext: "Configured cards / UPI",
            icon: CreditCard,
            color: "from-[#FFB199] to-[#FF9EB5]",
            link: "/profile"
        },
        {
            title: "Emergency Contacts",
            value: emergencyContactsCount,
            subtext: "Configured for SOS alerts",
            icon: Shield,
            color: "from-[#FFC46B] to-[#FF9E5E]",
            link: "/profile"
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            {statCards.map((card, idx) => {
                const IconComponent = card.icon;
                return (
                    <Link
                        key={idx}
                        to={card.link}
                        className="card glass-2 card-interactive flex flex-col justify-between p-5 border border-white/70 block group"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-bold text-[#7A6A6A] uppercase tracking-wider">{card.title}</p>
                                <p className="text-3xl font-extrabold text-[#3B2A2A] font-display mt-1">{card.value}</p>
                            </div>
                            <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${card.color} flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform`}>
                                <IconComponent className="w-5 h-5" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#E8DFDF]/60 text-xs font-semibold text-[#5C4A4A]">
                            <span>{card.subtext}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-[#FF7A59] group-hover:translate-x-0.5 transition-transform" />
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
