import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import CommentSection from "../../components/CommentSection/CommentSection";
import "./index.css"

function ViewProfile(){
    const initial_values = {username:"", first_name:"", last_name:"", phone_number:"", email:"", photo:""};
    const {id} = useParams();
    
    const [userData, setUserData] = useState({})

    const getUserData = () => {
        axios({
            method:'GET',
            mode: 'cors',
            url:'http://localhost:8000/accounts/get/'+id.toString()+"/",
            signal: AbortSignal.timeout(5000)
        }).then(res => {
            setUserData(res.data);
            console.log(res);
        }).catch(e => {
          setUserData(initial_values);
          if(axios.isCancel(e)) return
        })
    }

    useEffect(() => {
        getUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <>
    <main>
    <br/>
    <h1>{userData.username}</h1>
    <br/>
    <div class="user-profile">
      <div class="edit-profile-with-icon" >
        <img class="view-profile-pic" src={userData.photo} alt="profile-pic"/>
      </div>
      <div class="edit-profile-name" id="view-prof-name">{userData.first_name} {userData.last_name}</div>
      <div class="edit-profile-location"></div>
      <h4>
        Phone Number
      </h4>
      <p id="view-prof-phone">
        {userData.phone_number}
      </p>
      <br/>
      <h4>
        Email
      </h4>
      <p id="email-h1-tag">
        {userData.email}
      </p>
      <br/>
    </div>
    <h4>
    Comments
    </h4>
    <CommentSection item_id={id} type="user"/>
    <br/>
    </main>
    </>
}

export default ViewProfile