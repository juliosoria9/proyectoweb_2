'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, logout, getAccessToken } from '@/lib/auth';
import WidgetGenero from '@/components/widgets/WidgetGenero';
import WidgetPopularidad from '@/components/widgets/WidgetPopularidad';
import VisualizadorPlaylist from '@/components/VisualizadorPlaylist';

export default function GeneradorPage() {
  const router = useRouter();
  const [generosDisponibles] = useState([
    'rock', 'pop', 'jazz', 'hip-hop', 'electronic', 'indie', 'folk', 'metal'
  ]);
  const [generosSeleccionados, setGenerosSeleccionados] = useState([]);
  const [popularidadSeleccionada, setPopularidadSeleccionada] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/');
    }
  }, [router]);

  function manejarSeleccionGenero(genero) {
    const yaEsta = generosSeleccionados.includes(genero);
    
    if (yaEsta) {
      const nuevos = generosSeleccionados.filter(g => g !== genero);
      setGenerosSeleccionados(nuevos);
    } else {
      const nuevos = [...generosSeleccionados, genero];
      setGenerosSeleccionados(nuevos);
    }
  }

  // Manejar selección de popularidad
  function manejarSeleccionPopularidad(popularidad) {
    setPopularidadSeleccionada(popularidad);
  }

  // Obtener rango de popularidad según categoría
  function obtenerRangoPopularidad(categoria) {
    if (categoria === 'mainstream') {
      return { min: 70, max: 100 };
    }
    if (categoria === 'popular') {
      return { min: 40, max: 69 };
    }
    if (categoria === 'underground') {
      return { min: 0, max: 39 };
    }
    return null;
  }

  async function generarPlaylist() {
    if (generosSeleccionados.length === 0) {
      setMensaje('Selecciona al menos un género.');
      return;
    }

    setMensaje('');
    setCargando(true);

    const token = getAccessToken();
    if (!token) {
      setMensaje('Sin token. Inicia sesión.');
      setCargando(false);
      return;
    }

    try {
      let todasLasCanciones = [];

      // Buscar canciones de cada género
      for (let i = 0; i < generosSeleccionados.length; i++) {
        const genero = generosSeleccionados[i];
        const busqueda = 'genre:' + genero;
        const url = 'https://api.spotify.com/v1/search?type=track&q=' + encodeURIComponent(busqueda) + '&limit=15';

        const respuesta = await fetch(url, {
          headers: { 'Authorization': 'Bearer ' + token }
        });
        const datos = await respuesta.json();

        if (datos.tracks && datos.tracks.items) {
          const canciones = datos.tracks.items;

          for (let j = 0; j < canciones.length; j++) {
            const cancion = canciones[j];
            todasLasCanciones.push({
              id: cancion.id,
              name: cancion.name,
              artist: cancion.artists[0].name,
              image: cancion.album.images[0]?.url || '',
              popularity: cancion.popularity
            });
          }
        }
      }

      // Filtrar por popularidad si hay selección
      if (popularidadSeleccionada) {
        const rango = obtenerRangoPopularidad(popularidadSeleccionada);
        if (rango) {
          todasLasCanciones = todasLasCanciones.filter(c => {
            return c.popularity >= rango.min && c.popularity <= rango.max;
          });
        }
      }

      // Quitar duplicados
      const sinDuplicados = [];
      const idsVistos = [];
      for (let i = 0; i < todasLasCanciones.length; i++) {
        const cancion = todasLasCanciones[i];
        if (!idsVistos.includes(cancion.id)) {
          idsVistos.push(cancion.id);
          sinDuplicados.push(cancion);
        }
      }

      // Limitar a 30 canciones
      const playlistFinal = sinDuplicados.slice(0, 30);

      setPlaylist(playlistFinal);
      setMensaje('Playlist generada con ' + playlistFinal.length + ' canciones.');
    } catch (e) {
      setMensaje('Error: ' + e.message);
    }

    setCargando(false);
  }

  function quitarCancion(id) {
    const nuevas = playlist.filter(c => c.id !== id);
    setPlaylist(nuevas);
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Generador de Playlist</h1>
      <p>Selecciona géneros y genera tu playlist personalizada.</p>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button 
          type="button" 
          onClick={() => router.back()}
          style={{ padding: '8px 12px', backgroundColor: '#ccc', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Atrás
        </button>
        <button 
          type="button" 
          onClick={() => { logout(); router.push('/'); }}
          style={{ padding: '8px 12px', backgroundColor: '#ff4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Cerrar sesión
        </button>
      </div>

      <WidgetGenero 
        generos={generosDisponibles}
        seleccionados={generosSeleccionados}
        onSelect={manejarSeleccionGenero}
      />

      <WidgetPopularidad
        popularidadSeleccionada={popularidadSeleccionada}
        onSelect={manejarSeleccionPopularidad}
      />

      <button 
        type="button" 
        onClick={generarPlaylist} 
        disabled={cargando}
        style={{
          padding: '10px 20px',
          backgroundColor: '#1DB954',
          color: '#fff',
          border: 'none',
          borderRadius: '20px',
          cursor: cargando ? 'not-allowed' : 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
          marginBottom: '20px'
        }}
      >
        {cargando ? 'Generando...' : 'Generar Playlist'}
      </button>

      {mensaje && (
        <div style={{
          padding: '10px',
          marginBottom: '20px',
          backgroundColor: '#f0f0f0',
          border: '1px solid #ddd',
          borderRadius: '4px'
        }}>
          {mensaje}
        </div>
      )}

      <VisualizadorPlaylist playlist={playlist} onQuitar={quitarCancion} />
    </div>
  );
}
