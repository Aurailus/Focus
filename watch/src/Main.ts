import Artist from './Artist';
import Watch from './Watch';

/**
 * Main entrypoint to the watchface.
 */

(async () => {
	await new Promise<void>((resolve) =>
		window.onload = () => resolve());

	const canvas = document.querySelector('canvas')!;
	canvas.width = document.body.clientWidth;
	canvas.height = canvas.width;

	const artist = new Artist(canvas);
	await artist.init();

	new Watch(artist);
})();
