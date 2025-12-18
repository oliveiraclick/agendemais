
import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { useAuth } from '../hooks/useAuth';
import { Button, AgendeLogo } from '../components/UI';
import { Mail, Lock, Phone, Store, User, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { ContextualHelp } from '../components/ContextualHelp';

export const Login: React.FC<{
  onCompanyLogin: (salonId: string) => void,
  onClientLogin?: (phone: string) => void;
  onProfessionalLogin?: (salonId: string, professionalId: string) => void;
  onRegister?: () => void;
  onForgotPassword?: () => void;
  prefilledEmail?: string;
}> = ({ onCompanyLogin, onClientLogin, onProfessionalLogin, onRegister, onForgotPassword, prefilledEmail }) => {
  const { salons, refreshSalons, createSalon } = useStore();
  const { signIn } = useAuth();

  const [activeTab, setActiveTab] = useState<'company' | 'client'>('company');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (prefilledEmail) setEmail(prefilledEmail);
  }, [prefilledEmail]);

  const handleCompanyLogin = async () => {
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    // Admin login (keep for backward compatibility)
    if (cleanEmail === 'adm@agendemais.app' && cleanPassword === 'agendemais@1112') {
      onCompanyLogin('admin');
      return;
    }

    try {
      // Supabase Auth login
      const { session } = await signIn(cleanEmail, cleanPassword);

      if (session?.user) {
        // Force refresh to ensure we have the latest data (especially after registration)
        await refreshSalons();

        // Find salon by user_id
        const salon = salons.find(s => s.user_id === session.user.id);

        if (salon) {
          onCompanyLogin(salon.id);
          return;
        }

        // Check professional login
        for (const salonItem of salons) {
          const professional = salonItem.professionals?.find(p => p.email === cleanEmail);
          if (professional && onProfessionalLogin) {
            onProfessionalLogin(salonItem.id, professional.id);
            return;
          }
        }

        // No salon found? AUTO-CREATE (Self-Healing)
        console.log('Salon not found. Attempting auto-creation fallback...');

        try {
          const meta = session.user.user_metadata || {};
          const fallbackName = meta.salonName || 'Meu Salão';
          const fallbackOwner = meta.ownerName || 'Admin';

          // Create in DB (will throw if fails, unless duplicate)
          const createdSalon = await createSalon(
            fallbackName,
            'professional',
            'Endereço não informado', // Address
            fallbackOwner,
            cleanEmail,
            '123456', // Default password (internal use)
            undefined,
            session.user.id // Link to Auth ID
          );

          // If we got here, it means DB insert worked OR it was a duplicate (handled in store)
          // So we can trust 'createdSalon' or fetch again.

          const updatedSalons = await refreshSalons();
          let newSalon = updatedSalons?.find(s => s.user_id === session.user.id);

          if (!newSalon && createdSalon) {
            // If refresh didn't find it but create returned it (e.g. duplicate handling), use it.
            newSalon = createdSalon;
          }

          if (newSalon) {
            onCompanyLogin(newSalon.id);
            return;
          } else {
            alert('Conta criada, mas houve um erro ao carregar. Tente fazer login novamente.');
            return;
          }
        } catch (err: any) {
          console.error('Auto-creation failed:', err);
          // If it failed, it means DB is unreachable or RLS blocked INSERT.
          // We must NOT let them in locally if they want cross-device access.
          alert(`Erro ao criar conta no servidor: ${err.message}. Tente novamente ou contate o suporte.`);
          return;
        }
      }

      alert('E-mail ou senha incorretos.');
    } catch (error: any) {
      // Better error messages
      let errorMessage = 'E-mail ou senha incorretos.';

      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'E-mail ou senha incorretos. Verifique e tente novamente.';
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = 'Por favor, confirme seu email antes de fazer login.';
      }

      alert(errorMessage);
    }
  };

  const handleClientLogin = () => {
    if (phone.length < 8) {
      alert("Digite um número de telefone válido.");
      return;
    }
    if (onClientLogin) {
      const cleanPhone = phone.replace(/\D/g, '');
      onClientLogin(cleanPhone);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-600 to-brand-700 flex flex-col">

      {/* Header com logo */}
      <div className="flex-shrink-0 pt-12 pb-6 px-6">
        <div className="flex justify-center mb-4">
          <div className="bg-white p-3 rounded-2xl shadow-lg">
            <AgendeLogo className="w-20 h-auto" />
          </div>
        </div>
        <p className="mt-1 text-center text-sm text-gray-600">
          Acesso Restrito <span className="text-[10px] text-gray-400">v1.8.0</span>
        </p>
      </div>

      {/* Card principal */}
      <div className="flex-1 bg-white rounded-t-[32px] px-6 pt-6 pb-8">

        {/* Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-2xl mb-6">
          <button
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'company' ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500'}`}
            onClick={() => setActiveTab('company')}
          >
            <Store className="w-4 h-4 inline mr-2" />
            Empresa
          </button>
          <button
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'client' ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500'}`}
            onClick={() => setActiveTab('client')}
          >
            <User className="w-4 h-4 inline mr-2" />
            Cliente
          </button>
        </div>

        {activeTab === 'company' ? (
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none text-gray-900 placeholder:text-gray-400"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full pl-12 pr-12 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none text-gray-900 placeholder:text-gray-400"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Esqueci senha */}
            {onForgotPassword && (
              <button
                onClick={onForgotPassword}
                className="text-sm text-brand-600 font-medium hover:text-brand-700 transition-colors"
              >
                Esqueci minha senha
              </button>
            )}

            {/* Botão entrar */}
            <Button
              className="w-full py-4 text-base font-bold rounded-2xl shadow-lg shadow-brand-200 flex items-center justify-center gap-2 mt-4"
              onClick={handleCompanyLogin}
            >
              Entrar
              <ChevronRight className="w-5 h-5" />
            </Button>

            {/* Cadastro */}
            {onRegister && (
              <div className="text-center pt-4 border-t border-gray-100 mt-6">
                <p className="text-sm text-gray-500">
                  Não tem conta?{' '}
                  <button onClick={onRegister} className="font-bold text-brand-600">
                    Cadastre-se
                  </button>
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Telefone */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Seu Celular</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none text-gray-900 placeholder:text-gray-400"
                  placeholder="(11) 99999-9999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2 px-1">
                Usaremos seu número para localizar seus agendamentos.
              </p>
            </div>

            {/* Botão acessar */}
            <Button
              className="w-full py-4 text-base font-bold rounded-2xl shadow-lg shadow-brand-200 flex items-center justify-center gap-2 mt-4"
              onClick={handleClientLogin}
            >
              Acessar Agendamentos
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        )}

        {/* Ajuda */}
        <div className="flex justify-center mt-6">
          <ContextualHelp topic="login" />
        </div>
      </div>
    </div>
  );
};
