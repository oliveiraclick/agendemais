
import React, { useState } from 'react';
import { useStore } from '../store';
import { AppShell, MobileNav, MobileNavItem, Button, Card } from '../components/UI';
import { LoyaltyCard } from '../components/LoyaltyCard';
import { LogOut, Calendar, MapPin, User, Home, Clock, MessageCircle, Instagram, Globe, History, CheckCircle, Store, ChevronLeft, ArrowRight, Star, XCircle, Image, Facebook, Gift } from 'lucide-react';

export const ClientPortal: React.FC<{
    clientPhone: string;
    onSelectSalon: (salonId: string) => void;
    onLogout: () => void;
}> = ({ clientPhone, onSelectSalon, onLogout }) => {
    const { salons, getClientByPhone, cancelAppointment } = useStore();

    // 'list' = Meus Favoritos (Tela Inicial)
    // 'dashboard' = Dentro de um salão específico
    const [viewMode, setViewMode] = useState<'list' | 'dashboard'>('list');
    const [activeTab, setActiveTab] = useState<'home' | 'profile'>('home'); // Tabs dentro do Dashboard
    const [selectedSalonId, setSelectedSalonId] = useState<string | null>(null);

    const client = getClientByPhone(clientPhone);

    // 1. Identificar Favoritos
    const mySalons = salons.filter(salon =>
        salon.appointments.some(appt => appt.clientPhone === clientPhone)
    );
    // Fallback para Demo se não tiver histórico
    const displaySalons = mySalons.length > 0 ? mySalons : salons;

    const currentSalon = salons.find(s => s.id === selectedSalonId);

    // --- Handlers ---

    const handleEnterSalon = (id: string) => {
        setSelectedSalonId(id);
        setViewMode('dashboard');
        setActiveTab('home');
    };

    const handleBackToFavorites = () => {
        setViewMode('list');
        setSelectedSalonId(null);
    };

    const handleAgendaClick = () => {
        if (selectedSalonId) {
            onSelectSalon(selectedSalonId);
        }
    };

    const handleCancelAppointment = (apptId: string) => {
        if (!currentSalon) return;

        if (currentSalon.allowClientCancellation === false) {
            alert(`O estabelecimento ${currentSalon.name} não permite cancelamentos pelo aplicativo. Por favor, entre em contato diretamente.`);
            return;
        }

        if (confirm("Tem certeza que deseja cancelar este agendamento?")) {
            cancelAppointment(currentSalon.id, apptId);
        }
    };

    // --- Renderers ---

    const renderFavoritesList = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-left-4">
            <div className="bg-brand-600 p-6 rounded-b-[2rem] -mx-4 -mt-4 shadow-lg mb-6">
                <div className="flex justify-between items-start text-white">
                    <div>
                        <h1 className="text-2xl font-bold">Olá, {client?.name?.split(' ')[0] || 'Visitante'}</h1>
                        <p className="text-brand-100 text-sm">Onde vamos agendar hoje?</p>
                    </div>
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <User className="w-5 h-5 text-white" />
                    </div>
                </div>
            </div>

            <div className="px-1">
                <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" /> Favoritos
                </h2>
                <div className="space-y-4">
                    {displaySalons.map(s => (
                        <div
                            key={s.id}
                            onClick={() => handleEnterSalon(s.id)}
                            className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-transform hover:shadow-md"
                        >
                            <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                                <img src={s.coverImage || `https://ui-avatars.com/api/?name=${s.name}`} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-900 text-lg truncate leading-tight">{s.name}</h3>
                                <p className="text-xs text-gray-500 truncate mb-1">{s.address}</p>
                                <div className="inline-flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded text-[10px] font-bold text-gray-600 uppercase">
                                    {s.category}
                                </div>
                            </div>
                            <div className="bg-brand-50 p-2 rounded-full text-brand-600">
                                <ArrowRight className="w-5 h-5" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="px-4 py-6">
                <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50" onClick={onLogout}>
                    <LogOut className="w-4 h-4 mr-2" /> Sair da Conta
                </Button>
            </div>
        </div>
    );

    const renderSalonDashboard = () => {
        if (!currentSalon) return null;

        // Filter history
        const history = currentSalon.appointments
            .filter(a => a.clientPhone === clientPhone)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        if (activeTab === 'profile') {
            return (
                <div className="space-y-6 animate-in slide-in-from-right-4 pt-4">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center text-gray-400 font-bold text-2xl">
                            {client?.name?.[0]}
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">{client?.name}</h2>
                        <p className="text-sm text-gray-500">{client?.phone}</p>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
                        <div className="p-4 flex justify-between items-center">
                            <span className="text-sm text-gray-600">Visitas neste local</span>
                            <span className="font-bold text-gray-900">{history.length}</span>
                        </div>
                    </div>

                    <Button variant="outline" className="w-full" onClick={handleBackToFavorites}>
                        <ArrowRight className="w-4 h-4 mr-2 rotate-180" /> Trocar de Estabelecimento
                    </Button>
                </div>
            );
        }

        return (
            <div className="space-y-8 animate-in fade-in duration-500 pt-2">
                {/* 1. Bem-vindo */}
                <div className="bg-brand-600 text-white p-6 rounded-2xl shadow-lg shadow-brand-200 relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-xl font-bold mb-1">Bem-vindo(a), {client?.name?.split(' ')[0]}!</h2>
                        <p className="text-brand-100 text-sm mb-4 opacity-90">É ótimo ter você no {currentSalon.name}.</p>

                        <div className="inline-flex bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg items-center gap-2 text-xs font-medium">
                            <Clock className="w-3 h-3" /> Aberto: {currentSalon.openTime} - {currentSalon.closeTime}
                        </div>
                    </div>
                    <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
                        <Store className="w-32 h-32" />
                    </div>
                    <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
                        <Store className="w-32 h-32" />
                    </div>
                </div>

                {/* 2. Fidelidade */}
                {client?.loyaltyCards?.find(fc => fc.salonId === currentSalon.id) && (
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg mb-3 px-1 flex items-center gap-2">
                            <Gift className="w-5 h-5 text-brand-600" /> Fidelidade
                        </h3>
                        <LoyaltyCard
                            salonName={currentSalon.name}
                            {...client.loyaltyCards.find(fc => fc.salonId === currentSalon.id)!}
                        />
                    </div>
                )}

                {/* 3. Sobre Nós */}
                <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-3 px-1">Sobre Nós</h3>
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-sm text-gray-600 leading-relaxed">
                        {currentSalon.aboutUs || "Descrição não informada."}
                    </div>
                </div>

                {/* 3. Botão de Ação (Posicionado conforme pedido) */}
                <div className="pt-2">
                    <Button className="w-full py-4 text-lg font-bold shadow-xl shadow-brand-200 flex items-center justify-center gap-2" onClick={handleAgendaClick}>
                        <Calendar className="w-5 h-5" /> Agendar Agora
                    </Button>
                </div>

                {/* 4. Galeria de Fotos */}
                <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-3 px-1 flex items-center gap-2">
                        <Image className="w-5 h-5 text-brand-600" /> Galeria de Fotos
                    </h3>
                    {currentSalon.gallery && currentSalon.gallery.length > 0 ? (
                        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4">
                            {currentSalon.gallery.map((img, i) => (
                                <div
                                    key={i}
                                    className="flex-shrink-0 w-40 h-40 rounded-xl overflow-hidden shadow-sm bg-gray-100 cursor-pointer active:scale-95 transition-transform"
                                    onClick={() => window.open(img, '_blank')}
                                >
                                    <img src={img} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-gray-50 p-6 rounded-xl text-center text-gray-400 text-sm">
                            Sem fotos disponíveis.
                        </div>
                    )}
                </div>

                {/* 5. Localização */}
                <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-3 px-1 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-brand-600" /> Localização
                    </h3>
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <p className="text-sm text-gray-700 font-medium mb-3">{currentSalon.address}</p>
                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(currentSalon.address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-32 bg-gray-100 rounded-lg w-full flex flex-col items-center justify-center text-brand-600 text-xs font-bold uppercase tracking-wider hover:bg-brand-50 transition-colors border-2 border-dashed border-gray-200 hover:border-brand-300"
                        >
                            <MapPin className="w-8 h-8 mb-2 text-brand-500" />
                            Abrir no Google Maps
                        </a>
                    </div>
                </div>

                {/* 6. Histórico */}
                <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-3 px-1 flex items-center gap-2">
                        <History className="w-5 h-5 text-brand-600" /> Histórico
                    </h3>
                    <div className="space-y-3">
                        {history.length > 0 ? (
                            history.slice().reverse().map(app => (
                                <div key={app.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center">
                                    <div>
                                        <div className="font-bold text-gray-900 text-sm">
                                            {new Date(app.date).toLocaleDateString()}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-0.5">
                                            {new Date(app.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {currentSalon.services.find(s => s.id === app.serviceId)?.name}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        {app.status === 'completed' && <div className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">Concluído</div>}
                                        {app.status === 'cancelled' && <div className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">Cancelado</div>}
                                        {app.status === 'scheduled' && (
                                            <>
                                                <div className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">Agendado</div>
                                                <button
                                                    onClick={() => handleCancelAppointment(app.id)}
                                                    className="text-[10px] text-red-500 underline hover:text-red-700"
                                                >
                                                    Cancelar
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-6 text-gray-400 text-sm">
                                Você ainda não tem agendamentos aqui.
                            </div>
                        )}
                    </div>
                </div>

                {/* 7. Redes Sociais */}
                <div className="grid grid-cols-4 gap-2 pt-4">
                    {currentSalon.socials?.whatsapp && (
                        <a href={`https://wa.me/${currentSalon.socials.whatsapp}`} target="_blank" className="bg-green-50 p-3 rounded-xl flex flex-col items-center gap-1 text-green-700 hover:bg-green-100 transition-colors">
                            <MessageCircle className="w-6 h-6" />
                            <span className="text-[10px] font-bold">Whats</span>
                        </a>
                    )}
                    {currentSalon.socials?.instagram && (
                        <a href={`https://instagram.com/${currentSalon.socials.instagram.replace('@', '')}`} target="_blank" className="bg-purple-50 p-3 rounded-xl flex flex-col items-center gap-1 text-purple-700 hover:bg-purple-100 transition-colors">
                            <Instagram className="w-6 h-6" />
                            <span className="text-[10px] font-bold">Insta</span>
                        </a>
                    )}
                    {currentSalon.socials?.facebook && (
                        <a href={currentSalon.socials.facebook} target="_blank" className="bg-blue-50 p-3 rounded-xl flex flex-col items-center gap-1 text-blue-700 hover:bg-blue-100 transition-colors">
                            <Facebook className="w-6 h-6" />
                            <span className="text-[10px] font-bold">Face</span>
                        </a>
                    )}
                    {currentSalon.socials?.website && (
                        <a href={currentSalon.socials.website} target="_blank" className="bg-gray-50 p-3 rounded-xl flex flex-col items-center gap-1 text-gray-700 hover:bg-gray-100 transition-colors">
                            <Globe className="w-6 h-6" />
                            <span className="text-[10px] font-bold">Site</span>
                        </a>
                    )}
                </div>
            </div>
        );
    };

    return (
        <AppShell
            header={
                viewMode === 'list' ? (
                    <div className="px-4 py-4 bg-white border-b border-gray-100">
                        <div className="font-bold text-lg text-brand-600">Agende +</div>
                    </div>
                ) : (
                    <div className="px-4 py-3 bg-white flex items-center gap-3 border-b border-gray-100 shadow-sm">
                        <button onClick={handleBackToFavorites} className="p-1 -ml-1 text-gray-600 rounded-full hover:bg-gray-100">
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <div className="font-bold text-gray-900 truncate">
                            {currentSalon?.name}
                        </div>
                    </div>
                )
            }
            bottomNav={
                viewMode === 'dashboard' ? (
                    <MobileNav>
                        <MobileNavItem
                            icon={<Home />}
                            label="Home"
                            active={activeTab === 'home'}
                            onClick={() => setActiveTab('home')}
                        />
                        <MobileNavItem
                            icon={<Calendar />}
                            label="Agenda"
                            active={false} // Always triggers action
                            onClick={handleAgendaClick}
                        />
                        <MobileNavItem
                            icon={<User />}
                            label="Perfil"
                            active={activeTab === 'profile'}
                            onClick={() => setActiveTab('profile')}
                        />
                    </MobileNav>
                ) : null
            }
        >
            <div className="p-4 pb-24">
                {viewMode === 'list' ? renderFavoritesList() : renderSalonDashboard()}
            </div>
        </AppShell>
    );
};
