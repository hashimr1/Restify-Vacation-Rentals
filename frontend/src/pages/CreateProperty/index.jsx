import { useState, useContext } from "react";
import './index.css';
import { AuthContext } from "../../contexts";
import { useNavigate, Link } from 'react-router-dom';

const CreateProperty = () =>{
    const navigate = useNavigate();
    const {token} = useContext(AuthContext);
    const [selectedFile1, setSelectedFile1] = useState(null);
    const [selectedFile2, setSelectedFile2] = useState(null);
    const [selectedFile3, setSelectedFile3] = useState(null);
    const [success, setSuccess] = useState("");
  
    const [listingData, setListingData] = useState({
        host: 1,
        name: "",
        description: "",
        address: "",
        property_type: "",
        stay_type: "",
        beds: 0,
        baths: 0,
        guests: 0,
        tv: false,
        air_condition: false,
        wifi: false,
        kitchen: false,
        hair_dryer: false,
        heating: false,
        iron: false,
        washer: false,
        dryer: false,
        pool: false,
        free_parking: false,
        crib: false,
        grill: false,
        hot_tub: false,
        EV_charger: false,
        gym: false,
        indoor_fireplace: false,
        breakfast: false,
        smoking_allowed: false
    });

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        const newValue = type === "checkbox" ? checked : value;
        setListingData({ ...listingData, [name]: newValue });
    };

    const handlePreview = (event) => {
        setSelectedFile1(event.target.files[0]);
    };

    const handlePreview2 = (event) => {
        setSelectedFile2(event.target.files[0]);
    };

    const handlePreview3 = (event) => {
        setSelectedFile3(event.target.files[0]);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(listingData.name)
        if (listingData.name === "") {
            console.log("error");
        }
  
        const formData = new FormData();
        if (selectedFile1 !== null && selectedFile1 !== undefined){formData.append("preview", selectedFile1)}
        if (selectedFile2 !== null && selectedFile2 !== undefined){formData.append("preview2", selectedFile2)}
        if (selectedFile3 !== null && selectedFile3 !== undefined){formData.append("preview3", selectedFile3)}
        formData.append("host", listingData.host);
        formData.append("name", listingData.name);
        formData.append("description", listingData.description);
        formData.append("address", listingData.address);
        formData.append("property_type", listingData.property_type);
        formData.append("stay_type", listingData.stay_type);
        formData.append("beds", listingData.beds);
        formData.append("baths", listingData.baths);
        formData.append("guests", listingData.guests);
        formData.append("tv", listingData.tv);
        formData.append("air_condition", listingData.air_condition);
        formData.append("wifi", listingData.wifi);
        formData.append("kitchen", listingData.kitchen);
        formData.append("hair_dryer", listingData.hair_dryer);
        formData.append("heating", listingData.heating);
        formData.append("iron", listingData.iron);
        formData.append("washer", listingData.washer);
        formData.append("dryer", listingData.dryer);
        formData.append("pool", listingData.pool);
        formData.append("free_parking", listingData.free_parking);
        formData.append("crib", listingData.crib);
        formData.append("grill", listingData.grill);
        formData.append("hot_tub", listingData.hot_tub);
        formData.append("EV_charger", listingData.EV_charger);
        formData.append("gym", listingData.gym);
        formData.append("indoor_fireplace", listingData.indoor_fireplace);
        formData.append("breakfast", listingData.breakfast);
        formData.append("smoking_allowed", listingData.smoking_allowed);
  
        fetch("http://localhost:8000/properties/createproperty/", {
        method: "POST",
        headers: {
        'Authorization' : 'Bearer ' + token
        },
        body: formData
        })
        .then(response => {
            if (response.ok){
                response.json().then(data=> {
                    setSuccess("Creation Successful");
                    console.log(data);
                    navigate("/my_listings/");
                }
                );
            } else {
                setSuccess("");
                response.json().then(data=> {
                    for (var key in data) {
                        alert("Error for field " + key + ": " +  data[key][0]);
                    }
                    console.log(data);
                }
                )
            }
        })
        .then(data => console.log(data))
        .catch(error => {
            window.alert(error)});
    };

    return (
        <main>
            <br/>
                <h1>Set up your listing to become a host.</h1>
            <br/>
            <form id="main-div" onSubmit={handleSubmit}>
                <div class="step-div">
                    <h3>STEP 1</h3>
                    <h4>What kind of place are you listing?</h4>
                    <label htmlFor="property_type">What type of property is this?</label>
                        <div class="selection">
                            <select onChange={handleChange} required name="property_type">
                                <option></option>
                                <option value="Apartment">Apartment</option>
                                <option value="House">House</option>
                                <option value="Secondary unit">Secondary unit</option>
                                <option value="Unique space">Unique space</option>
                                <option value="Bed and breakfast">Bed and breakfast</option>
                                <option value="Boutique hotel">Boutique hotel</option>                             
                            </select>
                        </div>
                    <label htmlFor="stay_type">What will guests have?</label>
                    <div class="selection">
                        <select onChange={handleChange} required name="stay_type">
                            <option></option>
                            <option value="Private room">Private room</option>
                            <option value="Shared property">Shared property</option>
                            <option value="Whole place">Whole place</option>                           
                        </select>
                    </div>
                </div>

                <div class="step-div">
                    <h3>STEP 2</h3>
                    <h4>Where is the property located?</h4>
                    <label htmlFor="address">Street address</label>
                    <input onChange={handleChange} name="address" type="text" required class="ainput long-text"/>
                </div>

                <div class="step-div">
                    <h3>STEP 3</h3>
                    <h4>How many guests can your place accommodate?</h4>
                    <input onChange={handleChange} type="number" name="guests" required class="ainput" min="1"/>
                    <label htmlFor="beds">How many beds can guests use?</label>
                    <input onChange={handleChange} type="number" name="beds" required class="ainput" min="0"/>
                    <label htmlFor="baths">How many bathrooms?</label>
                    <input onChange={handleChange} type="number" name="baths" required class="ainput" min="0"/>
                </div>

                <div class="step-div">
                    <h3>STEP 4</h3>
                    <h4>What kind of amenities are available?</h4>
                    <div id="amenities">
                        <div class="checkboxes">
                            <h5>Essentials</h5>
                            <label id="checkbox_label"><input name="tv" onChange={handleChange} type="checkbox"/> TV </label>
                            <label id="checkbox_label"><input name="air_condition" onChange={handleChange} type="checkbox"/> Air conditioning </label>
                            <label id="checkbox_label"><input name="wifi" onChange={handleChange} type="checkbox"/> Wi-fi </label>
                            <label id="checkbox_label"><input name="kitchen" onChange={handleChange} type="checkbox"/> Kitchen </label>
                            <label id="checkbox_label"><input name="hair_dryer" onChange={handleChange} type="checkbox"/> Hair dryer </label>
                            <label id="checkbox_label"><input name="heating" onChange={handleChange} type="checkbox"/> Heating </label>
                            <label id="checkbox_label"><input name="iron" onChange={handleChange} type="checkbox"/> Iron </label>
                            <label id="checkbox_label"><input name="washer" onChange={handleChange} type="checkbox"/> Washer </label>
                            <label id="checkbox_label"><input name="dryer" onChange={handleChange} type="checkbox"/> Dryer </label>
                        </div>
                        <div class="checkboxes">
                            <h5>Features</h5>
                            <label id="checkbox_label"><input name="pool" onChange={handleChange} type="checkbox"/> Pool </label>
                            <label id="checkbox_label"><input name="free_parking" onChange={handleChange} type="checkbox"/> Free parking </label>
                            <label id="checkbox_label"><input name="crib" onChange={handleChange} type="checkbox"/> Crib </label>
                            <label id="checkbox_label"><input name="grill" onChange={handleChange} type="checkbox"/> Grill </label>
                            <label id="checkbox_label"><input name="hot_tub" onChange={handleChange} type="checkbox"/> Hot tub </label>
                            <label id="checkbox_label"><input name="EV_charger" onChange={handleChange} type="checkbox"/> EV charger </label>
                            <label id="checkbox_label"><input name="gym" onChange={handleChange} type="checkbox"/> Gym </label>
                            <label id="checkbox_label"><input name="indoor_fireplace" onChange={handleChange} type="checkbox"/> Indoor fireplace </label>
                            <label id="checkbox_label"><input name="breakfast" onChange={handleChange} type="checkbox"/> Breakfast </label>
                            <label id="checkbox_label"><input name="smoking_allowed" onChange={handleChange} type="checkbox"/> Smoking allowed </label>
                        </div>
                    </div>
                </div>

                <div class="step-div">
                    <h3>STEP 5</h3>
                    <label htmlFor="name">How would you describe your property to guests?</label>
                    <input name="name" onChange={handleChange} type="text" required class="ainput" placeholder="Give your listing a title"/>
                    <textarea name="description" onChange={handleChange} id="description" required="required" placeholder="Write a description"></textarea>
                </div>

                <div class="step-div">
                    <h3>STEP 6</h3>
                    <h4>Help your guests visualize your place.</h4>
                    <div class="property-image">
                        <input name="preview" type="file" accept="image/*" required onChange={handlePreview}/>
                        <br></br>
                        <input name="preview2" type="file" accept="image/*" onChange={handlePreview2}/>
                        <br></br>
                        <input name="preview3" type="file" accept="image/*" onChange={handlePreview3}/>
                        
                    </div>
                </div>

                <div class="step-div">
                    <button class="end-button bottom-buttons" type="submit">Activate Listing</button>
                </div>

            </form>
        </main>
    );

}

export default CreateProperty