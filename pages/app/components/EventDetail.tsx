import { useNavigate } from "@remix-run/react";
import type { Event } from "~/utils/events";

type EventDetailProps = {
	event: Event;
};

const EventDetail: React.FC<EventDetailProps> = ({ event }) => {
	const navigate = useNavigate();

	return (
		<div className="relative bg-white p-4 w-full">
			<button
				className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
				onClick={() =>
					navigate(
						`/calendar/${event.date.split("-")[0]}/${event.date.split("-")[1]}`,
					)
				}
				type="button"
			>
				✕
			</button>
			<img
				src={event.thumbnail}
				alt={event.title}
				className="w-full h-64 object-cover rounded mb-4"
			/>
			<h3 className="text-xl font-bold mb-4">{event.title}</h3>
			<p className="text-gray-600 mb-2">{event.date}</p>
			{event.start && (
				<p className="text-gray-600 mb-2">{`${event.start} - ${event.end}`}</p>
			)}
			<p className="text-gray-700">{event.description}</p>
		</div>
	);
};

export default EventDetail;
