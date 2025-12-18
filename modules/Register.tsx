
import React, { useState } from 'react';
import { useStore } from '../store';
import { useAuth } from '../hooks/useAuth';
import { Button, AgendeLogo } from '../components/UI';
import { CalendarCheck, ArrowRight, User, Mail, Phone, Lock, Store, MapPin, ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';

export const Register: React.FC<{
    onLoginRedirect: () => void;
    onSuccess: (email: string) => void;
}> = ({ onLoginRedirect, onSuccess }) => {
    const { createSalon, refreshSalons } = useStore();
    const { signUp } = useAuth();

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
    const [showPassword, setShowPassword] = useState(false);
    const [registrationStep, setRegistrationStep] = useState<'form' | 'verifying'>('form');
    const [error, setError] = useState('');

    // Email validation
    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Password strength validation
    const validatePassword = (password: string): { valid: boolean; message: string } => {
        if (password.length < 8) {
            return { valid: false, message: 'A senha deve ter pelo menos 8 caracteres' };
        }
        if (!/[A-Z]/.test(password)) {
            return { valid: false, message: 'A senha deve conter pelo menos uma letra maiúscula' };
        }
        if (!/[0-9]/.test(password)) {
            return { valid: false, message: 'A senha deve conter pelo menos um número' };
        }
        return { valid: true, message: '' };
    };

    const handleSubmit = async () => {
        setError('');

        // Validação de campos obrigatórios
        if (!formData.ownerName || !formData.salonName || !formData.email || !formData.password || !formData.address) {
            setError("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        // Validação de email
        if (!isValidEmail(formData.email)) {
            setError("Por favor, digite um email válido.");
            return;
        }

        // Validação de senha
        const passwordCheck = validatePassword(formData.password);
        if (!passwordCheck.valid) {
            setError(passwordCheck.message);
            return;
        }

        setIsLoading(true);

        try {
            // Step 1: Create Supabase Auth user
            const { user } = await signUp(formData.email, formData.password, {
                salonName: formData.salonName,
                ownerName: formData.ownerName,
                phone: formData.phone,
            });

            if (user) {
                // Step 2: Wait for DB Trigger to create salon
                // The trigger 'on_auth_user_created' runs automatically.

                // Step 3: Refresh local store to get the new salon
                await refreshSalons();

                // Step 4: Show success
                setIsRegistered(true);
                setIsLoading(false);
            }
        } catch (error: any) {
            setIsLoading(false);

            // User-friendly error messages
            let errorMessage = 'Erro ao criar conta. Tente novamente.';

            if (error.message?.includes('already registered')) {
                errorMessage = 'Este email já está cadastrado. Tente fazer login.';
            } else if (error.message?.includes('invalid email')) {
                errorMessage = 'Email inválido. Verifique e tente novamente.';
            } else if (error.message?.includes('weak password')) {
                errorMessage = 'Senha muito fraca. Use uma senha mais forte.';
            }

            setError(errorMessage);
        }
    };


    // Email Verification Screen
    if (registrationStep === 'verifying') {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-600 flex flex-col">
                {/* Header */}
                <div className="flex-shrink-0 pt-12 pb-6 px-6">
                    <div className="flex justify-center mb-4">
                        <div className="bg-white p-4 rounded-full shadow-lg">
                            <Mail className="w-12 h-12 text-blue-600" />
                        </div>
                    </div>
                    <h1 className="text-center text-white text-2xl font-bold">
                        Verifique seu Email
                    </h1>
                    <p className="text-center text-white/80 text-sm mt-2">
                        Enviamos um link de confirmação para {formData.email}
                    </p>
                </div>

                {/* Card */}
                <div className="flex-1 bg-white rounded-t-[32px] px-6 pt-8 pb-8">
                    <div className="text-center mb-6">
                        <p className="text-gray-600 mb-4">
                            Por favor, verifique sua caixa de entrada e clique no link de confirmação para ativar sua conta.
                        </p>
                        <p className="text-gray-500 text-sm">
                            Não recebeu o email? Verifique a pasta de spam ou aguarde alguns minutos.
                        </p>
                    </div>

                    <Button
                        className="w-full py-4 text-base font-bold rounded-2xl"
                        onClick={onLoginRedirect}
                    >
                        Ir para Login
                    </Button>
                </div>
            </div>
        );
    }

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
                            Escolha como deseja começar:
                        </p>
                    </div>

                    {/* Botão Testar Grátis */}
                    <Button
                        className="w-full py-4 text-base font-bold bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 mb-4"
                        onClick={() => {
                            alert(`🎉 Parabéns! Você tem 7 dias de teste grátis.\n\nAproveite para conhecer todas as funcionalidades!`);
                            onSuccess(formData.email);
                        }}
                    >
                        Quero Testar Grátis
                        <ArrowRight className="w-5 h-5" />
                    </Button>

                    <div className="text-center text-xs text-gray-400 mb-4">ou</div>

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
                                type={showPassword ? 'text' : 'password'}
                                className="w-full pl-10 pr-10 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {/* Password Strength Indicator */}
                        {formData.password && (
                            <div className="mt-2 space-y-1">
                                <div className="flex gap-1">
                                    <div className={`h-1 flex-1 rounded-full ${formData.password.length >= 8 ? 'bg-green-500' : 'bg-gray-200'}`} />
                                    <div className={`h-1 flex-1 rounded-full ${/[A-Z]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-200'}`} />
                                    <div className={`h-1 flex-1 rounded-full ${/[0-9]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-200'}`} />
                                </div>
                                <p className="text-[10px] text-gray-500">
                                    {formData.password.length < 8 && '• Mínimo 8 caracteres '}
                                    {!/[A-Z]/.test(formData.password) && '• 1 letra maiúscula '}
                                    {!/[0-9]/.test(formData.password) && '• 1 número'}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl text-sm flex items-start gap-2">
                            <span className="text-red-500 font-bold">⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}
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
