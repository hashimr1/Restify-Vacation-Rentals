import './index.css';
import React, { useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';

function ReservationCard(props) {
    const navigate = useNavigate();
    const [property, setProperty] = useState({});

    useEffect(() => {
        // console.log('http://localhost:8000/properties/searchproperty/?pk=' + String(props.property))
        fetch('http://localhost:8000/properties/searchproperty/?pk=' + String(props.property))
        .then(response => response.json())
        .then(data => {setProperty(data.results[0])
            // console.log(data.results[0])
        })
        .catch((error) => {
        console.log(error)
        });
    }, [props.property]);

    const leaveReview = () => {
        navigate("/property/comment/" + props.reservation_id + "/" + property.name);
    };

    const cancelReservation = () =>{
        props.cancel(props.reservation_id)
    }

    return (
        <div className="reservation-card">
            <Link to={`/view_listing/${props.property}`}>
            <img className="property-pic" src={property.preview} width="100px" height="100px" alt="property_image"/>
            </Link>
            <div className="res-info">
                <h3>{property.name}</h3>
                <h4 id="date">{props.date}</h4>
            </div>
            <div className="right-buttons">
                <div className="reservation-status">
                    <h3>{props.status.replace(/_/g, ' ')}</h3>
                </div>
                {(props.status === 'Completed') && (
                    <button className="leave-review-button" onClick={leaveReview}>
                        Leave Review
                    </button>)
                }
                {(props.status === 'Pending' || props.status === 'Approved') && (
                    <button className="cancel-button" onClick={cancelReservation}>
                        Cancel
                    </button>
                )}
            </div>
        </div>
        );
}

export default ReservationCard;