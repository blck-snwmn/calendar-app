import { type LoaderFunctionArgs, json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import Calendar from "~/components/Calendar";

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
    return json({ year: y, month: m });
};

export default function CalendarPages() {
    const data = useLoaderData<typeof loader>()
    console.log(data);
    return (
        <div>
            <h1>Calendar for {data.year}-{data.month + 1}</h1>
            <Calendar year={data.year} month={data.month} />
        </div>
    );
}