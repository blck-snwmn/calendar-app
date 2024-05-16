import { Link, useParams } from "@remix-run/react";
import type { Event } from "~/utils/events";

type EventListProps = {
	events: Event[];
};

const EventList: React.FC<EventListProps> = ({ events }) => {
	const { year, month, date } = useParams();

	return (
		<div>
			<h3>Event List</h3>
			<ul>
				{events.map((event) => (
					<li key={event.id}>
						<Link to={`/${year}/${month}/${date}/${event.id}`}>
							{event.title}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
};

export default EventList;
