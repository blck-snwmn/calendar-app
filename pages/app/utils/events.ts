// app/utils/events.ts
import { isEqual } from "date-fns";
import { format, toDate, toZonedTime } from "date-fns-tz";

export type Event = {
	id: string;
	title: string;
	start: string;
	end: string;
	timeZone: string;
};

const eventData: Event[] = [
	{
		id: "1",
		title: "ミーティング",
		start: "2024-05-15T10:00:00+09:00",
		end: "2024-05-15T11:00:00+09:00",
		timeZone: "Asia/Tokyo",
	},
	{
		id: "2",
		title: "打ち合わせ",
		start: "2024-05-20T14:00:00+09:00",
		end: "2024-05-20T15:00:00+09:00",
		timeZone: "Asia/Tokyo",
	},
];

export async function getEvents(year: number, month: number): Promise<Event[]> {
	return eventData;
}

export function formatEventDate(event: Event, locale: string): string {
	const startDate = toDate(event.start, { timeZone: event.timeZone });
	const localStartDate = toZonedTime(startDate, getTimeZone(locale));
	const formatedDate = format(localStartDate, "yyyy-MM-dd");
	// console.log(x)
	return formatedDate;
}

function getTimeZone(locale: string): string {
	// ロケールからタイムゾーンを取得する関数
	switch (locale) {
		case "ja":
			return "Asia/Tokyo";
		default:
			return "UTC";
	}
}

export function filterEventsByDate(events: Event[], date: string): Event[] {
	return events.filter((event) => new Date(event.start).toISOString().slice(0, 10) === date);
}

export function findEventById(events: Event[], eventId: string, date: string): Event | undefined {
	return events.find(
		(event) => event.id === eventId && new Date(event.start).toISOString().slice(0, 10) === date,
	);
}

export const generateCalendarDates = (
	year: number,
	month: number,
	holidays: { [date: string]: boolean },
	locale: string,
	events: Event[],
) => {
	const numDays = daysInMonth(year, month);
	const firstDay = new Date(year, month, 1).getDay();
	const prevMonthDays = daysInMonth(year, month - 1);
	const totalDays = firstDay + numDays;

	return Array.from({ length: totalDays }, (_, i) => {
		const isPrevMonth = i < firstDay;
		const date = new Date(
			year,
			isPrevMonth ? month - 1 : month,
			isPrevMonth ? prevMonthDays - firstDay + i + 1 : i - firstDay + 1,
		);
		const formattedDate = format(date, "yyyy-MM-dd");
		const isHoliday = holidays[formattedDate] || false;
		const dayEvents = events.filter((event) =>
			isEqual(formatEventDate(event, locale), formattedDate),
		);
		return {
			day: date.getDate(),
			isHoliday,
			events: dayEvents,
			isPrevMonth,
			key: `${isPrevMonth ? "prev" : "current"}-${formattedDate}`,
		};
	});
};

function daysInMonth(year: number, month: number) {
	return new Date(year, month + 1, 0).getDate();
}
