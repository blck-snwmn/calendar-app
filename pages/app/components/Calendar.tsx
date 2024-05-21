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
					className="flex-0 flex-grow-[0] flex-shrink-[0] w-[13%] h-[30px] flex items-center justify-center bg-gray-200"
				>
					{weekday}
				</div>
			))}
			{allDates.map(({ day, isHoliday, events, key }) => {
				const displayEvents = events.slice(0, 4); // 最初の4つの予定を表示
				const hasMoreEvents = events.length > 4;  // 5つ以上の予定があるかどうか
				return (
					<div
						key={key}
						className={`relative flex-0 flex-grow-[0] flex-shrink-[0] w-[13%] flex flex-col items-center justify-start h-[220px] m-0 bg-white shadow-sm transition-colors gap-2 p-2 box-border ${isHoliday ? "text-red-500" : ""}`}
					>
						<div>{day}</div>
						{displayEvents.map(event => (
							event.title ? (
								<Link
									key={event.id}
									to={`${event.id}`}
									className={`text-xs h-[24px] p-1 mb-1 rounded ${event.isStart && event.isEnd
											? 'bg-blue-100 text-black'  // 単日の予定
											: 'bg-blue-500 text-white'  // 複数日にまたがる予定
										} shadow-xs whitespace-nowrap overflow-hidden text-ellipsis w-full box-border`}
								>
									{event.title}
								</Link>
							) : (
								<div key={event.id} className="h-[24px] w-full mb-1 bg-transparent" />
							)
						))}
						{hasMoreEvents && (
							<div className="text-xs text-gray-500 h-[20px] flex items-center justify-center">
								+{events.length - 4} more
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
};


export default Calendar;
