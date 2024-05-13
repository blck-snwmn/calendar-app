import { type LoaderFunctionArgs, json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import Calendar from "~/components/Calendar";
import { getEvents } from "~/utils/events";

// 仮のデータロード関数
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
	// TODO 本番環境ではここでデータベースからデータを取得します
	const holidays = { "2024-05-01": true };

	const events = await getEvents(y, m);

	return json({ year: y, month: m, holidays, events });
};

export default function CalendarPages() {
	const { year, month, holidays, events } = useLoaderData<typeof loader>();
	const { t, i18n } = useTranslation();
	return (
		<div>
			{t("welcome")}
			<h1>
				Calendar for {year}-{month + 1}
			</h1>
			<Calendar
				year={year}
				month={month}
				holidays={holidays}
				locale={i18n.language}
				events={events}
			/>
		</div>
	);
}
