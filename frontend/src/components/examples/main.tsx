import { createRoot } from 'react-dom/client';
import ComponentsDemo from './ComponentsDemo';

const rootElement = document.getElementById('components-demo-root');

if (!rootElement) {
    throw new Error('No se encontró el contenedor de demostración.');
}

createRoot(rootElement).render(<ComponentsDemo />);