import { create } from 'zustand';
import type { SecurityKey } from '@/types/security-key';

interface KeysState {
    keys: SecurityKey[];
    selectedKey: SecurityKey | null;
    isLoading: boolean;
    error: string | null;
    setKeys: (keys: SecurityKey[]) => void;
    addKey: (key: SecurityKey) => void;
    updateKey: (key: SecurityKey) => void;
    deleteKey: (id: string) => void;
    selectKey: (key: SecurityKey | null) => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
}

export const useKeysStore = create<KeysState>((set) => ({
    keys: [],
    selectedKey: null,
    isLoading: false,
    error: null,
    setKeys: (keys) => set({ keys }),
    addKey: (key) => set((state) => ({ keys: [...state.keys, key] })),
    updateKey: (key) =>
        set((state) => ({
            keys: state.keys.map((k) => (k.id === key.id ? key : k)),
        })),
    deleteKey: (id) =>
        set((state) => ({
            keys: state.keys.filter((k) => k.id !== id),
        })),
    selectKey: (key) => set({ selectedKey: key }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
}));
