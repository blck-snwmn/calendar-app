import { type LoaderFunctionArgs, json } from "@remix-run/cloudflare";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { addMonths, format, subMonths } from "date-fns";
import { useTranslation } from "react-i18next";
import Calendar from "~/components/Calendar";
import { getMonthEvents } from "~/utils/events";

export const loader = async ({ params }: LoaderFunctionArgs) => {
	const { year, month } = params;
	if (!year || !month) {
		throw new Response("Year and month are required", {
			status: 400,
		});
	}
	const y = Number.parseInt(year, 10);
	const m = Number.parseInt(month, 10) - 1;
	if (Number.isNaN(y) || Number.isNaN(m) || m < 0 || m > 11) {
		throw new Response("Invalid year or month", {
			status: 400,
		});
	}
	console.log(`Loading data for ${y}-${m}`);
	const holidays = { "2024-05-01": true };

	const events = await getMonthEvents(y, m);

	return json({ year: y, month: m, holidays, events });
};

export default function CalendarPage() {
	const { year, month, holidays, events } = useLoaderData<typeof loader>();
	const { t, i18n } = useTranslation();

	const currentDate = new Date(year, month);
	const prevMonth = format(subMonths(currentDate, 1), "yyyy/MM");
	const nextMonth = format(addMonths(currentDate, 1), "yyyy/MM");

	return (
		<div className="flex flex-col p-4">
			<p>{t("welcome")}</p>
			<h2 className="flex items-center space-x-4">
				<Link
					to={`/calendar/${prevMonth}`}
					className="text-gray-700 visited:text-gray-700 no-underline"
				>
					<button
						className="inline-block px-2 py-1 border border-gray-300 rounded bg-gray-100 hover:bg-gray-200"
						type="button"
					>
						{"<"}
					</button>
				</Link>
				<span>
					Calendar for {year}-{month + 1}
				</span>
				<Link
					to={`/calendar/${nextMonth}`}
					className="text-gray-700 visited:text-gray-700 no-underline"
				>
					<button
						className="inline-block px-2 py-1 border border-gray-300 rounded bg-gray-100 hover:bg-gray-200"
						type="button"
					>
						{">"}
					</button>
				</Link>
			</h2>
			<div className="flex mt-4">
				<div className="flex-[2]">
					<Calendar
						year={year}
						month={month}
						holidays={holidays}
						locale={i18n.language}
						events={events}
					/>
				</div>
				<div className="flex-[1]">
					<Outlet />
				</div>
			</div>
		</div>
	);
}
