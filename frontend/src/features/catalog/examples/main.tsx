import { createRoot } from 'react-dom/client';

import CatalogDemo from './CatalogDemo';

const rootElement = document.getElementById('catalog-demo-root');

if (!rootElement) {
    throw new Error(
        'No se encontró el contenedor de demostración del catálogo.'
    );
}

createRoot(rootElement).render(<CatalogDemo />);