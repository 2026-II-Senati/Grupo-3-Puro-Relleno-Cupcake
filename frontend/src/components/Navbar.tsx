import { NavLink } from 'react-router-dom';

export const Navbar = () => {
  return (
    <header style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '12px 24px' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#db2777' }}>🧁 Puro Relleno Cupcake</h2>
        <div style={{ display: 'flex', gap: '16px' }}>
          <NavLink 
            to="/dashboard" 
            style={({ isActive }) => ({ textDecoration: 'none', color: isActive ? '#db2777' : '#4b5563', fontWeight: isActive ? 'bold' : 'normal' })}>
            Panel Principal
          </NavLink>
          <NavLink 
            to="/pedidos" 
            style={({ isActive }) => ({ textDecoration: 'none', color: isActive ? '#db2777' : '#4b5563', fontWeight: isActive ? 'bold' : 'normal' })}>
            Pedidos
          </NavLink>
          <NavLink 
            to="/agenda" 
            style={({ isActive }) => ({ textDecoration: 'none', color: isActive ? '#db2777' : '#4b5563', fontWeight: isActive ? 'bold' : 'normal' })}>
            Agenda
          </NavLink>
          <NavLink 
            to="/pagos" 
            style={({ isActive }) => ({ textDecoration: 'none', color: isActive ? '#db2777' : '#4b5563', fontWeight: isActive ? 'bold' : 'normal' })}>
            Pagos
          </NavLink>
          <NavLink 
            to="/login" 
            style={({ isActive }) => ({ textDecoration: 'none', color: isActive ? '#db2777' : '#4b5563', fontWeight: isActive ? 'bold' : 'normal' })}>
            Cerrar Sesión
          </NavLink>
        </div>
      </nav>
    </header>
  );
};