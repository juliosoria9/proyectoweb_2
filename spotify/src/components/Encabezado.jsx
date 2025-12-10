'use client';

import { useRouter } from 'next/navigation';
import { logout } from '@/lib/auth';

export default function Encabezado({ titulo, mostrarAtras, mostrarEstadisticas, mostrarDashboard }) {
  const router = useRouter();

  function irAtras() {
    router.back();
  }

  function irAEstadisticas() {
    router.push('/dashboard/estadisticas');
  }

  function irADashboard() {
    router.push('/dashboard');
  }

  function cerrarSesion() {
    logout();
    router.push('/');
  }

  return (
    <header style={{
      padding: '15px 20px',
      backgroundColor: '#1DB954',
      color: '#fff',
      marginBottom: '20px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px' }}> Spagetify</h1>
          {titulo && <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>{titulo}</p>}
        </div>

        <nav style={{ display: 'flex', gap: '10px' }}>
          {mostrarAtras && (
            <button type="button" onClick={irAtras} style={estiloBoton}>
               Atras
            </button>
          )}

          {mostrarDashboard && (
            <button type="button" onClick={irADashboard} style={estiloBoton}>
               Dashboard
            </button>
          )}

          {mostrarEstadisticas && (
            <button type="button" onClick={irAEstadisticas} style={estiloBoton}>
               Estadisticas
            </button>
          )}

          <button type="button" onClick={cerrarSesion} style={estiloBotonRojo}>
            Cerrar sesión
          </button>
        </nav>
      </div>
    </header>
  );
}

const estiloBoton = {
  padding: '8px 12px',
  backgroundColor: '#fff',
  color: '#1DB954',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold'
};

const estiloBotonRojo = {
  padding: '8px 12px',
  backgroundColor: '#ff4444',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};
