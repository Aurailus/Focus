import { ComplicationType, ComplicationStyle } from './Complication';

/**
 * Specifies how the notches should be rendered.
 */

export const NotchMode = {
	NONE: 0,
	QUARTERS: 1,
	HOURS: 2,
	MINUTES: 3
};

/**
 * Theme preferences that determine how the watch should be rendered.
 */

export interface Theme {
	notchMode: number;
	notchModeAmbient: number;
	showEvents: boolean;
	showMinutes: boolean;
	showGlow: boolean;
	glowColors: [ string, string, string ];
	complications: ({ type: ComplicationType; style: number } | null)[];
}

/**
 * Returns the theme preferences set by the user.
 */

export function getTheme(): Theme {
	return {
		notchMode: NotchMode.MINUTES,
		notchModeAmbient: NotchMode.HOURS,
		showEvents: true,
		showMinutes: true,
		showGlow: true,
		// glowColors: [
		// 	'rgba(66, 148, 255, 1)',
		// 	'rgba(5, 124, 242, 0.6)',
		// 	'rgba(198, 0, 237, 1)'
		// ],
		glowColors: [
			'rgba(172, 77, 255, 1)',
			'rgba(255, 54, 134, 0.4)',
			'rgba(255, 71, 249, 0.6)'
		],
		// glowColors: [
		// 	'rgba(54, 255, 87)',
		// 	'rgba(0, 207, 155)',
		// 	'rgba(122, 255, 82, 0.6)'
		// ],
		complications: [ null, {
			type: 'heartrate',
			style: ComplicationStyle.OUTLINED
		}, {
			type: 'date',
			style: ComplicationStyle.OUTLINED
		}, {
			type: 'battery',
			style: ComplicationStyle.OUTLINED
		}]
	};
}
