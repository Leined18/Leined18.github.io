const btn = document.getElementById('movingBtn');
let pos = 0;
const interval = 10;
const step = 2;

btn.addEventListener('click', () => {
	const containerWidth = document.getElementById('button-container').offsetWidth;
	const btnWidth = btn.offsetWidth;

	const move = setInterval(() => {
		if (pos + btnWidth >= containerWidth) {
			clearInterval(move);
			alert('¡Botón ha llegado al final! 🎉');
		} else {
			pos += step;
			btn.style.left = pos + 'px';
		}
	}, interval);
});
