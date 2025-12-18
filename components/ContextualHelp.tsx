import React, { useState } from 'react';
import { Modal, Button } from './UI';
import { HelpCircle, BookOpen, ChevronRight, PlayCircle } from 'lucide-react';

export type HelpTopic =
    | 'login'
    | 'owner-dashboard'
    | 'owner-agenda'
    | 'owner-inventory'
    | 'owner-marketing'
    | 'owner-finance'
    | 'owner-team'
    | 'owner-settings'
    | 'booking-profile'
    | 'booking-services'
    | 'booking-date'
    | 'booking-summary';

interface ContextualHelpProps {
    topic: HelpTopic;
    className?: string;
    variant?: 'icon' | 'button';
}

export const ContextualHelp: React.FC<ContextualHelpProps> = ({ topic, className, variant = 'button' }) => {
    const [isOpen, setIsOpen] = useState(false);

    const helpContent: Record<HelpTopic, { title: string; content: React.ReactNode }> = {
        'login': {
            title: 'Acessando sua Conta',
            content: (
                <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                            <UserTypeIcon type="owner" /> Proprietários
                        </h4>
                        <p className="text-sm text-blue-800">Use seu <strong>e-mail corporativo</strong> e senha definidos no cadastro. Se esqueceu, contate o suporte.</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                        <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                            <UserTypeIcon type="client" /> Clientes
                        </h4>
                        <p className="text-sm text-green-800">Acesse com seu <strong>número de celular</strong>. O sistema identifica seus agendamentos automaticamente.</p>
                    </div>
                </div>
            )
        },
        'owner-dashboard': {
            title: 'Painel de Controle',
            content: (
                <ul className="space-y-3 text-sm text-gray-600">
                    <Li><strong>Metas:</strong> Acompanhe seu progresso diário, semanal e mensal em relação à meta de faturamento.</Li>
                    <Li><strong>Aniversariantes:</strong> Veja quem faz aniversário hoje e envie um parabéns com 1 clique.</Li>
                    <Li><strong>Resgate:</strong> Lista de clientes sumidos há mais de 30 dias para você chamar no WhatsApp.</Li>
                </ul>
            )
        },
        'owner-agenda': {
            title: 'Gerenciando a Agenda',
            content: (
                <div className="space-y-3 text-sm text-gray-600">
                    <p>Visualize todos os agendamentos do dia.</p>
                    <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                        <strong className="block text-orange-800 mb-1">Como Bloquear Horários?</strong>
                        <p>Use a ferramenta de <strong>Bloqueio</strong> para fechar a agenda em feriados ou folgas. Você pode bloquear o salão todo ou um profissional específico.</p>
                    </div>
                </div>
            )
        },
        'owner-inventory': {
            title: 'Serviços e Produtos',
            content: (
                <ul className="space-y-3 text-sm text-gray-600">
                    <Li><strong>Serviços:</strong> Cadastre o que você faz (Corte, Unha, etc), definindo preço e duração. A duração define sua disponibilidade na agenda.</Li>
                    <Li><strong>Produtos:</strong> Controle seu estoque de uso interno e venda produtos para clientes (Shampoos, Cremes). Ative "Venda Online" para aparecer no agendamento.</Li>
                </ul>
            )
        },
        'owner-marketing': {
            title: 'Marketing com I.A.',
            content: (
                <p className="text-sm text-gray-600">
                    Use nossa <strong>Inteligência Artificial</strong> para criar descrições chamativas para seu salão ou legendas para posts no Instagram. Basta dar o comando e copiar o texto!
                </p>
            )
        },
        'owner-finance': {
            title: 'Gestão Financeira',
            content: (
                <ul className="space-y-3 text-sm text-gray-600">
                    <Li>Lance <strong>Despesas</strong> (contas de luz, aluguel) para ter o cálculo real de lucro.</Li>
                    <Li>Registre <strong>Comissões</strong> pagas aos profissionais.</Li>
                    <Li>Filtre por mês para ver o balanço completo do período.</Li>
                </ul>
            )
        },
        'owner-team': {
            title: 'Equipe e Profissionais',
            content: (
                <div className="space-y-3 text-sm text-gray-600">
                    <p>Adicione membros à sua equipe. Cada um terá seu próprio login.</p>
                    <Li><strong>QR Code:</strong> Cada profissional tem um QR Code exclusivo para divulgar seu trabalho.</Li>
                    <Li><strong>Comissões:</strong> Configure a % de comissão personalizada para cada um.</Li>
                </div>
            )
        },
        'owner-settings': {
            title: 'Configurações do Negócio',
            content: (
                <ul className="space-y-3 text-sm text-gray-600">
                    <Li>Altere foto de capa e logo.</Li>
                    <Li>Defina horário de funcionamento.</Li>
                    <Li>Configure regras de cancelamento.</Li>
                </ul>
            )
        },
        'booking-profile': {
            title: 'Sobre o Estabelecimento',
            content: (
                <p className="text-sm text-gray-600">
                    Aqui você vê fotos, avaliações e a localização do estabelecimento. Clique em <strong>Agendar Agora</strong> para começar.
                </p>
            )
        },
        'booking-services': {
            title: 'Escolha o Serviço',
            content: (
                <p className="text-sm text-gray-600">
                    Selecione o serviço que deseja (ex: Corte, Manicure). Você pode selecionar o <strong>Profissional</strong> de sua preferência ou deixar "Qualquer Profissional" para ver mais horários livres.
                </p>
            )
        },
        'booking-date': {
            title: 'Data e Hora',
            content: (
                <p className="text-sm text-gray-600">
                    Os horários mostrados são em tempo real. Se um dia estiver cinza, é porque não há vagas ou o salão está fechado.
                </p>
            )
        },
        'booking-summary': {
            title: 'Confirmação e Lojinha',
            content: (
                <div className="space-y-3 text-sm text-gray-600">
                    <p>Confira os dados do agendamento.</p>
                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                        <strong className="block text-purple-900 mb-1 flex items-center gap-1"><ShoppingBagIcon /> Leve um Produto!</strong>
                        <p className="text-purple-800">Aproveite para adicionar produtos ao seu carrinho e retirar no dia do atendimento.</p>
                    </div>
                </div>
            )
        }
    };

    const data = helpContent[topic];

    return (
        <>
            {variant === 'button' ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className={`flex items-center gap-2 text-xs font-bold text-brand-600 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-full transition-colors ${className}`}
                >
                    <HelpCircle className="w-4 h-4" />
                    Ajuda
                </button>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className={`p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-full transition-all ${className}`}
                >
                    <HelpCircle className="w-5 h-5" />
                </button>
            )}

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Ajuda Rápida">
                <div className="p-4">
                    <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-4">
                        <div className="p-3 bg-brand-100 rounded-full">
                            <BookOpen className="w-6 h-6 text-brand-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{data.title}</h3>
                    </div>

                    <div className="mb-6">
                        {data.content}
                    </div>

                    <Button className="w-full" onClick={() => setIsOpen(false)}>
                        Entendi
                    </Button>
                </div>
            </Modal>
        </>
    );
};

// Sub-components for styling
const Li: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-start gap-2">
        <ChevronRight className="w-4 h-4 text-brand-500 mt-0.5 shrink-0" />
        <span>{children}</span>
    </li>
);

const UserTypeIcon: React.FC<{ type: 'owner' | 'client' }> = ({ type }) => {
    return type === 'owner' ? (
        <div className="w-4 h-4 rounded bg-blue-600 flex items-center justify-center text-[8px] text-white font-bold">D</div>
    ) : (
        <div className="w-4 h-4 rounded bg-green-600 flex items-center justify-center text-[8px] text-white font-bold">C</div>
    )
}

const ShoppingBagIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
)
