import {
    NavLink,
    useNavigate,
} from 'react-router-dom';

import {
    useAuth,
} from '../features/auth/AuthProvider';

const navLinkStyle = ({
                          isActive,
                      }: {
    isActive: boolean;
}) => ({
    textDecoration: 'none',
    color: isActive ? '#db2777' : '#4b5563',
    fontWeight: isActive ? 700 : 400,
});

export const Navbar = () => {
    const navigate = useNavigate();

    const { session, signOut } = useAuth();

    function handleLogout() {
        signOut();

        navigate('/login', {
            replace: true,
        });
    }

    return (
        <header
            style={{
                backgroundColor: '#ffffff',
                borderBottom: '1px solid #e5e7eb',
                padding: '16px 24px',
            }}
        >
            <nav
                aria-label="Navegación principal"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                    maxWidth: '1200px',
                    margin: '0 auto',
                }}
            >
                <h2
                    style={{
                        margin: 0,
                        fontSize: '1.2rem',
                        color: '#db2777',
                    }}
                >
                    🧁 Puro Relleno Cupcake
                </h2>

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '16px',
                        fontSize: '14px',
                    }}
                >
                    <NavLink
                        to="/dashboard"
                        style={navLinkStyle}
                    >
                        Panel Principal
                    </NavLink>

                    <NavLink
                        to="/catalogo"
                        style={navLinkStyle}
                    >
                        Catálogo
                    </NavLink>

                    <NavLink
                        to="/pedidos"
                        style={navLinkStyle}
                    >
                        Pedidos
                    </NavLink>

                    <NavLink
                        to="/agenda"
                        style={navLinkStyle}
                    >
                        Agenda
                    </NavLink>

                    <NavLink
                        to="/pagos"
                        style={navLinkStyle}
                    >
                        Pagos
                    </NavLink>

                    {session && (
                        <span
                            style={{
                                color: '#7c2d4d',
                                fontSize: '13px',
                            }}
                        >
                            {session.user.fullName}
                        </span>
                    )}

                    <button
                        type="button"
                        onClick={handleLogout}
                        style={{
                            border: '1px solid #db2777',
                            backgroundColor: '#ffffff',
                            color: '#db2777',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 600,
                        }}
                    >
                        Cerrar sesión
                    </button>
                </div>
            </nav>
        </header>
    );
};