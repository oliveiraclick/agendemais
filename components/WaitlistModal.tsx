
import React, { useState } from 'react';
import { Modal, Button, Input } from './UI';
import { Bell } from 'lucide-react';

interface WaitlistModalProps {
    isOpen: boolean;
    onClose: () => void;
    salonName: string;
    serviceName?: string;
    date?: string;
    onJoin: (phone: string, email: string) => void;
}

export const WaitlistModal: React.FC<WaitlistModalProps> = ({ isOpen, onClose, salonName, serviceName, date, onJoin }) => {
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = () => {
        if (phone) {
            onJoin(phone, email);
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Entrar na Lista de Espera">
            <div className="space-y-4 text-center">
                <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto text-brand-600 mb-2">
                    <Bell className="w-8 h-8" />
                </div>
                <p className="text-gray-600">
                    O horário desejado para <strong>{serviceName}</strong> em <strong>{salonName}</strong> está indisponível?
                </p>
                <div className="bg-amber-50 text-amber-800 p-3 rounded-lg text-sm font-medium">
                    Seja avisado assim que vagar!
                </div>

                <div className="space-y-3 text-left">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Seu Telefone</label>
                        <Input
                            placeholder="(11) 99999-9999"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">E-mail (Opcional)</label>
                        <Input
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <Button className="w-full py-3" onClick={handleSubmit}>
                    Quero ser avisado
                </Button>
            </div>
        </Modal>
    );
};
