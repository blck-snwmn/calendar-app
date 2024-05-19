import { Link, useNavigate, useParams } from "@remix-run/react";
import type { Event } from "~/utils/events";

type EventListProps = {
	events: Event[];
};

const EventList: React.FC<EventListProps> = ({ events }) => {
	const navigate = useNavigate();
	const { year, month, date } = useParams();

	return (
		<div className="relative bg-white p-4 w-full">
			<button
				className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
				onClick={() => navigate(`/calendar/${year}/${month}`)}
				type="button"
			>
				✕
			</button>
			<h3 className="text-xl font-bold mb-4">Event List</h3>
			<p className="mb-4 text-gray-600">{`${year}-${month}-${date}`}</p>
			<ul>
				{events.map((event) => (
					<li key={event.id} className="mb-4 flex items-start">
						<img
							src={event.thumbnail}
							alt={event.title}
							className="w-32 h-32 rounded mr-4"
						/>
						<div className="flex-grow">
							<Link
								to={`${event.id}`}
								className="text-lg font-bold text-blue-600 hover:underline"
							>
								{event.title}
							</Link>
							<p className="text-gray-600">
								{event.start ? `${event.start} - ${event.end}` : event.date}
							</p>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default EventList;
