// context/AuthContext.js
'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/firebase';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (!authUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        // Fetch additional user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', authUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({
            uid: authUser.uid,
            name: authUser.name,
            email: authUser.email,
            ...userData,
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []); // Removed user from dependencies to prevent infinite loops

  const value = {
    user,
    loading,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
