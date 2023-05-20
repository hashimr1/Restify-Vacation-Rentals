import { useState, useEffect, useContext } from "react";
import {Trash} from 'react-feather';
import { AuthContext } from "../../contexts";

const PropertyRanges = (props) => {
    const property_id = props.property_id;
    const {token} = useContext(AuthContext);
    const [ranges, setRanges] = useState([]);

    const getRanges = () => {
        fetch(`http://localhost:8000/properties/${property_id}/showavailability/`)
        .then(response => response.json())
        .then(data => {setRanges(data)
            // console.log(data.results[0])
        })
    }

    

    const deleteRange = (id) => {
        fetch(`http://localhost:8000/properties/${id}/deleteavailability/`, {
            method: 'DELETE',
            headers: {
                'Authorization' : "Bearer " + token,
            }
        })
        .then(response => {
            if (response.status === 204){
                const updatedRanges = ranges.filter(obj => obj.pk !== id);
                setRanges(updatedRanges);
            } else if (response.status === 401) {
                alert("You are not authorized to delete this");
                return
            }
        })
    }
    
    useEffect(() => {
        getRanges()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <div id="property-range-div">
        <div className="range-card">
                <h3>Price</h3>
                <h3>Start Date</h3>
                <h3>End Date</h3>
                <h3>-</h3>
        </div>
        {ranges.map((range) => {
            return <div key={range.pk} className="range-card">
                <h3>${parseFloat(range.price).toFixed(2)}</h3>
                <h3>{range.start_date}</h3>
                <h3>{range.end_date}</h3>
                <Trash className="delete-range-icon" onClick={() =>
                deleteRange(range.pk)}/>
            </div>
        })}
    </div>
}

export default PropertyRanges