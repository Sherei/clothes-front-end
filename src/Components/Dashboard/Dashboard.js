import React, { useEffect, useState } from 'react';
import {
    FaUsers, FaClipboardList, FaFirstOrder, FaCommentDots, FaBlog,
    FaTh,
    FaBars,
    FaDiscourse,
    FaServicestack,
    FaCameraRetro,
    FaHome,
    FaQq
} from "react-icons/fa";
import { AiFillFolderAdd } from 'react-icons/ai'
import { BiLogOut } from 'react-icons/bi';
import { Users } from "./Users"
import { Products } from "./Products"
import { Orders } from "./Orders"
import Comments from './Comments';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Loader from '../Loader/Loader';
import { useNavigate } from 'react-router-dom';
import "./dashboard.css";
import Blogs from './Blogs';
import Collections from './Collections';
import AddCollections from './AddCollections';
import { Link } from 'react-scroll';
import { toast } from 'react-toastify';

export const Dashboard = () => {

    useEffect(() => {
        window.scrollTo({
            top: 0
        });
    }, []);

    let cu = useSelector(store => store.userSection.cu)
    const move = useNavigate()

    const [users, setUsers] = useState([])
    const [product, setProducts] = useState([])
    const [comment, setComments] = useState([])
    const [order, setOrder] = useState([])
    const [blog, setBlog] = useState([])
    const [collection, setCollection] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [file, setFile] = useState('users')

    useEffect(() => {
        try {
            axios.get(`${process.env.REACT_APP_BASE_URL}/dashboard`).then((res) => {
                setUsers(res.data.Users)
                setProducts(res.data.Products)
                setComments(res.data.comments)
                setOrder(res.data.allOrder)
                setBlog(res.data.allBlog)
                setCollection(res.data.allCollection)
            })
        } catch (e) { } finally {
            setIsLoading(false)
        }
    }, [])


    const handleItemClick = (id) => {
        setFile(id);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        setIsLoading(true); // Start loading

        if (cu.role !== "admin") {
           return move('/'); 
         }

        setIsLoading(false); // Stop loading
    }, [cu.role, move]);

    return (
        <>
            <div className='container mt-2 mb-5'>
                <div className='row'>
                    <div className="col-lg-12 col-sm-12 d-flex justify-content-between">
                        <h1 className="p_head">
                            Dashboard
                        </h1>
                    </div>
                </div>
                <div className='d-flex align-items-center gap-3 flex-wrap mt-3 mb-5 dash_row'>
                    {isLoading ? (
                        <div className='col-lg-12 col-sm-12 d-flex align-items-center justify-content-center' style={{ height: "50vh" }}>
                            <Loader />
                        </div>
                    ) : (
                        <>
                            {/* Add Collection */}
                            <div className='dash_card'>
                                <div className='p-3 admin_card' onClick={() => move('/admin-dashboard-add-collection')}>
                                    <div className='d-flex justify-content-between align-items-center'>
                                        <div>
                                            <p className='admin_card_title m-0'>Add Collection</p>
                                            {/* <p className='admin_card_number'>{collection.length}</p> */}
                                        </div>
                                        <div className='card_icon'>
                                            <FaBlog />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Add Products */}
                            <div className='dash_card'>
                                <div className='p-3 admin_card'  onClick={() => move('/admin-dashboard-add-product')}>
                                    <div className='d-flex justify-content-between align-items-center'>
                                        <div>
                                            <p className='admin_card_title'>Add Product</p>
                                            {/* <p className='admin_card_number'>{collection.length}</p> */}
                                        </div>
                                        <div className='card_icon'>
                                            <AiFillFolderAdd />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Add Blog */}
                            <div className='dash_card'>
                                <div className='p-3 admin_card'   onClick={() => move('/admin-dashboard-add-blog')}>
                                    <div className='d-flex justify-content-between align-items-center'>
                                        <div>
                                            <p className='admin_card_title'>Add Blog</p>
                                            {/* <p className='admin_card_number'>{collection.length}</p> */}
                                        </div>
                                        <div className='card_icon'>
                                            <FaBlog />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Collections */}
                            <div className='dash_card'>
                                <Link to='collections'>
                                <div className='p-3 admin_card' >
                                    <div className='d-flex justify-content-between align-items-center'>
                                        <div>
                                            <p className='admin_card_title'>Collections</p>
                                            <p className='admin_card_number'>{collection.length}</p>
                                        </div>
                                        <div className='card_icon'>
                                            <FaBlog />
                                        </div>
                                    </div>
                                </div>
                                </Link>
                                
                            </div>
                            
                            {/* Orders */}
                            <div className='dash_card'>
                                <Link to='orders'>
                                <div className='p-3 admin_card'>
                                    <div className='d-flex justify-content-between align-items-center'>
                                        <div>
                                            <p className='admin_card_title'>Orders</p>
                                            <p className='admin_card_number'>{order.length}</p>
                                        </div>
                                        <div className='card_icon'>
                                            <FaFirstOrder />
                                        </div>
                                    </div>
                                </div>
                                </Link>
                            </div>
                            
                            {/* Users */}
                            <div className='dash_card'>
                                <Link to='users'>
                                <div className='p-3 admin_card'>
                                    <div className='d-flex justify-content-between align-items-center'>
                                        <div>
                                            <p className='admin_card_title'>Users</p>
                                            <p className='admin_card_number'>{users.length}</p>
                                        </div>
                                        <div className='card_icon'>
                                            <FaUsers />
                                        </div>
                                    </div>
                                </div>
                                </Link>
                                
                            </div>
                            
                            {/* Products */}
                            <div className='dash_card'>
                                <Link to='products'>
                                <div className='p-3 admin_card'>
                                    <div className='d-flex justify-content-between align-items-center'>
                                        <div>
                                            <p className='admin_card_title'>Products</p>
                                            <p className='admin_card_number'>{product.length}</p>
                                        </div>
                                        <div className='card_icon'>
                                            <FaClipboardList />
                                        </div>
                                    </div>
                                </div>
                                </Link>
                                
                            </div>
                            
                            {/* Reviews */}
                            <div className='dash_card'>
                                <Link to='reviews'>
                                <div className='p-3 admin_card'>
                                    <div className='d-flex justify-content-between align-items-center'>
                                        <div>
                                            <p className='admin_card_title'>Reviews</p>
                                            <p className='admin_card_number'>{comment.length}</p>
                                        </div>
                                        <div className='card_icon'>
                                            <FaCommentDots />
                                        </div>
                                    </div>
                                </div>
                                </Link>
                            </div>

                             {/* Blogs */}
                             <div className='dash_card'>
                                <Link to='blogs'>
                                <div className='p-3 admin_card'>
                                    <div className='d-flex justify-content-between align-items-center'>
                                        <div>
                                            <p className='admin_card_title'>Blogs</p>
                                            <p className='admin_card_number'>{blog.length}</p>
                                        </div>
                                        <div className='card_icon'>
                                            <FaCommentDots />
                                        </div>
                                    </div>
                                </div>
                                </Link>
                            </div>
                        </>

                    )}

                </div>

                <div className='row'>
                    
                <div className='col-12' id='orders'>
                        <Orders />
                    </div>
                <div className='col-12' id='users'>
                            <Users />
                        </div>
                        <div className='col-12' id="collections">
                            <Collections />
                        </div>

                        <div className='col-12' id='products'>
                            <Products />
                        </div>
                        <div className='col-12' id='reviews'>
                            <Comments />
                        </div>
                        <div className='col-12' id='blogs'>
                            <Blogs />
                        </div>
                    
                </div>
            </div>
        </>
    );
};
