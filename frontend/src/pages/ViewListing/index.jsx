import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import './index.css';
import { AuthContext } from "../../contexts";
import CommentSection from "../../components/CommentSection/CommentSection";
import Ranges from "./ranges";


const ViewListing = () =>{
    const {token} = useContext(AuthContext);
    const { id } = useParams();
    const [success, setSuccess] = useState("");
    const [host, setHost] = useState({});
    const [style1, setStyle1] = useState({width:'100%',height:'700px', display:'block'});
    const [style2, setStyle2] = useState({width:'100%',height:'700px', display:'none'});
    const [style3, setStyle3] = useState({width:'100%',height:'700px', display:'none'});
    const [style4, setStyle4] = useState({display:'block'});
    const [style5, setStyle5] = useState({display:'none'});
    const [style6, setStyle6] = useState({display:'none'});

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
        preview: "",
        preview2: "", 
        preview3: "",       
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

    const [reservationData, setReservationData] = useState({
        start_date: "",
        end_date: ""});

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        const newValue = type === "checkbox" ? checked : value;
        setReservationData({ ...reservationData, [name]: newValue });
    };
  
    useEffect(() => {
      fetch('http://localhost:8000/properties/searchproperty/?pk=' + id)
      .then(response => response.json())
      .then(data => {setListingData(data.results[0])
        // console.log(data.results[0])
      })
      .catch((error) => {
      console.log(error)
      });
    }, []);

    useEffect(() => {
        fetch("http://localhost:8000/accounts/get/" + String(listingData.host) + "/")
        .then(response => {
            if (response.ok) {
                response.json().then(data => {
                    setHost(data);
                })
            }
        })
    }, [])

    const showSlides = (slideIndex) => {
        if (slideIndex == 1) {
            setStyle1({width:'100%',height:'700px',display:'block'})
            setStyle2({width:'100%',height:'700px',display:'none'})
            setStyle3({width:'100%',height:'700px',display:'none'})
            setStyle4({display:'block'})
            setStyle5({display:'none'})
            setStyle6({display:'none'})
        } 
        else if (slideIndex == 2) {
            setStyle1({width:'100%',height:'700px',display:'none'})
            setStyle2({width:'100%',height:'700px',display:'block'})
            setStyle3({width:'100%',height:'700px',display:'none'})
            setStyle4({display:'none'})
            setStyle5({display:'block'})
            setStyle6({display:'none'})
        } 
        else if (slideIndex == 3) {
            setStyle1({width:'100%',height:'700px',display:'none'})
            setStyle2({width:'100%',height:'700px',display:'none'})
            setStyle3({width:'100%',height:'700px',display:'block'})
            setStyle4({display:'none'})
            setStyle5({display:'none'})
            setStyle6({display:'block'})
        } 
    };

    const handleSubmit = (event) => {
        event.preventDefault();
  
        const formData = new FormData();
        formData.append("start_date", reservationData.start_date);
        formData.append("end_date", reservationData.end_date);

        // console.log(reservationData);
  
        fetch("http://localhost:8000/reservations/" + String(id) + "/reserve/", {
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
                    alert("Your reservation was successful");
                    console.log(data)
                }
                );
            } else {
                setSuccess("");
                response.json().then(data=> {
                    alert(data);
                    // console.log(data);
                }
                );
            }
        })
        .then(data => console.log(data))
        .catch(error => {
            window.alert(error)});
    };
    

    return (
        <main class="listing m">
            <div class="m" id="top-div">
                <div class="container m">
                    <h1>{listingData.name}</h1>
                    <h3>{listingData.address}</h3>
                </div>

                <div class="container m">

                  <div class="mySlides">
                    <div style={style4} class="numbertext">1 / 3</div>
                    <img src={listingData.preview} style={style1} class="ppic"/>
                  </div>

                  <div class="mySlides">
                    <div style={style5} class="numbertext">2 / 3</div>
                    <img src={listingData.preview2} style={style2} class="ppic"/>
                  </div>
            
                  <div style={style6} class="mySlides">
                    <div class="numbertext">3 / 3</div>
                    <img src={listingData.preview3} style={style3} class="ppic"/>
                  </div>

                    <h3 class="next" onClick={() => showSlides(1)}>1</h3>
                    <h3 class="next" id="ntwo" onClick={() => showSlides(2)}>2</h3>
                    <h3 class="next" id="nthree" onClick={() => showSlides(3)}>3</h3>
                </div>
            </div>

            <div id="flex-div" class="m">
                <div id="bottom-div" class="m">
                    <div class="container border m">
                        <div id="intro-div">
                            <div class="inner-intro" id="heading">
                                <h2>{listingData.property_type} hosted by {host.first_name} {host.last_name}</h2>
                                <br></br>
                                <h4>{listingData.stay_type} · {listingData.guests} guests · {listingData.beds} beds · {listingData.baths} bath</h4>
                            </div>
                            <div class="inner-intro">
                                <img src={host.photo} id="pic3"/>
                            </div>
                        </div>
                    </div>
                    <div class="container border m">
                        <p>{listingData.description}</p>
                    </div>
                    <div class="container border m">
                        <h3>Availabilities:</h3>
                        <Ranges property_id={id}/>
                    </div>
                    <div class="container border m">
                        <h3>What this place offers</h3>
                        <div id="rooms-div">
                            <div class="room">
                                <h4>Amenities</h4>
                                <br></br>
                                <ul>
                                {listingData.tv && <li>TV</li>}
                                {listingData.air_condition && <li>Air conditioning</li>}
                                {listingData.wifi && <li>Wi-fi</li>}
                                {listingData.kitchen && <li>Kitchen</li>}
                                {listingData.hair_dryer && <li>Hair dryer</li>}
                                {listingData.heating && <li>Heating</li>}
                                {listingData.iron && <li>Iron</li>}
                                {listingData.washer && <li>Washer</li>}
                                {listingData.dryer && <li>Dryer</li>}
                                </ul>
                            </div>
                            <div class="room">
                                <h4>Features</h4>
                                <br></br>
                                {listingData.pool && <li>Pool</li>}
                                {listingData.free_parking && <li>Free parking</li>}
                                {listingData.crib && <li>Crib</li>}
                                {listingData.grill && <li>Grill</li>}
                                {listingData.hot_tub && <li>Hot tub</li>}
                                {listingData.EV_charger && <li>EV charger</li>}
                                {listingData.gym && <li>Gym</li>}
                                {listingData.indoor_fireplace && <li>Indoor fireplace</li>}
                                {listingData.breakfast && <li>Breakfast</li>}
                                {listingData.smoking_allowed && <li>Smoking allowed</li>}                            </div>
                        </div>
                    </div>
                    <div class="container m">
                        <CommentSection item_id={id} type="property"/>
                    </div>
                </div>
                <form class="container sticky m" onSubmit={handleSubmit}>
                    <div id="menu-div-2">
                        <label htmlFor="start_date">CHECK-IN</label>
                        <input type="date" id="start" name="start_date" onChange={handleChange}/>
                        <br></br>
                        <label htmlFor="end_date">CHECK-OUT</label>
                        <input type="date" id="end" name="end_date" onChange={handleChange}/>
                        <br></br>
                        <label htmlFor="guests">GUESTS</label>
                        <input type="number" id="guests" inputmode="numeric" pattern="\d*" placeholder="1 guest"/>
                    </div>
                    <br></br>
                    <button id="req-button" type="submit">Reserve</button>
                    {/* <h2>Availabilities:</h2>
                    <Ranges property_id={id}/> */}
                    
                </form>
                {/* <h2>Availabilities:</h2>
                <Ranges property_id={id}/> */}
            </div>
        </main>
    );
}

export default ViewListing