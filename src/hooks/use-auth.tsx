"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, firestore } from '@/lib/firebase';
import type { UserProfile } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  refetchUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ user: null, userProfile: null, loading: true, refetchUserProfile: async () => {} });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async (currentUser: User | null) => {
    if (!currentUser) {
      setUserProfile(null);
      return;
    }
    const userRef = doc(firestore, 'users', currentUser.uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      setUserProfile(docSnap.data() as UserProfile);
    } else {
      // User document doesn't exist, create it.
      // A profile is incomplete until they visit the profile page and save.
      const newUserProfile: UserProfile = {
        displayName: currentUser.displayName || '',
        email: currentUser.email || '',
        location: '',
        profileCompleted: false,
        createdAt: serverTimestamp(),
      };
      await setDoc(userRef, newUserProfile);
      setUserProfile(newUserProfile);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      setUser(user);
      await fetchUserProfile(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchUserProfile]);

  const refetchUserProfile = useCallback(async () => {
    if (user) {
      await fetchUserProfile(user);
    }
  }, [user, fetchUserProfile]);


  return (
    <AuthContext.Provider value={{ user, userProfile, loading, refetchUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
