import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import './index.css';
import { AuthContext } from "../../contexts";
import PropertyRanges from "./PropertyRanges";


const EditProperty = () =>{
  const {token} = useContext(AuthContext);
  const { id } = useParams();
  const [selectedFile1, setSelectedFile1] = useState(null);
  const [selectedFile2, setSelectedFile2] = useState(null);
  const [selectedFile3, setSelectedFile3] = useState(null);
  const [success, setSuccess] = useState("");

  const [listingData, setListingData] = useState({
      host: 1,
      pk: 1,
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

  useEffect(() => {
    fetch('http://localhost:8000/properties/searchproperty/?pk=' + id)
    .then(response => response.json())
    .then(data => {setListingData(data.results[0])
        // console.log(data.results[0])
    })
    .catch((error) => {
    console.log(error)
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (event) => {
      const { name, value, type, checked } = event.target;
      const newValue = type === "checkbox" ? checked : value;
      setListingData({ ...listingData, [name]: newValue });
  };

  // const handleFileChange = (event) => {
  //     setSelectedFile(event.target.files[0]);
  // };
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
      formData.append("pk", listingData.pk);
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

      fetch("http://localhost:8000/properties/" + id + "/updateproperty/", {
      method: "PUT",
      headers: {
      'Authorization' : 'Bearer ' + token
      },
      body: formData
      })
      .then(response => {
          if (response.ok){
              response.json().then(data=> {
                  setSuccess("Update Successful");
                  console.log(data)}
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
      // .then(data => console.log(data))
      .catch(error => {
          window.alert(error)});
  };

  return (
      <main>
      <br/>
      <h1>Update Property</h1>
      <br/>
      <form id='listing'onSubmit={handleSubmit}>
      <label htmlFor="name">Name</label>
      <input
          className="update-inputs"
          type="text"
          name="name"
          value={listingData.name}
          onChange={handleChange}
      />
      <label htmlFor="description">Description</label>
      <input
          className="update-inputs"
          type="text"
          name="description"
          value={listingData.description}
          onChange={handleChange}
      />
      <label htmlFor="address">Address</label>
      <input
          className="update-inputs"
          type="text"
          name="address"
          value={listingData.address}
          onChange={handleChange}
      />
      <label htmlFor="property_type">Property Type</label>
      <select
          className="update-inputs"
          name="property_type"
          value={listingData.property_type}
          onChange={handleChange}
      >
          <option value="Apartment">Apartment</option>
          <option value="House">House</option>
          <option value="Secondary unit">Secondary unit</option>
          <option value="Unique space">Unique space</option>
          <option value="Bed and breakfast">Bed and breakfast</option>
          <option value="Boutique hotel">Boutique hotel</option>
      </select>
      <label htmlFor="stay_type">Stay Type</label>
      <select
          className="update-inputs"
          name="stay_type"
          value={listingData.stay_type}
          onChange={handleChange}
      >
          <option value="Private room">Private room</option>
          <option value="Shared property">Shared property</option>
          <option value="Whole place">Whole place</option>
      </select>
      <label htmlFor="beds">Beds</label>
      <input
          className="update-inputs"
          type="number"
          name="beds"
          value={listingData.beds}
          onChange={handleChange}
      />
      <label htmlFor="baths">Baths</label>
      <input
          className="update-inputs"
          type="number"
          name="baths"
          value={listingData.baths}
          onChange={handleChange}
      />
      <label htmlFor="guests">Guests</label>
      <input
          className="update-inputs"
          type="number"
          name="guests"
          value={listingData.guests}
          onChange={handleChange}
      />
      <label htmlFor="preview">Previews</label>
        <input
          className="update-inputs"
          type="file"
          accept="image/*"
          name="preview"
          onChange={handlePreview}
        />
        <input
          className="update-inputs"
          type="file"
          accept="image/*"
          name="preview2"
          onChange={handlePreview2}
        />
        <input
          className="update-inputs"
          type="file"
          accept="image/*"
          name="preview3"
          onChange={handlePreview3}
        />
        <div className="amenities-update">
        <label htmlFor="tv">TV</label>
        <input
          type="checkbox"
          name="tv"
          checked={listingData.tv}
          onChange={handleChange}
        />
        <label htmlFor="air_condition">Air Condition</label>
        <input
          type="checkbox"
          name="air_condition"
          checked={listingData.air_condition}
          onChange={handleChange}
        />
        <label htmlFor="wifi">WiFi</label>
        <input
          type="checkbox"
          name="wifi"
          checked={listingData.wifi}
          onChange={handleChange}
        />
        <label htmlFor="kitchen">Kitchen</label>
        <input
          type="checkbox"
          name="kitchen"
          checked={listingData.kitchen}
          onChange={handleChange}
        />
        <label htmlFor="hair_dryer">Hair Dryer</label>
        <input
          type="checkbox"
          name="hair_dryer"
          checked={listingData.hair_dryer}
          onChange={handleChange}
        />
        <label htmlFor="heating">Heating</label>
        <input
          type="checkbox"
          name="heating"
          checked={listingData.heating}
          onChange={handleChange}
        />
        <label htmlFor="iron">Iron</label>
        <input
          type="checkbox"
          name="iron"
          checked={listingData.iron}
          onChange={handleChange}
        />
        <label htmlFor="washer">Washer</label>
        <input
          type="checkbox"
          name="washer"
          checked={listingData.washer}
          onChange={handleChange}
        />
        <label htmlFor="dryer">Dryer</label>
        <input
          type="checkbox"
          name="dryer"
          checked={listingData.dryer}
          onChange={handleChange}
        />
        <label htmlFor="pool">Pool</label>
        <input
          type="checkbox"
          name="pool"
          checked={listingData.pool}
          onChange={handleChange}
        />
        <label htmlFor="free_parking">Free Parking</label>
        <input
          type="checkbox"
          name="free_parking"
          checked={listingData.free_parking}
          onChange={handleChange}
        />
        <label htmlFor="crib">Crib</label>
        <input
          type="checkbox"
          name="crib"
          checked={listingData.crib}
          onChange={handleChange}
        />
        <label htmlFor="grill">Grill</label>
        <input
          type="checkbox"
          name="grill"
          checked={listingData.grill}
          onChange={handleChange}
        />
        <label htmlFor="hot_tub">Hot Tub</label>
        <input
          type="checkbox"
          name="hot_tub"
          checked={listingData.hot_tub}
          onChange={handleChange}
        />
        <label htmlFor="EV_charger">EV Charger</label>
        <input
          type="checkbox"
          name="EV_charger"
          checked={listingData.EV_charger}
          onChange={handleChange}
        />
        <label htmlFor="gym">Gym</label>
        <input
          type="checkbox"
          name="gym"
          checked={listingData.gym}
          onChange={handleChange}
        />
        <label htmlFor="indoor_fireplace">Indoor Fireplace</label>
        <input
          type="checkbox"
          name="indoor_fireplace"
          checked={listingData.indoor_fireplace}
          onChange={handleChange}
        />
        <label htmlFor="breakfast">Breakfast</label>
        <input
          type="checkbox"
          name="breakfast"
          checked={listingData.breakfast}
          onChange={handleChange}
        />
        <label htmlFor="smoking_allowed">Smoking Allowed</label>
        <input
          type="checkbox"
          name="smoking_allowed"
          checked={listingData.smoking_allowed}
          onChange={handleChange}
        />
        </div>
        <br/>
        <h2>Availabilities:</h2>
        <PropertyRanges property_id={id}/>
        <Link id="add-availability-link" to={`/${id}/${listingData.name}/addavailability`}>Add Availability</Link>
        {success !== "" && <h1 id="update-success">{success}</h1>}
        <button type="submit">Update Listing</button>
      </form>
      </main>
    );
}

export default EditProperty
