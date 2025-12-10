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

	// Lista de generos disponibles
	const generosDisponibles = ['rock', 'pop', 'jazz', 'hip-hop', 'electronic', 'indie', 'folk', 'metal'];

	// Estado del generador
	const [generosSeleccionados, setGenerosSeleccionados] = useState([]);
	const [decadaSeleccionada, setDecadaSeleccionada] = useState(null);
	const [popularidadSeleccionada, setPopularidadSeleccionada] = useState(null);
	const [playlist, setPlaylist] = useState([]);
	const [cargando, setCargando] = useState(false);
	const [mensaje, setMensaje] = useState('');

	// Verificar autenticación al cargar
	useEffect(() => {
		if (!isAuthenticated()) {
			router.push('/');
			return;
		}
		setReady(true);
	}, [router]);

	// Seleccionar o quitar un genero
	function manejarSeleccionGenero(genero) {
		const yaEsta = generosSeleccionados.includes(genero);
		
		if (yaEsta) {
			const nuevos = generosSeleccionados.filter(g => g !== genero);
			setGenerosSeleccionados(nuevos);
		} else {
			const nuevos = [...generosSeleccionados, genero];
			setGenerosSeleccionados(nuevos);
		}
	}

	// Seleccionar decada
	function manejarSeleccionDecada(decada) {
		setDecadaSeleccionada(decada);
	}

	// Seleccionar popularidad
	function manejarSeleccionPopularidad(popularidad) {
		setPopularidadSeleccionada(popularidad);
	}

	// Obtener rango de popularidad
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

	// Generar la playlist
	async function generarPlaylist() {
		// Validar que hay géneros seleccionados
		if (generosSeleccionados.length === 0) {
			setMensaje('Selecciona al menos un género.');
			return;
		}

		setMensaje('');
		setCargando(true);

		// Verificar token
		const token = getAccessToken();
		if (!token) {
			setMensaje('Sin token. Inicia sesión.');
			setCargando(false);
			return;
		}

		try {
			// Array para guardar todas las canciones
			let todasLasCanciones = [];

			// Buscar canciones por cada género seleccionado
			for (let i = 0; i < generosSeleccionados.length; i++) {
				const genero = generosSeleccionados[i];
				
				// Construir busqueda base
				let busqueda = 'genre:' + genero;
				
				// Si hay decada seleccionada, añadir filtro de año
				if (decadaSeleccionada) {
					// Ejemplo: decada 1980 -> buscar "year:1980-1989"
					const anioInicio = decadaSeleccionada;
					const anioFin = parseInt(decadaSeleccionada) + 9;
					busqueda = busqueda + ' year:' + anioInicio + '-' + anioFin;
				}
				
				// Construir URL de búsqueda
				const url = 'https://api.spotify.com/v1/search?type=track&q=' + encodeURIComponent(busqueda) + '&limit=10';
				
				// Llamar a la API de Spotify
				const respuesta = await fetch(url, {
					headers: {
						'Authorization': 'Bearer ' + token
					}
				});

				// Verificar si la respuesta es correcta
				if (!respuesta.ok) {
					console.log('Error en búsqueda de género:', genero);
					continue;
				}

				// Convertir respuesta a JSON
				const datos = await respuesta.json();

				// Verificar que hay resultados
				if (datos.tracks && datos.tracks.items) {
					// Recorrer cada canción
					for (let j = 0; j < datos.tracks.items.length; j++) {
						const cancion = datos.tracks.items[j];
						
						// Obtener nombre del artista
						let nombreArtista = 'Desconocido';
						if (cancion.artists && cancion.artists.length > 0) {
							nombreArtista = cancion.artists[0].name;
						}

						// Obtener imagen del álbum
						let imagenAlbum = '';
						if (cancion.album && cancion.album.images && cancion.album.images.length > 0) {
							imagenAlbum = cancion.album.images[0].url;
						}

						// Crear objeto de canción simplificado
						const cancionSimple = {
							id: cancion.id,
							name: cancion.name,
							artist: nombreArtista,
							image: imagenAlbum,
							popularity: cancion.popularity
						};

						// Agregar a la lista
						todasLasCanciones.push(cancionSimple);
					}
				}
			}

			// Eliminar canciones duplicadas (mismo ID)
			const cancionesUnicas = [];
			const idsVistos = [];
			
			for (let k = 0; k < todasLasCanciones.length; k++) {
				const cancion = todasLasCanciones[k];
				
				// Si no hemos visto este ID, agregar
				if (!idsVistos.includes(cancion.id)) {
					idsVistos.push(cancion.id);
					cancionesUnicas.push(cancion);
				}
			}

			// Filtrar por popularidad si hay selección
			let cancionesFiltradas = cancionesUnicas;
			if (popularidadSeleccionada) {
				const rango = obtenerRangoPopularidad(popularidadSeleccionada);
				if (rango) {
					cancionesFiltradas = cancionesUnicas.filter(c => {
						return c.popularity >= rango.min && c.popularity <= rango.max;
					});
				}
			}

			// Limitar a 30 canciones máximo
			const cancionesFinales = cancionesFiltradas.slice(0, 30);

			// Guardar en el estado
			setPlaylist(cancionesFinales);
			setMensaje('Playlist generada: ' + cancionesFinales.length + ' canciones.');

		} catch (e) {
			setMensaje('Error: ' + e.message);
		}

		setCargando(false);
	}

	// Quitar una cancion de la playlist
	function quitarCancion(id) {
		const nuevas = playlist.filter(c => c.id !== id);
		setPlaylist(nuevas);
	}

	if (!ready) {
		return <div>Cargando...</div>;
	}

	return (
		<div>
			<Encabezado 
				titulo="Generador de Playlist" 
				mostrarAtras={true}
				mostrarEstadisticas={true}
			/>

			<main className={styles.main}>
				<p>Selecciona géneros y genera tu playlist personalizada.</p>

				<WidgetGenero 
					generos={generosDisponibles}
					seleccionados={generosSeleccionados}
					onSelect={manejarSeleccionGenero}
				/>

				<WidgetDecada 
					decadaSeleccionada={decadaSeleccionada}
					onSelect={manejarSeleccionDecada}
				/>

				<WidgetPopularidad
					popularidadSeleccionada={popularidadSeleccionada}
					onSelect={manejarSeleccionPopularidad}
				/>

				<button 
					type="button" 
					onClick={generarPlaylist} 
					disabled={cargando}
					className={styles.botonGenerar}
				>
					{cargando ? 'Generando...' : 'Generar Playlist'}
				</button>

				{mensaje && (
					<div className={styles.mensaje}>
						{mensaje}
					</div>
				)}

				<VisualizadorPlaylist playlist={playlist} onQuitar={quitarCancion} />
			</main>
		</div>
	);
}
