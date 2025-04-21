'use client';

import type React from 'react';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { create } from 'zustand';

type SupabaseState = {
    supabase: SupabaseClient;
    user: User | null;
    loading: boolean;
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
};

const useSupabaseStore = create<SupabaseState>((set) => ({
    supabase: createClient(),
    user: null,
    loading: true,
    setUser: (user) => set({ user }),
    setLoading: (loading) => set({ loading }),
}));

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
    const { supabase, setUser, setLoading } = useSupabaseStore();
    const router = useRouter();

    useEffect(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            if (session) {
                setUser(session.user);
            } else {
                setUser(null);
            }
            setLoading(false);
            router.refresh();
        });

        // Check for existing session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setUser(session.user);
            }
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase, setUser, setLoading, router]);

    return <>{children}</>;
}

export const useSupabase = () => {
    const { supabase, user, loading } = useSupabaseStore();
    return { supabase, user, loading };
};
