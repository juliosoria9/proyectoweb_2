'use client';

import styles from './WidgetGenero.module.css';

export default function WidgetGenero({ generos, seleccionados, onSelect }) {
  
  function renderizarBoton(genero) {
    var estaSeleccionado = seleccionados.includes(genero);
    
    var claseCSS = styles.boton;
    if (estaSeleccionado) {
      claseCSS = styles.botonActivo;
    }
    
    var texto = genero;
    if (estaSeleccionado) {
      texto = '✓ ' + genero;
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
