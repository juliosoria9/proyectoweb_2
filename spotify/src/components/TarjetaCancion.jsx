'use client';

import styles from './TarjetaCancion.module.css';

export default function TarjetaCancion({ cancion, onQuitar }) {
  
  // Función para quitar esta canción
  function handleQuitar() {
    onQuitar(cancion.id);
  }
  
  return (
    <div className={styles.tarjeta}>
      
      {/* Imagen de la canción */}
      {cancion.image && (
        <img 
          src={cancion.image} 
          alt={cancion.name} 
          width="50" 
          height="50" 
          className={styles.imagen} 
        />
      )}
      
      {/* Información de la canción */}
      <div className={styles.info}>
        <div className={styles.nombre}>{cancion.name}</div>
        <div className={styles.artista}>{cancion.artist}</div>
      </div>
      
      {/* Botón para quitar */}
      <button type="button" onClick={handleQuitar} className={styles.botonQuitar}>
        Quitar
      </button>
      
    </div>
  );
}
