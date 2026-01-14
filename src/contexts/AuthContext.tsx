import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { authService } from '../services/auth.service';
import { usersService } from '../services/users.service';
import type { Profile } from '../types/database';

interface AuthContextType {
    user: User | null;
    profile: Profile | null;
    loading: boolean;
    signUp: (email: string, password: string, userData: { username: string; full_name: string }) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                loadProfile();
            } else {
                setLoading(false);
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                loadProfile();
                usersService.updateOnlineStatus(true);
            } else {
                setProfile(null);
                setLoading(false);
            }
        });

        // Update online status on mount
        if (user) {
            usersService.updateOnlineStatus(true);
        }

        // Update offline status on unmount
        return () => {
            if (user) {
                usersService.updateOnlineStatus(false);
            }
            subscription.unsubscribe();
        };
    }, []);

    const loadProfile = async () => {
        try {
            const profileData = await authService.getCurrentProfile();
            setProfile(profileData);
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const signUp = async (email: string, password: string, userData: { username: string; full_name: string }) => {
        await authService.signUp(email, password, userData);
    };

    const signIn = async (email: string, password: string) => {
        await authService.signIn(email, password);
    };

    const signOut = async () => {
        await usersService.updateOnlineStatus(false);
        await authService.signOut();
    };

    const updateProfile = async (updates: Partial<Profile>) => {
        await authService.updateProfile(updates);
        if (profile) {
            setProfile({ ...profile, ...updates });
        }
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
