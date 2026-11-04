import {
    loadSession,
    clearSession,
} from './authApi';

export async function authorizedFetch(
    url: string,
    options: RequestInit = {}
): Promise<Response> {

    const session = loadSession();

    if (!session?.token) {
        throw new Error(
            'Debes iniciar sesión para continuar.'
        );
    }

    const headers = new Headers(options.headers);

    headers.set(
        'Authorization',
        `Bearer ${session.token}`
    );

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        clearSession();

        window.dispatchEvent(
            new Event('prc-session-expired')
        );
    }

    return response;
}