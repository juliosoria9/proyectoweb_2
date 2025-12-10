'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getSpotifyAuthUrl } from '@/lib/auth';
import styles from './page.module.css';

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
    <div className={styles.contenedor}>
      <h1 className={styles.titulo}>🍝 Spagetify</h1>
      <p className={styles.subtitulo}>Genera playlists según tus gustos</p>
      
      <button 
        type="button"
        onClick={handleLogin}
        className={styles.botonLogin}
      >
        Iniciar sesión con Spotify
      </button>
    </div>
  );
}


