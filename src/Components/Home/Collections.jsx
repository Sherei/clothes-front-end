import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../Loader/Loader';
import axios from 'axios';
import "./collection.css"

const Collections = () => {

    const [collection, setCollection] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState('');

    let move = useNavigate()

    useEffect(() => {
        setIsLoading(true)
        axios
            .get(`${process.env.REACT_APP_BASE_URL}/collection/ActiveStatus`)
            .then((res) => {
                setCollection(res?.data);
                setIsLoading(false);
                // console.log(res.data, "Collection Here")
            })
            .catch((error) => {
            });
    }, []);
    // /Product/byCategory/:category
    return <>
        <div className="container mt-5">
            <div className="row">
                <div className="col-12"><h1 className='home_heading text-center mb-1 text-capitalize fs-3 text-light'>Premium 1st</h1></div>
            </div>
            <div className='d-flex flex-wrap align-center justify-content-center'>
                {isLoading ? (
                    <div className='d-flex justify-content-center align-items-center' style={{minHeight:"50vh"}}>
                    <Loader />
                    </div>
                ) : (
                    collection.map((item, index) => {
                        return (
                            <div className='p-2'>
 <div className="col card border-0 border-bottom border-light shadow-sm" key={index} data-aos='fade-up'>
                            <a href={`/Products/${item.category.replace(/ /g, '-')}`}>
                                <div className="card_img">
                                    <img src={item?.image} className="text-center" alt={item?.title} />
                                </div>
                                <p className="card_title fs-4">{item?.category}</p>
                            </a>
                        </div>
                        </div>
                        );
                    })
                )}
            </div>
        </div>
    </>
}

export default Collections