import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div style={{ padding: '32px', border: '1px solid #e5e7eb', borderRadius: '8px', maxWidth: '360px', width: '100%', textAlign: 'center' }}>
        <h2 style={{ color: '#db2777', marginBottom: '8px' }}>Puro Relleno Cupcake</h2>
        <p style={{ color: '#6b7280', marginBottom: '20px' }}>Inicio de sesión al sistema</p>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input type="email" placeholder="Correo electrónico" style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '4px' }} defaultValue="admin@purorelleno.com" />
          <input type="password" placeholder="Contraseña" style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '4px' }} defaultValue="••••••••" />
          <button type="submit" style={{ padding: '10px', background: '#db2777', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};