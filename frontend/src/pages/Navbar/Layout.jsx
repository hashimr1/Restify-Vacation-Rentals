import {Link, Outlet} from "react-router-dom";
import logo from '../../assets/restifytextlogo.png'
import { Bell, Menu } from 'react-feather';
import { useState, useEffect, useContext } from "react";
import NotificationCard from './NotificationCard'
import './Layout.css';
import { AuthContext } from "../../contexts";


//const token = "ezIiwiZXhwIjoxNjc5OTY3MzA1LCJpYXQiOjE2Nzk4ODA5MDUsImp0aSI6IjFiMzdiNDhmNzM3NzRhZWQ4NDFkMGExMGJiZjBkNjNhIiwidXNlcl9pZCI6Mn0.T3x4ob2hYG6wh2KZGPhhSVyFe5QQjvQrjuJ4xJoG5qs";

const Layout = () => {
  const {token, setToken} = useContext(AuthContext);
  // set this to true if the user is logged in
  const [loggedIn, setLoggedIn] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationNextPage, setNextNotificationPage] = useState(1);
  const [notificationNext, setNotificationNext] = useState(false);
  const [userData, setUserData] = useState({});



  const fetchToken = () => {
    setToken(localStorage.getItem('token'));
  }

  const getNotifications = () => {
    // console.log("grabbing notifs: " + token);
    fetch('http://localhost:8000/social/notifications/?page=1', {
      method: 'GET',
      headers: {
        'Authorization' : "Bearer " + token,
      }
    })
    .then(response => {if(response.status === 401) {
      setNotifications([])
      // console.log("not authenticated");
      // console.log(response);
      // console.log(token);
      setLoggedIn(false);
      }
      else {
      response.json().then(data => {
        setLoggedIn(true);
        setNotifications(data.results);
        setNotificationNext(data.next !== null);
        setNextNotificationPage(2);
        // console.log(data.next !== null);
        // console.log(data.results);
        // console.log(next);
      })}
    })
    .catch((error) => {
      console.log(error)
    });
  }

  const getMoreNotifications = () => {
    if (notificationNextPage) {
      fetch('http://localhost:8000/social/notifications/?page=' + notificationNextPage, {
      method: 'GET',
      headers: {
        'Authorization' : 'Bearer ' + token
      }
    })
    .then(response => response.json())
    .then(data => {
      setNotifications(notifications.concat(data.results));
      setNotificationNext(data.next !== null);
      setNextNotificationPage(notificationNextPage + 1);
    })
    .catch((error) => {
      console.log(error)
    });
    }
  }

  const getUserData = () => {
    // console.log("grabbing user: " + token);
    fetch('http://localhost:8000/accounts/view/', {
      headers: {
        'Authorization' : 'Bearer ' + token
      }
    })
    .then(response => {if(response.status === 401) {
      setLoggedIn(false);}
      else {
      response.json().then(data => {
        setUserData(data);
        setLoggedIn(true);
        window.localStorage.setItem('token', token);
      })
      }}
    )
    .catch((error) => {
      console.log(error)
    })
  }

  const signOut = () => {
    setToken("");
    localStorage.setItem('token', "");
    setLoggedIn(false);
    window.location.reload();
  }

  useEffect(() => {
    fetchToken();
    getNotifications();
    getUserData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, localStorage.getItem('token')]);



  //functions for handling hover on search bar

    return <>
    <header>
    <nav>
      <Link to='/' id="logo" >
        <img src={logo} width="163px" height="58px" alt='logo'/>
      </Link>
      <div id="rightelements">
        <div className="dropdown">
          <button className="dropbtn">
              <Bell color="black"/>
          </button>
          <div className="dropdown-content-b">
            <h1>Notifications</h1>
            <div className='notifications-div'>
            {!loggedIn && (<h3>Please log in to see notifications</h3>)}
            {notifications.map((notification) => {
              return <NotificationCard
              key={notification.pk}
              pk={notification.pk}
              message={notification.message}
              setNotifications={setNotifications}
              setNextNotificationPage={setNextNotificationPage}
              setNotificationNext={setNotificationNext}/>
            })}
            </div>
            {notificationNext ? <button className='load-btn' onClick={getMoreNotifications}>Load More</button>: null}
          </div>
        </div>
        <div className="dropdown">
          <button className="dropbtn">
              <Menu color="black" />
          </button>
              {loggedIn ? (<div className="dropdown-content-a">
              <img id="profile-pic" src={userData.photo} width="100px" height="100px" alt="profile-pic"/>
              <h1>{userData.username}</h1>
              <Link to={`/${userData.pk}/view_profile/`}>View Profile</Link>
              <Link to="/edit_profile/">Edit Profile</Link>
              <Link to="/user_reservations">View Reservations</Link>
              <Link to="/my_listings">My Listings</Link>
              <Link to="/user_requests">Listing Requests</Link>
              <button onClick={signOut}>Sign Out</button>
              </div>): (<div className="dropdown-content-a">
              <Link to="/login">Log in</Link>
              </div>)}

        </div>
      </div>
    </nav>
    </header>
      <Outlet />
    </>;
};

export default Layout;
    