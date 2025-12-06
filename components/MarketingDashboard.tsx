
import React, { useState } from 'react';
import { Button, Card } from './UI';
import { generateMarketingPost } from '../services/geminiService';
import { Sparkles, Copy, Check, Share2, MessageCircle, Instagram } from 'lucide-react';

import { Review } from '../types';
import { Star } from 'lucide-react';

interface MarketingDashboardProps {
    salonName: string;
    reviews?: Review[];
}

export const MarketingDashboard: React.FC<MarketingDashboardProps> = ({ salonName, reviews = [] }) => {
    const [goal, setGoal] = useState('');
    const [generatedPost, setGeneratedPost] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleGenerate = async () => {
        if (!goal) return;
        setLoading(true);
        setGeneratedPost('');
        const text = await generateMarketingPost(salonName, goal);
        setGeneratedPost(text);
        setLoading(false);
        setCopied(false);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedPost);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const suggestedGoals = [
        "Divulgar promoção de corte",
        "Atrair clientes para horários vagos",
        "Avisar sobre novo serviço de manicure",
        "Desejar bom fim de semana"
    ];

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-brand-100 to-white p-6 rounded-2xl border border-brand-200">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                        <Sparkles className="w-6 h-6 text-brand-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Assistente de Marketing IA</h2>
                        <p className="text-sm text-gray-600">Crie textos incríveis para suas redes sociais em segundos.</p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Qual o objetivo do post de hoje?</label>
                    <textarea
                        className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                        placeholder="Ex: Divulgar que temos horários livres amanhã..."
                        rows={3}
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                    />
                    <div className="flex gap-2 mt-2 overflow-x-auto pb-2 no-scrollbar">
                        {suggestedGoals.map((s, i) => (
                            <button
                                key={i}
                                onClick={() => setGoal(s)}
                                className="whitespace-nowrap bg-gray-50 hover:bg-brand-50 text-xs px-3 py-1.5 rounded-full border border-gray-200 transition-colors"
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                <Button
                    className="w-full bg-gradient-to-r from-brand-600 to-brand-800 hover:from-brand-700 hover:to-brand-900 shadow-lg shadow-brand-200"
                    onClick={handleGenerate}
                    disabled={loading || !goal}
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 animate-spin" /> Criando mágica...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4" /> Gerar Post com IA
                        </span>
                    )}
                </Button>
            </div>

            {generatedPost && (
                <div className="animate-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-white border-2 border-brand-100 rounded-xl p-6 shadow-sm relative">
                        <div className="absolute top-4 right-4 flex gap-2">
                            <button
                                onClick={handleCopy}
                                className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                                title="Copiar"
                            >
                                {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                            </button>
                        </div>

                        <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">Resultado Gerado:</h3>
                        <p className="text-lg text-gray-800 leading-relaxed font-medium">
                            {generatedPost}
                        </p>

                        <div className="mt-6 flex gap-3 pt-4 border-t border-gray-100">
                            <button className="flex-1 bg-green-50 text-green-700 py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-green-100 transition-colors">
                                <MessageCircle className="w-4 h-4" /> WhatsApp
                            </button>
                            <button className="flex-1 bg-gray-50 text-gray-700 py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors">
                                <Instagram className="w-4 h-4" /> Instagram
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reviews Section */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Últimas Avaliações</h2>
                        <p className="text-sm text-gray-600">{reviews.length} avaliações recebidas</p>
                    </div>
                    {reviews.length > 0 && (
                        <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900 flex items-center justify-end gap-1">
                                {(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)} <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                            </div>
                            <span className="text-xs text-brand-600 font-bold">Média Geral</span>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    {reviews.slice().reverse().map(review => (
                        <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-bold text-gray-900">{review.clientName}</span>
                                <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <Star key={star} className={`w-3 h-3 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                                    ))}
                                </div>
                            </div>
                            {review.comment && (
                                <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg italic border border-gray-100">"{review.comment}"</p>
                            )}
                            <div className="mt-2 text-[10px] text-gray-400">
                                {new Date(review.date).toLocaleDateString()} às {new Date(review.date).toLocaleTimeString()}
                            </div>
                        </div>
                    ))}
                    {reviews.length === 0 && (
                        <div className="text-center py-8 text-gray-400">
                            <Star className="w-10 h-10 mx-auto mb-2 opacity-50" />
                            <p>Nenhuma avaliação ainda.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
