'use client';

import styles from './WidgetDecada.module.css';

export default function WidgetDecada({ decadaSeleccionada, onSelect }) {
  const decadas = ['1960', '1970', '1980', '1990', '2000', '2010', '2020'];

  function renderizarBoton(decada) {
    const estaSeleccionada = (decadaSeleccionada === decada);
    
    let claseCSS = styles.boton;
    if (estaSeleccionada) {
      claseCSS = styles.botonActivo;
    }

    const texto = decada + 's';

    return (
      <button
        key={decada}
        type="button"
        onClick={() => onSelect(decada)}
        className={claseCSS}
      >
        {texto}
      </button>
    );
  }

  return (
    <div className={styles.contenedor}>
      <h2>Selecciona una década</h2>
      <p className={styles.descripcion}>Filtra canciones por año de lanzamiento</p>
      <div className={styles.lista}>
        {decadas.map(renderizarBoton)}
        
        <button
          type="button"
          onClick={() => onSelect(null)}
          className={styles.botonLimpiar}
        >
          Todas
        </button>
      </div>
    </div>
  );
}
