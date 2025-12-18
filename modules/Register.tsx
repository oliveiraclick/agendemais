
import React, { useState } from 'react';
import { useStore } from '../store';
import { Button, AgendeLogo } from '../components/UI';
import { CalendarCheck, ArrowRight, User, Mail, Phone, Lock, Store, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

export const Register: React.FC<{
    onLoginRedirect: () => void;
    onSuccess: (email: string) => void;
}> = ({ onLoginRedirect, onSuccess }) => {
    const { createSalon } = useStore();

    const [formData, setFormData] = useState({
        ownerName: '',
        salonName: '',
        email: '',
        phone: '',
        password: '',
        address: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);

    const handleSubmit = () => {
        if (!formData.ownerName || !formData.salonName || !formData.email || !formData.password || !formData.address) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        setIsLoading(true);

        setTimeout(() => {
            createSalon(
                formData.salonName,
                'professional',
                formData.address,
                formData.ownerName,
                formData.email,
                formData.password
            );

            setTimeout(() => {
                setIsRegistered(true);
                setIsLoading(false);
            }, 500);
        }, 1500);
    };

    if (isRegistered) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-green-500 to-green-600 flex flex-col">
                {/* Header */}
                <div className="flex-shrink-0 pt-12 pb-6 px-6">
                    <div className="flex justify-center mb-4">
                        <div className="bg-white p-4 rounded-full shadow-lg">
                            <CalendarCheck className="w-12 h-12 text-green-600" />
                        </div>
                    </div>
                    <h1 className="text-center text-white text-2xl font-bold">
                        Conta Criada!
                    </h1>
                    <p className="text-center text-white/80 text-sm mt-2">
                        Sua conta foi registrada com sucesso
                    </p>
                </div>

                {/* Card */}
                <div className="flex-1 bg-white rounded-t-[32px] px-6 pt-8 pb-8">
                    <div className="text-center mb-6">
                        <p className="text-gray-600">
                            Para começar a usar, realize o pagamento da taxa de adesão.
                        </p>
                    </div>

                    <Button
                        className="w-full py-4 text-base font-bold bg-green-600 hover:bg-green-700 rounded-2xl shadow-lg shadow-green-200 flex items-center justify-center gap-2 mb-4"
                        onClick={() => window.open('https://pay.kiwify.com.br/ZqDT7Lt', '_blank')}
                    >
                        Realizar Pagamento
                        <ArrowRight className="w-5 h-5" />
                    </Button>

                    <div className="pt-4 border-t border-gray-100 text-center">
                        <p className="text-sm text-gray-500 mb-3">Já realizou o pagamento?</p>
                        <Button
                            variant="outline"
                            className="w-full py-3 text-sm font-medium rounded-2xl"
                            onClick={() => onSuccess(formData.email)}
                        >
                            Ir para o Login
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-brand-600 to-brand-700 flex flex-col">

            {/* Header */}
            <div className="flex-shrink-0 pt-8 pb-4 px-6">
                <button
                    onClick={onLoginRedirect}
                    className="flex items-center text-white/80 text-sm mb-4"
                >
                    <ChevronLeft className="w-5 h-5" />
                    Voltar
                </button>

                <div className="flex justify-center mb-3">
                    <div className="bg-white p-2 rounded-xl shadow-lg">
                        <AgendeLogo className="w-16 h-auto" />
                    </div>
                </div>
                <h1 className="text-center text-white text-xl font-bold">
                    Criar Conta
                </h1>
            </div>

            {/* Card */}
            <div className="flex-1 bg-white rounded-t-[32px] px-6 pt-6 pb-8 overflow-y-auto">
                <div className="space-y-4">

                    {/* Nome e Estabelecimento */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Seu Nome</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    className="w-full pl-10 pr-3 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                                    placeholder="João"
                                    value={formData.ownerName}
                                    onChange={e => setFormData({ ...formData, ownerName: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Estabelecimento</label>
                            <div className="relative">
                                <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    className="w-full pl-10 pr-3 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                                    placeholder="Nome"
                                    value={formData.salonName}
                                    onChange={e => setFormData({ ...formData, salonName: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Endereço */}
                    <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Endereço</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                className="w-full pl-10 pr-3 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                                placeholder="Rua Exemplo, 123"
                                value={formData.address}
                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Email e WhatsApp */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">E-mail</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="email"
                                    className="w-full pl-10 pr-3 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                                    placeholder="email@m.com"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">WhatsApp</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="tel"
                                    className="w-full pl-10 pr-3 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                                    placeholder="(11) 99999"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Senha */}
                    <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Senha</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="password"
                                className="w-full pl-10 pr-3 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Botão criar */}
                    <Button
                        className="w-full py-4 text-base font-bold rounded-2xl shadow-lg shadow-brand-200 flex items-center justify-center gap-2 mt-2"
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Criando...' : 'Criar Conta'}
                        <ChevronRight className="w-5 h-5" />
                    </Button>

                    <p className="text-[10px] text-center text-gray-400">
                        Ao criar conta, você aceita nossos Termos de Uso.
                    </p>
                </div>
            </div>
        </div>
    );
};
