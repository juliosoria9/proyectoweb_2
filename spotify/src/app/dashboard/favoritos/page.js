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
				{cancion.image && (
					<img 
						src={cancion.image} 
						alt={cancion.name}
						width="60"
						height="60"
						className={styles.imagen}
					/>
				)}

				<div className={styles.info}>
					<div className={styles.nombre}>{cancion.name}</div>
					<div className={styles.artista}>{cancion.artist}</div>
				</div>

				<button 
					type="button"
					onClick={handleQuitar}
					className={styles.botonQuitar}
				>
					Quitar ⭐
				</button>
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
				{cargando && <p>Cargando favoritos...</p>}

				{!cargando && favoritos.length === 0 && (
					<p>No tienes canciones favoritas. Añade algunas con la estrella ⭐</p>
				)}

				{!cargando && favoritos.length > 0 && (
					<div className={styles.lista}>
						{favoritos.map(renderizarCancion)}
					</div>
				)}

			</main>
		</div>
	);
}
