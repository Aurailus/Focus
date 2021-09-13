
/**
 * Specifies how the notches should be rendered.
 */

export const NotchMode = {
	NONE: 0,
	QUARTER: 1,
	HOURS: 2,
	MINUTES: 3
};

/**
 * Theme preferences that determine how the watch should be rendered.
 */

export interface Theme {
	notchMode: number;
	showEvents: boolean;
	showMinutes: boolean;
	showGlow: boolean;
	glowColors: [ string, string, string ];
}

/**
 * Returns the theme preferences set by the user.
 */

export function getTheme(): Theme {
	return {
		notchMode: NotchMode.MINUTES,
		showEvents: true,
		showMinutes: true,
		showGlow: true,
		glowColors: [
			'#4294ff',
			'rgba(5, 124, 242, 0.6)',
			'rgba(198, 0, 237, 1)'
		]
	};
}
