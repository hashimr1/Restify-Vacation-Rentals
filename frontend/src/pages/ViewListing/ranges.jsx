import { useState, useEffect, useContext } from "react";
import {Trash} from 'react-feather';
import { AuthContext } from "../../contexts";

const Ranges = (props) => {
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
    
    useEffect(() => {
        getRanges()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <div id="property-range-div">
        <div className="range-card">
                <h3>Price</h3>
                <h3>Start Date</h3>
                <h3>End Date</h3>
        </div>
        {ranges.map((range) => {
            return <div key={range.pk} className="range-card">
                <h3>${parseFloat(range.price).toFixed(2)}</h3>
                <h3>{range.start_date}</h3>
                <h3>{range.end_date}</h3>
            </div>
        })}
    </div>
}

export default Ranges