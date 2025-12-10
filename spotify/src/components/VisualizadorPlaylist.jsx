'use client';

import TarjetaCancion from '@/components/TarjetaCancion';

export default function VisualizadorPlaylist({ playlist, onQuitar }) {
  if (playlist.length === 0) {
    return (
      <div style={{ marginTop: '20px', color: '#999' }}>
        <p>No hay canciones en la playlist aún. Selecciona géneros y genera una.</p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '20px' }}>
      <h2>Playlist generada ({playlist.length} canciones)</h2>
      <div style={{ border: '1px solid #ddd', borderRadius: '4px' }}>
        {playlist.map((cancion) => (
          <TarjetaCancion key={cancion.id} cancion={cancion} onQuitar={onQuitar} />
        ))}
      </div>
    </div>
  );
}
