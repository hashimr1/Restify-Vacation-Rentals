import './index.css';
import React, { useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';

function ListingCard(props) {
    const navigate = useNavigate();
    const [property, setProperty] = useState({});

    useEffect(() => {
        fetch('http://localhost:8000/properties/searchproperty/?pk=' + String(props.property_id))
        .then(response => response.json())
        .then(data => {setProperty(data.results[0])
        })
        .catch((error) => {
            console.log(error)
        });
    }, [props.property]);

    const deleteProperty = () =>{
        props.delete(props.property_id)
    }

    const editListing = () => {
        navigate("/edit_property/" + props.property_id);
    };

    const addAvalibility = () => {
        navigate("../" + props.property_id + "/" + property.name + "/addavailability");
    };

    return (
        <div class="listing-card">
            <Link to={`/view_listing/${props.property_id}`}>
                <img class="property-pic" src={property.preview} alt="property-pic"/>
            </Link>
            <div class="req-info">
                <h3 id="name">{property.name}</h3>
                <p id="description">{property.description}</p>
            </div>

            <div class="l-buttons">
                <button class="edit-button side-button" onClick={editListing}>
                    Edit
                </button>
                <br></br>
                <button class="edit-button side-button" onClick={addAvalibility}>
                    Add Avalibility
                </button>
                <br></br>
                <button class="delete-buttton side-button" onClick={deleteProperty}>
                    Delete
                </button>
            </div>

        </div>
        );
}

export default ListingCard;