import { Link } from 'react-router-dom';

export function Pedidos() {
    return (
        <section
            style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '40px 20px',
            }}
        >
            <h1>Gestión de pedidos</h1>

            <p>
                Desde este módulo podrás registrar y consultar
                pedidos personalizados de Puro Relleno Cupcake.
            </p>

            <p>
                La interfaz de seguimiento y administración
                de pedidos se implementará posteriormente.
            </p>

            <Link
                to="/pedidos/nuevo"
                style={{
                    display: 'inline-block',
                    marginTop: '16px',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    backgroundColor: '#7c2d4d',
                    color: '#ffffff',
                    textDecoration: 'none',
                    fontWeight: 600,
                }}
            >
                Registrar nuevo pedido
            </Link>
        </section>
    );
}