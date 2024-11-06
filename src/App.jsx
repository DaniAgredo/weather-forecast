import React, { useState, useEffect } from 'react';
import ImagenFondo from './Components/ImagenFondo';
import './App.css';

function App() {
	const [clima, setClima] = useState(null);
	const [pronostico, setPronostico] = useState(null);
	const [unidad, setUnidad] = useState('C');
	const [recomendacionesGeneradas, setRecomendacionesGeneradas] = useState({});
	const [cargando, setCargando] = useState(true);

	const apiKey = 'ea72d129d85e7c0a5d8fbdc66d867f46';
	const recomendacionesClima = {
		Rain: [
			'Lleva paraguas y ropa impermeable',
			'Evita caminar en áreas inundadas',
			'Mantente informado sobre el pronóstico',
		],
		Clouds: [
			'Usa bloqueador solar y gafas de sol',
			'Disfruta del aire fresco',
			'No te olvides la crema solar',
		],
		Clear: [
			'Disfruta del sol y no te olvides la crema solar',
			'Usa ropa ligera y cómoda',
			'Perfecto día para hacer ejercicio',
		],
		Snow: [
			'Abrecha con ropa cálida y guantes',
			'Usa zapatos cómodos y resbalosos',
			'Mantente informado sobre el pronóstico',
		],
		Thunderstorm: [
			'Evita salir y mantente informado',
			'Mantén dispositivos electrónicos alejados del agua',
			'No te acerques a cables eléctricos',
		],
		Drizzle: [
			'Lleva chaqueta impermeable y zapatos cómodos',
			'Evita caminar en áreas resbalosas',
			'Mantente informado sobre el pronóstico',
		],
	};

	useEffect(() => {
		navigator.geolocation.getCurrentPosition((position) => {
			const lat = position.coords.latitude;
			const lon = position.coords.longitude;
			obtenerClima(lat, lon);
			obtenerPronostico(lat, lon);
		});
	}, []);

	useEffect(() => {
		if (pronostico) {
			const generarRecomendaciones = () => {
				const recomendaciones = {};
				pronostico.list.slice(0, 7).forEach((dia, index) => {
					recomendaciones[dia.dt] =
						recomendacionesClima[dia.weather[0].main][
							Math.floor(
								Math.random() *
									recomendacionesClima[dia.weather[0].main].length,
							)
						];
				});
				setRecomendacionesGeneradas(recomendaciones);
			};
			generarRecomendaciones();
			setCargando(false);
		}
	}, [pronostico]);

	const obtenerClima = (lat, lon) => {
		fetch(
			`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
		)
			.then((response) => response.json())
			.then((data) => {
				setClima(data);
			})
			.catch((error) => {
				console.error('Error al obtener clima:', error);
			});
	};

	const obtenerPronostico = (lat, lon) => {
		fetch(
			`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
		)
			.then((response) => response.json())
			.then((data) => {
				setPronostico(data);
			})
			.catch((error) => {
				console.error('Error al obtener pronóstico:', error);
			});
	};

	const cambiarUnidad = () => {
		setUnidad(unidad === 'C' ? 'F' : 'C');
	};

	if (cargando) {
		return <div>Cargando...</div>;
	}

	return (
		<div>
			<ImagenFondo />
			<div className="contenedor">
				<h1 className="titulo">El Clima En Tu Zona Es:</h1>
				{clima ? (
					<div>
						<div className="info-clima">
							<div className="datos-clima">
								<p>
									Ubicación: {clima.name}, {clima.sys.country}
								</p>
								<p>Condición: {clima.weather[0].description}</p>
								<p>
									Temperatura:{' '}
									{unidad === 'C'
										? clima.main.temp
										: (clima.main.temp * 9) / 5 + 32}{' '}
									{unidad}
								</p>
							</div>
							<div className="icono-clima">
								<img
									src={`http://openweathermap.org/img/wn/${clima.weather[0].icon}@2x.png`}
									alt={`Icono del clima: ${clima.weather[0].description}`}
								/>
								<span>{clima.weather[0].main}</span>
							</div>
						</div>
						<div className="botones-internos">
							<button className="boton-cambiar-unidad" onClick={cambiarUnidad}>
								{unidad === 'C' ? 'Celsius' : 'Fahrenheit'}
							</button>
						</div>
					</div>
				) : (
					<p>No hay datos del clima</p>
				)}
			</div>

			{pronostico && (
				<div className="pronostico-externo">
					<h2 className="pronostico-titulo-texto">
						Pronóstico para los próximos días
					</h2>
					<div className="pronostico-dias">
						{pronostico.list.slice(0, 7).map((dia, index) => (
							<div key={dia.dt} className="tarjeta-clima">
								<h3>
									{
										[
											'Lunes',
											'Martes',
											'Miércoles',
											'Jueves',
											'Viernes',
											'Sábado',
											'Domingo',
										][index]
									}
								</h3>
								<img
									src={`http://openweathermap.org/img/wn/${dia.weather[0].icon}@2x.png`}
									alt={`Icono del clima: ${dia.weather[0].description}`}
								/>
								<p>{recomendacionesGeneradas[dia.dt]}</p>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}

export default App;
