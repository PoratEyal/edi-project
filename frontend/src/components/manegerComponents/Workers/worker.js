import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './workers.module.css';
import axios from 'axios';
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiMoreHorizontal } from "react-icons/fi";
import { BiEditAlt } from "react-icons/bi";
import Swal from 'sweetalert2';

const Worker = (props) => {

    const navigate = useNavigate();
    const [isDivVisible, setDivVisible] = useState(false);
    const [openOptions, setOpenOptions] = useState(null);
    const [userDeleted, setUserDelted] = useState(false)
    const [clickEditWorker, setEditWorker] = useState(false);
    const [selectedRole, setRole] = useState("");

    const divRef = useRef(null);
    const user = props.user;

    const options = (shiftId) => {
        setOpenOptions(shiftId);
        setDivVisible(true);
    }

    const deleteUser = async (userId) => {
        Swal.fire({
            title: 'האם ברצונך למחוק את המשתמש',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'ביטול',
            confirmButtonColor: '#34a0ff',
            cancelButtonColor: '#d33',
            confirmButtonText: 'אישור'
        }).then(async (result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'המשתמש נמחק',
                    icon: 'success',
                    confirmButtonColor: '#34a0ff',
                    confirmButtonText: 'סגירה'
                }
                );
                try {
                    await axios.delete(`${process.env.REACT_APP_URL}/deleteUser/${userId}`)
                        .then(response => {
                            setUserDelted(true)
                        })
                        .catch(error => {
                            console.log(error.response.data.error);
                        });
                } catch (error) {
                    console.log(error.message);
                }
            }
        });
    }
    return <React.Fragment>
        <div key={user._id} className={styles.user_container}>
            <div>
                <div className={styles.delete_edit_div}>
                    <FiMoreHorizontal className={styles.icon} onClick={() => options(user._id)}></FiMoreHorizontal>

                    {openOptions === user._id && isDivVisible ?
                        <div ref={divRef} className={styles.edit_div_options}>
                            <div className={styles.edit_div_flex}>
                                <label onClick={() => { setEditWorker(!clickEditWorker); setDivVisible(false) }}>עריכת עובד</label>
                                <BiEditAlt onClick={() => { setEditWorker(!clickEditWorker); setDivVisible(false) }} className={styles.icon_edit_select}></BiEditAlt>
                            </div>

                            <div className={styles.edit_div_flex}>
                                <label onClick={() => { deleteUser(user._id); setDivVisible(false); setUserDelted(false); }}>מחיקת עובד</label>
                                <RiDeleteBin6Line className={styles.icon_edit_select} onClick={() => { deleteUser(user._id); setDivVisible(false); setUserDelted(false); }}></RiDeleteBin6Line>
                            </div>
                        </div> : null}
                </div>
            </div>
            <div>
                <p className={styles.p}>{user.fullName}</p>
            </div>
        </div>
        {
            clickEditWorker ? <div className={styles.editWorker}>
            <input className={styles.input_edit} defaultValue={user.fullName} type="text" placeholder="שם מלא"/>
            <input className={styles.input_edit} defaultValue={user.username} type="text" placeholder='שם משתמש'/>
            <input className={styles.input_edit}  type="password" placeholder='סיסמא'/>

            <select className={styles.select} onChange={(e) => { setRole(e.target.value) }} defaultValue="">
                  <option value="" disabled>תפקיד</option>
                  {props.roles.map(role => { return <option value={role._id} key={role._id}>{role.name}</option> })}
              </select>
            <div className={styles.btn_div}>
                <button
                    className={styles.edit_worker_btn}
                    onClick={() => {
                    }}
                >אישור
                </button>
                <button
                    className={styles.edit_worker_btn_cancel}
                    onClick={() => {setEditWorker(!clickEditWorker)
                    }}
                >ביטול
                </button>
            </div>
        </div> : null
        }
    </React.Fragment>
}
export default Worker