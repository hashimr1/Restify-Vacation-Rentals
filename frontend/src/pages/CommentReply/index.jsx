import { AuthContext } from "../../contexts";
import { useContext, useState} from "react";
import { useParams, useNavigate } from "react-router-dom";
import './index.css';

const CommentReply = () => {
    const navigate = useNavigate();
    const {token} = useContext(AuthContext);
    const [comment, setComment] = useState("");
    const { type, commentid, target_name } = useParams();

    const handleChange = (event) => {
        const { value } = event.target;
        setComment(value);
    }

    const handleSubmit = (event) => {
        console.log(commentid)
        event.preventDefault();
        if (type === "property"){
            fetch('http://localhost:8000/social/comments/property/reply/' + commentid + '/', {
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
                if (response.ok){navigate(-1);}
                else {
                    if (response.status === 401){
                        alert("You are not authorized to comment");
                    } else if (response.status === 403){
                        response.json().then(data=> {
                            alert(data);
                            console.log(data);}
                        )
                    } else {
                        response.json().then(data=> {
                            for (var key in data) {
                                alert("Error for field " + key + ": " +  data[key][0]);
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
            fetch('http://localhost:8000/social/comments/user/reply/' + commentid + '/', {
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
                if (response.ok){navigate(-1);}
                else {
                    if (response.status === 401){
                        alert("You are not authorized to comment");
                    } else if (response.status === 403 || response.status === 404){
                        response.json().then(data=> {
                            alert(data);
                            console.log(data);}
                        )
                    } else {
                        response.json().then(data=> {
                            for (var key in data) {
                                alert("Error for field " + key + ": " +  data[key][0]);
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
            <h1>Write a reply to {target_name}</h1>
            <br/>
            <form id="comment-form" onSubmit={handleSubmit}>
            <textarea
            onChange={handleChange} 
            placeholder="leave your comment here"
            maxLength={500}/>
            <input name="submit" type="submit" id="submit-comment"/>
            </form>
        </main>
    )
}

export default CommentReply;