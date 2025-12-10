'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { saveTokens } from '@/lib/auth';

export default function CallbackPage() {
  var router = useRouter();
  var searchParams = useSearchParams();
  var [error, setError] = useState(null);
  var yaProcesado = useRef(false);

  useEffect(function() {
    if (yaProcesado.current) {
      return;
    }

    var code = searchParams.get('code');
    var state = searchParams.get('state');
    var errorParam = searchParams.get('error');

    if (errorParam) {
      setError('Autenticación cancelada');
      return;
    }

    if (!code) {
      setError('No se recibió código de autorización');
      return;
    }

    var savedState = localStorage.getItem('spotify_auth_state');
    if (!state || state !== savedState) {
      setError('Error de validación. Intenta de nuevo.');
      localStorage.removeItem('spotify_auth_state');
      return;
    }

    localStorage.removeItem('spotify_auth_state');
    yaProcesado.current = true;

    async function intercambiarToken() {
      try {
        var respuesta = await fetch('/api/spotify-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: code })
        });

        var datos = await respuesta.json();
        
        if (!respuesta.ok) {
          setError(datos.error || 'Error al obtener token');
          return;
        }

        saveTokens(datos.access_token, datos.refresh_token, datos.expires_in);
        router.push('/dashboard');
      } catch (e) {
        setError(e.message);
      }
    }

    intercambiarToken();
  }, [searchParams, router]);

  function volverAlInicio() {
    router.push('/');
  }

  var estiloContenedor = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: '#121212'
  };

  var estiloTexto = {
    color: 'white',
    fontSize: '20px'
  };

  var estiloBoton = {
    background: '#1DB954',
    color: 'white',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer'
  };

  if (error) {
    return (
      <div style={estiloContenedor}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ color: '#e74c3c', marginBottom: '16px' }}>Error</h1>
          <p style={{ color: 'white', marginBottom: '24px' }}>{error}</p>
          <button type="button" onClick={volverAlInicio} style={estiloBoton}>
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={estiloContenedor}>
      <p style={estiloTexto}>Autenticando...</p>
    </div>
  );
}