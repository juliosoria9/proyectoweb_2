'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getAccessToken } from '@/lib/auth';
import Encabezado from '@/components/Encabezado';
import styles from './page.module.css';

export default function FavoritosPage() {
	const router = useRouter();
	const [ready, setReady] = useState(false);
	const [favoritos, setFavoritos] = useState([]);
	const [cargando, setCargando] = useState(true);

	useEffect(function() {
		if (!isAuthenticated()) {
			router.push('/');
			return;
		}
		setReady(true);
		cargarFavoritos();
	}, [router]);

	async function cargarFavoritos() {
		const guardados = localStorage.getItem('favorite_tracks');
		if (!guardados) {
			setCargando(false);
			return;
		}

		const listaIds = JSON.parse(guardados);
		if (listaIds.length === 0) {
			setCargando(false);
			return;
		}

		const token = getAccessToken();
		if (!token) {
			setCargando(false);
			return;
		}

		try {
			const url = 'https://api.spotify.com/v1/tracks?ids=' + listaIds.join(',');
			const respuesta = await fetch(url, {
				headers: { 'Authorization': 'Bearer ' + token }
			});

			if (!respuesta.ok) {
				setCargando(false);
				return;
			}

			const datos = await respuesta.json();
			const canciones = [];
			
			for (let i = 0; i < datos.tracks.length; i++) {
				const track = datos.tracks[i];
				if (!track) {
					continue;
				}
				
				let nombreArtista = 'Desconocido';
				if (track.artists && track.artists.length > 0) {
					nombreArtista = track.artists[0].name;
				}
				
				let imagenAlbum = '';
				if (track.album && track.album.images && track.album.images.length > 0) {
					imagenAlbum = track.album.images[0].url;
				}
				
				const cancion = {
					id: track.id,
					name: track.name,
					artist: nombreArtista,
					image: imagenAlbum
				};
				
				canciones.push(cancion);
			}

			setFavoritos(canciones);
		} catch (error) {
			console.log('Error:', error);
		}

		setCargando(false);
	}

	function quitarFavorito(idCancion) {
		const nuevaLista = [];
		for (let i = 0; i < favoritos.length; i++) {
			if (favoritos[i].id !== idCancion) {
				nuevaLista.push(favoritos[i]);
			}
		}
		setFavoritos(nuevaLista);

		const guardados = localStorage.getItem('favorite_tracks');
		if (guardados) {
			const listaIds = JSON.parse(guardados);
			const nuevosIds = [];
			for (let i = 0; i < listaIds.length; i++) {
				if (listaIds[i] !== idCancion) {
					nuevosIds.push(listaIds[i]);
				}
			}
			localStorage.setItem('favorite_tracks', JSON.stringify(nuevosIds));
		}
	}

	function renderizarCancion(cancion) {
		function handleQuitar() {
			quitarFavorito(cancion.id);
		}
		
		return (
			<div key={cancion.id} className={styles.tarjeta}>
				<div className={styles.imagenContainer}>
					{cancion.image && (
						<img 
							src={cancion.image} 
							alt={cancion.name}
							width="64"
							height="64"
							className={styles.imagen}
						/>
					)}
				</div>

				<div className={styles.info}>
					<div className={styles.nombre}>{cancion.name}</div>
					<div className={styles.artista}>{cancion.artist}</div>
				</div>

				<div className={styles.acciones}>
					<span className={styles.iconoFavorito}>⭐</span>
					<button 
						type="button"
						onClick={handleQuitar}
						className={styles.botonQuitar}
					>
						Quitar
					</button>
				</div>
			</div>
		);
	}

	if (!ready) {
		return <div>Cargando...</div>;
	}

	return (
		<div>
			<Encabezado 
				titulo="Mis Favoritos ⭐" 
				mostrarAtras={true}
				mostrarDashboard={true}
			/>

			<main className={styles.main}>
				{cargando && (
					<div className={styles.cargandoContenedor}>
						<div className={styles.spinner}></div>
						<p className={styles.cargandoTexto}>Cargando tus canciones favoritas...</p>
					</div>
				)}

				{!cargando && favoritos.length === 0 && (
					<div className={styles.vacio}>
						<div className={styles.iconoVacio}>⭐</div>
						<h2>Sin favoritos aún</h2>
						<p>Comienza a marcar tus canciones favoritas desde el generador de playlists.</p>
						<p className={styles.ayuda}>Busca el ícono de estrella (☆) en cada canción</p>
					</div>
				)}

				{!cargando && favoritos.length > 0 && (
					<div>
						<div className={styles.header}>
							<h2 className={styles.titulo}>
								{favoritos.length} {favoritos.length === 1 ? 'Canción' : 'Canciones'}
							</h2>
						</div>
						<div className={styles.lista}>
							{favoritos.map(renderizarCancion)}
						</div>
					</div>
				)}

			</main>
		</div>
	);
}
