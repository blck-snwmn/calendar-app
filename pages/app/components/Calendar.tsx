// biome-ignore lint/style/useImportType: <explanation>
import React, { useMemo } from "react";

import styles from './Calendar.module.css';

type CalendarProps = {
    year: number;
    month: number; // 月は0基準で、0が1月、11が12月です。
};

const daysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
};

const Calendar: React.FC<CalendarProps> = ({ year, month }) => {
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const numDays = daysInMonth(year, month);
    const startDay = new Date(year, month, 1).getDay();

    const days = Array.from({ length: numDays }, (_, i) => i + 1);
    const emptyDays: (number | null)[] = Array.from({ length: startDay }, () => null);
    const totalCells = emptyDays.concat(days);

    return (
        <div className={styles.calendarContainer}>
            {weekdays.map(weekday => (
                <div key={weekday} className={styles.weekday}>{weekday}</div>
            ))}
            {emptyDays.map((_, index) => (
                <div key={`empty-${year}-${month}`} className={styles.emptyDay} />
            ))}
            {days.map(day => (
                <div key={`day-${year}-${month}-${day}`} className={styles.day}>
                    {day}
                </div>
            ))}
        </div>
    );
};

export default Calendar;