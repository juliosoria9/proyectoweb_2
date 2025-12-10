'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getSpotifyAuthUrl } from '@/lib/auth';
import styles from './page.module.css';

export default function Home() {
  var router = useRouter();

  useEffect(function() {
    if (isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

  function iniciarSesion() {
    var url = getSpotifyAuthUrl();
    window.location.href = url;
  }

  return (
    <div className={styles.contenedor}>
      <h1 className={styles.titulo}>🍝 Spagetify</h1>
      <p className={styles.subtitulo}>Genera playlists según tus gustos</p>
      
      <button type="button" onClick={iniciarSesion} className={styles.botonLogin}>
        Iniciar sesión con Spotify
      </button>
    </div>
  );
}


