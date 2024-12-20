import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Loader from '../Loader/Loader';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay } from 'swiper/modules';
import "./hero.css"

const Hero = () => {

  const [banner, setBanner] = useState([]);
      const [isLoading, setIsLoading] = useState(false);
    
  useEffect(() => {
    setIsLoading(true)
    axios.get(`${process.env.REACT_APP_BASE_URL}/banner`)
        .then((res) => {
            setBanner(res?.data);
            setIsLoading(false);
        })
        .catch((error) => {
        });
}, []);


  return <>
    <div className='container-fluid'>
      <div className='row p-0'>
        <div className='col p-0'>
        {isLoading ? (
                        <div className='col-lg-12 col-sm-12 d-flex align-items-center justify-content-center' style={{ height: "50vh" }} >
                            <Loader />
                        </div>
                    ) : (
                        <>
                            {banner.length > 0 && (
                                

                                <div className='d-flex flex-wrap justify-content-center align-items-center '>
                                <Swiper
                                  className="mySwiper hero_swiper"
                                  slidesPerView={1}
                                  modules={[Autoplay]}
                                  autoplay={{
                                    delay: 3000,
                                    disableOnInteraction: false
                                  }}
                                >
                                  {banner?.map((data, index) => (
                                    <>
                                                <SwiperSlide className='hero_slide' key={index}>
                                                  <img src={data.image} className='img-fluid' alt="" />
                                                  </SwiperSlide>
                                                 {/* <SwiperSlide className='hero_slide'><img src="/hero1.jpeg" className='img-fluid' alt="" /></SwiperSlide>
                                                 <SwiperSlide className='hero_slide'><img src="/hero2.jpeg" className='img-fluid' alt="" /></SwiperSlide> */}
                                  </>
                                            ))}
                         </Swiper>
                        </div>                
                            )}
                        </>
                    )}
        </div>
      </div>
    </div>
  </>
}

export default Hero