import React,{ useEffect, useState } from 'react'
import axiosInstance from '../../axiosmodelapi';



export default function useVideoSearch(query, pageNumber, orderby) {
    
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [videos, setVideos] = useState([])
    const [hasMore, setHasMore] = useState(false)
    
    
    useEffect(() => {
        setVideos([])
        pageNumber=1
        return () => {
            setVideos([])
        }
    }, [query,orderby])

    React.useEffect(() => {
       
        

    
        setLoading(true)
        setError(false)

        
      


        
        axiosInstance.get('/user/videos_scroll_page/',{
            
            params: { q: query, page: pageNumber, orderby: orderby },
           
            
            
        }).then(res => {
            setVideos(prevVideos => {
                return [...new Set([...prevVideos, ...res.data.response])]
            })
            setHasMore(res.data.response.length > 0)
            setLoading(false)
        }).catch(e => {
            // console.log(e.message)
            setLoading(false)
            
            setError(true)
        })
        // return () => cancel()
    }, [query, pageNumber,orderby])

    return { loading, error, videos, hasMore }
}

