import { createRoot } from 'react-dom/client';

import LoginPage from './LoginPage';

const rootElement = document.getElementById('login-demo-root');

if (!rootElement) {
    throw new Error('No se encontró el contenedor de demostración del login.');
}

createRoot(rootElement).render(<LoginPage />);