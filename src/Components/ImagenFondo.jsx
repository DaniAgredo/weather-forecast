import React, { useState, useEffect } from 'react';

const urlApi = `https://api.unsplash.com/photos/random?client_id=qggyIoB6pMTlV2NkDUtujZpgdYD0ZPI5mtRTEUhCSFI&query=weather`;

const ImagenFondo = () => {
	const [imagen, setImagen] = useState('');
	const [cargando, setCargando] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const obtenerImagenFondo = async () => {
			try {
				const respuesta = await fetch(urlApi);
				const datos = await respuesta.json();
				setImagen(datos.urls.regular);
				setCargando(false);
			} catch (error) {
				console.error('Error:', error);
				setError(error);
				setCargando(false);
			}
		};

		const imagenAlmacenada = localStorage.getItem('imagenFondo');
		if (imagenAlmacenada) {
			setImagen(imagenAlmacenada);
			setCargando(false);
		} else {
			obtenerImagenFondo();
		}

		const intervalo = setInterval(obtenerImagenFondo, 600000); // 1 minuto

		return () => clearInterval(intervalo);
	}, []);

	if (cargando) {
		return <div>Cargando...</div>;
	}

	return (
		<div
			className="imagen-fondo"
			style={{
				backgroundImage: imagen ? `url(${imagen})` : 'none',
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				height: '100vh',
				width: '100vw',
				position: 'fixed',
				top: 0,
				left: 0,
				zIndex: -1,
			}}
		/>
	);
};

export default ImagenFondo;
