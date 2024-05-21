import { Link } from "@remix-run/react";
import type React from "react";
import { type ExtendedEvent, generateCalendarDates, splitMultiDayEvents, type Event } from "~/utils/events";

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
	const extendedEvents = splitMultiDayEvents(events);
	const allDates = generateCalendarDates(year, month, holidays, locale, extendedEvents);
	return (
		<div className="flex flex-wrap p-2 justify-start w-full">
			{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((weekday) => (
				<div
					key={weekday}
					className="flex-0 flex-grow-[0] flex-shrink-[0] w-[14%] h-[30px] flex items-center justify-center bg-gray-200"
				>
					{weekday}
				</div>
			))}
			{allDates.map(({ day, isHoliday, events, key }) => (
				<div
					key={key}
					className={`relative flex-0 flex-grow-[0] flex-shrink-[0] w-[14%] flex flex-col items-center justify-start h-[200px] m-0 bg-white shadow-sm transition-colors gap-2 p-2 box-border ${isHoliday ? "text-red-500" : ""}`}
				>
					<div>{day}</div>
					{events.map(event => (
						event.title ? (
							<Link
								key={event.id}
								to={`${event.id}`}
								className="text-xs h-[24px] p-1 mb-1 rounded bg-gray-200 shadow-xs whitespace-nowrap overflow-hidden text-ellipsis w-full box-border"
							>
								{event.title}
							</Link>
						) : (
							<div key={event.id} className="h-[24px] w-full mb-1 bg-transparent" />
						)
					))}
				</div>
			))}
		</div>
	);
};

export default Calendar;
