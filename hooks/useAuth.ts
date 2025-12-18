import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { User, Session } from '@supabase/supabase-js';

interface AuthState {
    user: User | null;
    session: Session | null;
    loading: boolean;
}

export const useAuth = () => {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        session: null,
        loading: true,
    });

    useEffect(() => {
        // Get initial session
        supabase?.auth.getSession().then(({ data: { session } }) => {
            setAuthState({
                user: session?.user ?? null,
                session,
                loading: false,
            });
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase?.auth.onAuthStateChange((_event, session) => {
            setAuthState({
                user: session?.user ?? null,
                session,
                loading: false,
            });
        }) ?? { data: { subscription: { unsubscribe: () => { } } } };

        return () => subscription.unsubscribe();
    }, []);

    const signUp = async (email: string, password: string, metadata?: any) => {
        if (!supabase) {
            throw new Error('Supabase client not initialized');
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: metadata,
            },
        });

        if (error) throw error;
        return data;
    };

    const signIn = async (email: string, password: string) => {
        if (!supabase) {
            throw new Error('Supabase client not initialized');
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;
        return data;
    };

    const signOut = async () => {
        if (!supabase) {
            throw new Error('Supabase client not initialized');
        }

        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    };

    const resetPassword = async (email: string) => {
        if (!supabase) {
            throw new Error('Supabase client not initialized');
        }

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) throw error;
    };

    return {
        ...authState,
        signUp,
        signIn,
        signOut,
        resetPassword,
    };
};
