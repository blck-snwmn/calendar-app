import { type LoaderFunctionArgs, json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import Calendar from "~/components/Calendar";
import { useTranslation } from 'react-i18next';

// 仮のデータロード関数
export const loader = async ({ params }: LoaderFunctionArgs) => {
    const { year, month } = params;
    if (!year || !month) {
        throw new Response("Year and month are required", {
            status: 400
        });
    }
    const y = Number.parseInt(year, 10);
    const m = Number.parseInt(month, 10) - 1;
    if (Number.isNaN(y) || Number.isNaN(m) || m < 0 || m > 11) {
        throw new Response("Invalid year or month", {
            status: 400
        });
    }
    console.log(`Loading data for ${y}-${m}`);
    // TODO 本番環境ではここでデータベースからデータを取得します
    const holidays = { '2024-5-1': true }
    return json({ year: y, month: m, holidays });
};

export default function CalendarPages() {
    const { year, month, holidays } = useLoaderData<typeof loader>()
    const { t } = useTranslation();
    return (
        <div>
            {t('welcome')}
            <h1>Calendar for {year}-{month + 1}</h1>
            <Calendar year={year} month={month} holidays={holidays} />
        </div>
    );
}