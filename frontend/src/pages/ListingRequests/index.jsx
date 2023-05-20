import './index.css';
import RequestCard from './RequestCard'
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts';

function UserRequests() {
  const {token} = useContext(AuthContext);
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [reqreservations, reqsetReservations] = useState([]);
  const [reqnextpage, reqsetNextPage] = useState(2)
  const [reqnext, reqsetNext] = useState();
  const [upreservations, upsetReservations] = useState([]);
  const [upnextpage, upsetNextPage] = useState(2)
  const [upnext, upsetNext] = useState();
  const [hisreservations, hissetReservations] = useState([]);
  const [hisnextpage, hissetNextPage] = useState(2)
  const [hisnext, hissetNext] = useState();

  const showPending = () => {
    setActiveTab('pending');
  };

  const showApproved = () => {
    setActiveTab('approved');
  };

  const showRejected = () => {
    setActiveTab('rejected');
  };

  const getMoreRes = (type) => {
    var next = false;
    var nextpage = 2;
    var setReservations;
    var setNext;
    var setNextPage;
    var reservations = [];

    if (type === "pending") { 
      next = reqnext; nextpage = reqnextpage
      setReservations = reqsetReservations;
      setNext = reqsetNext;
      setNextPage = reqsetNextPage;
      reservations = reqreservations;
    } else if (type === "approved") { 
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
      fetch('http://localhost:8000/reservations/host/reservations/?page=' + nextpage + "&tab="  + type, {
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

    if (type === "pending") { 
      setReservations = reqsetReservations;
      setNext = reqsetNext;
      setNextPage = reqsetNextPage;
    } else if (type === "approved") { 
      setReservations = upsetReservations;
      setNext = upsetNext;
      setNextPage = upsetNextPage;
    } else { 
      setReservations = hissetReservations;
      setNext = hissetNext;
      setNextPage = hissetNextPage;
    }

    fetch('http://localhost:8000/reservations/host/reservations/?page=1&tab=' + type, {
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
    getResList("pending");
    getResList("approved");
    getResList("rejected");
  }, [token]);

  const rejectRequest = (res_id) => { if (window.confirm("Are you sure you want to reject this request?")){
    fetch('http://localhost:8000/reservations/' + res_id + '/deny/', {
        headers: {
            'Authorization' : 'Bearer ' + token
        }
    })
      .then(response => response.json())
      .then(data => {console.log(data);
        getResList("pending");
        getResList("approved");
        getResList("rejected");
        })
      .catch((error) => {
        console.log(error)
      });
    }
  };

  const cancelRequest = (res_id) => { if (window.confirm("Are you sure you want to cancel this request?")){
    fetch('http://localhost:8000/reservations/' + res_id + '/cancel/', {
        headers: {
            'Authorization' : 'Bearer ' + token
        }
    })
      .then(response => response.json())
      .then(data => {console.log(data);
        getResList("pending");
        getResList("approved");
        getResList("rejected");
        })
      .catch((error) => {
        console.log(error)
      });
    }
  };

  const terminateRequest = (res_id) => { if (window.confirm("Are you sure you want to terminate this request?")){
    fetch('http://localhost:8000/reservations/' + res_id + '/terminate/', {
        headers: {
            'Authorization' : 'Bearer ' + token
        }
    })
      .then(response => response.json())
      .then(data => {console.log(data);
        getResList("pending");
        getResList("approved");
        getResList("rejected");
        })
      .catch((error) => {
        console.log(error)
      });
    }
  };

  const approveRequest = (res_id) => { if (window.confirm("Are you sure you want to approve this request?")){
    fetch('http://localhost:8000/reservations/' + res_id + '/approve/', {
        headers: {
            'Authorization' : 'Bearer ' + token
        }
    })
      .then(response => response.json())
      .then(data => {console.log(data);
        getResList("pending");
        getResList("approved");
        getResList("rejected");
        })
      .catch((error) => {
        console.log(error)
      });
    }
  };

  return (
    <main>
      {!loggedIn ? (<main><br/><h1>Please log in to see requests</h1></main>):
      (<>
    <br/>
        <h1>My Requests</h1>
    <br/>
    <div id="outer-reservation-div">
      <div id="tabs">
        <input type="radio" id="pending-button" name="tab" style={{ display: 'none' }} onClick={showPending} defaultChecked={activeTab === 'pending'}/>
        <label htmlFor="pending-button" className="tab">
          <h2>Pending</h2>
        </label>
        <input type="radio" id="approved-button" name="tab" style={{ display: 'none' }} onClick={showApproved} defaultChecked={activeTab === 'approved'}/>
        <label htmlFor="approved-button" className="tab">
          <h2>Approved</h2>
        </label>
        <input type="radio" id="rejected-button" name="tab" style={{ display: 'none' }} onClick={showRejected} defaultChecked={activeTab === 'rejected'}/>
        <label htmlFor="rejected-button" className="tab">
          <h2>Rejected</h2>
        </label>
      </div>
      {activeTab === 'pending' && (
        <div id="pending-div" className="reservation-div">
          {reqreservations.map((reservation) => {
            if (reservation.status === 'Pending') {
              return (<RequestCard
              key={reservation.pk}
              guest={reservation.guest}
              reservation_id={reservation.pk}
              property={reservation.property}
              date={`${reservation.start_date} - ${reservation.end_date}`}
              status={reservation.status}
              reject={rejectRequest}
              approve={approveRequest}
              cancel={cancelRequest}
              terminate={terminateRequest}
            />)
            } else {
              return null;
            }
          })}
          {reqnext ?
          <button id="load-btn" onClick={() => {getMoreRes("pending")}}> Load more </button>: null}
        </div>
      )}
      {activeTab === 'approved' && (
        <div id="approved-div" className="reservation-div">
          {upreservations.map((reservation) => {
            if (reservation.status === 'Approved' || reservation.status === 'Cancellation_Request' || reservation.status === 'Completed') {
              return (<RequestCard
              key={reservation.pk}
              guest={reservation.guest}
              reservation_id={reservation.pk}
              property={reservation.property}
              date={`${reservation.start_date} - ${reservation.end_date}`}
              status={reservation.status}
              reject={rejectRequest}
              approve={approveRequest}
              cancel={cancelRequest}
              terminate={terminateRequest}
            />)
            } else {
              return null;
            }
          })}
          {upnext ?
          <button id="load-btn" onClick={() => {getMoreRes("approved")}}> Load more </button>: null}
        </div>
      )}
      {activeTab === 'rejected' && (
        <div id="rejected-div" className="reservation-div">
          {hisreservations.map((reservation) => {
            if (reservation.status === 'Terminated' || reservation.status === 'Denied' || reservation.status === "Expired" || reservation.status === 'Canceled') {
              return (<RequestCard
              key={reservation.pk}
              guest={reservation.guest}
              reservation_id={reservation.pk}
              property={reservation.property}
              date={`${reservation.start_date} - ${reservation.end_date}`}
              status={reservation.status}
              reject={rejectRequest}
              approve={approveRequest}
              cancel={cancelRequest}
              terminate={terminateRequest}
            />)
            } else {
              return null;
            }
          })}
          {hisnext ?
          <button id="load-btn" onClick={() => {getMoreRes("rejected")}}> Load more </button>: null}
        </div>
      )}
    </div>
      </>)}
    </main>
  )
};

export default UserRequests;