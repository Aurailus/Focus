let theme = {
	/** 0: none, 1: quarter, 2: hours, 3: hours + minute */
	notches: 3,
	/** False: don't display, True: display */
	events: true,
	/** False: don't show minute hand, True: show minute hand */
	minutes: true,
	/** False: don't show center glow, True: show center glow  */
	glow: true,
	/** Center glow color. */
	glow_a: '#4294ff',
	/** Moving glow 1 color. */
	glow_b: 'rgba(5, 124, 242, 0.6)',
	/** Moving glow 2 color. */
	glow_c: 'rgba(198, 0, 237, 1)',
	// /** Center glow color. */
	// glow_a: '#e838ff',
	// /** Moving glow 1 color. */
	// glow_b: 'rgba(255, 38, 56, 0.6)',
	// /** Moving glow 2 color. */
	// glow_c: 'rgba(179, 38, 255, 1)',
}

let image_loaded = false;
let window_loaded = false;

window.onload = () => {
	window_loaded = true;
	if (image_loaded) init();
};

const glow_image = document.createElement('img');
glow_image.src = 'res/glow.png';
glow_image.onload = () => {
	image_loaded = true;
	if (window_loaded) init();
};

const glow_canvas = document.createElement('canvas');
glow_canvas.width = 128;
glow_canvas.height = 128;
const glow_ctx = glow_canvas.getContext('2d')!;

function init() {
	const canvas = document.querySelector('canvas')!;
	const ctx = canvas.getContext('2d')!;
	canvas.width = document.body.clientWidth;
	canvas.height = canvas.width;
	const clockRadius = document.body.clientWidth / 2;

	let rot = 0;
	let ambient = false;

	const EVENT_WIDTH = 22;
	let EVENT_BUFFER = theme.notches === 0 ? 2 : 14;
	const TITLE_BUFFER = 2;
	const TITLE_SIZE = 16;
	const NOTCH_BUFFER = 2;
	const DATE_SIZE = 20;

	const COLOR_LIGHT_DIM = 'rgba(65, 199, 232, 0.15)';
	const COLOR_LIGHT_OVERLAY = 'rgba(65, 199, 232, 0.33)';
	const COLOR_MINUTE_HAND = 'rgba(65, 199, 232, 0.8)';

	const degToRad = (deg: number) => deg * (Math.PI / 180);

	const createDate = (hour: number, minute: number) => {
		const date = new Date();
		date.setHours(hour, minute, 0);
		return date;
	};

	const events = [
		{ start: createDate(9, 30), end: createDate(11, 20), color: '#33B679', title: 'PAAS' },
		{ start: createDate(12, 30), end: createDate(1, 20), color: '#33B679', title: 'STAT' },
		{ start: createDate(1, 30), end: createDate(2, 20), color: '#33B679', title: 'MATH' }
		// { start: createDate(9, 30), end: createDate(11, 20), color: '#59acff', title: 'Work' },
		// { start: createDate(12, 30), end: createDate(1, 20), color: '#59acff', title: 'Walk' },
		// { start: createDate(1, 30), end: createDate(2, 20), color: '#59acff', title: 'Bike' }
	];

	function getTime() {
		try { return tizen.time.getCurrentDateTime(); }
		catch (e) { return new Date(); }
	}

	function drawCircle(angle: number, distance: number, width: number, color: string) {
			ctx.save();
			ctx.translate(canvas.width / 2, canvas.height / 2);
			ctx.rotate(angle)

			ctx.beginPath();
			ctx.arc(distance, 0, width / 2, 0, 2 * Math.PI, false);
			ctx.fillStyle = color;
			ctx.fill();
			ctx.closePath();

			ctx.restore();
	}

	// function drawLine(startDistance, endDistance, angle, width, color) {
	// 	ctx.save();
	// 	ctx.translate(canvas.width / 2, canvas.height / 2);
	// 	ctx.rotate(degToRad(angle + 90));

	// 	ctx.beginPath();
	// 	ctx.lineWidth = width;
	// 	ctx.strokeStyle = color;
	// 	ctx.moveTo(startDistance, 0);
	// 	ctx.lineTo(endDistance, 0);
	// 	ctx.stroke();
	// 	ctx.closePath();

	// 	ctx.restore();
	// }

	function drawRoundedRect(startDistance: number, endDistance: number, angle: number, width: number,
		fill?: string, stroke?: string, strokeWidth?: number) {
		ctx.save();
		ctx.translate(canvas.width / 2, canvas.height / 2);
		ctx.rotate(angle);

		ctx.beginPath();
		ctx.moveTo(-width / 2, startDistance);
		ctx.lineTo(-width / 2, endDistance);
		ctx.quadraticCurveTo(-width / 2, endDistance + width / 1.5, 0, endDistance + width / 1.5);
		ctx.quadraticCurveTo(width / 2, endDistance + width / 1.5, width / 2, endDistance);
		ctx.lineTo(width / 2, startDistance);
		ctx.quadraticCurveTo(width / 2, startDistance - width / 1.5, 0, startDistance - width / 1.5);
		ctx.quadraticCurveTo(-width / 2, startDistance - width / 1.5, -width / 2, startDistance);
		ctx.closePath();

		if (fill) {
			ctx.fillStyle = fill;
			ctx.fill();
		}

		if (stroke && strokeWidth) {
			ctx.strokeStyle = stroke;
			ctx.lineWidth = strokeWidth;
			ctx.stroke();
		}

		ctx.restore()
	}

	function drawEvent(event: any) {
		const startAngle = degToRad(((event.start.getHours() % 12) +
			event.start.getMinutes() / 60) / 12 * 360 + EVENT_WIDTH / 6 - 90);
		const endAngle = degToRad(((event.end.getHours() % 12) +
			event.end.getMinutes() / 60) / 12 * 360 - EVENT_WIDTH / 8 - 90);

		ctx.save();
		ctx.translate(canvas.width / 2, canvas.height / 2);

		ctx.beginPath();
		ctx.fillStyle = COLOR_LIGHT_DIM;

		ctx.arc(0, 0, clockRadius - EVENT_BUFFER, startAngle, endAngle, false);

		let controlPosX = Math.cos(endAngle + degToRad(4.25)) * (clockRadius - EVENT_BUFFER);
		let controlPosY = Math.sin(endAngle + degToRad(4.25)) * (clockRadius - EVENT_BUFFER);
		let endPosX = Math.cos(endAngle + degToRad(4.25)) * (clockRadius - EVENT_BUFFER - EVENT_WIDTH / 2);
		let endPosY = Math.sin(endAngle + degToRad(4.25)) * (clockRadius - EVENT_BUFFER - EVENT_WIDTH / 2);

		ctx.quadraticCurveTo(controlPosX, controlPosY, endPosX, endPosY);

		controlPosX = Math.cos(endAngle + degToRad(4.25)) * (clockRadius - EVENT_BUFFER - EVENT_WIDTH);
		controlPosY = Math.sin(endAngle + degToRad(4.25)) * (clockRadius - EVENT_BUFFER - EVENT_WIDTH);
		endPosX = Math.cos(endAngle) * (clockRadius - EVENT_BUFFER - EVENT_WIDTH);
		endPosY = Math.sin(endAngle) * (clockRadius - EVENT_BUFFER - EVENT_WIDTH);

		ctx.quadraticCurveTo(controlPosX, controlPosY, endPosX, endPosY);

		ctx.arc(0, 0, clockRadius - EVENT_BUFFER - EVENT_WIDTH, endAngle, startAngle, true);

		controlPosX = Math.cos(startAngle - degToRad(4.25)) * (clockRadius - EVENT_BUFFER - EVENT_WIDTH);
		controlPosY = Math.sin(startAngle - degToRad(4.25)) * (clockRadius - EVENT_BUFFER - EVENT_WIDTH);
		endPosX = Math.cos(startAngle - degToRad(4.25)) * (clockRadius - EVENT_BUFFER - EVENT_WIDTH / 2);
		endPosY = Math.sin(startAngle - degToRad(4.25)) * (clockRadius - EVENT_BUFFER - EVENT_WIDTH / 2);

		ctx.quadraticCurveTo(controlPosX, controlPosY, endPosX, endPosY);

		controlPosX = Math.cos(startAngle - degToRad(4.25)) * (clockRadius - EVENT_BUFFER);
		controlPosY = Math.sin(startAngle - degToRad(4.25)) * (clockRadius - EVENT_BUFFER);
		endPosX = Math.cos(startAngle) * (clockRadius - EVENT_BUFFER);
		endPosY = Math.sin(startAngle) * (clockRadius - EVENT_BUFFER);

		ctx.quadraticCurveTo(controlPosX, controlPosY, endPosX, endPosY);

		ctx.fill();
		ctx.closePath();

		ctx.restore();

		drawCircle(startAngle, clockRadius - EVENT_BUFFER - EVENT_WIDTH / 2, EVENT_WIDTH - 8, event.color);

		ctx.font = `900 ${TITLE_SIZE}px Arial sans-serif`;
		ctx.fillStyle = '#fff';
		ctx.textBaseline = 'top';
		ctx.textAlign = 'center';

		let currentAngle = startAngle + degToRad(96);
		for (let i = 0; i < event.title.length; i++) {
			ctx.save();
			ctx.translate(canvas.width / 2, canvas.height / 2);
			ctx.rotate(currentAngle);

			ctx.fillText(event.title[i], 0, -(clockRadius - EVENT_BUFFER - TITLE_BUFFER));

			ctx.restore();
			if (i < event.title.length - 1)
				currentAngle += ctx.measureText(event.title[i]).width * 0.0065 / 2
											+ ctx.measureText(event.title[i + 1]).width * 0.0065 / 2;
		}
	}

	function drawGlow(offsetX: number, offsetY: number, scaleMult: number, color: string) {
		glow_ctx.fillStyle = color;
		glow_ctx.globalCompositeOperation = 'source-over';
		glow_ctx.fillRect(0, 0, glow_canvas.width, glow_canvas.height);
		glow_ctx.globalCompositeOperation = 'destination-in';
		glow_ctx.drawImage(glow_image, 0, 0);

		const scale = 240 * scaleMult;

		ctx.drawImage(glow_canvas,
			canvas.width / 2 + offsetX - scale / 2,
			canvas.height / 2 + offsetY - scale / 2,
			scale, scale);
	}

	function drawWatchFace() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		const time = getTime();

		ctx.font = `900 ${DATE_SIZE}px Arial sans-serif`;
		ctx.fillStyle = '#aaa';
		ctx.textBaseline = 'bottom';
		ctx.textAlign = 'center';

		ctx.fillText(`${['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][time.getDay()]} ${time.getDate()}`,
			clockRadius, clockRadius + clockRadius / 1.75);

		ctx.fillStyle = '#666'
		ctx.fillRect(clockRadius - 1 * DATE_SIZE, clockRadius + clockRadius / 1.75 + 2, 2 * DATE_SIZE, 2);

		if (!ambient) {
			rot = (rot + 1) % 360;

			let scaleA = 1 + (Math.sin(degToRad(rot + 180)) / 6);
			let scaleB = 1 + (Math.cos(degToRad(rot)) / 6);
			let scaleC = 1.3 + (Math.cos(degToRad(rot - 90)) / 6);
			let offsetX = Math.cos(degToRad(rot + 90)) * 50 + (1 - scaleA);
			let offsetY = Math.sin(degToRad(rot + 90)) * 50 + (1 - scaleB);

			if (theme.glow) {
				ctx.globalCompositeOperation = 'lighter';
				drawGlow(-offsetX, -offsetY, scaleA, theme.glow_b);
				drawGlow(0, 0, scaleC, theme.glow_a);
				drawGlow(offsetX, offsetY, scaleB, theme.glow_c);
				ctx.globalCompositeOperation = 'source-over';
			}

			if (theme.notches) {
				for (let i = 0; i < 12 * 5; i++) {
					if (i % 15 === 0)
						drawCircle(degToRad(i / (12 * 5) * 360 - 90), clockRadius - NOTCH_BUFFER - 4, 8, COLOR_MINUTE_HAND)
					else if (i % 5 === 0 && theme.notches >= 2)
						drawCircle(degToRad(i / (12 * 5) * 360 - 90), clockRadius - NOTCH_BUFFER - 4, 6, COLOR_LIGHT_OVERLAY)
					else if (theme.notches >= 3)
						drawCircle(degToRad(i / (12 * 5) * 360 - 90), clockRadius - NOTCH_BUFFER - 4, 4, COLOR_LIGHT_DIM)
				}
			}
		}

		if (theme.events) {
			for (let event of events) {
				drawEvent(event);
			}
		}

		drawCircle(0, 0, 36, COLOR_LIGHT_OVERLAY);
		drawCircle(0, 0, 20, '#fff');

		if (theme.minutes) {
			const minuteAngle = degToRad((time.getMinutes() + time.getSeconds() / 60) / 60 * 360 - 180);
			drawRoundedRect(34, clockRadius - 64, minuteAngle, 16, COLOR_MINUTE_HAND, undefined, undefined);
		}

		const hourAngle = degToRad(((time.getHours() % 12) + time.getMinutes() / 60) / 12 * 360 - 180);
		drawRoundedRect(36, clockRadius - 80, hourAngle, 16, 'rgba(0, 0, 0, 0.15)', '#fff', 4);

		if (!ambient) setTimeout(() => window.requestAnimationFrame(drawWatchFace), 1000/10);
	}

	window.requestAnimationFrame(drawWatchFace);

	window.addEventListener('timetick', drawWatchFace);

	window.addEventListener('ambientmodechanged', (e: any) => {
		ambient = e.detail.ambientMode;
		drawWatchFace();
	});

	document.addEventListener('visibilitychange', () => {
		if (!document.hidden) drawWatchFace();
	});
}
