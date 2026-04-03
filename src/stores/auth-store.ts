'use client';

import { create } from 'zustand';
import { Profile, UserRole } from '@/types';
import { demoProfiles } from '@/lib/demo-data';

interface AuthState {
  user: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phone: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setUser: (user: Profile | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (phone: string, _password: string) => {
    set({ isLoading: true });

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Normalize phone — strip spaces, dashes, +91 prefix
    const normalizedPhone = phone.replace(/[\s\-+]/g, '').replace(/^91/, '');

    // Find profile by phone number
    // Priority: admin > teacher > parent > student
    // This allows any registered phone to log in
    const profile = demoProfiles.find(p => p.phone === normalizedPhone);

    if (!profile) {
      set({ isLoading: false });
      return { success: false, error: 'This mobile number is not registered. Please contact the school administration.' };
    }

    // In demo mode, we accept any password format: [role]123
    // In production, this would validate against hashed passwords
    set({ user: profile, isAuthenticated: true, isLoading: false });

    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('demo_user', JSON.stringify(profile));
    }

    return { success: true };
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('demo_user');
    }
  },

  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
  },
}));

// Initialize from localStorage
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('demo_user');
  if (stored) {
    try {
      const user = JSON.parse(stored) as Profile;
      useAuthStore.getState().setUser(user);
    } catch {
      // Invalid stored data
    }
  }
}
