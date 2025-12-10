'use client';

import { useState, useEffect } from 'react';
import styles from './TarjetaCancion.module.css';

export default function TarjetaCancion({ cancion, onQuitar }) {
  

  const [esFavorito, setEsFavorito] = useState(false);

 
  useEffect(function() {
    const guardados = localStorage.getItem('favorite_tracks');
    

    if (guardados) {
      const lista = JSON.parse(guardados);
      const esta = lista.includes(cancion.id);
      setEsFavorito(esta);
    }
  }, [cancion.id]);


  function toggleFavorito() {

    const guardados = localStorage.getItem('favorite_tracks');
    let lista = [];
    if (guardados) {
      lista = JSON.parse(guardados);
    }


    if (esFavorito) {
      lista = lista.filter(function(id) {
        return id !== cancion.id;
      });
      setEsFavorito(false);
    } 

    else {
      lista.push(cancion.id);
      setEsFavorito(true);
    }

 
    localStorage.setItem('favorite_tracks', JSON.stringify(lista));
  }
  
  function handleQuitar() {
    onQuitar(cancion.id);
  }


  let iconoEstrella = '☆';
  if (esFavorito) {
    iconoEstrella = '⭐';
  }
  
  return (
    <div className={styles.tarjeta}>
      
      <button type="button" onClick={toggleFavorito} className={styles.botonFavorito}>
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
      
      <button type="button" onClick={handleQuitar} className={styles.botonQuitar}>
        Quitar
      </button>
      
    </div>
  );
}
