'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getSpotifyAuthUrl } from '@/lib/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogin = () => {
    window.location.href = getSpotifyAuthUrl();
  };

  return (
    <div>
      <h1>spaguetify</h1>
      <p>Genera playlists segun tus gustos</p>
      <a href="#" onClick={(e) => { e.preventDefault(); handleLogin(); }}>
        Iniciar sesión con Spotify
      </a>
    </div>
  );
}


