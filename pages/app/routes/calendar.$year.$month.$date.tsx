import { type LoaderFunctionArgs, json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import EventList from "~/components/EventList";
import { getMonthEvents } from "~/utils/events";

export const loader = async ({ params }: LoaderFunctionArgs) => {
	const { year, month, date } = params;
	if (!year || !month || !date) {
		throw new Response("Year, month, and date are required", {
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

	return json({
		events: events.filter((event) => new Date(event.start).getDate() === d),
	});
};

export default function EventListPage() {
	const { events } = useLoaderData<typeof loader>();

	return <EventList events={events} />;
}
