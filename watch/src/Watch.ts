import Artist from './Artist';
import { degToRad } from './Util';
import { getEvents, Event } from './Events';
import { getTheme, NotchMode, Theme } from './Theme';
import { ComplicationType } from './Complication';
// import connect from './Service';

const NOTCH_MINUTE_COLOR = 'rgba(65, 199, 232, 0.15)';
const NOTCH_HOUR_COLOR = 'rgba(65, 199, 232, 0.33)';
const NOTCH_QUARTER_COLOR = 'rgba(65, 199, 232, 0.5)';

/** The distance that elements should be away from the screen edge in addition to OUTER_BUFFER if notches are drawn. */
const NOTCH_BUFFER = 12;

/** The text size of the day. */
const DAY_SIZE = 20;

/** The text size of the date. */
const DATE_SIZE = 24;

/**
 * Handles app events, drawing using the artist, ambient mode, and watch <-> companion communication.
 */

export default class Watch {
	private theme: Theme;
	private events: Event[];

	private ambient: boolean;
	private animStep: number;
	private animReq?: number;
	private animTimeout?: number;

	constructor(private artist: Artist) {
		this.animStep = 0;
		this.ambient = false;
		this.theme = getTheme();
		this.events = getEvents();

		// connect();

		/** Triggered only in ambient mode. */
		window.addEventListener('timetick', () => this.draw());

		/** Update variables and redraw when the ambient mode changes. */
		window.addEventListener('ambientmodechanged', (e: any) => {
			const ambient = e.detail.ambientMode;
			if (this.ambient === ambient) return;
			this.ambient = ambient;
			this.draw();
		});

		/** Immediately rerender when the visibility state chanegs. */
		document.addEventListener('visibilitychange', () => {
			if (!document.hidden) this.draw();
		});

		this.draw();
	}

	/**
	 * Clears pending draws.
	 */

	private clearPendingDraw() {
		if (this.animTimeout !== undefined) window.clearTimeout(this.animTimeout);
		this.animTimeout = undefined;
		if (this.animReq !== undefined) window.cancelAnimationFrame(this.animReq);
		this.animReq = undefined;
	}

	private getTime() {
		try { return tizen.time.getCurrentDateTime(); }
		catch (e) { return new Date(); }
	}

	/**
	 *
	 * @param pos - The position of the complication, starting at 0 for the top and moving 90 degrees per number increase.
	 */

	private drawComplication(pos: number, type: ComplicationType, style: number) {
		const { artist } = this;

		const offsetScale = artist.radius / 2;
		const angle = degToRad(pos * 90);
		const x = Math.cos(angle - degToRad(90)) * offsetScale;
		const y = Math.sin(angle - degToRad(90)) * offsetScale;

		if (style > 0) artist.circle(angle, offsetScale, 40,
			style === 2 ? (this.ambient ? '#aaa' : '#777') : undefined,
			style === 1 ? (this.ambient ? '#777' : '#444') : undefined, 3);

		artist.ctx.save();
		artist.ctx.translate(artist.radius, artist.radius);

		const alpha = (v: number, v2?: number) => style > 1
			? `rgba(0, 0, 0, ${(style < 2 && v2 || v) * (this.ambient ? 2 : 1)})`
			: `rgba(255, 255, 255, ${(style < 2 && v2 || v) * (this.ambient ? 2 : 1)})`;

		switch (type) {
		case 'date':
			const time = this.getTime();

			artist.ctx.font = `900 ${DAY_SIZE}px Arial sans-serif`;
			artist.ctx.fillStyle = alpha(.9, .7);
			artist.ctx.textBaseline = 'bottom';
			artist.ctx.textAlign = 'center';

			artist.ctx.fillText(`${['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][time.getDay()]}`, x, y - 2);

			artist.ctx.fillStyle = alpha(.6, .2);
			artist.ctx.fillRect(x - DAY_SIZE, y - 1, 2 * DAY_SIZE, 3);

			artist.ctx.fillStyle = alpha(.9, .7);
			artist.ctx.font = `900 ${DATE_SIZE}px Arial sans-serif`;
			artist.ctx.fillText(`${time.getDate()}`, x, y + 31);

			break;

		case 'battery':
			const battery = 50;

			artist.ctx.drawImage(artist.icons.battery, x - 18, y - 18 - 14, 36, 36);

			artist.ctx.font = '900 24px Arial sans-serif';
			artist.ctx.textBaseline = 'top';
			artist.ctx.textAlign = 'center';
			artist.ctx.fillStyle = alpha(.9, .7);
			artist.ctx.fillText(battery.toString(), x, y + 4);

			break;

		case 'steps':
			const steps = 1800;

			artist.ctx.drawImage(artist.icons.steps, x - 18, y - 18 - 14, 36, 36);

			artist.ctx.font = '900 22px Arial sans-serif';
			artist.ctx.textBaseline = 'top';
			artist.ctx.textAlign = 'center';
			artist.ctx.fillStyle = alpha(.9, .7);
			artist.ctx.fillText(steps.toString(), x, y + 4);

			break;

		case 'heartrate':
			const heartrate = 85;

			artist.ctx.drawImage(artist.icons.heart, x - 18, y - 18 - 14, 36, 36);

			artist.ctx.font = '900 24px Arial sans-serif';
			artist.ctx.textBaseline = 'top';
			artist.ctx.textAlign = 'center';
			artist.ctx.fillStyle = alpha(.9, .7);
			artist.ctx.fillText(heartrate.toString(), x, y + 4);

			break;

		default:
			break;
		}

		artist.ctx.restore();
	}

	private draw() {
		const { artist, theme, events } = this;

		this.clearPendingDraw();
		artist.clear();

		const time = this.getTime();

		for (let i = 0; i < 4; i++) {
			let complication = theme.complications[i];
			if (complication === null) continue;
			this.drawComplication(i, complication.type, complication.style);
		}

		if (!this.ambient && theme.showGlow) {
			this.animStep = (this.animStep + 1) % 360;

			let scaleA = 0.8 + (Math.sin(degToRad(this.animStep + 180)) / 6);
			let scaleB = 0.8 + (Math.cos(degToRad(this.animStep)) / 6);
			let scaleC = 1.2 + (Math.sin(degToRad((this.animStep * 3) + 90)) / 6);
			let offset = Math.cos(degToRad(this.animStep * 3)) * 50;

			artist.ctx.globalCompositeOperation = 'lighter';
			artist.glow(degToRad(this.animStep), offset, scaleA, theme.glowColors[1]);
			artist.glow(0, 0, scaleC, theme.glowColors[0]);
			artist.glow(degToRad(this.animStep + 180), offset, scaleB, theme.glowColors[2]);
			artist.ctx.globalCompositeOperation = 'source-over';
		}

		const notchMode = this.ambient ? theme.notchModeAmbient : theme.notchMode;
		const outerBuffer = theme.notchModeAmbient === NotchMode.NONE ? 2 : 8;

		if (notchMode !== NotchMode.NONE) {
			for (let i = 0; i < 12 * 5; i++) {
				if ((i % 5 === 0 && notchMode >= NotchMode.HOURS) || (i % 15 === 0 && notchMode >= NotchMode.QUARTERS)) {
					artist.circle(degToRad(i / (12 * 5) * 360 - 90),
						artist.radius - outerBuffer - 4, 3,
						this.ambient ? NOTCH_QUARTER_COLOR : NOTCH_HOUR_COLOR);
				}
				else if (notchMode >= NotchMode.MINUTES) {
					artist.circle(degToRad(i / (12 * 5) * 360 - 90),
						artist.radius - outerBuffer - 4, 2,
						this.ambient ? NOTCH_HOUR_COLOR : NOTCH_MINUTE_COLOR);
				}
			}
		}

		if (theme.showEvents) {
			for (let event of events) {
				let eventBuffer = outerBuffer + (theme.notchMode !== NotchMode.NONE ? NOTCH_BUFFER : 0);
				artist.event(event, artist.radius - eventBuffer);
			}
		}

		artist.circle(0, 0, 18, NOTCH_HOUR_COLOR);
		artist.circle(0, 0, 10, '#fff');

		if (theme.showMinutes) {
			const minuteAngle = degToRad((time.getMinutes() + time.getSeconds() / 60) / 60 * 360 - 180);
			artist.rounded(minuteAngle, 38, artist.radius - 56, 12, NOTCH_QUARTER_COLOR);
		}

		const hourAngle = degToRad(((time.getHours() % 12) + time.getMinutes() / 60) / 12 * 360 - 180);
		artist.rounded(hourAngle, 42, artist.radius - 80, 16,
			'rgba(0, 0, 0, 0.15)', '#fff', 4);

		if (!this.ambient) this.animTimeout = setTimeout(() =>
			this.animReq = window.requestAnimationFrame(() => this.draw()),
		1000/10) as any;
	}
}
