
import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Button, Card, Input, AgendeLogo } from '../components/UI';
import { LogIn, Store, Lock, User, Phone, Mail, CalendarCheck } from 'lucide-react';
import { useInstallPrompt } from '../contexts/InstallContext';
import { ContextualHelp } from '../components/ContextualHelp';

export const Login: React.FC<{
  context: 'admin' | 'tenant';
  salonId?: string;
  prefilledEmail?: string;
  onLogin: (salonId?: string, isProfessional?: boolean, professionalId?: string) => void;
  onClientLogin?: (phone: string) => void;
  onBack: () => void;
  onRegister?: () => void;
  onHelp?: () => void;
}> = ({ context, salonId, prefilledEmail, onLogin, onClientLogin, onRegister, onBack, onHelp }) => {
  const { salons } = useStore();
  const { showPrompt, isInstallable } = useInstallPrompt();

  // Login Type State: 'company' | 'client'
  const [activeTab, setActiveTab] = useState<'company' | 'client'>('company');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('11999990000');

  useEffect(() => {
    if (prefilledEmail) setEmail(prefilledEmail);
    // Campos vazios por padrão (sem credenciais de teste)
  }, [prefilledEmail]);

  const handleCompanyLogin = () => {
    // 1. Check for Admin SaaS
    if (email === 'adm@agendemais.app' && password === 'agendemais@1112') {
      onLogin(undefined, false); // No salonId = Super Admin
      return;
    }

    // 2. Search for Owner (Proprietário)
    const ownerSalon = salons.find(s => s.ownerEmail === email);
    if (ownerSalon) {
      if (ownerSalon.password && ownerSalon.password !== password) {
        alert('Senha incorreta.');
        return;
      }

      // CHECK TRIAL STATUS
      if (ownerSalon.subscriptionStatus === 'trial' && ownerSalon.createdAt) {
        const created = new Date(ownerSalon.createdAt);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - created.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 7) {
          setShowPaymentLock(true);
          return;
        }
      }

      onLogin(ownerSalon.id, false);
      return;
    }

    // 3. Search for Professional (Staff)
    let foundPro = null;
    let foundProSalonId = null;

    for (const salon of salons) {
      const pro = salon.professionals.find(p => p.email === email);
      if (pro) {
        foundPro = pro;
        foundProSalonId = salon.id;
        break;
      }
    }

    if (foundPro && foundProSalonId) {
      if (foundPro.password && foundPro.password !== password) {
        alert('Senha incorreta.');
        return;
      }
      onLogin(foundProSalonId, true, foundPro.id);
      return;
    }

    alert('Usuário ou senha inválidos.');
  };

  // Lock Screen State
  const [showPaymentLock, setShowPaymentLock] = useState(false);

  if (showPaymentLock) {
    return (
      <div className="h-full overflow-y-auto bg-gray-50 flex flex-col justify-center py-6 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md my-auto">
          <div className="flex justify-center mb-6">
            <div className="animate-in zoom-in duration-500 bg-red-100 p-4 rounded-full">
              <Lock className="w-16 h-16 text-red-600" />
            </div>
          </div>

          <h2 className="text-center text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
            Período de Teste Expirado
          </h2>
          <p className="text-center text-gray-600 mb-8 px-4">
            Seu período de teste gratuito de 7 dias acabou. Para continuar usando o Agende+, realize o pagamento.
          </p>

          <div className="mt-4 bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-2xl sm:px-10 border border-gray-100 text-center space-y-4">

            <Button
              className="w-full py-4 text-lg font-bold bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg shadow-green-200 flex items-center justify-center gap-2 animate-pulse"
              onClick={() => window.open('https://pay.kiwify.com.br/ZqDT7Lt', '_blank')}
            >
              <CalendarCheck className="w-5 h-5" /> Liberar Acesso Agora
            </Button>

            <div className="pt-4 border-t border-gray-100">
              <Button
                variant="outline"
                className="w-full py-2 text-sm font-medium text-gray-700"
                onClick={() => setShowPaymentLock(false)}
              >
                Voltar para Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleClientLogin = () => {
    if (phone.length < 8) {
      alert("Digite um número de telefone válido.");
      return;
    }

    if (onClientLogin) {
      // Remove non-numeric chars
      const cleanPhone = phone.replace(/\D/g, '');
      onClientLogin(cleanPhone);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-6 sm:px-6 lg:px-8 relative">

      {/* Header / Logo Section */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center flex-col items-center mb-4">
          <div className="mb-2 animate-in zoom-in duration-500">
            <AgendeLogo className="w-32 h-auto" />
          </div>


          <p className="mt-2 text-center text-sm text-gray-600">
            Acesso Restrito
          </p>

          <div className="mt-4 flex justify-center">
            <ContextualHelp topic="login" />
          </div>
        </div>
      </div>

      <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow-2xl shadow-gray-200/50 border-0 sm:rounded-2xl sm:px-10 overflow-hidden">

          {/* Tabs */}
          <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
            <button
              className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'company' ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('company')}
            >
              Empresa
            </button>
            <button
              className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'client' ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('client')}
            >
              Cliente
            </button>
          </div>

          <div className="space-y-6">

            {activeTab === 'company' ? (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="w-full mb-4">
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">E-mail Corporativo</label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                    <input
                      type="email"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="w-full mb-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Senha</label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                    <input
                      type="password"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="text-right">
                  <button
                    onClick={() => window.open('https://wa.me/5511999999999?text=Olá! Esqueci minha senha do Agende+. Meu email é: ' + encodeURIComponent(email), '_blank')}
                    className="text-xs text-brand-600 font-bold hover:underline"
                  >Esqueci minha senha</button>
                </div>

                <Button
                  className="w-full flex justify-center items-center gap-2 py-4 text-lg font-bold shadow-lg shadow-brand-200 mt-6 rounded-xl hover:shadow-xl hover:-translate-y-0.5 transition-all"
                  onClick={handleCompanyLogin}
                >
                  Entrar como Empresa
                  <Store className="w-5 h-5" />
                </Button>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                <div className="w-full mb-4">
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Seu Celular</label>
                  <div className="relative group">
                    <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                    <input
                      type="tel"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                      placeholder="(DDD) 99999-9999"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Usaremos seu número para localizar seus agendamentos e estabelecimentos favoritos.
                  </p>
                </div>

                <Button
                  className="w-full flex justify-center items-center gap-2 py-4 text-lg font-bold shadow-lg shadow-brand-200 mt-6 rounded-xl hover:shadow-xl hover:-translate-y-0.5 transition-all"
                  onClick={handleClientLogin}
                >
                  Acessar Agendamentos
                  <User className="w-5 h-5" />
                </Button>
              </div>
            )}

            {onRegister && activeTab === 'company' && (
              <div className="mt-6 text-center pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Ainda não é parceiro?{' '}
                  <button onClick={onRegister} className="font-bold text-brand-600 hover:text-brand-800 transition-colors">
                    Cadastre sua empresa
                  </button>
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* App Store / Google Play Buttons (Simulation) */}
        <div className="mt-4 flex flex-col items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Baixe nosso App</p>
          <div className="flex gap-3">
            <button
              onClick={() => alert("Para instalar no iOS:\n\n1. Toque no botão Compartilhar (quadrado com seta)\n2. Role para baixo e selecione 'Adicionar à Tela de Início'")}
              className="bg-black text-white px-4 py-3 rounded-lg flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="text-left leading-none">
                <div className="text-[10px] uppercase text-gray-400">Versão Mobile</div>
                <div className="text-sm font-bold font-sans">INSTALE NO IOS</div>
              </div>
            </button>
            <button
              onClick={() => {
                if (isInstallable) {
                  showPrompt();
                } else {
                  alert("Para instalar no Android:\n\n1. Toque nos três pontinhos do navegador\n2. Selecione 'Instalar aplicativo' ou 'Adicionar à tela inicial'");
                }
              }}
              className="bg-black text-white px-4 py-3 rounded-lg flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="text-left leading-none">
                <div className="text-[10px] uppercase text-gray-400">Versão Mobile</div>
                <div className="text-sm font-bold font-sans">INSTALE NO ANDROID</div>
              </div>
            </button>
          </div>
        </div>

        {/* Versão discreta */}
        <div className="text-center text-[10px] text-gray-300 mt-4">v1.0.5</div>
      </div >
    </div >
  );
};
