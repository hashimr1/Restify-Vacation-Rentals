import { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts";
import './addavailability.css';

const AddAvailability = () => {
    const { id, prop_name } = useParams();
    const {token} = useContext(AuthContext);
    const [availabilityData, setAvailabilityData] = useState({
        start_date:"",
        end_date:"",
        price:0
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value} = event.target;
        setAvailabilityData({ ...availabilityData, [name]: value });
    };

    const checkValues = () => {
        var new_error = "";
        if (availabilityData.start_date > availabilityData.end_date){
            new_error = new_error + "Start date cannot be after end date \n"
        }
        if (availabilityData.price < 0){
            new_error = new_error + "Price cannot be less than 0"
        }
        if (availabilityData.start_date === "" || availabilityData.end_date === "" || availabilityData.price === ""){
            new_error = new_error + "At least 1 field is still blank"
        }

        setError(new_error);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        checkValues();

        const formData = new FormData();
        formData.append("property", id)
        formData.append("start_date", availabilityData.start_date);
        formData.append("end_date", availabilityData.end_date);
        formData.append("price", availabilityData.price);

        fetch(`http://127.0.0.1:8000/properties/${id}/addavailability/`, {
            method: "POST",
            headers: {
                'Authorization' : 'Bearer ' + token
                },
            body: formData
        })
        .then(response => {
            if (response.ok) {
                navigate(`/edit_property/${id}`);
            } else if (response.status === 401){
                setError("Not authorized, please try logging in")
            } else {
                response.json().then(data=> {
                    setError(data);
                })
            }
        })

    }

    return (
        <main>
            <br/>
            <h1>Add an availability for property: {prop_name} </h1>
            <form id="availability" onSubmit={handleSubmit}>
                <label htmlFor="start_date">Start Date</label>
                <input
                type="date"
                className="availability-inputs"
                name="start_date"
                onChange={handleChange}
                />
                <label htmlFor="end_date">End Date</label>
                <input
                type="date"
                className="availability-inputs"
                name="end_date"
                onChange={handleChange}
                />
                <label htmlFor="price">Price</label>
                <input
                type="number"
                className="availability-inputs"
                name="price"
                onChange={handleChange}
                />
                <h1 id="error-field">{error}</h1>
                <button type="submit">Add Availability</button>
            </form>

        </main>
    )
}

export default AddAvailability