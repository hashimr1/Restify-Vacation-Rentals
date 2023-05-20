import './index.css';
import ListingCard from './listingCard'
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts';
import { PlusCircle } from 'react-feather';
import { useNavigate } from 'react-router-dom';

function MyListings() {
    const navigate = useNavigate();
    const {token} = useContext(AuthContext);
    const [loggedIn, setLoggedIn] = useState(false);
    const [listings, setListings] = useState([]);

    const getListings = () => {
    
        fetch('http://localhost:8000/properties/listings/', {
          headers: {
            'Authorization' : 'Bearer ' + token
          }
        })
        .then(response => {
          if (response.status === 401){
            setLoggedIn(false);
          } else {
            setLoggedIn(true);
            response.json().then(data => {
              setListings(data);
            })
          }
          })
        .catch((error) => {
          console.log(error)
        });
    }
    
    useEffect(() => {
        getListings();
    }, [token]);

    const deleteListing = (prop_id) => { if (window.confirm("Are you sure you want to delete this listing?")){
        fetch('http://localhost:8000/properties/' + prop_id + '/deleteproperty/', {
            headers: {
                'Authorization' : 'Bearer ' + token
            }, 
            method: 'DELETE'
        })
          .then(response => {
            response.json().then(data=> {
              console.log(data)}
            );
            getListings();
        })
          .then(data => {console.log(data);
            })
          .catch((error) => {
            console.log(error)
          });
        }
    };

    const createListing = () => {
        navigate("/create_listing/");
    };

    return (
      <main>
        {!loggedIn ? (<main><br/><h1>Please log in to see listings</h1></main>):
        (<>
        <br/>
            <h1>My Listings</h1>
        <br/>
        <div id="outer-listings-div">
            <div class="listings-div">
                {listings.map((property) => {
                    return (<ListingCard
                        property={property}
                        property_id={property.pk}
                        delete={deleteListing}
                    />)
                })}
        
                <div id="create-new" class="add-listing-div">
                    <button className="delete-noti-btn" onClick={createListing}><PlusCircle /> Add another listing</button>
                </div>
            </div>
        </div>
        </>)}
    </main>
    )
  };
  
  export default MyListings;