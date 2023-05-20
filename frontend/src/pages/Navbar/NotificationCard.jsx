import { useContext } from 'react';
import { Trash } from 'react-feather';
import { AuthContext } from '../../contexts';

// const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjc5ODcwMjUwLCJpYXQiOjE2Nzk3ODM4NTAsImp0aSI6Ijg1YmIyMGEwNzQ4NDRjNmRhZDA1ZWY4MmViM2U4ZWQwIiwidXNlcl9pZCI6MX0.MOP0zu2ij8Io6gbUZujSFL6ZGyA3IhTSv6dQO9FF5k0";

const NotificationCard = (props) => {
  const {token} = useContext(AuthContext);

    const getNotifications = () => {
        fetch('http://localhost:8000/social/notifications/?page=1', {
            method: 'GET',
            headers: {
            'Authorization' : 'Bearer ' + token
            }
        })
        .then(response => response.json())
        .then(data => {
            props.setNotifications(data.results);
            props.setNotificationNext(data.next !== null);
            props.setNextNotificationPage(2);
            // console.log(data.next !== null);
            // console.log(data.results);
            // console.log(next);
        })
        .catch((error) => {
            console.log(error)
        });
    }

    const clearNotification = () => {
        fetch('http://localhost:8000/social/notifications/'+ props.pk +'/delete/', {
          method: "DELETE",
          headers: {
            'Authorization' : 'Bearer ' + token
          }
        })
        .then(response => {getNotifications();})
        .catch((error) => {
          console.log(error)
        });
      }
    
    return(
    <div className="notification-card">
        <p className="notification-description">{props.message}</p>
        <button className="delete-noti-btn" onClick={clearNotification}><Trash /></button>
    </div>
    )
}

export default NotificationCard;