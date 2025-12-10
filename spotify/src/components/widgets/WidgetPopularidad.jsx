'use client';

import styles from './WidgetPopularidad.module.css';

export default function WidgetPopularidad({ popularidadSeleccionada, onSelect }) {
  

  const categorias = [
    { id: 'mainstream', nombre: 'Mainstream', min: 70, max: 100 },
    { id: 'popular', nombre: 'Popular', min: 40, max: 69 },
    { id: 'underground', nombre: 'Underground', min: 0, max: 39 }
  ];

 
  function renderizarBoton(categoria) {
 
    const estaSeleccionada = (popularidadSeleccionada === categoria.id);
    

    let claseCSS = styles.boton;
    if (estaSeleccionada) {
      claseCSS = styles.botonActivo;
    }

    return (
      <button
        key={categoria.id}
        type="button"
        onClick={() => onSelect(categoria.id)}
        className={claseCSS}
      >
        {categoria.nombre}
      </button>
    );
  }

  return (
    <div className={styles.contenedor}>
      <h2>Popularidad</h2>
      <p className={styles.descripcion}>¿Hits famosos o joyas ocultas?</p>
      <div className={styles.lista}>
        {categorias.map(renderizarBoton)}
        
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
