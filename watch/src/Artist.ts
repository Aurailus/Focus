import { Event } from './Events';
import { degToRad } from './Util';

/** The width of events. */
const EVENT_WIDTH = 22;

/** The distance inside the event that the title should be drawn. */
const TITLE_SPACING = 2;

/** The text size of the event title. */
const TITLE_SIZE = 16;

/** The color that displays behind event names. */
const EVENT_BACKGROUND_COLOR = 'rgba(65, 199, 232, 0.2)';

/** 90 degree turn in radians. */
const QUARTER_TURN = degToRad(90);

/**
 * Handles drawing shapes used by the watch face.
 * init() loads resources, and **must** be awaited before using any operations.
 */

export default class Artist {
	icons: Record<string, HTMLImageElement>;

	readonly radius: number;
	readonly ctx: CanvasRenderingContext2D;

	private glowCtx: CanvasRenderingContext2D;
	private glowImg: HTMLImageElement;

	/**
	 * Initializes an Artist to the canvas or canvas context provided.
	 *
	 * @param canvas - The canvas or canvas context to bind the artist to.
	 */

	constructor(canvas: HTMLCanvasElement | CanvasRenderingContext2D) {
		if ('getContext' in canvas) this.ctx = canvas.getContext('2d')!;
		else this.ctx = canvas;
		this.icons = {};
		this.radius = this.ctx.canvas.width / 2;

		const glowCanvas = document.createElement('canvas');
		glowCanvas.width = 128;
		glowCanvas.height = 128;
		this.glowCtx = glowCanvas.getContext('2d')!;
		this.glowImg = null as any;
	}

	loadImage(path: string): Promise<HTMLImageElement> {
		return new Promise<HTMLImageElement>(resolve => {
			const img = document.createElement('img');
			img.onload = () => resolve(img);
			img.src = path;
		});
	}

	/**
	 * Loads resources needed for certain draw operations.
	 *
	 * @returns a promise indicating that the loading is complete.
	 */

	async init(): Promise<void> {
		const [ glowImg, battery, steps, heart ] = await Promise.all([
			this.loadImage('../res/glow.png'),
			this.loadImage('../res/battery.svg'),
			this.loadImage('../res/steps.svg'),
			this.loadImage('../res/heart.svg')
		]);

		this.glowImg = glowImg;
		this.icons = { battery, steps, heart };
	}

	/**
	 * Clears the canvas for a new frame.
	 */

	clear() {
		const { ctx, radius: canvRadius } = this;
		ctx.clearRect(0, 0, canvRadius * 2, canvRadius * 2);
	}

	/**
	 * Draws a circle on the canvas.
	 *
	 * @param radians - The angle in radians to draw the circle at, starting at the top and moving clockwise.
	 * @param dist - The distance from the center of the canvas to draw the circle at.
	 * @param radius - The radius of the circle to draw.
	 * @param fill - The color to fill the circle with. undefined will result in no fill.
	 * @param stroke - The color to trace the circle with. undefined will result in no stroke.
	 * @param strokeWidth - The width of the stroke for the circle with. undefined will result in no stroke.
	 */

	circle(radians: number, dist: number, radius: number, fill?: string, stroke?: string, strokeWidth?: number) {
		const { ctx, radius: canvRadius } = this;

		ctx.save();
		ctx.translate(canvRadius, canvRadius);
		ctx.rotate(radians - QUARTER_TURN);

		ctx.beginPath();
		ctx.arc(dist, 0, radius, 0, 2 * Math.PI, false);
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

		ctx.restore();
	}

	/**
	 * Draws a line on the canvas.
	 *
	 * @param radians - The angle in radians to draw the line at, starting at the top and moving clockwise.
	 * @param startDist - The distance from the center of the canvas to begin the line at.
	 * @param endDist - The distance from the center of the canvas to end the line at.
	 * @param width - The width of the line to draw.
	 * @param color - The color to draw the line with.
	 */

	line(radians: number, startDist: number, endDist: number, width: number, color: string) {
		const { ctx, radius: canvRadius } = this;

		ctx.save();
		ctx.translate(canvRadius, canvRadius);
		ctx.rotate(radians);

		ctx.beginPath();
		ctx.lineWidth = width;
		ctx.strokeStyle = color;
		ctx.moveTo(0, startDist);
		ctx.lineTo(0, endDist);
		ctx.stroke();
		ctx.closePath();

		ctx.restore();
	}

	/**
	 * Draws a rounded rectangle on the canvas.
	 *
	 * @param radians - The angle in radians to draw the rounded rectangle at, starting at the top and moving clockwise.
	 * @param startDist - The distance from the center of the canvas to begin the rounded rectangle at.
	 * @param endDist - The distance from the center of the canvas to end the rounded rectangle at.
	 * @param width - The width of the rounded rectangle to draw.
	 * @param fill - The color to fill the rounded rectangle with. undefined will result in no fill.
	 * @param stroke - The color to trace the rounded rectangle with. undefined will result in no stroke.
	 * @param strokeWidth - The width of the stroke for the rounded rectangle with. undefined will result in no stroke.
	 */

	rounded(radians: number, startDist: number, endDist: number, width: number,
		fill?: string, stroke?: string, strokeWidth?: number ) {
		const { ctx, radius: canvRadius } = this;

		ctx.save();
		ctx.translate(canvRadius, canvRadius);
		ctx.rotate(radians);

		ctx.beginPath();
		ctx.moveTo(-width / 2, startDist);
		ctx.lineTo(-width / 2, endDist);
		ctx.quadraticCurveTo(-width / 2, endDist + width / 1.5, 0, endDist + width / 1.5);
		ctx.quadraticCurveTo(width / 2, endDist + width / 1.5, width / 2, endDist);
		ctx.lineTo(width / 2, startDist);
		ctx.quadraticCurveTo(width / 2, startDist - width / 1.5, 0, startDist - width / 1.5);
		ctx.quadraticCurveTo(-width / 2, startDist - width / 1.5, -width / 2, startDist);
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

		ctx.restore();
	}

	/**
	 * Draws a glow on the canvas.
	 *
	 * @param radians - The angle in radians to draw the glow at, starting at the top and moving clockwise.
	 * @param dist - The distance from the center of the canvas to draw the glow at.
	 * @param scale - A scale multiplier for the glow's size. A value of 1 results in a size 66% of the canvas size.
	 * @param color - The color to draw the glow with.
	 */

	glow(radians: number, dist: number, scale: number, color: string) {
		const { ctx, glowCtx, glowImg, radius: canvRadius } = this;

		const offsetX = Math.cos(radians) * dist;
		const offsetY = Math.sin(radians) * dist;

		glowCtx.fillStyle = color;
		glowCtx.globalCompositeOperation = 'source-over';
		glowCtx.fillRect(0, 0, glowCtx.canvas.width, glowCtx.canvas.height);
		glowCtx.globalCompositeOperation = 'destination-in';
		glowCtx.drawImage(glowImg, 0, 0);

		const size = (canvRadius * 1.5) * scale;

		ctx.drawImage(glowCtx.canvas,
			canvRadius + offsetX - size / 2, canvRadius + offsetY - size / 2,
			size, size);
	}

	/**
	 * Draws a calendar event on the canvas.
	 *
	 * @param event - The event to draw.
	 * @param dist - The distance from the center of the canvas to draw the event at.
	 */

	event(event: Event, dist: number) {
		const { ctx, radius: canvRadius } = this;

		ctx.save();
		ctx.translate(canvRadius, canvRadius);

		const startAngle = degToRad(((event.start.getHours() % 12) +
			event.start.getMinutes() / 60) / 12 * 360 + EVENT_WIDTH / 6 - 90);
		const endAngle = degToRad(((event.end.getHours() % 12) +
			event.end.getMinutes() / 60) / 12 * 360 - EVENT_WIDTH / 8 - 90);

		ctx.beginPath();
		ctx.fillStyle = EVENT_BACKGROUND_COLOR;

		ctx.arc(0, 0, dist, startAngle, endAngle, false);

		let controlPosX = Math.cos(endAngle + degToRad(4.25)) * dist;
		let controlPosY = Math.sin(endAngle + degToRad(4.25)) * dist;
		let endPosX = Math.cos(endAngle + degToRad(4.25)) * (dist - EVENT_WIDTH / 2);
		let endPosY = Math.sin(endAngle + degToRad(4.25)) * (dist - EVENT_WIDTH / 2);

		ctx.quadraticCurveTo(controlPosX, controlPosY, endPosX, endPosY);

		controlPosX = Math.cos(endAngle + degToRad(4.25)) * (dist - EVENT_WIDTH);
		controlPosY = Math.sin(endAngle + degToRad(4.25)) * (dist - EVENT_WIDTH);
		endPosX = Math.cos(endAngle) * (dist - EVENT_WIDTH);
		endPosY = Math.sin(endAngle) * (dist - EVENT_WIDTH);

		ctx.quadraticCurveTo(controlPosX, controlPosY, endPosX, endPosY);

		ctx.arc(0, 0, dist - EVENT_WIDTH, endAngle, startAngle, true);

		controlPosX = Math.cos(startAngle - degToRad(4.25)) * (dist - EVENT_WIDTH);
		controlPosY = Math.sin(startAngle - degToRad(4.25)) * (dist - EVENT_WIDTH);
		endPosX = Math.cos(startAngle - degToRad(4.25)) * (dist - EVENT_WIDTH / 2);
		endPosY = Math.sin(startAngle - degToRad(4.25)) * (dist - EVENT_WIDTH / 2);

		ctx.quadraticCurveTo(controlPosX, controlPosY, endPosX, endPosY);

		controlPosX = Math.cos(startAngle - degToRad(4.25)) * dist;
		controlPosY = Math.sin(startAngle - degToRad(4.25)) * dist;
		endPosX = Math.cos(startAngle) * dist;
		endPosY = Math.sin(startAngle) * dist;

		ctx.quadraticCurveTo(controlPosX, controlPosY, endPosX, endPosY);

		ctx.fill();
		ctx.closePath();

		ctx.restore();

		this.circle(startAngle + QUARTER_TURN,
			dist - EVENT_WIDTH / 2, EVENT_WIDTH / 2 - 4, event.color);

		ctx.font = `900 ${TITLE_SIZE}px Arial sans-serif`;
		ctx.fillStyle = '#fff';
		ctx.textBaseline = 'top';
		ctx.textAlign = 'center';

		let currentAngle = startAngle + QUARTER_TURN + degToRad(6);
		for (let i = 0; i < event.title.length; i++) {
			ctx.save();
			ctx.translate(canvRadius, canvRadius);
			ctx.rotate(currentAngle);

			ctx.fillText(event.title[i], 0, -dist + TITLE_SPACING);

			ctx.restore();
			if (i < event.title.length - 1)
				currentAngle += ctx.measureText(event.title[i]).width * 0.0065 / 2
					+ ctx.measureText(event.title[i + 1]).width * 0.0065 / 2;
		}
	}
}
