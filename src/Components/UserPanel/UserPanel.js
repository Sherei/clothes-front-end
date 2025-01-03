import React, { useEffect, useRef, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from '../Loader/Loader';
import { FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import { useDispatch } from "react-redux";
import userPanel from "../Animations/userPanel.json"
import axios from 'axios';
import "./userPanel.css"

const UserPanel = () => {

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, []);
    const cu = useSelector((store) => store.userSection.cu);
    const navigate = useNavigate();
    const { userid } = useParams();
    const [order, setOrder] = useState([]);
    const [component, setComponent] = useState("orders");
    const dispatch = useDispatch();
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        try {
            axios.get(`${process.env.REACT_APP_BASE_URL}/comments`).then((res) => {
                if (res) {

                    dispatch({ type: "ADD_COMMENT", payload: res.data });
                    setComments(res.data);
                    setLoading(false);
                }
            });
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    }, [userid, dispatch]);


    useEffect(() => {
        try {
            setIsLoading(true);
            axios.get(`${process.env.REACT_APP_BASE_URL}/order`).then((res) => {
                if (res.data) {
                    setOrder(res.data);
                    setIsLoading(false);
                }
            });
        } catch (e) {
        }
    }, []);

    const filterOrder = order.filter((item) => item.userId === cu._id);

    const formatDateTime = (dateStr) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', options);
    };

    function Logout() {
        dispatch({
            type: "LOGOUT_USER",
        });
        navigate("/login");
    }

    return (
        <section style={{ minHeight: "100vh" }}>
            <div className="container py-lg-5 py-2">
                <div className="row">

                    <div className="col-lg-4 col-md-4 col-sm-12">
                        <div className="card border border-0 border-bottom border-light shadow-sm mb-4 p-3">
                            <div className="text-center">
                                <img
                                    src="/profile.png"
                                    alt="avatar"
                                    className="rounded-circle"
                                    style={{ width: "110px", height:"110px" }}
                                />
                                <h5 className="my-3">{cu.name}</h5>
                                <p className="text-muted mb-1">{cu.number}</p>
                                <p className="text-muted mb-4">{cu.email}</p>

                                <button type="button" className="button-submit px-5 ms-1 my-3" style={{ width: "100%" }} onClick={Logout}>
                                    Logout
                                </button>
                            </div>

                        </div>
                    </div>

                    <div className='col-lg-8 col-md-8 col-sm-12'>
                        <div className='d-flex gap-3 mb-4'>
                        <button type="button" className={`button-submit`} onClick={() => setComponent('orders')} style={{ width: "150px" }}>
                    Orders
                    </button>
                    <button type="button" className="button-submit px-4" style={{ width: "150px" }} onClick={() => setComponent('review')}>
                    My Reviews
                    </button>
                            {/* <button className={`profile_btn ${component === 'orders' ? 'profile_btn button-submit px-4' : 'profile_btn'}`} onClick={() => setComponent('orders')}>My Orders</button>
                            <button className={`profile_btn ${component === 'review' ? 'profile_btn button-submit px-4' : 'profile_btn'}`} >My Reviews</button> */}
                            {/* <button className={`profile_btn ${component === 'feedback' ? 'button-submit px-4' : ''}`} onClick={() => setComponent('feedback')}>Give Feedback</button> */}
                        </div>
                        {component === "orders" &&
                            <>
                                {isLoading  ? (
                                    <div className='d-flex justify-content-center align-items-center' style={{minHeight:"50vh"}}>
                                    <Loader />
                                    </div>
                                ) : filterOrder.length > 0 ? (
                                    <>
                                        <p className='fs-5 fw-bolder m-0' style={{ color: "white" }}>Orders : {filterOrder?.length}</p>
                                        <div className='h_box_main'>
                                            {filterOrder?.map((item, index) => {
                                                const orderItemsLength = item.orderItems.length;
                                                let totalFprice = 0;
                                                item.orderItems.forEach((data) => {
                                                    totalFprice += parseFloat(data?.total);
                                                });
                                                return <>
                                                
                                                <div className='card border-0 border-bottom border-light shadow-sm m-3' key={index} 
                                                style={{  position: "relative", maxWidth:"250px" }}>
                                                    <a href={`/order-detail/${item?._id}`}>
                                                <p className='panel_index'>{index + 1}</p>
                                                  
                                                    <img src={item?.orderItems[0]?.image} 
                                                    style={{ height: '200px' }} 
                                                    className='rounded-3 img-fluid mb-1'
                                                    alt={item.title}
                                                    />
                                                    <div className='p-2 text-light'>
                                                    <p className='mb-0 mt-2'>
                                                                    Tracking ID: {item?.orderId}
                                                                </p>
                                                                <p className='m-0'>
                                                                    Total: ${item?.total?.toFixed()}
                                                                </p>
                                                                <p className='m-0'>
                                                                    Date: {formatDateTime(item?.date)}
                                                                </p>
                                                                <p className='m-0'>
                                                                    <a className='text-light' >Detail</a>
                                                                </p>
                                                        
                                                        </div>                             
                                                        </a>                       
                                                    </div>
                                                </>
                                            })}
                                        </div>


                                    </>
                                ) : (
                                    <div className='py-0 my-3 d-flex flex-column align-items-center justify-content-center gap-3' style={{ minHeight: '80vh' }}>
                                        <p className='fw-bolder text-light'>No Order Placed yet</p>
                                        <Lottie animationData={userPanel} loop={true} style={{ width: "50%", height: "30%" }} />
                                        <button className='button-submit px-5 py-3 ' onClick={() => navigate('/Products/all')}>
                                            Shop our products
                                        </button>
                                    </div>
                                )
                                }
                            </>
                        }

                        {component === "review" &&
                            <>
                                <div className='h_box_main'>
                                    {loading ? (
                                        <div className='d-flex justify-content-center align-items-center' style={{minHeight:"50vh"}}>
                                        <Loader />
                                        </div>
                                    ) : comments?.filter((item) => item.userId === cu._id).length === 0 ? (
                                        <div
                                            className="col-lg-12 col-sm-12 d-flex align-items-center justify-content-center"
                                            style={{ height: "50vh" }}
                                        >
                                            <h2 className='text-center'>No Review available</h2>
                                        </div>
                                    ) : (comments?.filter((data) => data.userId === cu._id).map((item, index) => {
                                        return <>
                                           <div 
                                           className='card m-2 border border-0 border-bottom border-light shadow-sm' 
                                           style={{ width: "270px" }} key={index}>
                                        <div className="card_img mb-2" style={{ background: "transparent" }}>
                                            {item?.mediaUrl === undefined && (
                                                <img src="/feedback.png" alt={item.title} style={{ maxWidth: '100%', height: '95%' }} />
                                            )
                                            }
                                            {item?.mediaUrl && (
                                                <>
                                                    {item?.mediaUrl.endsWith('.jpg') || item?.mediaUrl.endsWith('.png') ? (
                                                        <img src={item?.mediaUrl} 
                                                        alt={item.title}
                                                         style={{ maxWidth: '100%', height: '95%' }} />
                                                    ) : (
                                                        <video controls autoPlay style={{ maxWidth: '100%', maxHeight: '95%' }}>
                                                            <source src={item?.mediaUrl} type="video/mp4" />
                                                            Your browser does not support the video tag.
                                                        </video>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                        <p className='text-center'>{item?.comment}</p>
                                        <p className='text-center fw-bold fs-6'>{item?.name}</p>
                                    </div>
                                        </>
                                    })
                                    )}
                                </div>
                            </>
                        }
                    </div>
                </div>
            </div>
        </section >
    );
};

const buttonStyle = {
    display: 'inline-block',
    padding: '10px 20px',
    margin: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
};

export default UserPanel;
