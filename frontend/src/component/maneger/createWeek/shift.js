import React, { useState } from "react";
import styles from '../createWeek/createWeek.module.css'
import axios from 'axios';

const Shift = (props) => {

    const [shift, setShift] = useState(props.shift);

    const deleteShift = async () => {
        try {
            await axios.delete(`http://localhost:3001/app/deleteShift/${shift._id}`)
              .then(response => {
                props.getShifts()
              })
              .catch(error => {
                console.log(error.response.data.error);
              });
          } catch (error) {
            console.log(error.message);
          }
    }

    return <div className={styles.shift}>
        <p className={styles.shift_name}>{shift.description}</p>
        <p>משעה - {shift.startTime} עד {shift.endTime}</p>
        <button className={styles.btn_delete} onClick={deleteShift}>מחיקת משמרת</button>
        {/* <p>workers:</p>
        {
           shift.workers ? shift.workers.map((worker) => {return <p>worker</p>}) : null
        } */}
    </div>
}

export default Shift