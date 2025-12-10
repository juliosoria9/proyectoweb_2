'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, logout, getAccessToken } from '@/lib/auth';
import WidgetGenero from '@/components/widgets/WidgetGenero';
import VisualizadorPlaylist from '@/components/VisualizadorPlaylist';

export default function GeneradorPage() {
  const router = useRouter();
  const [generosDisponibles] = useState([
    'rock', 'pop', 'jazz', 'hip-hop', 'electronic', 'indie', 'folk', 'metal'
  ]);
  const [generosSeleccionados, setGenerosSeleccionados] = useState([]);
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
      const cancionesEjemplo = [
        { id: '1', name: 'Canción 1', artist: 'Artista 1', image: 'https://via.placeholder.com/50' },
        { id: '2', name: 'Canción 2', artist: 'Artista 2', image: 'https://via.placeholder.com/50' },
        { id: '3', name: 'Canción 3', artist: 'Artista 3', image: 'https://via.placeholder.com/50' },
      ];

      setPlaylist(cancionesEjemplo);
      setMensaje('Playlist generada (datos de prueba).');
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
