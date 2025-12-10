'use client';

import styles from './WidgetPopularidad.module.css';

export default function WidgetPopularidad({ popularidadSeleccionada, onSelect }) {
  var categorias = [
    { id: 'mainstream', nombre: 'Mainstream' },
    { id: 'popular', nombre: 'Popular' },
    { id: 'underground', nombre: 'Underground' }
  ];

  function renderizarBoton(categoria) {
    var estaSeleccionada = (popularidadSeleccionada === categoria.id);

    var claseCSS = styles.boton;
    if (estaSeleccionada) {
      claseCSS = styles.botonActivo;
    }

    function handleClick() {
      onSelect(categoria.id);
    }

    return (
      <button
        key={categoria.id}
        type="button"
        onClick={handleClick}
        className={claseCSS}
      >
        {categoria.nombre}
      </button>
    );
  }

  function limpiarSeleccion() {
    onSelect(null);
  }

  return (
    <div className={styles.contenedor}>
      <h2>Popularidad</h2>
      <p className={styles.descripcion}>¿Hits famosos o joyas ocultas?</p>
      <div className={styles.lista}>
        {categorias.map(renderizarBoton)}
        
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
