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
    const numDays = useMemo(() => daysInMonth(year, month), [year, month]);
    const startDay = useMemo(() => new Date(year, month, 1).getDay(), [year, month]);

    const days = useMemo(() => Array.from({ length: numDays }, (_, i) => i + 1), [numDays]);
    const emptyDays = useMemo(() => Array.from({ length: startDay }, () => null), [startDay]);
    const totalCells = useMemo(() => emptyDays.concat(days), [emptyDays, days]);

    return (
        <div>
            <table className={styles.calendarTable}>
                <thead>
                    <tr>
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <th key={day} className={styles.headerCell}>{day}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: Math.ceil(totalCells.length / 7) }, (_, week) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                        <tr key={week} className={styles.weekRow}>
                            {totalCells.slice(week * 7, (week + 1) * 7).map((day, index) => (
                                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                                <td key={index} className={day ? styles.dayCell : styles.emptyCell}>
                                    {day || ''}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Calendar;