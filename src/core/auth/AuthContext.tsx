// src/core/auth/AuthContext.tsx

import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../../../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import type { AuthContextType, AuthProviderProps, UserRole } from './AuthTypes'; 
import { fetchUserRole } from '../../api/user'; 

const defaultContextValue: AuthContextType = {
    currentUser: null,
    userRole: null,
    loading: true,
};

const AuthContext = createContext<AuthContextType>(defaultContextValue);

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: AuthProviderProps) { 
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null); 
  const [loading, setLoading] = useState(true);

  const MOCK = (import.meta as any).env?.VITE_MOCK === '1' || (import.meta as any).env?.VITE_MOCK === 'true';

    useEffect(() => {
        if (MOCK) {
            // Usuário e role falsos para desenvolvimento sem backend
            const fakeUser = { uid: 'mock-uid', displayName: 'Usuário Mock' } as unknown as User;
            setCurrentUser(fakeUser);
            setUserRole((import.meta as any).env?.VITE_MOCK_ROLE === 'admin' ? 'admin' : 'professor');
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setCurrentUser(user);

                try {
                    const idToken = await user.getIdToken();

                    const role = await fetchUserRole(idToken);
                    setUserRole(role);
                } catch (error) {
                    console.error("Erro ao obter token ou role:", error);
                    setUserRole(null);
                }

            } else {
                setCurrentUser(null);
                setUserRole(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, [MOCK]);

  const value: AuthContextType = {
    currentUser,
    userRole,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <div>Carregando Sistema...</div>}
    </AuthContext.Provider>
  );
}