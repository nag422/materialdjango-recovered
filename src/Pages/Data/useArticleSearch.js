import { useEffect, useState } from 'react'
import axios from 'axios';
import axiosInstance from '../../axiosmodelapi';

export default function useArticleSearch(query, pageNumber, orderby) {
    
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [articles, setArticles] = useState([])
    const [hasMore, setHasMore] = useState(false)
   
    
    useEffect(() => {
        setArticles([])
        pageNumber=1
        return () => {
            setArticles([])
        }
    }, [query,orderby])

    useEffect(() => {
        // Fetch the token from storage then navigate to our appropriate place
        

    
        setLoading(true)
        setError(false)

             


        
        axiosInstance.get('/user/articles_scroll_page/',{
            
            params: { q: query, page: pageNumber, orderby: orderby },
            
            
            
        }).then(res => {
            setArticles(prevArticles => {
                return [...new Set([...prevArticles, ...res.data.response])]
            })
            setHasMore(res.data.response.length > 0)
            setLoading(false)
        }).catch(e => {
            // console.log(e.message)
            setLoading(false)
            if (axios.isCancel(e)) return
            setError(true)
        })
        // return () => cancel()
    }, [query, pageNumber,orderby])

    return { loading, error, articles, hasMore }
}

