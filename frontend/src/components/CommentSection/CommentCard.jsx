import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CommentCard = (props) => {
    const navigate = useNavigate();
    const [user, setUser] = useState({});

    useEffect(() => {
        fetch("http://localhost:8000/accounts/get/" + props.sender + "/")
        .then(response => {
            if (response.ok) {
                response.json().then(data => {
                    setUser(data);
                })
            }
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const reply = () =>{
        navigate("/" + props.type + "/reply/" + props.id +"/"+ user.username);
    }


    return (
        <div className="comment-card">
            <h3>
                {user.username}
            </h3>
            <h6>
                {new Date(props.datetime).toLocaleString()}
            </h6>
            <h4>
                {props.message}
            </h4>
            {props.reply_button && (
                <button className="comment-reply-btn" onClick={reply}>Reply</button>
            )}
        </div>
    )
}

export default CommentCard;