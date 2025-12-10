'use client';

export default function TarjetaCancion({ cancion, onQuitar }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '10px',
      borderBottom: '1px solid #eee'
    }}>
      {cancion.image && (
        <img src={cancion.image} alt={cancion.name} width="50" height="50" style={{ borderRadius: '4px' }} />
      )}
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 'bold' }}>{cancion.name}</div>
        <div style={{ fontSize: '0.9em', color: '#666' }}>{cancion.artist}</div>
      </div>
      <button
        type="button"
        onClick={() => onQuitar(cancion.id)}
        style={{
          padding: '6px 12px',
          backgroundColor: '#ff4444',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Quitar
      </button>
    </div>
  );
}
