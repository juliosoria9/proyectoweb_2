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

      // Si hay error, mostrar mensaje
      if (!resp.ok) {
        setMensaje('Error al pedir datos. ¿Token expirado?');
        setCargando(false);
        return;
      }

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
        {artistas.map((a) => (
          <li key={a.id}>{a.name}</li>
        ))}
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

          return (
            <li key={cancion.id}>
              {cancion.name} - {nombresArtistas}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
