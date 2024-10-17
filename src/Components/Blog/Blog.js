import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { FaArrowRight } from "react-icons/fa"
import Loader from "../Loader/Loader";
import { useNavigate } from 'react-router-dom'
import "./blog.css"
import Aos from 'aos';
import 'aos/dist/aos.css';

const Blog = () => {


    const [blog, setBlog] = useState([])
    const [loading, setLoading] = useState(false)
    const [filter, setFilter] = useState([])
    const move = useNavigate()

    useEffect(() => {
        Aos.init({
          offset: 100,
          duration: 600,
          easing: 'ease-in',
          delay: 25,
        });
      }, []);

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
        {blog.length !== 0 &&
            <div className='container px-md-3 px-2'>
                <div className='row mb-4'>
                    <div className='col'>
                        <p className='fs-3 fw-bolder text-center'>Our Blog</p>
                        <p className='text-center'>We prepared some helpful tips for you</p>
                    </div>
                </div>
                {loading ? (
                    <div
                        className="col-lg-12 col-sm-12 d-flex align-items-center justify-content-center"
                        style={{ height: "50vh" }}
                    >
                        <Loader />
                    </div>
                ) : blog.length === 0 ? (
                    <div className="col-12" style={{ height: "300px" }}>
                        <p className='text-center'>No Blog Uploaded yet...</p>
                    </div>
                ) : (
                    <div className="h_box_main">
                        {blog?.slice(0, 3).map((item, index) => {
                            return <a href={"/blog_detail/" + item._id}  style={{ width: "270px" }} data-aos="flip-left">
                             <div className="card" key={index}>
                        
                                <div className="card_img">
                                    <img src={item?.image} className="text-center" alt={item?.title} />
                                </div>
                                <p className="card_title text-muted">{item?.title}</p>
                                        <p className='text-center fw-bolder'>Read more</p>                              
                        </div>
                        </a> 
                        })
                        }
                    </div>
                )}
                <div className='col-lg-12 my-5 d-flex justify-content-center'>
                    <a href="/all-blog">
                        <button className='button-submit px-5'>View All </button>
                    </a>
                </div>
            </div>
        }
    </>
}

export default Blog