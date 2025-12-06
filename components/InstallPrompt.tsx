import React, { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handler = (e: Event) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            // Update UI notify the user they can install the PWA
            setIsVisible(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        // Show the install prompt
        await deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const choiceResult = await deferredPrompt.userChoice;

        if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
            setIsVisible(false);
        } else {
            console.log('User dismissed the install prompt');
        }

        setDeferredPrompt(null);
    };

    const handleClose = () => {
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 z-50 animate-bounce-subtle">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-4 border border-brand-100 dark:border-gray-700 flex items-center justify-between max-w-md mx-auto relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-brand-500 opacity-10 rounded-full blur-xl"></div>

                <div className="flex items-center gap-4 z-10">
                    <div className="bg-brand-50 rounded-lg p-2.5 flex-shrink-0">
                        <img src="/icon.png" alt="App Icon" className="w-10 h-10 object-contain" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-md">Instale o App</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Acesso rápido e melhor experiência</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 z-10">
                    <button
                        onClick={handleClose}
                        className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                        aria-label="Fechar"
                    >
                        <X size={20} />
                    </button>
                    <button
                        onClick={handleInstallClick}
                        className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-lg shadow-brand-500/30 flex items-center gap-2"
                    >
                        <Download size={16} />
                        Instalar
                    </button>
                </div>
            </div>
        </div>
    );
}
