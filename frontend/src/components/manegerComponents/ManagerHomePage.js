import styles from '../manegerComponents/maneger_home_page.module.css'
import React, { useEffect, useState } from 'react'
import { Link, Outlet} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { BiLogOut } from "react-icons/bi";
import { BiUserCircle } from "react-icons/bi";
import { AiOutlineSchedule } from "react-icons/ai";
import { IoIosCreate } from "react-icons/io";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import Swal from 'sweetalert2';


const ManagerHomePage = () => {
    const navigate = useNavigate();
    let data = {};
    const [fullname, setName]= useState("");

    useEffect(() => {
        const StorageData = JSON.parse(localStorage.getItem("user"));
        if(StorageData){
            data = StorageData;
            setName(data.fullName);
        }
        else{
            navigate('/');
        }
    }, [])

    const signout = () => {
        Swal.fire({
            title: 'האם ברצונכם להתנתק',
            text: "",
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'ביטול',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'כן'
          }).then((result) => {
            if (result.isConfirmed) {
              localStorage.clear()
              navigate('./')
            }
          })
    }


    return <React.Fragment>
        <div className={styles.upperContainer}>
            <div className={styles.nav_buttons}>
                <Link to="/"><button className={styles.signout} onClick={signout}><BiLogOut></BiLogOut></button></Link>
                <Link to="/managerSettings"><button className={styles.user_settings}><BiUserCircle></BiUserCircle></button></Link>
                <Link to="/userManagment"><button className={styles.user_managment_btn}>עובדים</button></Link>
            </div>

            <h1 className={styles.h1}>{fullname}</h1>
        </div>

        <div className={styles.container}>
            <Link to="/SeeCurrentWeekShifts">
                <button className={styles.btn}>
                    <div>
                        {<AiOutlineSchedule className={styles.icon}></AiOutlineSchedule>} הצג משמרות נוכחיות
                    </div>
                </button>
            </Link>

            <Link to="/createNewWeek">
                <button className={styles.btn}>
                    <div>
                    {<IoIosCreate className={styles.icon}></IoIosCreate>} יצירת משמרות לשבוע הבא 
                    </div>
                </button>
            </Link> 

            <Link to="/currentWeekShifts">
                <button className={styles.btn}>
                    <div>
                        {<AiOutlineUsergroupAdd className={styles.icon3}></AiOutlineUsergroupAdd>} הקצאת משמרות לשבוע הבא
                    </div>
                </button>
            </Link>

            <Outlet />
        </div>
    </React.Fragment>
}

export default ManagerHomePage;
  