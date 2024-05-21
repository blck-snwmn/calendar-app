import { isEqual, parseISO, format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { toDate, toZonedTime } from "date-fns-tz";

export type Event = {
	id: string;
	title: string;
	start: string; // ISO形式の日付文字列
	end: string;   // ISO形式の日付文字列
	description: string;
	thumbnail: string;
	timeZone: string;
};

export type ExtendedEvent = Event & {
	isStart: boolean;
	isEnd: boolean;
};

const eventData: Event[] = [
	{
		id: "1",
		title: "ミーティング",
		start: "2024-05-15T10:00:00Z",
		end: "2024-05-15T11:00:00Z",
		description: "プロジェクトの進捗確認",
		thumbnail: "/images/meeting.webp",
		timeZone: "Asia/Tokyo",
	},
	{
		id: "2",
		title: "打ち合わせ",
		start: "2024-05-20T14:00:00Z",
		end: "2024-05-20T15:00:00Z",
		description: "クライアントとの要件定義",
		thumbnail: "/images/discussion.webp",
		timeZone: "Asia/Tokyo",
	},
	{
		id: "3",
		title: "ブレインストーミングセッション",
		start: "2024-05-18T13:00:00Z",
		end: "2024-05-18T14:30:00Z",
		description: "新しいプロジェクトのアイデア出し",
		thumbnail: "/images/brainstorming.webp",
		timeZone: "Asia/Tokyo",
	},
	{
		id: "4",
		title: "開発者ミーティング",
		start: "2024-05-29T09:00:00Z",
		end: "2024-05-29T10:00:00Z",
		description: "開発進捗と技術的課題の確認",
		thumbnail: "/images/developer_meeting.webp",
		timeZone: "Asia/Tokyo",
	},
	{
		id: "5",
		title: "複数日にまたがるイベント1",
		start: "2024-05-14T00:00:00Z",
		end: "2024-05-20T23:59:59Z",
		description: "複数日にまたがるイベントの説明",
		thumbnail: "/images/multi_day_1.jpg",
		timeZone: "Asia/Tokyo",
	},
	{
		id: "6",
		title: "複数日にまたがるイベント2",
		start: "2024-05-10T00:00:00Z",
		end: "2024-05-17T23:59:59Z",
		description: "複数日にまたがるイベントの説明",
		thumbnail: "/images/multi_day_2.jpg",
		timeZone: "Asia/Tokyo",
	}
];

export async function getMonthEvents(year: number, month: number): Promise<Event[]> {
	return eventData.filter(event => {
		const start = parseISO(event.start);
		const end = parseISO(event.end);
		return (start.getFullYear() === year && start.getMonth() === month) ||
			(end.getFullYear() === year && end.getMonth() === month) ||
			(start.getFullYear() === year && start.getMonth() < month && end.getFullYear() === year && end.getMonth() > month);
	});
}

export async function getDateEvents(year: number, month: number, day: number): Promise<Event[]> {
	return eventData.filter(event => {
		const date = new Date(year, month, day);
		const start = parseISO(event.start);
		const end = parseISO(event.end);
		return start <= date && date <= end;
	});
}

export async function getEvent(eventId: string): Promise<Event | undefined> {
	return eventData.find((event) => event.id === eventId);
}

export function formatEventDate(event: Event, locale: string): string {
	const startDate = toDate(event.start, { timeZone: event.timeZone });
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

export function splitMultiDayEvents(events: Event[]): ExtendedEvent[] {
	const extendedEvents: ExtendedEvent[] = [];

	// biome-ignore lint/complexity/noForEach: <explanation>
	events.forEach(event => {
		const startDate = parseISO(event.start);
		const endDate = parseISO(event.end);

		// biome-ignore lint/complexity/noForEach: <explanation>
		eachDayOfInterval({ start: startDate, end: endDate }).forEach(currentDate => {
			extendedEvents.push({
				...event,
				isStart: isSameDay(currentDate, startDate),
				isEnd: isSameDay(currentDate, endDate),
				start: format(currentDate, 'yyyy-MM-dd'),
				end: format(currentDate, 'yyyy-MM-dd'),
			});
		});
	});

	return extendedEvents;
}

export function generateCalendarDates(
	year: number,
	month: number,
	holidays: { [date: string]: boolean },
	locale: string,
	events: ExtendedEvent[],
) {
	const startDate = startOfMonth(new Date(year, month));
	const endDate = endOfMonth(new Date(year, month));
	const allDates = eachDayOfInterval({ start: startDate, end: endDate }).map(date => {
		const formattedDate = format(date, 'yyyy-MM-dd');
		const isHoliday = holidays[formattedDate] || false;
		const dayEvents = events.filter(event => event.start === formattedDate);

		return {
			day: date.getDate(),
			isHoliday,
			events: dayEvents,
			key: formattedDate,
		};
	});

	// 各日付のイベントリストを調整し、前後の日付と整合させる
	for (let i = 0; i < allDates.length; i++) {
		const currentDate = allDates[i];
		const previousDate = allDates[i - 1] || { events: [] };

		const adjustedEvents: ExtendedEvent[] = [];
		for (const cevent of currentDate.events) {
			const pindex = previousDate.events.findIndex(event => event.id === cevent.id);
			if (pindex === -1) {
				adjustedEvents.push(cevent);
				continue;
			}
			// 補正後のindex は adjustedEvents の最後の要素になるので、adjustedEvents.length を index として利用
			let index = adjustedEvents.length
			// index<pindexの場合, 前日のイベントの位置と乖離があるので、index=pindexになるまで、空のイベントを追加
			while (index < pindex) {
				adjustedEvents.push({ id: `empty-${currentDate.key}-${index}`, title: '', start: '', end: '', description: '', thumbnail: '', timeZone: '', isStart: false, isEnd: false });
				index++;
			}
			adjustedEvents.push(cevent);
		}
		currentDate.events = adjustedEvents;
	}

	return allDates;
}

function daysInMonth(year: number, month: number) {
	return new Date(year, month + 1, 0).getDate();
}
