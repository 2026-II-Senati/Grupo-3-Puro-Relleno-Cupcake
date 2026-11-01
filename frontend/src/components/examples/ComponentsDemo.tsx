import { useState } from 'react';

import Button from '../Button/Button';
import Input from '../Input/Input';
import Select from '../Select/Select';
import Card from '../Card/Card';
import Badge from '../Badge/Badge';
import Alert from '../Alert/Alert';

export default function ComponentsDemo() {
    const [nombre, setNombre] = useState('');
    const [estado, setEstado] = useState('');

    return (
        <main
            style={{
                maxWidth: '800px',
                margin: '0 auto',
                padding: '32px 20px',
                display: 'grid',
                gap: '24px',
            }}
        >
            <header>
                <h1>Puro Relleno Cupcake</h1>

                <p>
                    Demostración de componentes reutilizables.
                </p>
            </header>

            <Card
                heading="Componente Button"
                description="Variantes y estados de nuestros botones."
            >
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '12px',
                    }}
                >
                    <Button
                        onClick={() => window.alert('Botón funcionando')}
                    >
                        Guardar pedido
                    </Button>

                    <Button variant="secondary">
                        Cancelar
                    </Button>

                    <Button disabled>
                        Deshabilitado
                    </Button>

                    <Button isLoading>
                        Procesando
                    </Button>
                </div>
            </Card>

            <Card heading="Componente Input">
                <Input
                    label="Nombre del cliente"
                    placeholder="Ingresa tu nombre"
                    value={nombre}
                    onChange={(event) => setNombre(event.target.value)}
                    helperText="Este campo es una demostración."
                />

                <div style={{ marginTop: '16px' }}>
                    <Input
                        label="Correo electrónico"
                        type="email"
                        placeholder="correo@ejemplo.com"
                        error="Ejemplo de mensaje de error."
                    />
                </div>
            </Card>

            <Card heading="Componente Select">
                <Select
                    label="Estado del pedido"
                    placeholder="Selecciona un estado"
                    value={estado}
                    onChange={(event) => setEstado(event.target.value)}
                >
                    <option value="pendiente">Pendiente</option>
                    <option value="preparacion">En preparación</option>
                    <option value="completado">Completado</option>
                </Select>

                <p>Estado seleccionado: {estado || 'Ninguno'}</p>
            </Card>

            <Card
                heading="Componente Card"
                description="Ejemplo de información de un pedido."
                footer={
                    <Button variant="secondary">
                        Ver detalles
                    </Button>
                }
            >
                <p>Pedido de cupcakes personalizados.</p>

                <p>Cliente: María López</p>

                <Badge variant="warning">
                    Pendiente
                </Badge>
            </Card>

            <Card heading="Componente Badge">
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '10px',
                    }}
                >
                    <Badge>Neutral</Badge>

                    <Badge variant="success">
                        Completado
                    </Badge>

                    <Badge variant="warning">
                        Pendiente
                    </Badge>

                    <Badge variant="danger">
                        Cancelado
                    </Badge>

                    <Badge variant="info">
                        Información
                    </Badge>
                </div>
            </Card>

            <Card heading="Componente Alert">
                <div
                    style={{
                        display: 'grid',
                        gap: '12px',
                    }}
                >
                    <Alert
                        variant="success"
                        title="Operación exitosa"
                    >
                        El pedido se registró correctamente.
                    </Alert>

                    <Alert
                        variant="error"
                        title="Ocurrió un error"
                    >
                        No se pudo guardar la información.
                    </Alert>

                    <Alert
                        variant="warning"
                        title="Atención"
                    >
                        Verifica los datos antes de continuar.
                    </Alert>

                    <Alert
                        variant="info"
                        title="Información"
                    >
                        Esta es una demostración de componentes.
                    </Alert>
                </div>
            </Card>
        </main>
    );
}
