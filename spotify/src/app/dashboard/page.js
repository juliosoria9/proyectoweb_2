'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, logout } from '@/lib/auth';

export default function DashboardPage() {
	const router = useRouter();
	const [ready, setReady] = useState(false);

	useEffect(() => {
		// Si no hay token, vuelve al inicio
		if (!isAuthenticated()) {
			router.push('/');
			return;
		}
		setReady(true);
	}, [router]);

	if (!ready) {
		return <div>Cargando...</div>;
	}

	return (
		<div>
			<h1>Dashboard</h1>
			<p>Aqui ira el panel con widgets y playlist.</p>
			<button type="button" onClick={() => { logout(); router.push('/'); }}>
				Cerrar sesión
			</button>
		</div>
	);
}
