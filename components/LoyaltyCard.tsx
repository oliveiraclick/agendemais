
import React from 'react';
import { Gift, CheckCircle } from 'lucide-react';

interface LoyaltyCardProps {
    salonName: string;
    stamps: number;
    totalRequired: number;
    reward: string;
}

export const LoyaltyCard: React.FC<LoyaltyCardProps> = ({ salonName, stamps, totalRequired, reward }) => {
    const slots = [];
    for (let i = 1; i <= totalRequired; i++) {
        const isStamped = i <= stamps;
        slots.push(
            <div key={i} className={`
                w-10 h-10 rounded-full flex items-center justify-center border-2 
                ${isStamped ? 'bg-brand-600 border-brand-600 text-white' : 'bg-white border-dashed border-gray-300'}
            `}>
                {isStamped ? <CheckCircle size={20} /> : <span className="text-gray-300 text-xs font-bold">{i}</span>}
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative">
            <div className="bg-brand-600 p-4 text-white flex justify-between items-center">
                <span className="font-bold text-lg">{salonName}</span>
                <Gift className="opacity-80" />
            </div>
            <div className="p-6">
                <div className="flex flex-wrap gap-3 justify-center mb-6">
                    {slots}
                </div>
                <div className="text-center">
                    <p className="text-sm text-gray-500 mb-1">Prêmio ao completar:</p>
                    <p className="font-bold text-brand-700 text-lg">{reward}</p>
                </div>
                {stamps >= totalRequired && (
                    <div className="mt-4 bg-green-100 text-green-700 p-3 rounded-lg text-center font-bold animate-pulse">
                        Cartão Completo! Resgate seu prêmio na recepção.
                    </div>
                )}
            </div>
            {/* Background decoration */}
            <div className="absolute top-1/2 left-0 w-4 h-8 bg-gray-50 rounded-r-full -translate-y-1/2 border-r border-t border-b border-gray-200" />
            <div className="absolute top-1/2 right-0 w-4 h-8 bg-gray-50 rounded-l-full -translate-y-1/2 border-l border-t border-b border-gray-200" />
        </div>
    );
};
