'use client';

import { useState, useEffect } from 'react';
import styles from './TarjetaCancion.module.css';

const STORAGE_KEY = 'favorite_tracks';

export default function TarjetaCancion({ cancion, onQuitar }) {
  const [esFavorito, setEsFavorito] = useState(false);

  useEffect(function() {
    const cancionesFavoritas = localStorage.getItem(STORAGE_KEY);
    
    if (cancionesFavoritas) {
      const listaFavoritos = JSON.parse(cancionesFavoritas);
      const estaEnFavoritos = listaFavoritos.includes(cancion.id);
      setEsFavorito(estaEnFavoritos);
    }
  }, [cancion.id]);

  function toggleFavorito() {
    const cancionesFavoritas = localStorage.getItem(STORAGE_KEY);
    let listaFavoritos = [];
    
    if (cancionesFavoritas) {
      listaFavoritos = JSON.parse(cancionesFavoritas);
    }

    if (esFavorito) {
      const nuevaLista = [];
      for (let i = 0; i < listaFavoritos.length; i++) {
        if (listaFavoritos[i] !== cancion.id) {
          nuevaLista.push(listaFavoritos[i]);
        }
      }
      listaFavoritos = nuevaLista;
      setEsFavorito(false);
    } else {
      listaFavoritos.push(cancion.id);
      setEsFavorito(true);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(listaFavoritos));
  }
  
  function handleQuitar() {
    onQuitar(cancion.id);
  }

  const iconoEstrella = esFavorito ? '⭐' : '☆';
  
  return (
    <div className={styles.tarjeta}>
      <button 
        type="button" 
        onClick={toggleFavorito} 
        className={styles.botonFavorito}
        title={esFavorito ? 'Quitar de favoritos' : 'Añadir a favoritos'}
      >
        {iconoEstrella}
      </button>
      
      {cancion.image && (
        <img 
          src={cancion.image} 
          alt={cancion.name} 
          width="50" 
          height="50" 
          className={styles.imagen} 
        />
      )}
      
      <div className={styles.info}>
        <div className={styles.nombre}>{cancion.name}</div>
        <div className={styles.artista}>{cancion.artist}</div>
      </div>
      
      <button 
        type="button" 
        onClick={handleQuitar} 
        className={styles.botonQuitar}
        title="Quitar de la playlist"
      >
        Quitar
      </button>
    </div>
  );
}
