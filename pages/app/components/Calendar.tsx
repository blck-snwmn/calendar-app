import { format, isEqual } from "date-fns";
import type React from "react";
import { type Event, formatEventDate } from "~/utils/events";

type CalendarProps = {
	year: number;
	month: number; // 月は0基準で、0が1月、11が12月です。
	holidays: { [date: string]: boolean }; // 日付をキーとして、休日かどうかのブール値を持つ
	locale: string;
	events: Event[];
};

const daysInMonth = (year: number, month: number) => {
	return new Date(year, month + 1, 0).getDate();
};

const generateCalendarDates = (
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

const Calendar: React.FC<CalendarProps> = ({
	year,
	month,
	holidays,
	locale,
	events,
}) => {
	const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	const allDates = generateCalendarDates(year, month, holidays, locale, events);

	return (
		<div className="flex flex-wrap p-2 justify-start w-full">
			{weekdays.map((weekday) => (
				<div key={weekday} className="flex-0 flex-grow-[0] flex-shrink-[0] w-[14%] h-[30px] flex items-center justify-center bg-gray-200">
					{weekday}
				</div>
			))}
			{allDates.map(({ day, isHoliday, events, isPrevMonth, key }) => (
				<div
					key={key}
					className={`flex-0 flex-grow-[0] flex-shrink-[0] w-[14%] flex flex-col items-center justify-start h-[100px] m-0 bg-white shadow-sm transition-colors gap-2 p-2 box-border hover:bg-gray-200 ${isHoliday ? "text-red-500" : ""} ${isPrevMonth ? "text-gray-500" : ""}`}
				>
					<div>{day}</div>
					{events.map((event) => (
						<div key={event.id} className="text-xs p-1 rounded bg-gray-200 shadow-xs whitespace-nowrap overflow-hidden text-ellipsis w-full box-border mb-1">
							{event.title}
						</div>
					))}
				</div>
			))}
		</div>
	);
};

export default Calendar;
