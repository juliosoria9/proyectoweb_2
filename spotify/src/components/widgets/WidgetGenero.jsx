'use client';

export default function WidgetGenero({ generos, seleccionados, onSelect }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <h2>Selecciona géneros</h2>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {generos.map((genero) => {
          const estaSel = seleccionados.includes(genero);
          const color = estaSel ? '#1DB954' : '#ccc';
          
          return (
            <button
              key={genero}
              type="button"
              onClick={() => onSelect(genero)}
              style={{
                padding: '8px 12px',
                backgroundColor: color,
                color: estaSel ? '#fff' : '#000',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer',
                fontWeight: estaSel ? 'bold' : 'normal'
              }}
            >
              {estaSel ? '✓ ' : ''}{genero}
            </button>
          );
        })}
      </div>
    </div>
  );
}
