import { type LoaderFunctionArgs, json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import EventDetail from "~/components/EventDetail";
import { getMonthEvents } from "~/utils/events";

export const loader = async ({ params }: LoaderFunctionArgs) => {
	const { year, month, date, eventId } = params;
	if (!year || !month || !date || !eventId) {
		throw new Response("Year, month, date, and eventId are required", {
			status: 400,
		});
	}
	const y = Number.parseInt(year, 10);
	const m = Number.parseInt(month, 10) - 1;
	const d = Number.parseInt(date, 10);
	if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) {
		throw new Response("Invalid date", {
			status: 400,
		});
	}

	const events = await getMonthEvents(y, m);
	const event = events.find(
		(event) => event.id === eventId && new Date(event.start).getDate() === d,
	);

	if (!event) {
		throw new Response("Event not found", {
			status: 404,
		});
	}

	return json({ event });
};

export default function EventDetailPage() {
	const { event } = useLoaderData<typeof loader>();

	return <EventDetail event={event} />;
}
