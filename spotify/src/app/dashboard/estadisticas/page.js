'use client';

// Página de estadísticas muy sencilla: protege con login,
// trae top artistas y top canciones de Spotify y los lista en texto.

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, logout, getAccessToken } from '@/lib/auth';

export default function EstadisticasPage() {
  const router = useRouter();
  const [artistas, setArtistas] = useState([]);
  const [canciones, setCanciones] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  // Si no hay token, vuelve al inicio.
  useEffect(() => {
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

    // Decidir cuál URL usar según el tipo
    let url;
    if (tipo === 'artists') {
      url = 'https://api.spotify.com/v1/me/top/artists?limit=5';
    } else if (tipo === 'tracks') {
      url = 'https://api.spotify.com/v1/me/top/tracks?limit=5';
    }

    try {
      // Pedir datos a Spotify
      const resp = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Convertir respuesta a JSON
      const data = await resp.json();
      const items = data.items;

      // Guardar en el estado correspondiente
      if (tipo === 'artists') {
        setArtistas(items);
      } else if (tipo === 'tracks') {
        setCanciones(items);
      }

    } catch (e) {
      setMensaje('Error de red: ' + e.message);
    }

    setCargando(false);
  }

  return (
    <div>
      <h1>Estadísticas</h1>
      <p>Consulta tu top de Spotify.</p>

      <div>
        <button type="button" onClick={() => traerTop('artists')} disabled={cargando}>Top artistas</button>
        <button type="button" onClick={() => traerTop('tracks')} disabled={cargando}>Top canciones</button>
        <button type="button" onClick={() => router.back()}>Atrás</button>
        <button type="button" onClick={() => { logout(); router.push('/'); }}>Cerrar sesión</button>
      </div>

      {cargando && <p>Cargando...</p>}
      {mensaje && <p>{mensaje}</p>}

      <h2>Artistas</h2>
      <ul>
        {artistas.map((a) => {
          // Obtener imagen del artista
          let imagen = '';
          if (a.images && a.images.length > 0) {
            imagen = a.images[0].url;
          }

          return (
            <li key={a.id}>
              {imagen && <img src={imagen} alt={a.name} width="50" height="50" />}
              {a.name}
            </li>
          );
        })}
      </ul>

      <h2>Canciones</h2>
      <ul>
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
            <li key={cancion.id}>
              {imagen && <img src={imagen} alt={cancion.name} width="50" height="50" />}
              <div>{cancion.name} - {nombresArtistas}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
