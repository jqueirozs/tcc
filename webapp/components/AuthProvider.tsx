'use client';
import { ReactNode, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useState, createContext, useContext } from 'react';
import { auth, initFirebase } from '../lib/firebase';

interface AuthContextProps {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps>({ user: null, loading: true });

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initFirebase();
    const unsub = onAuthStateChanged(auth(), (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
