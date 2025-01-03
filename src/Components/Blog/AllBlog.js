import React, { useState, useEffect } from 'react'
import Loader from "../Loader/Loader";
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

const AllBlog = () => {
    // useEffect(() => {
    //     window.scrollTo({
    //         top: 0,
    //         behavior: 'smooth'
    //     });
    // }, []);

    const [blog, setBlog] = useState([])
    const [loading, setLoading] = useState(false)
    const [filter, setFilter] = useState([])
    const move = useNavigate()
    useEffect(() => {

        setLoading(true);
        try {
            axios.get(`${process.env.REACT_APP_BASE_URL}/blog`).then((res) => {
                setBlog(res?.data);
            }).finally(() => {
                setLoading(false);
            });
        } catch (e) {
        }
    }, []);

    return <>
        <div className='container p-0 my-5'>
            <div className='row my-5'>
                <div className='col'>
                    <h1 className='text-center fw-bolder'>Our Blogs</h1>
                    <p className='text-center'>We prepared some helpful tips for you</p>
                </div>
            </div>
            {loading ? (
               <div className='d-flex justify-content-center align-items-center' style={{minHeight:"50vh"}}>
               <Loader />
               </div>
            ) : blog?.length === 0 ? (
                <div className="col-12" style={{ height: "300px" }}>
                    <p className='text-center'>No Blog Uploaded yet...</p>
                </div>
            ) : (
                <div className="h_box_main">
                    {blog?.map((item, index) => {
                        return <div className='my-3' key={index} >
                        <div className="col card border-0 border-bottom border-light shadow-sm"
                         style={{ width: "270px" }}
                         key={index}
                       
                         >
                        <a href={"/blog_detail/" + item._id}>
                               <div className="card" key={index}>
                        
                        <div className="card_img">
                            <img src={item?.image} className="text-center" alt={item?.title} />
                        </div>
                        <p className='text-center mt-2'>{item?.title}</p>
                                        {item?.introduction && <p className='text-center mt-2 mb-2 text-muted'>{item?.introduction?.slice(0, 50)}...</p>}
                                        <p className='text-center read'>Read more</p>
                                                    
                </div>
                        </a>
                        </div>
                        </div>

                    })
                    }
                </div>
            )}
        </div>
    </>
}

export default AllBlog