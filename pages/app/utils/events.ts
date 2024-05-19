import { isEqual } from "date-fns";
import { format, toDate, toZonedTime } from "date-fns-tz";

export type Event = {
	id: string;
	title: string;
	date: string;
	start?: string;
	end?: string;
	description: string;
	thumbnail: string;
	timeZone: string;
};

const eventData: Event[] = [
	{
		id: "1",
		title: "ミーティング",
		date: "2024-05-15",
		start: "10:00",
		end: "11:00",
		description: "プロジェクトの進捗確認",
		thumbnail: "/images/meeting.jpg",
		timeZone: "Asia/Tokyo",
	},
	{
		id: "2",
		title: "打ち合わせ",
		date: "2024-05-20",
		start: "14:00",
		end: "15:00",
		description: "クライアントとの要件定義",
		thumbnail: "/images/discussion.jpg",
		timeZone: "Asia/Tokyo",
	},
];

export async function getMonthEvents(year: number, month: number): Promise<Event[]> {
	return eventData;
}

export async function getDateEvents(year: number, month: number, day: number): Promise<Event[]> {
	return eventData.filter(event =>
		new Date(event.date).getFullYear() === year &&
		new Date(event.date).getMonth() === month &&
		new Date(event.date).getDate() === day
	);
}

export async function getEvent(eventId: string): Promise<Event | undefined> {
	return eventData.find(event => event.id === eventId);
}

export function formatEventDate(event: Event, locale: string): string {
	const startDate = toDate(event.date, { timeZone: event.timeZone });
	const localStartDate = toZonedTime(startDate, getTimeZone(locale));
	const formattedDate = format(localStartDate, "yyyy-MM-dd");
	return formattedDate;
}

function getTimeZone(locale: string): string {
	switch (locale) {
		case "ja":
			return "Asia/Tokyo";
		default:
			return "UTC";
	}
}

export function generateCalendarDates(
	year: number,
	month: number,
	holidays: { [date: string]: boolean },
	locale: string,
	events: Event[]
) {
	const numDays = daysInMonth(year, month);
	const firstDay = new Date(year, month, 1).getDay();
	const prevMonthDays = daysInMonth(year, month - 1);
	const totalDays = firstDay + numDays;

	return Array.from({ length: totalDays }, (_, i) => {
		const isPrevMonth = i < firstDay;
		const date = new Date(
			year,
			isPrevMonth ? month - 1 : month,
			isPrevMonth ? prevMonthDays - firstDay + i + 1 : i - firstDay + 1
		);
		const formattedDate = format(date, "yyyy-MM-dd");
		const isHoliday = holidays[formattedDate] || false;
		const dayEvents = events.filter((event) =>
			isEqual(formatEventDate(event, locale), formattedDate)
		);
		return {
			day: date.getDate(),
			isHoliday,
			events: dayEvents,
			isPrevMonth,
			key: `${isPrevMonth ? "prev" : "current"}-${formattedDate}`
		};
	});
}

function daysInMonth(year: number, month: number) {
	return new Date(year, month + 1, 0).getDate();
}
