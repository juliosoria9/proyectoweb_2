'use client';

import styles from './WidgetGenero.module.css';

export default function WidgetGenero({ generos, seleccionados, onSelect }) {
  
  function renderizarBoton(genero) {
    const estaSeleccionado = seleccionados.includes(genero);
    
    let claseCSS = styles.boton;
    if (estaSeleccionado) {
      claseCSS = styles.botonActivo;
    }
    
    let textoBoton = genero;
    if (estaSeleccionado) {
      textoBoton = '✓ ' + genero;
    }
    
    function handleClick() {
      onSelect(genero);
    }
    
    return (
      <button
        key={genero}
        type="button"
        onClick={handleClick}
        className={claseCSS}
      >
        {textoBoton}
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
