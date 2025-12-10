'use client';

import { useRouter } from 'next/navigation';
import { logout } from '@/lib/auth';
import styles from './Encabezado.module.css';

export default function Encabezado({ titulo, mostrarAtras, mostrarEstadisticas, mostrarDashboard }) {
  const router = useRouter();

  // Ir a la página anterior
  function irAtras() {
    router.back();
  }

  // Ir a estadísticas
  function irAEstadisticas() {
    router.push('/dashboard/estadisticas');
  }

  // Ir al dashboard
  function irADashboard() {
    router.push('/dashboard');
  }

  // Cerrar sesión y volver al inicio
  function cerrarSesion() {
    logout();
    router.push('/');
  }

  return (
    <header className={styles.encabezado}>
      <div className={styles.contenido}>
        
        {/* Logo y título */}
        <div>
          <h1 className={styles.titulo}>Spagetify</h1>
          {titulo && <p className={styles.subtitulo}>{titulo}</p>}
        </div>

        {/* Botones de navegación */}
        <nav className={styles.nav}>
          
          {mostrarAtras && (
            <button type="button" onClick={irAtras} className={styles.boton}>
              Atras
            </button>
          )}

          {mostrarDashboard && (
            <button type="button" onClick={irADashboard} className={styles.boton}>
              Dashboard
            </button>
          )}

          {mostrarEstadisticas && (
            <button type="button" onClick={irAEstadisticas} className={styles.boton}>
              Estadisticas
            </button>
          )}

          <button type="button" onClick={cerrarSesion} className={styles.botonRojo}>
            Cerrar sesión
          </button>
          
        </nav>
      </div>
    </header>
  );
}
