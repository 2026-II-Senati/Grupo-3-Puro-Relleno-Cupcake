import { useState } from 'react';

import Button from '../../../components/Button/Button';

import ProductCatalogPage from '../ProductCatalogPage';

import { sampleProducts } from '../data/products';

type DemoStatus = 'ready' | 'loading' | 'error';

function CatalogDemo() {
    const [status, setStatus] = useState<DemoStatus>('ready');

    return (
        <>
            <div
                style={{
                    padding: '16px',
                    backgroundColor: '#ffffff',
                    borderBottom: '1px solid #eeeeee',
                }}
            >
                <div
                    style={{
                        maxWidth: '1200px',
                        margin: '0 auto',
                    }}
                >
                    <p>
                        <strong>Panel de pruebas del catálogo</strong>
                    </p>

                    <p>
                        Estos controles permiten simular los estados
                        de la interfaz sin utilizar el backend.
                    </p>

                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '10px',
                        }}
                    >
                        <Button
                            onClick={() => setStatus('ready')}
                        >
                            Mostrar productos
                        </Button>

                        <Button
                            variant="secondary"
                            onClick={() => setStatus('loading')}
                        >
                            Simular carga
                        </Button>

                        <Button
                            variant="secondary"
                            onClick={() => setStatus('error')}
                        >
                            Simular error
                        </Button>
                    </div>
                </div>
            </div>

            <ProductCatalogPage
                products={sampleProducts}
                status={status}
            />
        </>
    );
}

export default CatalogDemo;