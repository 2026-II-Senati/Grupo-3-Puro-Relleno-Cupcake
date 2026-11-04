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
                        element={<CreateOrderPage />}
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
                        element={<Pagos />}
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