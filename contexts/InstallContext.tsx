import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface InstallContextType {
    isInstallable: boolean;
    showPrompt: () => Promise<void>;
    deferredPrompt: BeforeInstallPromptEvent | null;
}

const InstallContext = createContext<InstallContextType | undefined>(undefined);

export const InstallProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstallable, setIsInstallable] = useState(false);

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setIsInstallable(true);
            console.log('Install prompt captured');
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const showPrompt = async () => {
        if (!deferredPrompt) {
            console.log('No deferred prompt available');
            return;
        }

        try {
            await deferredPrompt.prompt();
            const choiceResult = await deferredPrompt.userChoice;

            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
                setIsInstallable(false);
                setDeferredPrompt(null);
            } else {
                console.log('User dismissed the install prompt');
            }
        } catch (err) {
            console.error('Error showing install prompt:', err);
        }
    };

    return (
        <InstallContext.Provider value={{ isInstallable, showPrompt, deferredPrompt }}>
            {children}
        </InstallContext.Provider>
    );
};

export const useInstallPrompt = () => {
    const context = useContext(InstallContext);
    if (context === undefined) {
        throw new Error('useInstallPrompt must be used within a InstallProvider');
    }
    return context;
};
