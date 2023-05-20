import './index.css';
import React, { useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';

function RequestCard(props) {
    const navigate = useNavigate();
    const [property, setProperty] = useState({});
    const [guestName, setGuest] = useState({});

    useEffect(() => {
        fetch('http://localhost:8000/properties/searchproperty/?pk=' + String(props.property))
        .then(response => response.json())
        .then(data => {setProperty(data.results[0])
        })
        .catch((error) => {
        console.log(error)
        });
    }, [props.property]);

    useEffect(() => {
        fetch("http://localhost:8000/accounts/get/" + String(props.guest) + "/")
        .then(response => {
            if (response.ok) {
                response.json().then(data => {
                    setGuest(data);
                })
            }
        })
    }, [])

    const rejectReservation = () =>{
        props.reject(props.reservation_id)
    }

    const approveReservation = () =>{
        props.approve(props.reservation_id)
    }

    const cancelReservation = () =>{
        props.cancel(props.reservation_id)
    }

    const terminateReservation = () =>{
        props.terminate(props.reservation_id)
    }

    const leaveReview = () =>{
        navigate("/user/comment/" + props.reservation_id + "/" + guestName.first_name);
    }

    return (
        <div className="request-card">
            <Link to={`/view_listing/${props.property}`}>
            <img className="property-pic" src={property.preview} width="100px" height="100px" alt="property_image"/>
            </Link>
            <div className="res-info">
                <h3><b>Property:</b> {property.name}</h3>
                <h4 id="g_name"><b>Guest:</b> <Link className='profile-link-requests' to={`/${guestName.pk}/view_profile`}>{guestName.first_name} {guestName.last_name}</Link></h4>
                <h3>{props.date}</h3>
            </div>
            <div className="right-buttons">
                <button className="reject-button status-button">
                        {props.status}
                </button>
                {(props.status === 'Pending') && (
                    <button className="approve-button" onClick={approveReservation}>
                        Approve
                    </button>)
                }
                {/* {(props.status === 'Terminated' || props.status === 'Denied' || props.status === "Expired" || props.status === 'Canceled') && (
                    <button className="reject-button">
                        {props.status}
                    </button>)
                } */}
                {(props.status === 'Completed') && (
                    <button className="approve-button" onClick={leaveReview}>
                        Leave Review
                    </button>)
                }
                {(props.status === 'Cancellation_Request') && (
                    <button className="approve-button" onClick={cancelReservation}>
                        Cancel
                    </button>)
                }
                {(props.status === 'Pending') && (
                    <button className="reject-button" onClick={rejectReservation}>
                        Reject
                    </button>
                )}
                {(props.status === 'Approved') && (
                    <button className="reject-button" onClick={terminateReservation}>
                        Terminate
                    </button>
                )}
            </div>
        </div>
        );
}

export default RequestCard;