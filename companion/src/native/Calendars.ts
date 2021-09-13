import { NativeModules } from 'react-native';
const { CalendarModule } = NativeModules;

export interface Calendar {
  id: string;
  color: string;
  title: string;
  enabled: boolean;
}

export function getCalendars(): Promise<Calendar[]> {
	return CalendarModule.getCalendars();
}

export function setCalendars(enabled: string[]): Promise<void> {
	return CalendarModule.setCalendars(enabled);
}
