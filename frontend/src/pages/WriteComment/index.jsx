import { AuthContext } from "../../contexts";
import { useContext, useState} from "react";
import { useParams, useNavigate } from "react-router-dom";
import './index.css';


const WriteComment = () => {
    const navigate = useNavigate();
    const {token} = useContext(AuthContext);
    const [comment, setComment] = useState("");
    const { type, resid, target_name } = useParams();
    const [error, setError] = useState("");

    const handleChange = (event) => {
        const { value } = event.target;
        setComment(value);
    }

    var checkComment = () => {
        if (comment === "") {
            setError("You cannot leave an empty message");
            return false;
        } else {
            setError("");
            return true;
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!checkComment()){
            return
        }
        if (type === "property"){
            fetch('http://localhost:8000/social/comments/property/write/' + resid + '/', {
                method: "POST",
                headers: {
                    'Authorization' : 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'message': String(comment)
                })
            })
            .then(response => {
                if (response.ok){navigate('/user_reservations');}
                else {
                    if (response.status === 401){
                        alert("You are not authorized to comment");
                    } else if (response.status === 403){
                        response.json().then(data=> {
                            setError(data);
                            console.log(data);}
                        )
                    } else {
                        response.json().then(data=> {
                            for (var key in data) {
                                setError("Error for field " + key + ": " +  data[key][0]);
                            }
                            console.log(data);}
                        )
                    }
                }
            }
        )
        .catch((error) => {
        console.log(error)
        });
        } else {
            fetch('http://localhost:8000/social/comments/user/write/' + resid + '/', {
                method: "POST",
                headers: {
                    'Authorization' : 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'message': String(comment)
                })
            })
            .then(response => {
                if (response.ok){navigate('/user_requests');}
                else {
                    if (response.status === 401){
                        alert("You are not authorized to comment");
                    } else if (response.status === 403){
                        response.json().then(data=> {
                            setError(data);
                            console.log(data);}
                        )
                    } else {
                        response.json().then(data=> {
                            for (var key in data) {
                                setError("Error for field " + key + ": " +  data[key][0]);
                            }
                            console.log(data);}
                        )
                    }
                }
            })
        }
        
    }

    

    return (
        <main>
            <br/>
            {(type === "property") && (<h1>Write a commment for the property: {target_name}</h1>)}
            {(type === "user") && (<h1>Write a comment for guest: {target_name}</h1>)}
            <br/>
            <form id="comment-form" onSubmit={handleSubmit}>
            <textarea
            onChange={handleChange} 
            placeholder="leave your comment here"
            maxLength={500}/>
            <input name="submit" type="submit" id="submit-comment"/>
            </form>
            <p id="error">{error}</p>
        </main>
    )
}

export default WriteComment