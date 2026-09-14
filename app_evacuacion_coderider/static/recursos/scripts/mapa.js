const reproductor = document.querySelector('#music-player');
const botonReproducir = document.querySelector('#play-button');
const tituloActual = document.querySelector('#now-title');
const artistaActual = document.querySelector('#now-artist');
const portadaActual = document.querySelector('#mini-cover');
const barraProgreso = document.querySelector('.progress-line span');
const tarjetas = document.querySelectorAll('[data-src]');

let cancionSeleccionada = false;

function cargarCancion(tarjeta) {
	if (!reproductor || !tarjeta) return;

	reproductor.src = tarjeta.dataset.src;
	tituloActual.textContent = tarjeta.dataset.title;
	artistaActual.textContent = tarjeta.dataset.artist;
	portadaActual.textContent = tarjeta.querySelector('.cover')?.textContent || '◒';
	portadaActual.className = `mini-cover ${tarjeta.querySelector('.cover')?.className || ''}`;
	cancionSeleccionada = true;
	reproductor.play().then(() => {
		botonReproducir.textContent = 'Ⅱ';
	}).catch(() => {
		botonReproducir.textContent = '▶';
	});
}

tarjetas.forEach((tarjeta) => {
	tarjeta.addEventListener('click', () => cargarCancion(tarjeta));
});

botonReproducir?.addEventListener('click', () => {
	if (!cancionSeleccionada) {
		cargarCancion(tarjetas[0]);
		return;
	}

	if (reproductor.paused) {
		reproductor.play().then(() => { botonReproducir.textContent = 'Ⅱ'; });
	} else {
		reproductor.pause();
		botonReproducir.textContent = '▶';
	}
});

reproductor?.addEventListener('play', () => { botonReproducir.textContent = 'Ⅱ'; });
reproductor?.addEventListener('pause', () => { botonReproducir.textContent = '▶'; });
reproductor?.addEventListener('timeupdate', () => {
	if (reproductor.duration) barraProgreso.style.width = `${(reproductor.currentTime / reproductor.duration) * 100}%`;
});
