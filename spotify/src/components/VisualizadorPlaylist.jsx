'use client';

import TarjetaCancion from '@/components/TarjetaCancion';
import styles from './VisualizadorPlaylist.module.css';

export default function VisualizadorPlaylist({ playlist, onQuitar }) {
  
  if (playlist.length === 0) {
    return (
      <div className={styles.vacio}>
        <p>No hay canciones en la playlist aún.</p>
        <p>Selecciona géneros y genera una.</p>
      </div>
    );
  }
  
  function renderizarCancion(cancion) {
    return (
      <TarjetaCancion 
        key={cancion.id} 
        cancion={cancion} 
        onQuitar={onQuitar} 
      />
    );
  }
  
  return (
    <div className={styles.contenedor}>
      <h2>Playlist generada ({playlist.length} canciones)</h2>
      
      <div className={styles.lista}>
        {playlist.map(renderizarCancion)}
      </div>
    </div>
  );
}
