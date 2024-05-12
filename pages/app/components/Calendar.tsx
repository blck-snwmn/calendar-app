/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import type React from 'react';

type CalendarProps = {
    year: number;
    month: number; // 月は0基準で、0が1月、11が12月です。
    holidays: { [date: string]: boolean }; // 日付をキーとして、休日かどうかのブール値を持つ
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
    align-items: flex-start;
    justify-content: center;
    height: 100px;
    margin: 0;
    background-color: #fff;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    transition: background-color 0.2s;
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

const daysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
};

const Calendar: React.FC<CalendarProps> = ({ year, month, holidays }) => {
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const numDays = daysInMonth(year, month);
    const startDay = new Date(year, month, 1).getDay();
    const days = Array.from({ length: numDays }, (_, i) => {
        const day = i + 1;
        const date = `${year}-${month + 1}-${day}`;
        const isHoliday = holidays[date] || false;
        return { day, isHoliday };
    }); const emptyDays = Array.from({ length: startDay }, () => null);

    return (
        <div css={calendarContainerStyle}>
            {weekdays.map(weekday => (
                <div key={weekday} css={weekdayStyle}>{weekday}</div>
            ))}
            {emptyDays.map(() => (
                <div key={`empty-${year}-${month}`} css={emptyDayStyle} />
            ))}
            {days.map(({ day, isHoliday }) => (
                <div key={`day-${year}-${month}-${day}`} css={[dayStyle, isHoliday && holidayStyle]}>
                    {day}
                </div>
            ))}
        </div>
    );
};

export default Calendar;
