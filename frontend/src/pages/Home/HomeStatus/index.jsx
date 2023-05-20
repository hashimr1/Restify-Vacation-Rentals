import './index.css'
import {useEffect, useState} from 'react'

function HomeStatus(pageNumber, conditions, isSearch, setIsSearch){
    const [homes, setHomes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    useEffect(() =>{
        setLoading(true);
        setError(false);
        var params;
        console.log(conditions);
        if(conditions){
            params = Object.entries(conditions).map(([value,item]) => {if(item !== ""){return value + "=" + item}}).reduce((prev, curr) => prev+"&"+curr);
        }
        else{
            params = "";
        }
        fetch('http://127.0.0.1:8000/properties/searchproperty/?'+params+"&page="+pageNumber, {
                params: {page: pageNumber},
                headers: {'Content-Type': 'application/json'},
                signal: AbortSignal.timeout(5000)
            })
            .then(response => {
                console.log(response);
                if(response.ok){
                    response.json().then(res => {
                        if(pageNumber === 1){
                            setHomes(() => {
                                return [...new Set([ ...res.results.map(b => b)])]
                            })
                        }
                        else{
                            console.log(res.results);
                            setHomes(prevHomes => {
                                return [...new Set([...prevHomes, ...res.results.map(b => b)])]
                            })
                        }
                        setIsSearch(false);
                        setHasMore(!(res.next===null));
                        setLoading(false);
                    })
                    

            }})
            .catch(e => {
                setError(true);
                console.log(e);
            })
    },[pageNumber, isSearch])

    return {homes, loading, error, hasMore}
}

export default HomeStatus