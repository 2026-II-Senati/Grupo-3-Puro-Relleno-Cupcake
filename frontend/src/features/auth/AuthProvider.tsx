/* eslint-disable react-refresh/only-export-components */

import {
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';

import type { ReactNode } from 'react';

import {
    Navigate,
    Outlet,
} from 'react-router-dom';

import {
    loginUser,
    verifySession,
    saveSession,
    loadSession,
    clearSession,
} from '../../services/authApi';

import type {
    AuthSession,
} from '../../services/authApi';

interface AuthContextValue {
    session: AuthSession | null;
    checking: boolean;

    signIn: (
        email: string,
        password: string
    ) => Promise<void>;

    signOut: () => void;
}

const AuthContext = createContext<
    AuthContextValue | undefined
>(undefined);

export function AuthProvider({
                                 children,
                             }: {
    children: ReactNode;
}) {
    const [session, setSession] =
        useState<AuthSession | null>(null);

    const [checking, setChecking] = useState<boolean>(
        () => loadSession() !== null
    );

    useEffect(() => {
        const stored = loadSession();

        if (!stored) {
            return;
        }

        const controller = new AbortController();

        verifySession(
            stored.token,
            controller.signal
        )
            .then((user) => {
                if (controller.signal.aborted) {
                    return;
                }

                const validatedSession = {
                    token: stored.token,
                    user,
                };

                saveSession(validatedSession);
                setSession(validatedSession);
            })
            .catch(() => {
                if (controller.signal.aborted) {
                    return;
                }

                clearSession();
                setSession(null);
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setChecking(false);
                }
            });

        return () => {
            controller.abort();
        };
    }, []);

    async function signIn(
        email: string,
        password: string
    ): Promise<void> {
        const newSession = await loginUser(
            email,
            password
        );

        saveSession(newSession);
        setSession(newSession);
        setChecking(false);
    }

    function signOut(): void {
        clearSession();
        setSession(null);
        setChecking(false);
    }

    return (
        <AuthContext.Provider
            value={{
                session,
                checking,
                signIn,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            'useAuth debe utilizarse dentro de AuthProvider.'
        );
    }

    return context;
}

export function RequireAuth() {
    const { session, checking } = useAuth();

    if (checking) {
        return (
            <main
                style={{
                    padding: '40px',
                    textAlign: 'center',
                }}
                role="status"
            >
                Validando sesión...
            </main>
        );
    }

    if (!session) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    return <Outlet />;
}