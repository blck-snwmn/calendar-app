/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import type React from 'react';
import { formatEventDate, type Event } from '~/utils/events';
import { setYear, setMonth, setDate, format, isEqual } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

type CalendarProps = {
    year: number;
    month: number; // 月は0基準で、0が1月、11が12月です。
    holidays: { [date: string]: boolean }; // 日付をキーとして、休日かどうかのブール値を持つ
    locale: string;
    events: Event[];
};

const calendarContainerStyle = css`
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    justify-content: start;
    width: 100%;
`;

const weekdayStyle = css`
    flex: 0 0 14%;
    height: 30px; /* 曜日行の高さ */
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f0f0f0; /* 曜日背景色 */
`;

const dayStyle = css`
    flex: 0 0 14%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    height: 100px;
    margin: 0;
    background-color: #fff;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    transition: background-color 0.2s;
    gap: 8px;
    padding: 8px;
    box-sizing: border-box;
    &:hover {
        background-color: #e0e0e0;
    }
`;

const holidayStyle = css`
    color: red;
`;

const emptyDayStyle = css`
    flex: 0 0 14%;
    height: 100px;
    margin: 0;
`;

const eventStyle = css`
    font-size: 0.9em;
    padding: 4px;
    border-radius: 4px;
    background-color: #f0f0f0;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 4px;
`;

const daysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
};

const Calendar: React.FC<CalendarProps> = ({ year, month, holidays, locale, events }) => {
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const numDays = daysInMonth(year, month);
    const firstDay = new Date(year, month, 1).getDay();
    const prevMonthDays = daysInMonth(year, month - 1);

    const days = Array.from({ length: numDays }, (_, i) => {
        const day = i + 1;
        const date = new Date(year, month, day);
        const isHoliday = holidays[format(date, 'yyyy-MM-dd')] || false;
        const dayEvents = events.filter(event => isEqual(formatEventDate(event, locale), date));
        return { day, isHoliday, events: dayEvents };
    });

    const prevMonthDates = Array.from({ length: firstDay }, (_, i) => {
        const day = prevMonthDays - firstDay + i + 1;
        return { day, isHoliday: false, events: [] };
    });

    const allDates = [...prevMonthDates, ...days];

    return (
        <div css={calendarContainerStyle}>
            {weekdays.map(weekday => (
                <div key={weekday} css={weekdayStyle}>{weekday}</div>
            ))}
            {allDates.map(({ day, isHoliday, events }, index) => (
                <div
                    key={`day-${year}-${month}-${day}`}
                    css={[dayStyle, isHoliday && holidayStyle]}
                >
                    <div>{day}</div>
                    {events.map(event => (
                        <div key={event.id} css={eventStyle}>{event.title}</div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Calendar;
