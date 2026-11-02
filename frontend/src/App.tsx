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

import ProductCatalogPage from './features/catalog/ProductCatalogPage';
import { sampleProducts } from './features/catalog/data/products';

import CreateOrderPage from './features/orders/CreateOrderPage';

function AppLayout() {
    const location = useLocation();

    const hideNavbar = location.pathname === '/login';

    return (
        <>
            {!hideNavbar && <Navbar />}

            <Routes>
                <Route
                    path="/"
                    element={<Navigate to="/login" replace />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/catalogo"
                    element={
                        <ProductCatalogPage products={sampleProducts} />
                    }
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
            <AppLayout />
        </BrowserRouter>
    );
}