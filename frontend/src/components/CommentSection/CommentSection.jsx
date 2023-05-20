import { useContext, useEffect, useState } from "react"
import CommentCard from "./CommentCard";
import './CommentSection.css';
import { AuthContext } from "../../contexts";

const CommentSection = (props) => {
    const {token} = useContext(AuthContext)
    const [comments, setComments] = useState([]);
    const [lastComments, setThreads] = useState([]);
    const [nextpage, setNextPage] = useState(2)
    const [next, setNext] = useState(false);

    const makeThreads = () => {
        fetch(`http://localhost:8000/social/comments/norep/${props.type}/${props.item_id}/`,
        {
            headers: {
                'Authorization' : 'Bearer ' + token
            }
        })
        .then(response => {
            if (response.ok) {
                response.json().then(
                    data=> {
                        setThreads(data);
                    }
                )
            }
        })
    }

    const getMoreComments = () => {
        if (next) {
            fetch("http://localhost:8000/social/comments/" + props.type + "/"+ props.item_id + "/?page=" + nextpage)
            .then(response => {
                if (response.ok) {
                    response.json().then(data => {
                        setNext(data.next !== null);
                        setNextPage(nextpage + 1);
                        makeThreads();
                        setComments(comments.concat(data.results));
                    });
                }
            })
        }
      }
    
    const getComments = () => {
        fetch("http://localhost:8000/social/comments/" + props.type + "/"+ props.item_id + "/?page=1")
        .then(response => {
            if (response.ok) {
                response.json().then(data => {
                    makeThreads();
                    setComments(data.results);
                    setNext(data.next !== null);
                    setNextPage(2);
                });
            }
        })
    }


    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {getComments()}, [token]);

    return (
        <div id="comment-section">
            {(comments.length === 0) && <h3 style={{textAlign: "center"}}> No comments yet</h3>}
            {comments.map((comment) => {
                if (comment.reply_to === null){
                    if (lastComments.includes(comment.pk)){
                        return (<CommentCard 
                            type={props.type}
                            key={comment.pk}
                            id={comment.pk}
                            sender={comment.sender} 
                            message={comment.message} 
                            datetime={comment.date}
                            reply_button={true}/>)
                    }
                    return (
                        <CommentCard
                        type={props.type}
                        key={comment.pk}
                        id={comment.pk}
                        sender={comment.sender} 
                        message={comment.message}
                        datetime={comment.date}
                        reply_button={false}/>
                    )
                } else {
                    if (lastComments.includes(comment.pk)){
                        return (<div className="reply" key={comment.pk}>
                            <CommentCard 
                            type={props.type}
                            key={comment.pk}
                            id={comment.pk}
                            sender={comment.sender} 
                            message={comment.message}
                            datetime={comment.date}
                            reply_button={true}/>
                            </div>)
                    }
                    return (
                        <div className="reply" key={comment.pk}>
                        <CommentCard
                        type={props.type}
                        key={comment.pk}
                        id={comment.pk}
                        sender={comment.sender} 
                        message={comment.message}
                        datetime={comment.date}
                        reply_button={false}/>
                        </div>
                    )
                }
            })}
            {next ?
            <button id="load-btn-comment-section" onClick={getMoreComments}> Load more </button>: null}
        </div>
    )
}

export default CommentSection;