
import React, { useState } from 'react';
import { useStore } from '../store';
import { Button, AgendeLogo } from '../components/UI';
import { CalendarCheck, ArrowRight, User, Mail, Phone, Lock, Store, MapPin } from 'lucide-react';

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
            // Create the salon with password and address
            createSalon(
                formData.salonName,
                'professional',
                formData.address,
                formData.ownerName,
                formData.email,
                formData.password
            );

            setTimeout(() => {
                // Determine success and show payment screen
                setIsRegistered(true);
                setIsLoading(false);
            }, 500);
        }, 1500);
    };

    if (isRegistered) {
        return (
            <div className="h-full overflow-y-auto bg-gray-50 flex flex-col justify-center py-6 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md my-auto">
                    <div className="flex justify-center mb-6">
                        <div className="animate-in zoom-in duration-500 bg-green-100 p-4 rounded-full">
                            <CalendarCheck className="w-16 h-16 text-green-600" />
                        </div>
                    </div>

                    <h2 className="text-center text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
                        Conta criada!
                    </h2>
                    <p className="text-center text-gray-600 mb-8 px-4">
                        Sua conta foi registrada com sucesso. Para começar a usar, realize o pagamento da taxa de adesão.
                    </p>

                    <div className="mt-4 bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-2xl sm:px-10 border border-gray-100 text-center space-y-4">

                        <Button
                            className="w-full py-4 text-lg font-bold bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg shadow-green-200 flex items-center justify-center gap-2 animate-pulse"
                            onClick={() => window.open('https://pay.kiwify.com.br/ZqDT7Lt', '_blank')}
                        >
                            Realizar Pagamento <ArrowRight className="w-5 h-5" />
                        </Button>

                        <div className="pt-4 border-t border-gray-100">
                            <p className="text-sm text-gray-500 mb-3">Já realizou o pagamento?</p>
                            <Button
                                variant="outline"
                                className="w-full py-2 text-sm font-medium text-gray-700"
                                onClick={() => onSuccess(formData.email)}
                            >
                                Ir para o Login
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto bg-gray-50 flex flex-col justify-center py-4 px-4 sm:px-6 lg:px-8">

            {/* Header */}
            <div className="mx-auto w-full max-w-sm">
                <div className="flex justify-center mb-2">
                    <div className="animate-in zoom-in duration-500">
                        <AgendeLogo className="w-32 h-auto" />
                    </div>
                </div>

                <h2 className="text-center text-2xl font-extrabold text-gray-900 tracking-tight">
                    Crie sua conta grátis
                </h2>
                <p className="mt-1 text-center text-xs text-gray-600">
                    Já tem uma conta? <button onClick={onLoginRedirect} className="font-bold text-brand-600 hover:text-brand-800 transition-colors">Fazer Login</button>
                </p>

                <div className="mt-3 bg-white py-5 px-4 shadow-xl shadow-gray-200/50 rounded-2xl border border-gray-100">
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">Seu Nome</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-sm"
                                        placeholder="João Silva"
                                        value={formData.ownerName}
                                        onChange={e => setFormData({ ...formData, ownerName: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">Estabelecimento</label>
                                <div className="relative">
                                    <Store className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-sm"
                                        placeholder="Nome..."
                                        value={formData.salonName}
                                        onChange={e => setFormData({ ...formData, salonName: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">Endereço</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-sm"
                                    placeholder="Rua Exemplo, 123 - Centro"
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">E-mail</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                    <input
                                        type="email"
                                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-sm"
                                        placeholder="email@m.com"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">WhatsApp</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                    <input
                                        type="tel"
                                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-sm"
                                        placeholder="(11) 99999-9999"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">Senha</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                <input
                                    type="password"
                                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-sm"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <Button
                                className="w-full py-3 text-base font-bold rounded-xl shadow-lg shadow-brand-200 flex items-center justify-center gap-2"
                                onClick={handleSubmit}
                                disabled={isLoading}
                            >
                                {isLoading ? '...' : 'Criar Conta'} <ArrowRight className="w-4 h-4" />
                            </Button>
                            <p className="text-[10px] text-center text-gray-400 mt-2">
                                Termos de Uso aplicáveis.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
