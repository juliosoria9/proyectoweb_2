'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getAccessToken } from '@/lib/auth';
import Encabezado from '@/components/Encabezado';
import WidgetGenero from '@/components/widgets/WidgetGenero';
import VisualizadorPlaylist from '@/components/VisualizadorPlaylist';
import styles from './page.module.css';

export default function DashboardPage() {
	const router = useRouter();
	const [ready, setReady] = useState(false);

	// Lista de generos disponibles
	const generosDisponibles = ['rock', 'pop', 'jazz', 'hip-hop', 'electronic', 'indie', 'folk', 'metal'];

	// Estado del generador
	const [generosSeleccionados, setGenerosSeleccionados] = useState([]);
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
			// TODO: Llamar a Spotify search por ca genero
			const cancionesEjemplo = [
				{ id: '1', name: 'Canción 1', artist: 'Artista 1', image: 'https://via.placeholder.com/50' },
				{ id: '2', name: 'Canción 2', artist: 'Artista 2', image: 'https://via.placeholder.com/50' },
				{ id: '3', name: 'Canción 3', artist: 'Artista 3', image: 'https://via.placeholder.com/50' },
			];

			setPlaylist(cancionesEjemplo);
			setMensaje('Playlist generada (datos de prueba).');
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
