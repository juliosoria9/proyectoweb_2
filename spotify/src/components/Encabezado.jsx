'use client';

import { useRouter } from 'next/navigation';
import { logout } from '@/lib/auth';
import styles from './Encabezado.module.css';

export default function Encabezado({ titulo, mostrarAtras, mostrarEstadisticas, mostrarDashboard, mostrarFavoritos }) {
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

  function irAFavoritos() {
    router.push('/dashboard/favoritos');
  }

  function cerrarSesion() {
    logout();
    router.push('/');
  }

  return (
    <header className={styles.encabezado}>
      <div className={styles['encabezado-contenido']}>
        <div>
          <h1 className={styles['encabezado-titulo']}>Spagetify</h1>
          {titulo && <p className={styles['encabezado-subtitulo']}>{titulo}</p>}
        </div>

        <nav className={styles['encabezado-nav']}>
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

          {mostrarFavoritos && (
            <button type="button" onClick={irAFavoritos} className={styles.boton}>
              Favoritos ⭐
            </button>
          )}

          <button type="button" onClick={cerrarSesion} className={styles['boton-rojo']}>
            Cerrar sesión
          </button>
        </nav>
      </div>
    </header>
  );
}
