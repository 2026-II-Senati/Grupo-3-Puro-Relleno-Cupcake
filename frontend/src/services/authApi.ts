export interface AuthUser {
    id: number;
    fullName: string;
    email: string;
    roleId: number;
    role: string;
    isActive: boolean;
}

export interface AuthSession {
    token: string;
    user: AuthUser;
}

const SESSION_KEY = 'prc_auth_session';

async function getApiError(
    response: Response
): Promise<string> {
    const data: unknown = await response.json().catch(
        () => null
    );

    if (
        data !== null &&
        typeof data === 'object' &&
        'message' in data &&
        typeof data.message === 'string'
    ) {
        return data.message;
    }

    return `Error del servidor: ${response.status}`;
}

export async function loginUser(
    email: string,
    password: string
): Promise<AuthSession> {
    const response = await fetch('/api/v1/auth/login', {
        method: 'POST',

        headers: {
            'Content-Type': 'application/json',
        },

        body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password,
        }),
    });

    if (!response.ok) {
        throw new Error(await getApiError(response));
    }

    const data: AuthSession = await response.json();

    if (
        typeof data.token !== 'string' ||
        !data.token ||
        !data.user ||
        typeof data.user.id !== 'number'
    ) {
        throw new Error(
            'El servidor devolvió una respuesta de autenticación inválida.'
        );
    }

    return data;
}

export async function verifySession(
    token: string,
    signal?: AbortSignal
): Promise<AuthUser> {
    const response = await fetch('/api/v1/auth/me', {
        method: 'GET',

        headers: {
            Authorization: `Bearer ${token}`,
        },

        signal,
    });

    if (!response.ok) {
        throw new Error(await getApiError(response));
    }

    const data: { user: AuthUser } = await response.json();

    if (
        !data.user ||
        typeof data.user.id !== 'number'
    ) {
        throw new Error('La sesión no es válida.');
    }

    return data.user;
}

export function saveSession(
    session: AuthSession
): void {
    sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify(session)
    );
}

export function loadSession(): AuthSession | null {
    const raw = sessionStorage.getItem(SESSION_KEY);

    if (!raw) {
        return null;
    }

    try {
        const data: unknown = JSON.parse(raw);

        if (
            data === null ||
            typeof data !== 'object' ||
            !('token' in data) ||
            typeof data.token !== 'string' ||
            !('user' in data) ||
            data.user === null ||
            typeof data.user !== 'object'
        ) {
            clearSession();
            return null;
        }

        return data as AuthSession;

    } catch {
        clearSession();
        return null;
    }
}

export function clearSession(): void {
    sessionStorage.removeItem(SESSION_KEY);
}