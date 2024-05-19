import { Link } from "@remix-run/react";
import { format, isEqual } from "date-fns";
import type React from "react";
import {
	type Event,
	formatEventDate,
	generateCalendarDates,
} from "~/utils/events";

type CalendarProps = {
	year: number;
	month: number;
	holidays: { [date: string]: boolean };
	locale: string;
	events: Event[];
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
				<div
					key={weekday}
					className="flex-0 flex-grow-[0] flex-shrink-[0] w-[14%] h-[30px] flex items-center justify-center bg-gray-200"
				>
					{weekday}
				</div>
			))}
			{allDates.map(({ day, isHoliday, events, isPrevMonth, key }) => (
				<Link
					key={key}
					to={`${day}`}
					className={`flex-0 flex-grow-[0] flex-shrink-[0] w-[14%] flex flex-col items-center justify-start h-[100px] m-0 bg-white shadow-sm transition-colors gap-2 p-2 box-border hover:bg-gray-200 ${
						isHoliday ? "text-red-500" : ""
					} ${isPrevMonth ? "text-gray-500" : ""}`}
				>
					<div>{day}</div>
					{events.map((event) => (
						<Link
							key={event.id}
							to={`${day}/${event.id}`}
							className="text-xs p-1 rounded bg-gray-200 shadow-xs whitespace-nowrap overflow-hidden text-ellipsis w-full box-border mb-1 cursor-pointer"
						>
							{event.title}
						</Link>
					))}
				</Link>
			))}
		</div>
	);
};

export default Calendar;
