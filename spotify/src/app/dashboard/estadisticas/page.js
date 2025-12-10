'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getAccessToken } from '@/lib/auth';
import Encabezado from '@/components/Encabezado';
import styles from './page.module.css';

export default function EstadisticasPage() {
  const router = useRouter();
  const [artistas, setArtistas] = useState([]);
  const [canciones, setCanciones] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  // Si no hay token, vuelve al inicio
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/');
    }
  }, [router]);

  // Traer top artistas o canciones de Spotify
  async function traerTop(tipo) {
    setMensaje('');
    setCargando(true);

    const token = getAccessToken();
    if (!token) {
      setMensaje('Sin token. Inicia sesión.');
      setCargando(false);
      return;
    }

    // Decidir URL segun el tipo
    let url;
    if (tipo === 'artists') {
      url = 'https://api.spotify.com/v1/me/top/artists?limit=5';
    } else {
      url = 'https://api.spotify.com/v1/me/top/tracks?limit=5';
    }

    try {
      const resp = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await resp.json();

      if (tipo === 'artists') {
        setArtistas(data.items);
      } else {
        setCanciones(data.items);
      }
    } catch (e) {
      setMensaje('Error de red: ' + e.message);
    }

    setCargando(false);
  }

  return (
    <div>
      <Encabezado 
        titulo="Estadisticas" 
        mostrarAtras={true}
        mostrarDashboard={true}
      />

      <main className={styles.main}>
        <p>Consulta tu top de Spotify.</p>

        <div className={styles.botones}>
          <button 
            type="button" 
            onClick={() => traerTop('artists')} 
            disabled={cargando}
            className={styles.boton}
          >
            Top artistas
          </button>
          <button 
            type="button" 
            onClick={() => traerTop('tracks')} 
            disabled={cargando}
            className={styles.boton}
          >
            Top canciones
          </button>
        </div>

        {cargando && <p>Cargando...</p>}
        {mensaje && <p className={styles.error}>{mensaje}</p>}

        <h2>Artistas</h2>
        <ul className={styles.lista}>
          {artistas.map((a) => {
            let imagen = '';
            if (a.images && a.images.length > 0) {
              imagen = a.images[0].url;
            }

            return (
              <li key={a.id} className={styles.item}>
                {imagen && <img src={imagen} alt={a.name} width="50" height="50" className={styles.imagen} />}
                <span className={styles.texto}>{a.name}</span>
              </li>
            );
          })}
        </ul>

        <h2>Canciones</h2>
        <ul className={styles.lista}>
          {canciones.map((cancion) => {
            // Obtener nombres de artistas
            let nombresArtistas = '';
            if (cancion.artists && cancion.artists.length > 0) {
              const nombres = [];
              for (let i = 0; i < cancion.artists.length; i++) {
                nombres.push(cancion.artists[i].name);
              }
              nombresArtistas = nombres.join(', ');
            }

            // Obtener imagen del album
            let imagen = '';
            if (cancion.album && cancion.album.images && cancion.album.images.length > 0) {
              imagen = cancion.album.images[0].url;
            }

            return (
              <li key={cancion.id} className={styles.item}>
                {imagen && <img src={imagen} alt={cancion.name} width="50" height="50" className={styles.imagen} />}
                <div className={styles.texto}>
                  <strong>{cancion.name}</strong>
                  <div className={styles.artista}>{nombresArtistas}</div>
                </div>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}
