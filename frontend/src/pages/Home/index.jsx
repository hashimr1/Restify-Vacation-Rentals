import './index.css';
import ExploreBar from './ExploreBar'
import HomeStatus from './HomeStatus'
import HomePreview from './HomePreview'
import SearchBar from './SearchBar'
import {useState, useRef, useCallback} from 'react'
import { Bell, Menu, Search } from 'react-feather';
import Amenities from './SearchBar/Amenities'


function Home() {
    const initial_values = { tv: false, air_condition:false, wifi:false, kitchen:false, hair_dryer:false, heating:false, iron:false, 
        workspace:false, washer:false, dryer:false, pool:false, free_parking:false, crib:false, grill:false, hot_tub:false, EV_charger:false,
        gym:false, indoor_fireplace:false, breakfast:false, smoking_allowed:false, location: "", guests:1, start_date:"",
        end_date:"", order_by:""};
    const [searchValues, setSearchValues] = useState(initial_values);
    const [isOrderAlpha, setIsOrderAlpha] = useState(false);
    const [isOrderPrice, setIsOrderPrice] = useState(false);
    const [isSearch, setIsSearch] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const {homes, loading, error, hasMore} = HomeStatus(pageNumber, searchValues, isSearch, setIsSearch, setSearchValues);
    const [isHovering, setIsHovering] = useState(false);
    
    const observer = useRef()
    const lastHouse = useCallback(node => {
        if(loading) return
        if(observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if(entries[0].isIntersecting && hasMore){
                console.log("Visible")
                setPageNumber(prevPageNumber => prevPageNumber + 1)
            }
        })
        if(node) observer.current.observe(node)
    }, [loading, hasMore])

      const handleMouseOver = () => {
        setSearchValues(initial_values);
        setIsHovering(true);
      }

      const handleMouseOut = () => {
        setIsHovering(false);
      }
      
      const handleSubmitSearch = (e) => {
        e.preventDefault();
        console.log('SEARCHING')
        setIsSearch(true);
        setPageNumber(1);
        }
    
      const handleChange = (e) => {
        const {name, value} = e.target;
        if(e.target.type === 'checkbox'){
          setSearchValues({ ...searchValues, [name.toLowerCase()]: e.target.checked});
        }
        else{
          setSearchValues({ ...searchValues, [name.toLowerCase()]: value});
        }
        // setErrors(validateErrors(formValues));    
    
      }

      const addFilter = (e) => {
        console.log(searchValues);
        console.log("ADDING FILTER");
        const {name, value} = e.target;
        console.log(searchValues.order_by);
        if(searchValues.order_by !== "" && searchValues.order_by !== name){
          console.log("BOTH");
          setSearchValues({ ...searchValues, ["order_by"]: "Both"});
          setPageNumber(1);
          setIsSearch(true);
          if(name==="A-Z"){
            setIsOrderAlpha(true);
          }
          else{
            setIsOrderPrice(true);
          }
        } 
        else if(name==="A-Z"){
          setSearchValues({ ...searchValues, ["order_by"]: "Name"});
          setIsOrderAlpha(true);
          setPageNumber(1);
          setIsSearch(true);
        }

        else if(name==="Price"){
          setSearchValues({ ...searchValues, ["order_by"]: "Price"});
          setIsOrderPrice(true);
          console.log("CHANGING PRICE");
          setPageNumber(1);
          setIsSearch(true);
        }
      }

      const removeFilters = (e) => {
        setSearchValues({ ...searchValues, ["order_by"]: ""});
        setPageNumber(1);
        setIsOrderPrice(false);
        setIsOrderAlpha(false);
        setIsSearch(true);
      }

    return <>
    <div id="search-div">
      <div id="search-bar" onClick={handleMouseOver} >
        <Search/>
        </div>
    </div>
    <div id="home-page">
    <SearchBar handleChange={handleChange} handleSubmitSearch={handleSubmitSearch}  handleMouseOut={handleMouseOut}
    searchValues={searchValues} isHovering={isHovering}
    ></SearchBar>
        <div id='heading2'>Explore homes near you</div>
        <ExploreBar searchValues={searchValues} setSearchValues={setSearchValues} setIsSubmit={setIsSearch} setPageNumber={setPageNumber}/>
        <div className="radio-buttons">
          <div><input onClick={addFilter} type="radio" name="A-Z" checked={isOrderAlpha}/>A-Z</div>
          <div><input onClick={addFilter} type="radio" name="Price" checked={isOrderPrice}></input> Price (lowest to highest)</div>
          <button onClick={removeFilters} className="reset-filter-button">Clear</button>
        </div>
        <div id='homes-list'>
        {homes.map((home, index) => {
            if (homes.length === index + 1){
                return <HomePreview fkey={home.pk} value={home} id={lastHouse}></HomePreview>
            }
            else{
                return <HomePreview fkey={home.pk} value={home}></HomePreview>
            }
        })}
        </div>
    </div>
    </>;
};

export default Home;