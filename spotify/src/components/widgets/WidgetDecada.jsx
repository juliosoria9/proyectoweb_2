'use client';

import styles from './WidgetDecada.module.css';

export default function WidgetDecada({ decadaSeleccionada, onSelect }) {
  const DECADAS_DISPONIBLES = ['1960', '1970', '1980', '1990', '2000', '2010', '2020'];

  function renderizarBoton(decada) {
    const estaSeleccionada = (decadaSeleccionada === decada);
    
    let claseCSS = styles.boton;
    if (estaSeleccionada) {
      claseCSS = styles.botonActivo;
    }

    const textoBoton = decada + 's';

    function handleClick() {
      onSelect(decada);
    }

    return (
      <button
        key={decada}
        type="button"
        onClick={handleClick}
        className={claseCSS}
      >
        {textoBoton}
      </button>
    );
  }

  function limpiarSeleccion() {
    onSelect(null);
  }

  return (
    <div className={styles.contenedor}>
      <h2>Selecciona una década</h2>
      <p className={styles.descripcion}>Filtra canciones por año de lanzamiento</p>
      
      <div className={styles.lista}>
        {DECADAS_DISPONIBLES.map(renderizarBoton)}
        
        <button
          type="button"
          onClick={limpiarSeleccion}
          className={styles.botonLimpiar}
        >
          Todas
        </button>
      </div>
    </div>
  );
}
