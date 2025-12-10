'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getAccessToken } from '@/lib/auth';
import Encabezado from '@/components/Encabezado';
import WidgetGenero from '@/components/widgets/WidgetGenero';
import WidgetDecada from '@/components/widgets/WidgetDecada';
import WidgetPopularidad from '@/components/widgets/WidgetPopularidad';
import VisualizadorPlaylist from '@/components/VisualizadorPlaylist';
import styles from './page.module.css';

export default function DashboardPage() {
	const router = useRouter();
	const [ready, setReady] = useState(false);
	const generosDisponibles = ['rock', 'pop', 'jazz', 'hip-hop', 'electronic', 'indie', 'folk', 'metal'];
	const [generosSeleccionados, setGenerosSeleccionados] = useState([]);
	const [decadaSeleccionada, setDecadaSeleccionada] = useState(null);
	const [popularidadSeleccionada, setPopularidadSeleccionada] = useState(null);
	const [playlist, setPlaylist] = useState([]);
	const [cargando, setCargando] = useState(false);
	const [mensaje, setMensaje] = useState('');

	useEffect(function() {
		if (!isAuthenticated()) {
			router.push('/');
			return;
		}
		setReady(true);
	}, [router]);

	function manejarSeleccionGenero(genero) {
		const yaSeleccionado = generosSeleccionados.includes(genero);
		
		if (yaSeleccionado) {
			const nuevaLista = [];
			for (let i = 0; i < generosSeleccionados.length; i++) {
				if (generosSeleccionados[i] !== genero) {
					nuevaLista.push(generosSeleccionados[i]);
				}
			}
			setGenerosSeleccionados(nuevaLista);
		} else {
			const nuevaLista = [];
			for (let i = 0; i < generosSeleccionados.length; i++) {
				nuevaLista.push(generosSeleccionados[i]);
			}
			nuevaLista.push(genero);
			setGenerosSeleccionados(nuevaLista);
		}
	}

	function obtenerRangoPopularidad(categoria) {
		if (categoria === 'mainstream') {
			return { min: 70, max: 100 };
		}
		if (categoria === 'popular') {
			return { min: 40, max: 69 };
		}
		if (categoria === 'underground') {
			return { min: 0, max: 39 };
		}
		return null;
	}

	function quitarDuplicados(canciones) {
		const resultado = [];
		const idsVistos = [];
		
		for (let i = 0; i < canciones.length; i++) {
			const cancion = canciones[i];
			const yaExiste = idsVistos.includes(cancion.id);
			
			if (!yaExiste) {
				idsVistos.push(cancion.id);
				resultado.push(cancion);
			}
		}
		
		return resultado;
	}

	async function buscarCanciones() {
		const token = getAccessToken();
		if (!token) {
			return [];
		}

		let canciones = [];

		for (let i = 0; i < generosSeleccionados.length; i++) {
			const genero = generosSeleccionados[i];
			let busqueda = 'genre:' + genero;
			
			if (decadaSeleccionada !== null) {
				const añoInicio = decadaSeleccionada;
				const añoFin = parseInt(decadaSeleccionada) + 9;
				busqueda = busqueda + ' year:' + añoInicio + '-' + añoFin;
			}

			const offset = Math.floor(Math.random() * 20);
			const url = 'https://api.spotify.com/v1/search?type=track&q=' + encodeURIComponent(busqueda) + '&limit=15&offset=' + offset;
			
			const respuesta = await fetch(url, {
				headers: { 'Authorization': 'Bearer ' + token }
			});

			if (!respuesta.ok) {
				continue;
			}

			const datos = await respuesta.json();
			
			if (!datos.tracks) {
				continue;
			}
			
			if (!datos.tracks.items) {
				continue;
			}

			for (let j = 0; j < datos.tracks.items.length; j++) {
				const track = datos.tracks.items[j];
				
				let nombreArtista = 'Desconocido';
				if (track.artists && track.artists.length > 0) {
					nombreArtista = track.artists[0].name;
				}
				
				let imagenAlbum = '';
				if (track.album && track.album.images && track.album.images.length > 0) {
					imagenAlbum = track.album.images[0].url;
				}
				
				const cancionFormateada = {
					id: track.id,
					name: track.name,
					artist: nombreArtista,
					image: imagenAlbum,
					popularity: track.popularity
				};
				
				canciones.push(cancionFormateada);
			}
		}

		if (popularidadSeleccionada !== null) {
			const rango = obtenerRangoPopularidad(popularidadSeleccionada);
			const cancionesAntesDeFiltro = canciones.length;
			
			if (rango !== null) {
				const cancionesFiltradas = [];
				
				for (let i = 0; i < canciones.length; i++) {
					const cancion = canciones[i];
					const dentroDeRango = cancion.popularity >= rango.min && cancion.popularity <= rango.max;
					
					if (dentroDeRango) {
						cancionesFiltradas.push(cancion);
					}
				}
				
				canciones = cancionesFiltradas;
				
				if (canciones.length === 0 && cancionesAntesDeFiltro > 0) {
					console.log('Filtro de popularidad eliminó todas las canciones. Antes: ' + cancionesAntesDeFiltro);
				}
			}
		}

		return canciones;
	}

	async function generarPlaylist() {
		if (generosSeleccionados.length === 0) {
			setMensaje('Selecciona al menos un género.');
			return;
		}

		setCargando(true);
		setMensaje('');

		try {
			const nuevasCanciones = await buscarCanciones();
			const sinDuplicados = quitarDuplicados(nuevasCanciones);
			const finales = sinDuplicados.slice(0, 30);
			
			if (finales.length === 0) {
				let sugerencia = 'No se encontraron canciones. ';
				
				if (popularidadSeleccionada !== null && decadaSeleccionada !== null) {
					sugerencia = sugerencia + 'Intenta sin filtro de popularidad o década.';
				} else if (popularidadSeleccionada !== null) {
					sugerencia = sugerencia + 'Intenta con otro nivel de popularidad.';
				} else if (decadaSeleccionada !== null) {
					sugerencia = sugerencia + 'Intenta con otra década o sin filtro de década.';
				} else {
					sugerencia = sugerencia + 'Intenta con otros géneros.';
				}
				
				setMensaje(sugerencia);
				setPlaylist([]);
			} else {
				setPlaylist(finales);
				setMensaje('Playlist generada: ' + finales.length + ' canciones.');
			}
		} catch (error) {
			setMensaje('Error: ' + error.message);
		}

		setCargando(false);
	}

	async function refrescarPlaylist() {
		await generarPlaylist();
	}

	async function añadirMasCanciones() {
		if (generosSeleccionados.length === 0) {
			setMensaje('Selecciona al menos un género.');
			return;
		}

		setCargando(true);
		setMensaje('');

		try {
			const nuevasCanciones = await buscarCanciones();
			
			const todas = [];
			for (let i = 0; i < playlist.length; i++) {
				todas.push(playlist[i]);
			}
			for (let i = 0; i < nuevasCanciones.length; i++) {
				todas.push(nuevasCanciones[i]);
			}
			
			const sinDuplicados = quitarDuplicados(todas);
			const finales = sinDuplicados.slice(0, 50);
			const cantidadAñadida = finales.length - playlist.length;
			
			setPlaylist(finales);
			setMensaje('Se añadieron ' + cantidadAñadida + ' canciones. Total: ' + finales.length);
		} catch (error) {
			setMensaje('Error: ' + error.message);
		}

		setCargando(false);
	}

	function quitarCancion(idCancion) {
		const nuevaPlaylist = [];
		
		for (let i = 0; i < playlist.length; i++) {
			if (playlist[i].id !== idCancion) {
				nuevaPlaylist.push(playlist[i]);
			}
		}
		
		setPlaylist(nuevaPlaylist);
	}

	if (!ready) {
		return <div>Cargando...</div>;
	}

	let textoBoton = 'Generar Playlist';
	if (cargando) {
		textoBoton = 'Generando...';
	}

	return (
		<div>
			<Encabezado 
				titulo="Generador de Playlist" 
				mostrarAtras={true}
				mostrarEstadisticas={true}
				mostrarFavoritos={true}
			/>

			<main className={styles.main}>
				<div className={styles.layoutContainer}>
					<div className={styles.panelIzquierdo}>
						<h2 className={styles.tituloPanel}>Opciones de Playlist</h2>
						<p className={styles.descripcion}>Selecciona géneros y personaliza tu playlist.</p>

						<WidgetGenero 
							generos={generosDisponibles}
							seleccionados={generosSeleccionados}
							onSelect={manejarSeleccionGenero}
						/>

						<WidgetDecada 
							decadaSeleccionada={decadaSeleccionada}
							onSelect={setDecadaSeleccionada}
						/>

						<WidgetPopularidad
							popularidadSeleccionada={popularidadSeleccionada}
							onSelect={setPopularidadSeleccionada}
						/>

						<div className={styles.botonesAccion}>
							<button 
								type="button" 
								onClick={generarPlaylist} 
								disabled={cargando}
								className={styles.botonGenerar}
							>
								{textoBoton}
							</button>

							{playlist.length > 0 && (
								<button 
									type="button" 
									onClick={refrescarPlaylist} 
									disabled={cargando}
									className={styles.botonSecundario}
								>
									Refrescar
								</button>
							)}

							{playlist.length > 0 && (
								<button 
									type="button" 
									onClick={añadirMasCanciones} 
									disabled={cargando}
									className={styles.botonSecundario}
								>
									Añadir más
								</button>
							)}
						</div>

						{mensaje && (
							<div className={styles.mensaje}>
								{mensaje}
							</div>
						)}
					</div>

					<div className={styles.panelDerecho}>
						<h2 className={styles.tituloPanel}>Tu Playlist</h2>
						<VisualizadorPlaylist playlist={playlist} onQuitar={quitarCancion} />
					</div>
				</div>
			</main>
		</div>
	);
}
