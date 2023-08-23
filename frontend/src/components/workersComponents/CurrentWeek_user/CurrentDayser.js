import React, { useState, useLayoutEffect } from 'react';
import styles from './currentWeekUser.module.css';
import Shift from './CurrentShiftUser';
import moment from "moment";

const CurrentDayUser = (props) => {

  const [day] = useState(props.day);

  useLayoutEffect(() => {
    const today = moment().format('YYYY-MM-DD');
    if (moment(day.date).format('YYYY-MM-DD') === today) {
        // Delay the scroll by 2 seconds
        const scrollTimeout = setTimeout(() => {
            const dayContainer = document.getElementById(`day_${day.date}`);
            if (dayContainer) {
                dayContainer.scrollIntoView({ behavior: 'smooth' });
            }
        }, 1000);

        return () => clearTimeout(scrollTimeout);
    }
}, [day.date]);

  return (
    <div>
      <div className={styles.day_container} id={`day_${day.date}`}>
        
        <h2 className={styles.h2}>{day.name} - {moment(day.date).format('DD.MM')}</h2>

        {day.shifts?.length === 0 ? (
          <div className={styles.no_shifts_message}>אין משמרות ליום זה</div>
        ) : (
          day.shifts.map((shift) => (
            <Shift managerId={props.managerId} key={shift._id} shift={shift}></Shift>
          ))
        )}

      </div>
    </div>
  );
};

export default CurrentDayUser;
