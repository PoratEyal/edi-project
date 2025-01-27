import PageLayout from './/..//..//layout/PageLayout';
import styles from './workers.module.css';
import { ManagerContext } from '../ManagerHomePage';
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import Worker from './worker';
import LoadingAnimation from '../../loadingAnimation/loadingAnimation';
import PopUpAddWorker from '../../popups/addWorker/popUpAddWorker';

const Workers = () => {

  const navigate = useNavigate();

  const [users, setUsers] = useState([])
  const [noWorkers, setNoWorkers] = useState(false)
  const [userDeleted, setUserDelted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [roles, setRoles] = useState([]);
  const [setOpenOptions] = useState(null);
  const [isDivVisible, setDivVisible] = useState(false);

  const [isBackdropVisible, setIsBackdropVisible] = useState(false);
  const [clickAddShift, setClickAddShift] = useState(false);

  const divRef = useRef(null);

  const managerContext = useContext(ManagerContext);

  const toggleBackdrop = () => {
    setIsBackdropVisible(!isBackdropVisible);
  };  

  const getRoles = () => {
    const token = localStorage.getItem("token");
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const reqbody = {
      managerId: managerContext.getUser()
    }
    axios
      .post(`${process.env.REACT_APP_URL}/getRoles`, reqbody, config)
      .then((response) => {
        setRoles(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const body = {
          job: managerContext.getUser()
        }
        const response = await axios.post(`${process.env.REACT_APP_URL}/getMyWorkers`, body);
        if (Array.isArray(response.data) && response.data.length === 0) {
          setNoWorkers(true)
        }
        setUsers(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
    getRoles();
  }, [userDeleted]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const body = {
          job: managerContext.getUser()
        }
        const response = await axios.post(`${process.env.REACT_APP_URL}/getMyWorkers`, body);
        setUsers(response.data);
        setLoading(true)
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  // control on the close and open the option select
  useEffect(() => {
    function handleOutsideClick(event) {
      if (divRef.current && !divRef.current.contains(event.target)) {
        setDivVisible(false);
      }
    }

    if (isDivVisible) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isDivVisible])

  // when click on the ... icon - set those two states
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
        setUserDelted(true)
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

  return (
    <PageLayout text='עובדים'>
      <div className={styles.container}>
        {!loading ? 
        <LoadingAnimation></LoadingAnimation>
        : 
        (
          noWorkers ? (
            <div className={styles.noWorkers_div}>לא קיימים עובדים</div>
          ) : (
            users.map((user) => (
              (user._id !== managerContext.getUser()) ? (
                <Worker user={user} roles={roles} key={user._id}></Worker>
              ) : null
            ))
          )
        )}

        {clickAddShift && (
            <React.Fragment>
                <div className={`${styles.backdrop} ${isBackdropVisible ? styles.visible : ''}`} onClick={() => {setClickAddShift(false); toggleBackdrop();}}></div>
                <PopUpAddWorker
                    onClose={() => {setClickAddShift(false); toggleBackdrop();}}
                    roles={roles}
                ></PopUpAddWorker>
            </React.Fragment>
        )}

      </div>

      <img
        onClick={() => setClickAddShift(true)}
        src='addUser.png'
        className={styles.addUser_btn}
      />
      
    </PageLayout>
  );
}
export default Workers;