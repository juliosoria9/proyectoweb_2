'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getAccessToken } from '@/lib/auth';
import Encabezado from '@/components/Encabezado';

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

    // Decidir URL según el tipo
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
        titulo="Estadísticas" 
        mostrarAtras={true}
        mostrarDashboard={true}
      />

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <p>Consulta tu top de Spotify.</p>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button 
            type="button" 
            onClick={() => traerTop('artists')} 
            disabled={cargando}
            style={estiloBoton}
          >
            Top artistas
          </button>
          <button 
            type="button" 
            onClick={() => traerTop('tracks')} 
            disabled={cargando}
            style={estiloBoton}
          >
            Top canciones
          </button>
        </div>

        {cargando && <p>Cargando...</p>}
        {mensaje && <p style={{ color: 'red' }}>{mensaje}</p>}

        <h2>Artistas</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {artistas.map((a) => {
            let imagen = '';
            if (a.images && a.images.length > 0) {
              imagen = a.images[0].url;
            }

            return (
              <li key={a.id} style={estiloItem}>
                {imagen && <img src={imagen} alt={a.name} width="50" height="50" style={{ borderRadius: '4px' }} />}
                <span style={{ marginLeft: '10px' }}>{a.name}</span>
              </li>
            );
          })}
        </ul>

        <h2>Canciones</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
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
              <li key={cancion.id} style={estiloItem}>
                {imagen && <img src={imagen} alt={cancion.name} width="50" height="50" style={{ borderRadius: '4px' }} />}
                <div style={{ marginLeft: '10px' }}>
                  <strong>{cancion.name}</strong>
                  <div style={{ fontSize: '0.9em', color: '#666' }}>{nombresArtistas}</div>
                </div>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}

// Estilos simples
const estiloBoton = {
  padding: '10px 20px',
  backgroundColor: '#1DB954',
  color: '#fff',
  border: 'none',
  borderRadius: '20px',
  cursor: 'pointer',
  fontWeight: 'bold'
};

const estiloItem = {
  display: 'flex',
  alignItems: 'center',
  padding: '10px 0',
  borderBottom: '1px solid #eee'
};
