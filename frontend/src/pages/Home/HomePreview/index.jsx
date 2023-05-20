import './index.css'
import { Star } from "react-feather";
import React from 'react';
function HomePreview({value, id, fkey}){
  const options = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'};
    return <React.Fragment key={fkey}>
          <div className="home-page-description" ref={id}>
            <div className="home-page-image">
            <a href={"view_listing/"+value.pk}><img src={value.preview}/></a>
            
            <div className="home-page-location">
              <div>{value.address}</div>
              <div className="home-page-price">{value.propertyranges.length !== 0 && "$"+value.propertyranges[0].price +" per night"}</div>
            </div>
            <div className="home-page-date">{value.propertyranges.length !== 0 && new Date(value.propertyranges[0].start_date).toLocaleDateString([],options) + " - " + (new Date(value.propertyranges[0].end_date).toLocaleDateString([],options))}</div>
            
            </div>
          </div>
    </React.Fragment>
  


}

export default HomePreview