import { create } from "zustand";

interface ProfileProps {
    token: string;
    user: {
        email: string
    } | null,
    setAuth: (token: string, user: { email: string }) => void;
    removeAuth: VoidFunction;
}

export const useProfile = create<ProfileProps>((set) => ({
    token: '',
    user: null,
    setAuth: (token, user) => set({
        token,
        user
    }),
    removeAuth: () => set({
        token: '',
        user: null
    })
}))