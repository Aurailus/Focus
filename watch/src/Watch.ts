import Artist from './Artist';
import { degToRad } from './Util';
import { getEvents, Event } from './Events';
import { getTheme, NotchMode, Theme } from './Theme';

// TODO: placeholders
const COLOR_LIGHT_DIM = 'rgba(65, 199, 232, 0.15)';
const COLOR_LIGHT_OVERLAY = 'rgba(65, 199, 232, 0.33)';
const COLOR_MINUTE_HAND = 'rgba(65, 199, 232, 0.8)';

/** The minimum distance that all elements should be from the screen edge. */
const OUTER_BUFFER = 2;

/** The distance that elements should be away from the screen edge in addition to OUTER_BUFFER if notches are drawn. */
const NOTCH_BUFFER = 12;

/** The text size of the date. */
const DATE_SIZE = 20;

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

	private draw() {
		const { artist, theme, events } = this;

		this.clearPendingDraw();
		artist.clear();

		const time = this.getTime();

		artist.ctx.font = `900 ${DATE_SIZE}px Arial sans-serif`;
		artist.ctx.fillStyle = '#aaa';
		artist.ctx.textBaseline = 'bottom';
		artist.ctx.textAlign = 'center';

		artist.ctx.fillText(`${['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][time.getDay()]} ${time.getDate()}`,
			artist.radius, artist.radius + artist.radius / 1.75);

		artist.ctx.fillStyle = '#666';
		artist.ctx.fillRect(artist.radius - 1 * DATE_SIZE,
			artist.radius + artist.radius / 1.75 + 2, 2 * DATE_SIZE, 2);

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

		if (theme.notchMode !== NotchMode.NONE) {
			for (let i = 0; i < 12 * 5; i++) {
				if (i % 15 === 0) {
					artist.circle(degToRad(i / (12 * 5) * 360),
						artist.radius - OUTER_BUFFER - 4, 4, COLOR_MINUTE_HAND);
				}
				else if (i % 5 === 0 && theme.notchMode >= NotchMode.HOURS) {
					artist.circle(degToRad(i / (12 * 5) * 360 - 90),
						artist.radius - OUTER_BUFFER - 4, 3, COLOR_LIGHT_OVERLAY);
				}
				else if (theme.notchMode >= NotchMode.MINUTES) {
					artist.circle(degToRad(i / (12 * 5) * 360 - 90),
						artist.radius - OUTER_BUFFER - 4, 2, COLOR_LIGHT_DIM);
				}
			}
		}

		if (theme.showEvents) {
			for (let event of events) {
				let eventBuffer = OUTER_BUFFER + theme.notchMode !== NotchMode.NONE ? NOTCH_BUFFER : 0;
				artist.event(event, artist.radius - eventBuffer);
			}
		}

		artist.circle(0, 0, 18, COLOR_LIGHT_OVERLAY);
		artist.circle(0, 0, 10, '#fff');

		if (theme.showMinutes) {
			const minuteAngle = degToRad((time.getMinutes() + time.getSeconds() / 60) / 60 * 360 - 180);
			artist.rounded(minuteAngle, 40, artist.radius - 64, 16, COLOR_MINUTE_HAND);
		}

		const hourAngle = degToRad(((time.getHours() % 12) + time.getMinutes() / 60) / 12 * 360 - 180);
		artist.rounded(hourAngle, 42, artist.radius - 80, 16, 'rgba(0, 0, 0, 0.15)', '#fff', 4);

		if (!this.ambient) this.animTimeout = setTimeout(() =>
			this.animReq = window.requestAnimationFrame(() => this.draw()),
		1000/10) as any;
	}
}
