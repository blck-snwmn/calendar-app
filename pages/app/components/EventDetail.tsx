import type { Event } from "~/utils/events";

type EventDetailProps = {
	event: Event;
};

const EventDetail: React.FC<EventDetailProps> = ({ event }) => {
	return (
		<div>
			<h3>{event.title}</h3>
			<p>{`Start: ${event.start}`}</p>
			<p>{`End: ${event.end}`}</p>
		</div>
	);
};

export default EventDetail;
