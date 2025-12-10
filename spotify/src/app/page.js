'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getSpotifyAuthUrl } from '@/lib/auth';

export default function Home() {
  const router = useRouter();

  // Si ya tiene token, ir al dashboard
  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

  // Iniciar sesión con Spotify
  function handleLogin() {
    window.location.href = getSpotifyAuthUrl();
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#191414'
    }}>
      <h1 style={{ fontSize: '48px', color: '#1DB954', margin: 0 }}>🍝 Spagetify</h1>
      <p style={{ color: '#fff', marginTop: '10px', marginBottom: '30px' }}>
        Genera playlists según tus gustos
      </p>
      
      <button 
        type="button"
        onClick={handleLogin}
        style={{
          padding: '15px 30px',
          backgroundColor: '#1DB954',
          color: '#fff',
          border: 'none',
          borderRadius: '30px',
          fontSize: '18px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        Iniciar sesión con Spotify
      </button>
    </div>
  );
}


