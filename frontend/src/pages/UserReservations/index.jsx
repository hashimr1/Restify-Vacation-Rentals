import './index.css';
import ReservationCard from './ReservationCard'
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts';

function UserReservations() {
  const {token} = useContext(AuthContext);
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('requests');
  const [reqreservations, reqsetReservations] = useState([]);
  const [reqnextpage, reqsetNextPage] = useState(2)
  const [reqnext, reqsetNext] = useState();
  const [upreservations, upsetReservations] = useState([]);
  const [upnextpage, upsetNextPage] = useState(2)
  const [upnext, upsetNext] = useState();
  const [hisreservations, hissetReservations] = useState([]);
  const [hisnextpage, hissetNextPage] = useState(2)
  const [hisnext, hissetNext] = useState();

  const showRequests = () => {
    setActiveTab('requests');
  };

  const showUpcoming = () => {
    setActiveTab('upcoming');
  };

  const showHistory = () => {
    setActiveTab('history');
  };

  const getMoreRes = (type) => {
    var next = false;
    var nextpage = 2;
    var setReservations;
    var setNext;
    var setNextPage;
    var reservations = [];

    if (type === "requests") { 
      next = reqnext; nextpage = reqnextpage
      setReservations = reqsetReservations;
      setNext = reqsetNext;
      setNextPage = reqsetNextPage;
      reservations = reqreservations;
    } else if (type ==="upcoming") { 
      next = upnext; nextpage = upnextpage
      setReservations = upsetReservations;
      setNext = upsetNext;
      setNextPage = upsetNextPage;
      reservations = upreservations;
    } else { 
      next = hisnext; nextpage = hisnextpage
      setReservations = hissetReservations;
      setNext = hissetNext;
      setNextPage = hissetNextPage;
      reservations = hisreservations;
    }

    if (next) {
      fetch('http://localhost:8000/reservations/guest/reservations/?page=' + nextpage + "&tab="  + type, {
      headers: {
        'Authorization' : 'Bearer ' + token
      }
    })
    .then(response => response.json())
    .then(data => {
      setReservations(reservations.concat(data.results));
      setNext(data.next !== null);
      setNextPage(nextpage + 1);
    })
    .catch((error) => {
      console.log(error)
    });
    }
  }

  const getResList = (type) => {
    var setReservations;
    var setNext;
    var setNextPage;

    if (type === "requests") { 
      setReservations = reqsetReservations;
      setNext = reqsetNext;
      setNextPage = reqsetNextPage;
    } else if (type ==="upcoming") { 
      setReservations = upsetReservations;
      setNext = upsetNext;
      setNextPage = upsetNextPage;
    } else { 
      setReservations = hissetReservations;
      setNext = hissetNext;
      setNextPage = hissetNextPage;
    }

    fetch('http://localhost:8000/reservations/guest/reservations/?page=1&tab=' + type, {
      headers: {
        'Authorization' : 'Bearer ' + token
      }
    })
    .then(response => {
      if (response.status === 401){
        setLoggedIn(false);
      } else {
        setLoggedIn(true);
        response.json().then(data => {
          setReservations(data.results);
          setNext(data.next !== null);
          setNextPage(2);
        })
      }
      })
    .catch((error) => {
      console.log(error)
    });
  }

  useEffect(() => {
    getResList("requests");
    getResList("history");
    getResList("upcoming");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const cancelReservation = (res_id) => { if (window.confirm("Are you sure you want to cancel?")){
    fetch('http://localhost:8000/reservations/' + res_id + '/cancel/', {
        headers: {
            'Authorization' : 'Bearer ' + token
        }
    })
      .then(response => response.json())
      .then(data => {console.log(data);
        getResList("requests");
        getResList("history");
        getResList("upcoming");
        })
      .catch((error) => {
        console.log(error)
      });
    }
  };

  // console.log(next);
  return (
    <main>
      {!loggedIn ? (<main><br/><h1>Please log in to see reservations</h1></main>):
      (<>
    <br/>
        <h1>My Reservations</h1>
    <br/>
    <div id="outer-reservation-div">
      <div id="tabs">
        <input type="radio" id="requests-button" name="tab" style={{ display: 'none' }} onClick={showRequests} defaultChecked={activeTab === 'requests'}/>
        <label htmlFor="requests-button" className="tab">
          <h2>Requests</h2>
        </label>
        <input type="radio" id="upcoming-button" name="tab" style={{ display: 'none' }} onClick={showUpcoming} defaultChecked={activeTab === 'upcoming'}/>
        <label htmlFor="upcoming-button" className="tab">
          <h2>Upcoming</h2>
        </label>
        <input type="radio" id="history-button" name="tab" style={{ display: 'none' }} onClick={showHistory} defaultChecked={activeTab === 'history'}/>
        <label htmlFor="history-button" className="tab">
          <h2>History</h2>
        </label>
      </div>
      {activeTab === 'requests' && (
        <div id="requests-div" className="reservation-div">
          {reqreservations.map((reservation) => {
            if (reservation.status === 'Pending') {
              return (<ReservationCard
              key={reservation.pk}
              reservation_id={reservation.pk}
              property={reservation.property}
              date={`${reservation.start_date} - ${reservation.end_date}`}
              status={reservation.status}
              cancel={cancelReservation}
            />)
            } else {
              return null;
            }
          })}
          {reqnext ?
          <button id="load-btn" onClick={() => {getMoreRes("requests")}}> Load more </button>: null}
        </div>
      )}
      {activeTab === 'upcoming' && (
        <div id="upcoming-div" className="reservation-div">
          {upreservations.map((reservation) => {
            if (reservation.status === 'Approved' || reservation.status === 'Cancellation_Request') {
              return (<ReservationCard
              key={reservation.pk}
              reservation_id={reservation.pk}
              property={reservation.property}
              date={`${reservation.start_date} - ${reservation.end_date}`}
              status={reservation.status}
              cancel={cancelReservation}
            />)
            } else {
              return null;
            }
          })}
          {upnext ?
          <button id="load-btn" onClick={() => {getMoreRes("upcoming")}}> Load more </button>: null}
        </div>
      )}
      {activeTab === 'history' && (
        <div id="history-div" className="reservation-div">
          {hisreservations.map((reservation) => {
            if (reservation.status === 'Terminated' || reservation.status === 'Completed' || reservation.status === 'Denied' || reservation.status === "Expired" || reservation.status === 'Canceled' ) {
              return (<ReservationCard
              key={reservation.pk}
              reservation_id={reservation.pk}
              property={reservation.property}
              date={`${reservation.start_date} - ${reservation.end_date}`}
              status={reservation.status}
              cancel={cancelReservation}
            />)
            } else {
              return null;
            }
          })}
          {hisnext ?
          <button id="load-btn" onClick={() => {getMoreRes("history")}}> Load more </button>: null}
        </div>
      )}
    </div>
      </>)}
    </main>
  )
};

export default UserReservations;