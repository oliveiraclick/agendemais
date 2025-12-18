import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button, AgendeLogo } from '../components/UI';

interface ForgotPasswordProps {
    onBack: () => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack }) => {
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email) {
            setError('Por favor, digite seu email');
            return;
        }

        setIsLoading(true);

        try {
            await resetPassword(email);
            setEmailSent(true);
        } catch (err: any) {
            setError(err.message || 'Erro ao enviar email. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    if (emailSent) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 w-full max-w-md text-center border border-brand-100">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-3">
                        Email Enviado!
                    </h2>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        Enviamos um link de recuperação para <strong className="text-brand-600">{email}</strong>.
                        <br />
                        Verifique sua caixa de entrada (e spam).
                    </p>
                    <Button
                        onClick={onBack}
                        className="w-full py-4 text-base font-bold rounded-2xl shadow-lg"
                    >
                        Voltar para Login
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 w-full max-w-md border border-brand-100">
                <button
                    onClick={onBack}
                    className="flex items-center text-gray-600 hover:text-brand-600 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Voltar
                </button>

                <div className="text-center mb-8">
                    <AgendeLogo className="mx-auto mb-6" />
                    <h1 className="text-3xl font-bold text-gray-800 mb-3">
                        Esqueceu sua senha?
                    </h1>
                    <p className="text-gray-600">
                        Digite seu email e enviaremos um link para redefinir sua senha.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none text-gray-900 placeholder:text-gray-400"
                                placeholder="seu@email.com"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm border border-red-100">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 text-base font-bold rounded-2xl shadow-lg"
                    >
                        {isLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
                    </Button>
                </form>
            </div>
        </div>
    );
};
