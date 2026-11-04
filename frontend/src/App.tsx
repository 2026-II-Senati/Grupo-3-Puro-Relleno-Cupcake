import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
    useLocation,
} from 'react-router-dom';

import { Navbar } from './components/Navbar';

import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Pedidos } from './pages/Pedidos';
import { Agenda } from './pages/Agenda';
import { Pagos } from './pages/Pagos';
import { NotFound } from './pages/NotFound';

import CatalogConnectedPage from './features/catalog/CatalogConnectedPage';

import CreateOrderPage from './features/orders/CreateOrderPage';

import {
    AuthProvider,
    RequireAuth,
    useAuth,
} from './features/auth/AuthProvider';

import ProductAdminPage from './pages/ProductAdminPage';

import type { ReactNode } from 'react';

function OnlyRoles({
                       allowed,
                       children,
                   }: {
    allowed: readonly string[];
    children: ReactNode;
}) {
    const { session } = useAuth();

    if (!session) {
        return <Navigate to="/login" replace />;
    }

    const role = session.user.role.trim().toLowerCase();

    if (!allowed.includes(role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
}

function AppLayout() {
    const location = useLocation();

    const { session, checking } = useAuth();

    const hideNavbar =
        location.pathname === '/login' ||
        !session ||
        checking;

    return (
        <>
            {!hideNavbar && <Navbar />}

            <Routes>
                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />

                <Route
                    path="/login"
                    element={
                        session
                            ? (
                                <Navigate
                                    to="/dashboard"
                                    replace
                                />
                            )
                            : <Login />
                    }
                />

                <Route element={<RequireAuth />}>
                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/catalogo"
                        element={<CatalogConnectedPage />}
                    />

                    <Route
                        path="/pedidos/nuevo"
                        element={
                            <OnlyRoles
                                allowed={['admin', 'customer_service']}
                            >
                                <CreateOrderPage />
                            </OnlyRoles>
                        }
                    />

                    <Route
                        path="/pedidos"
                        element={<Pedidos />}
                    />

                    <Route
                        path="/agenda"
                        element={<Agenda />}
                    />

                    <Route
                        path="/pagos"
                        element={
                            <OnlyRoles
                                allowed={['admin', 'customer_service']}
                            >
                                <Pagos />
                            </OnlyRoles>
                        }
                    />

                    <Route
                        path="/productos/admin"
                        element={
                            <OnlyRoles allowed={['admin']}>
                                <ProductAdminPage />
                            </OnlyRoles>
                        }
                    />
                </Route>

                <Route
                    path="*"
                    element={<NotFound />}
                />
            </Routes>
        </>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppLayout />
            </AuthProvider>
        </BrowserRouter>
    );
}