import './index.css'
import Amenities from './Amenities'


function SearchBar({handleChange, handleSubmitSearch, handleMouseOut, searchValues, isHovering}){
  return <>
    <div class="hiddenSearchBar" onMouseLeave={handleMouseOut}>
        {isHovering && <form id="search-content" onSubmit={handleSubmitSearch}>
      <div id="details">
        Details
        <div id="details-info">
        <div class="floating-label-search-bar">
            <label class="search-bar-details-label">Check-in</label>
            <input id="startDate" class="form-control" name="start_date" onChange={handleChange} type="date" value={searchValues.start_date}/>
          </div>
          <div class="floating-label-search-bar">
            <label class="search-bar-details-label">Check-out</label>
            <input id="endDate" class="form-control" name = "end_date" onChange={handleChange} type="date" value={searchValues.end_date}/>
          </div>
          <div class="floating-label-search-bar">
            <label class="search-bar-details-label">Destination</label>
            <input type="text" class="form-control" name="location" onChange={handleChange} id="floatingInputValue" placeholder="" value={searchValues.destination}/>
            
          </div>
          <div class="floating-label-search-bar">
            <label class="search-bar-details-label">Guests</label>
            <input type="number" class="form-control" name="guests" onChange={handleChange} id="guests" placeholder="0" value={searchValues.guests}/>
            
          </div>
        </div>
        </div>
        Amenities
        <div id="amenities_group">
          Essentials
          <div id="essentials_content">
            <ul>
                <Amenities name="TV" value={handleChange} ></Amenities>
                <Amenities name="Hair dryer" value={handleChange} ></Amenities>
                <Amenities name="Air conditioning" value={handleChange} ></Amenities>
                <Amenities name="Heating" value={handleChange} ></Amenities>
                <Amenities name="Wifi" value={handleChange} ></Amenities>
                <Amenities name="Washer" value={handleChange} ></Amenities>
                <Amenities name="Kitchen" value={handleChange} ></Amenities>
                <Amenities name="Dryer" value={handleChange} ></Amenities>
                <Amenities name="Iron" value={handleChange} ></Amenities>
                <Amenities name="Dedicated workspace" value={handleChange} ></Amenities>
            </ul>
          </div>
        </div>
      <div id="amenities_group">
        Features
        <div id="features_content">
            <ul>
            <Amenities name="Pool" value={handleChange} ></Amenities>
            <Amenities name="Hot tub" value={handleChange} ></Amenities>
            <Amenities name="Free parking" value={handleChange} ></Amenities>
            <Amenities name="EV charger" value={handleChange} ></Amenities>
            <Amenities name="Crib" value={handleChange} ></Amenities>
            <Amenities name="Gym" value={handleChange} ></Amenities>
            <Amenities name="BBQ Grill" value={handleChange} ></Amenities>
            <Amenities name="Indoor fireplace" value={handleChange} ></Amenities>
            <Amenities name="Breakfast" value={handleChange} ></Amenities>
            <Amenities name="Smoking allowed" value={handleChange} ></Amenities>
            </ul>
        </div>
      </div>
 
        <div class="search-button-center">
          <button type="submit" className="search-options-search-bar" value="Search">Search</button>
        </div>
      </form>}
        </div>
  </>
}

export default SearchBar