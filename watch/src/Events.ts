
/**
 * A calendar event.
 */

export interface Event {
	start: Date;
	end: Date;
	title: string;
	color: string;
}

/**
 * Returns the current day's calendar events.
 */

export function getEvents(): Event[] {
	const createDate = (hour: number, minute: number) => {
		const date = new Date();
		date.setHours(hour, minute, 0);
		return date;
	};

	return [
		{ start: createDate(9, 30), end: createDate(11, 20), color: '#59acff', title: 'Japanese' },
		{ start: createDate(12, 30), end: createDate(1, 20), color: '#59acff', title: 'Stats' },
		{ start: createDate(1, 30), end: createDate(2, 20), color: '#59acff', title: 'Math' }
	];
}
