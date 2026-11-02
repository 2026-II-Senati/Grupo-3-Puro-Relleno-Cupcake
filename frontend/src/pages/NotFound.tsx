import { Link } from 'react-router-dom';

export const NotFound = () => (
  <div style={{ textAlign: 'center', padding: '60px 20px' }}>
    <h1 style={{ fontSize: '3rem', color: '#db2777' }}>404</h1>
    <h2>Página no encontrada</h2>
    <p style={{ color: '#6b7280', margin: '16px 0' }}>La ruta a la que intentas acceder no existe en el sistema.</p>
    <Link to="/dashboard" style={{ color: '#db2777', fontWeight: 'bold', textDecoration: 'none' }}>
      Volver al Panel Principal
    </Link>
  </div>
);