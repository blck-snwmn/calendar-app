/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { type LoaderFunctionArgs, json } from "@remix-run/cloudflare";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { addMonths, format, subMonths } from "date-fns";
import { useTranslation } from "react-i18next";
import Calendar from "~/components/Calendar";
import { getEvents } from "~/utils/events";

const linkStyle = css`
  text-decoration: none;
  color: inherit;
  &:visited {
    color: inherit;
  }
`;

const buttonStyle = css`
  display: inline-block;
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f8f8f8;
  cursor: pointer;
  &:hover {
    background-color: #e8e8e8;
  }
`;

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

	const currentDate = new Date(year, month);
	const prevMonth = format(subMonths(currentDate, 1), 'yyyy/MM');
	const nextMonth = format(addMonths(currentDate, 1), 'yyyy/MM');

	return (
		<div>
			{t("welcome")}
			<h2>
				<Link to={`/calendar/${prevMonth}`} css={[linkStyle, buttonStyle]}>{'<'}</Link>
				{' '}
				Calendar for {year}-{month + 1}
				{' '}
				<Link to={`/calendar/${nextMonth}`} css={[linkStyle, buttonStyle]}>{'>'}</Link>
			</h2>
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
