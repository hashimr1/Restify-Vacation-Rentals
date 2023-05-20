import './index.css';
import {Link} from 'react-router-dom'
import { TrendingUp } from 'react-feather';
import { useState } from 'react';

function ExploreBar({searchValues, setSearchValues, setIsSubmit, setPageNumber}){
  const initial_values = { tv: false, air_condition:false, wifi:false, kitchen:false, hair_dryer:false, heating:false, iron:false, 
    workspace:false, washer:false, dryer:false, pool:false, free_parking:false, crib:false, grill:false, hot_tub:false, EV_charger:false,
    gym:false, indoor_fireplace:false, breakfast:false, smoking_allowed:false, location: "", guests:1, start_date:"",
    end_date:"", order_by:""};
    const [currentTab, setCurrentTab] = useState("0");
    const switchHouseType = (e) => {
      const {name, value} = e.target;
      setCurrentTab(value);
      console.log("NAME ", name, "VALUE", value);
      if(value !== "0"){
        setSearchValues({ ...searchValues, ["property_type"]: value});
        setIsSubmit(true);
        setPageNumber(1);
      }
      else{
        setSearchValues(initial_values);
        setIsSubmit(true);
        setPageNumber(1);
      }
    }
    return <>
    <div id="homes-types">
      <ul>
        <li className={currentTab==="0" ? "current-category-home" : ""}>
          <TrendingUp></TrendingUp> <button onClick={switchHouseType} value="0">Trending</button>
        </li>
        <li className={currentTab==="Apartment" ? "current-category-home" : ""}><button onClick={switchHouseType} value="Apartment">Apartment</button></li>
        <li className={currentTab==="House" ? "current-category-home" : ""}><button onClick={switchHouseType} value="House">House</button></li>
        <li className={currentTab==="Secondary unit" ? "current-category-home" : ""}><button onClick={switchHouseType} value="Secondary unit">Secondary unit</button></li>
        <li className={currentTab==="Unique space" ? "current-category-home" : ""}><button onClick={switchHouseType} value="Unique space"> Unique space</button></li>
        <li className={currentTab==="Bed and breakfast" ? "current-category-home" : ""}><button onClick={switchHouseType} value="Bed and breakfast">Bed and breakfast</button></li>
        <li className={currentTab==="Boutique hotel" ? "current-category-home" : ""}><button onClick={switchHouseType} value="Boutique hotel">Boutique hotel</button></li>
      </ul>
    </div></>
}

export default ExploreBar