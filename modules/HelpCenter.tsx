import React, { useState } from 'react';
import { Button } from '../components/UI';
import {
    ChevronLeft, BookOpen, User, Briefcase, ChevronDown, ChevronUp,
    Calendar, ShoppingBag, Settings, Share2, ShieldCheck, DollarSign
} from 'lucide-react';

type Tab = 'owner' | 'client';

interface TutorialSection {
    id: string;
    title: string;
    icon: React.ReactNode;
    content: React.ReactNode;
}

export const HelpCenter: React.FC<{ onBack: () => void; initialRole?: Tab }> = ({ onBack, initialRole }) => {
    const [activeTab, setActiveTab] = useState<Tab>(initialRole || 'owner');
    const [expandedSection, setExpandedSection] = useState<string | null>(null);

    const toggleSection = (id: string) => {
        setExpandedSection(expandedSection === id ? null : id);
    };

    const ownerTutorials: TutorialSection[] = [
        {
            id: 'owner-setup',
            title: 'Configuração Inicial',
            icon: <Settings className="w-5 h-5 text-brand-600" />,
            content: (
                <ul className="space-y-2 text-sm text-gray-600 list-disc pl-5">
                    <li>Acesse a aba <strong>Configurações</strong> no menu inferior.</li>
                    <li>Preencha o nome do seu negócio, categoria e horário de funcionamento.</li>
                    <li>Adicione uma foto de capa para deixar seu perfil atrativo.</li>
                    <li>Defina se aceita cancelamentos pelo app.</li>
                </ul>
            )
        },
        {
            id: 'owner-services',
            title: 'Cadastrar Serviços & Produtos',
            icon: <ShoppingBag className="w-5 h-5 text-blue-600" />,
            content: (
                <div className="space-y-3 text-sm text-gray-600">
                    <p><strong>Serviços:</strong> Vá em <em>Estoque/Serviços</em>. Clique em "+ Adicionar Serviço", defina nome, preço e duração. Isso define sua agenda.</p>
                    <p><strong>Produtos:</strong> Na mesma aba, cadastre produtos para venda (shampoo, pomada) ou uso interno (luvas, tintas). Ative "Disponível para Venda" para que clientes comprem ao agendar.</p>
                </div>
            )
        },
        {
            id: 'owner-team',
            title: 'Equipe e Comissões',
            icon: <User className="w-5 h-5 text-purple-600" />,
            content: (
                <div className="space-y-2 text-sm text-gray-600">
                    <p>Convide seus profissionais na aba <strong>Equipe</strong>.</p>
                    <ul className="list-disc pl-5">
                        <li>Defina a comissão (%) de serviços e produtos.</li>
                        <li>O sistema calcula automaticamente quanto cada um deve receber.</li>
                        <li>Cada profissional tem seu próprio login para ver a agenda.</li>
                    </ul>
                </div>
            )
        },
        {
            id: 'owner-agenda',
            title: 'Bloqueios e Agenda',
            icon: <Calendar className="w-5 h-5 text-red-600" />,
            content: (
                <div className="space-y-2 text-sm text-gray-600">
                    <p>Precisa fechar o salão ou um profissional vai folgar?</p>
                    <p>Vá em <strong>Agenda</strong>, selecione a data e use a opção <strong>Bloquear Horário</strong>. Você pode bloquear o dia todo para o salão inteiro ou apenas para um profissional específico.</p>
                </div>
            )
        }
    ];

    const clientTutorials: TutorialSection[] = [
        {
            id: 'client-booking',
            title: 'Como Fazer um Agendamento',
            icon: <Calendar className="w-5 h-5 text-brand-600" />,
            content: (
                <ol className="space-y-2 text-sm text-gray-600 list-decimal pl-5">
                    <li>Na tela inicial de um salão, clique em <strong>Agendar Agora</strong>.</li>
                    <li>Escolha o serviço desejado (ex: Corte de Cabelo).</li>
                    <li>Selecione o profissional de sua preferência (ou "Qualquer um").</li>
                    <li>Escolha a data e o horário disponível.</li>
                    <li>Confirme seus dados e pronto!</li>
                </ol>
            )
        },
        {
            id: 'client-store',
            title: 'Comprando Produtos',
            icon: <ShoppingBag className="w-5 h-5 text-green-600" />,
            content: (
                <p className="text-sm text-gray-600">
                    Durante o agendamento, você verá a <strong>Lojinha do Salão</strong>. Adicione produtos ao seu carrinho e retire-os no dia do seu atendimento. É prático e você garante o produto!
                </p>
            )
        },
        {
            id: 'client-history',
            title: 'Meus Agendamentos',
            icon: <BookOpen className="w-5 h-5 text-blue-600" />,
            content: (
                <p className="text-sm text-gray-600">
                    Acesse a aba <strong>Perfil</strong> (se estiver logado) ou use o link enviado ao seu WhatsApp para ver seus agendamentos futuros e histórico.
                </p>
            )
        }
    ];

    const activeTutorials = activeTab === 'owner' ? ownerTutorials : clientTutorials;

    return (
        <div className="h-full bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-white px-4 py-4 shadow-sm z-10 flex items-center gap-4 sticky top-0">
                <Button variant="outline" className="p-2 rounded-full w-10 h-10 flex items-center justify-center p-0" onClick={onBack}>
                    <ChevronLeft className="w-6 h-6 text-gray-600" />
                </Button>
                <h1 className="text-xl font-bold text-gray-900">Central de Ajuda</h1>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 pb-32">
                {/* Tabs - Only show if no specific role was forced */}
                {!initialRole && (
                    <div className="flex bg-gray-200 p-1 rounded-xl mb-8">
                        <button
                            onClick={() => setActiveTab('owner')}
                            className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'owner'
                                ? 'bg-white text-brand-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Sou Proprietário
                        </button>
                        <button
                            onClick={() => setActiveTab('client')}
                            className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'client'
                                ? 'bg-white text-green-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Sou Cliente
                        </button>
                    </div>
                )}

                {/* Dynamic Title based on Role if tabs are hidden */}
                {initialRole && (
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-900">
                            {activeTab === 'owner' ? 'Central do Proprietário' : 'Ajuda para Clientes'}
                        </h2>
                    </div>
                )}

                {/* Intro Text */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Como podemos ajudar?
                    </h2>
                    <p className="text-gray-500 text-sm">
                        Selecione uma categoria abaixo para ver o passo a passo.
                    </p>
                </div>

                {/* Accordion List */}
                <div className="space-y-4">
                    {activeTutorials.map((section) => (
                        <div
                            key={section.id}
                            className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm transition-all duration-300"
                        >
                            <button
                                onClick={() => toggleSection(section.id)}
                                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg bg-gray-50`}>
                                        {section.icon}
                                    </div>
                                    <span className="font-bold text-gray-800">{section.title}</span>
                                </div>
                                {expandedSection === section.id ? (
                                    <ChevronUp className="w-5 h-5 text-gray-400" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                )}
                            </button>

                            {expandedSection === section.id && (
                                <div className="px-4 pb-4 pt-0 animate-in slide-in-from-top-2">
                                    <div className="pl-[3.25rem] border-l-2 border-gray-100 ml-6 py-2">
                                        {section.content}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Footer Contact */}
                <div className="mt-12 p-6 bg-brand-50 rounded-2xl text-center">
                    <ShieldCheck className="w-10 h-10 text-brand-600 mx-auto mb-3" />
                    <h3 className="font-bold text-brand-900 mb-1">Ainda com dúvidas?</h3>
                    <p className="text-sm text-brand-700 mb-4">
                        Nossa equipe de suporte está pronta para te atender.
                    </p>
                    <Button className="w-full bg-brand-600 text-white">
                        Falar com Suporte
                    </Button>
                </div>
            </div>
        </div>
    );
};
