'use client';

import styles from './WidgetGenero.module.css';

export default function WidgetGenero({ generos, seleccionados, onSelect }) {
  
  // Renderizar cada botón de género
  function renderizarBoton(genero) {
    // Ver si este género está seleccionado
    const estaSeleccionado = seleccionados.includes(genero);
    
    // Elegir la clase CSS según si está seleccionado o no
    let claseCSS = styles.boton;
    if (estaSeleccionado) {
      claseCSS = styles.botonActivo;
    }
    
    // Texto del botón: con ✓ si está seleccionado
    let texto = genero;
    if (estaSeleccionado) {
      texto = '✓ ' + genero;
    }
    
    return (
      <button
        key={genero}
        type="button"
        onClick={() => onSelect(genero)}
        className={claseCSS}
      >
        {texto}
      </button>
    );
  }
  
  return (
    <div className={styles.contenedor}>
      <h2>Selecciona géneros</h2>
      <div className={styles.lista}>
        {generos.map(renderizarBoton)}
      </div>
    </div>
  );
}
