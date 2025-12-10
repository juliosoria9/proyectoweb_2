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

  useEffect(function() {
    if (!isAuthenticated()) {
      router.push('/');
    }
  }, [router]);

  async function traerTop(tipo) {
    setMensaje('');
    setCargando(true);

    const token = getAccessToken();
    if (!token) {
      setMensaje('Sin token. Inicia sesión.');
      setCargando(false);
      return;
    }

    const url = 'https://api.spotify.com/v1/me/top/' + tipo + '?limit=5';

    try {
      const respuesta = await fetch(url, {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const datos = await respuesta.json();

      if (tipo === 'artists') {
        if (datos.items) {
          setArtistas(datos.items);
        } else {
          setArtistas([]);
        }
      } else {
        if (datos.items) {
          setCanciones(datos.items);
        } else {
          setCanciones([]);
        }
      }
    } catch (error) {
      setMensaje('Error de red: ' + error.message);
    }

    setCargando(false);
  }

  function cargarArtistas() {
    traerTop('artists');
  }

  function cargarCanciones() {
    traerTop('tracks');
  }

  function renderizarArtista(artista, posicion) {
    let imagen = '';
    if (artista.images && artista.images.length > 0) {
      imagen = artista.images[0].url;
    }

    return (
      <li key={artista.id} className={styles.item}>
        <div className={styles.ranking}>#{posicion + 1}</div>
        {imagen && <img src={imagen} alt={artista.name} width="64" height="64" className={styles.imagen} />}
        <span className={styles.texto}>{artista.name}</span>
      </li>
    );
  }

  function renderizarCancion(cancion, posicion) {
    let imagen = '';
    if (cancion.album && cancion.album.images && cancion.album.images.length > 0) {
      imagen = cancion.album.images[0].url;
    }

    let nombresArtistas = '';
    if (cancion.artists && cancion.artists.length > 0) {
      const nombres = [];
      for (let i = 0; i < cancion.artists.length; i++) {
        nombres.push(cancion.artists[i].name);
      }
      nombresArtistas = nombres.join(', ');
    }

    return (
      <li key={cancion.id} className={styles.item}>
        <div className={styles.ranking}>#{posicion + 1}</div>
        {imagen && <img src={imagen} alt={cancion.name} width="64" height="64" className={styles.imagen} />}
        <div className={styles.texto}>
          <strong>{cancion.name}</strong>
          <div className={styles.artista}>{nombresArtistas}</div>
        </div>
      </li>
    );
  }

  return (
    <div>
      <Encabezado titulo="Estadisticas" mostrarAtras={true} mostrarDashboard={true} />

      <main className={styles.main}>
        <p>Consulta tu top de Spotify.</p>

        <div className={styles.botones}>
          <button type="button" onClick={cargarArtistas} disabled={cargando} className={styles.boton}>
            Top artistas
          </button>
          <button type="button" onClick={cargarCanciones} disabled={cargando} className={styles.boton}>
            Top canciones
          </button>
        </div>

        {cargando && (
          <div className={styles.spinnerContainer}>
            <div className={styles.spinner}></div>
            <p className={styles.cargandoTexto}>Cargando tus estadísticas...</p>
          </div>
        )}
        
        {mensaje && <p className={styles.error}>{mensaje}</p>}

        {artistas.length > 0 && (
          <div className={styles.seccion}>
            <h2 className={styles.titulo}>🎤 Top Artistas</h2>
            <ul className={styles.lista}>
              {artistas.map(renderizarArtista)}
            </ul>
          </div>
        )}

        {canciones.length > 0 && (
          <div className={styles.seccion}>
            <h2 className={styles.titulo}>🎵 Top Canciones</h2>
            <ul className={styles.lista}>
              {canciones.map(renderizarCancion)}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
