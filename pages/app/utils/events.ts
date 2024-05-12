// app/utils/events.ts
import { toDate, format, toZonedTime } from 'date-fns-tz';

export type Event = {
    id: string;
    title: string;
    start: string;
    end: string;
    timeZone: string;
};

const eventData: Event[] = [
    {
        id: '1',
        title: 'ミーティング',
        start: '2024-05-15T10:00:00+09:00',
        end: '2024-05-15T11:00:00+09:00',
        timeZone: 'Asia/Tokyo',
    },
    {
        id: '2',
        title: '打ち合わせ',
        start: '2024-05-20T14:00:00+09:00',
        end: '2024-05-20T15:00:00+09:00',
        timeZone: 'Asia/Tokyo',
    },
];

export async function getEvents(year: number, month: number): Promise<Event[]> {
    return eventData;
}

export function formatEventDate(event: Event, locale: string): string {
    const startDate = toDate(event.start, { timeZone: event.timeZone });
    const localStartDate = toZonedTime(startDate, getTimeZone(locale));
    const formatedDate = format(localStartDate, 'yyyy-MM-dd')
    // console.log(x)
    return formatedDate;
}

function getTimeZone(locale: string): string {
    // ロケールからタイムゾーンを取得する関数
    switch (locale) {
        case 'ja':
            return 'Asia/Tokyo';
        default:
            return 'UTC';
    }
}