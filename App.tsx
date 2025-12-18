
import React, { useState } from 'react';
import { StoreProvider } from './store';
import { SuperAdmin } from './modules/SuperAdmin';
import { TenantAdmin } from './modules/TenantAdmin';
import { PublicBooking } from './modules/PublicBooking';
import { SalonDirectory } from './modules/SalonDirectory';
import { Login } from './modules/Login';
import { Register } from './modules/Register';
import { ForgotPassword } from './modules/ForgotPassword';
import { ResetPassword } from './modules/ResetPassword';
import { ProfessionalPanel } from './modules/ProfessionalPanel';
import { HowItWorks } from './modules/HowItWorks';
import { TermsOfUse } from './modules/TermsOfUse';
import { PrivacyPolicy } from './modules/PrivacyPolicy';
import { InstallProvider } from './contexts/InstallContext';
import { ClientPortal } from './modules/ClientPortal';
import { InstallPrompt } from './components/InstallPrompt';
import { HelpCenter } from './modules/HelpCenter';

type ViewState =
  | { type: 'register' }
  | { type: 'login'; context: 'admin' | 'tenant'; salonId?: string; prefilledEmail?: string }
  | { type: 'forgot-password' }
  | { type: 'reset-password' }
  | { type: 'directory' }
  | { type: 'super-admin' }
  | { type: 'tenant'; salonId: string }
  | { type: 'professional'; salonId: string; professionalId: string }
  | { type: 'public'; salonId: string; professionalId?: string; fromPortal?: boolean; clientPhone?: string }
  | { type: 'client-portal'; clientPhone: string }
  | { type: 'how-it-works' }
  | { type: 'help-center'; role?: 'owner' | 'client' }
  | { type: 'terms' }
  | { type: 'privacy' };

const AppContent: React.FC = () => {
  // START AT REGISTER
  const [view, setView] = useState<ViewState>({ type: 'register' });

  // SMART ROUTING: Detect PWA Standalone Mode
  React.useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      // Installed app -> Go to Login
      setView({ type: 'login', context: 'tenant' });
    }
  }, []);

  const navigate = (newView: 'tenant' | 'public', salonId: string) => {
    setView({ type: newView, salonId });
  };

  const goHome = () => {
    // Volta para o login
    setView({ type: 'login', context: 'tenant' });
  };

  const goRegister = () => {
    setView({ type: 'register' });
  };

  const goDirectory = () => setView({ type: 'directory' });
  // Although Landing is removed, these pages might still be accessible from Footer/Login if linked, 
  // but for now we keep them reachable via direct state change if needed, or remove completely if external.
  // Assuming Terms/Privacy might still be needed inside the app.
  const goHowItWorks = () => setView({ type: 'how-it-works' });
  const goTerms = () => setView({ type: 'terms' });
  const goPrivacy = () => setView({ type: 'privacy' });

  const handleSecretTenantAccess = (salonId: string) => {
    setView({ type: 'login', context: 'tenant', salonId });
  };

  switch (view.type) {
    case 'register':
      return (
        <Register
          onLoginRedirect={goHome}
          onSuccess={(email) => setView({ type: 'login', context: 'tenant', prefilledEmail: email })}
        />
      );
    case 'how-it-works':
      return <HowItWorks onBack={goRegister} />;
    case 'help-center':
      return <HelpCenter onBack={goRegister} initialRole={view.role} />;
    case 'terms':
      return <TermsOfUse onBack={goRegister} />;
    case 'privacy':
      return <PrivacyPolicy onBack={goRegister} />;
    case 'login':
      return (
        <Login
          onCompanyLogin={(id) => {
            if (id === 'admin') {
              setView({ type: 'super-admin' });
            } else {
              navigate('tenant', id);
            }
          }}
          onProfessionalLogin={(salonId, proId) => {
            setView({ type: 'professional', salonId, professionalId: proId });
          }}
          onClientLogin={(phone) => {
            setView({ type: 'client-portal', clientPhone: phone });
          }}
          onBack={goRegister}
          onRegister={goRegister}
          onForgotPassword={() => setView({ type: 'forgot-password' })}
          prefilledEmail={view.type === 'login' ? view.prefilledEmail : undefined}
        />
      );
    case 'forgot-password':
      return <ForgotPassword onBack={() => setView({ type: 'login', context: 'tenant' })} />;
    case 'reset-password':
      return <ResetPassword />;
    case 'directory':
      return <SalonDirectory
        onBack={goHome}
        onSelectSalon={(id) => navigate('public', id)}
        onAdminAccess={handleSecretTenantAccess}
      />;
    case 'client-portal':
      return (
        <ClientPortal
          clientPhone={view.clientPhone}
          onSelectSalon={(id) => setView({ type: 'public', salonId: id, fromPortal: true, clientPhone: view.clientPhone })}
          onLogout={goHome}
        />
      );
    case 'super-admin':
      return <SuperAdmin onNavigate={navigate} onLogout={goHome} />;
    case 'tenant':
      return <TenantAdmin salonId={view.salonId} onBack={goHome} onHelp={() => setView({ type: 'help-center', role: 'owner' })} />;
    case 'professional':
      return <ProfessionalPanel salonId={view.salonId} professionalId={view.professionalId} onLogout={goHome} />;
    case 'public':
      return <PublicBooking
        salonId={view.salonId}
        professionalId={view.professionalId}
        fromPortal={view.fromPortal}
        clientPhone={view.clientPhone}
        onBack={() => {
          if (view.fromPortal && view.clientPhone) {
            // Return to client portal correctly
            setView({ type: 'client-portal', clientPhone: view.clientPhone });
          } else {
            setView({ type: 'directory' });
          }
        }}
        onAdminAccess={handleSecretTenantAccess}
        onHelp={() => setView({ type: 'help-center', role: 'client' })}
      />;
    default:
      return <div>Error: Unknown view</div>;
  }
};

const App: React.FC = () => {
  return (
    <StoreProvider>
      <InstallProvider>
        <AppContent />
        <InstallPrompt />
      </InstallProvider>
    </StoreProvider>
  );
};

export default App;