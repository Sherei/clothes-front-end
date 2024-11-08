import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FaVideoSlash } from "react-icons/fa";
import { MdOutlinePhotoLibrary } from "react-icons/md";
import { toast } from 'react-toastify';
import Loader from "../Loader/Loader"
import axios from 'axios';
import { useSelector, useDispatch } from "react-redux";
import "./review.css"
import { useNavigate } from 'react-router-dom';


import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { Autoplay } from 'swiper/modules';

const Review = () => {


    let {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    let cu = useSelector((store) => store.userSection.cu);
    const [formData, setFormData] = useState(new FormData());
    const allComments = useSelector((store) => store.Comment.comment);

    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(false);
    const [btnLoading,setBtnLoading]=useState(false)

    const [form, setForm] = useState(false)
    const [imageSelected, setImageSelected] = useState(false);
    const [videoSelected, setVideoSelected] = useState(false);

    const dispatch = useDispatch();
    const move =useNavigate()

    const resetMediaSelection = () => {
        setImageSelected(false);
        setVideoSelected(false);
    };
    
     const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImageSelected(true);
        }
    };

    const handleVideoChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setVideoSelected(true);
        }
    };
    const openForm = () => {
        setForm(!form)
    }

    const Comment = async (cmnt) => {

        if (!imageSelected && !videoSelected) {
            toast.warning("Please select either an image or a video.");
            return; 
          }
        if(!cu){
            toast.warning("Login to give feedback")
            return move('/login')
        }
        let mediaUrl = "";

        if (cmnt.image && cmnt.image[0] && cmnt.video && cmnt.video[0]) {
            setBtnLoading(false)
            return toast.warning("Select each media");
        }

        if (cmnt.image && cmnt.image[0]) {
            
            const imageType = cmnt.image[0].type;

            if (!imageType.startsWith("image/")) {
            setBtnLoading(false)
                
                return toast.warning("Select valid image file");
            }
            const formData = new FormData();
            formData.append('file', cmnt.image[0]);
            formData.append('upload_preset', 'zonfnjjo');
            try {
            setBtnLoading(true)
                const response = await axios.post("https://api.cloudinary.com/v1_1/dlw9hxjr4/image/upload", formData);
                mediaUrl = response.data.url;
                setBtnLoading(false)
            } catch (error) {    
            setBtnLoading(false)
            // console.error("Image upload failed", error);
            }
        }

        if (cmnt.video && cmnt.video[0]) {
            
            const videoType = cmnt.video[0].type;

            if (!videoType.startsWith("video/")) {
            setBtnLoading(false)
                return toast.warning("Select valid video format");
            }
            const formData = new FormData();
            formData.append('file', cmnt.video[0]);
            formData.append('upload_preset', 'zonfnjjo');
            try {
            setBtnLoading(true)
                const response = await axios.post("https://api.cloudinary.com/v1_1/dlw9hxjr4/video/upload", formData);
                mediaUrl = response.data.url;
            
            setBtnLoading(false)
            } catch (error) {
            setBtnLoading(false)
            }
        }

        try {
            setBtnLoading(true)
            if(!mediaUrl){
            setBtnLoading(false)

                return toast.error("Media uploaded failed")
            }
            setBtnLoading(true)
            cmnt.mediaUrl = mediaUrl;
            cmnt.userId = cu._id;

            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/comments`, cmnt);

            if (response.data.message === "Comment Added") {

                dispatch({
                    type: "ADD_COMMENT",
                    payload: response.data.alldata,
                });
            
                setComments(response.data.alldata);
                const modal = document.getElementById('exampleModal');
                document.querySelector('.modal-backdrop').remove();
                reset();
                setImageSelected(false)
                setVideoSelected(false)
            setBtnLoading(false)
                toast.success("Feedback submitted");
                // window.location.reload();
            }
        } catch (e) {
            setBtnLoading(false)
        }   
        setBtnLoading(false)

    };



    useEffect(() => {
        setLoading(true);
        try {
            axios.get(`${process.env.REACT_APP_BASE_URL}/comments`).then((res) => {
                if (res) {
                    dispatch({ type: "ADD_COMMENT", payload: res.data });
                    setLoading(false)
                }
            });
        } catch (e) {
        }
    }, []);

    useEffect(() => {
        if (allComments) {
            setComments(allComments);
            setLoading(false);
        }
    }, [allComments]);



    const formatDateTime = (dateStr) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',

        };
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', options);
    };

    return <>
        <div className='container-fluid my-5'  id='review'>
            <div className='px-lg-4 px-md-3 px-2'>
                <div className="row d-flex justify-content-center">
                    <div className="col-lg-12 col-md-12 col-sm-12 py-5" >
                        <h1 className="fs-1 fw-bolder  text-light">
                            Riski-Brothers Society
                        </h1>
                        <div>
                            {comments?.length === 0 ? (
                                <div
                                    className="col-lg-12 col-sm-12 d-flex align-items-center justify-content-center"
                                    style={{ height: "50vh" }}
                                >
                                    <h2>No Review available</h2>
                                </div>
                            ) : (
                                <Swiper
                                breakpoints={{
                                    590: { slidesPerView: 1, spaceBetween: 10 }, 
                                    599: { slidesPerView: 2, spaceBetween: 10 }, 
                                    768: { slidesPerView: 2, spaceBetween: 10 }, 
                                    1024: { slidesPerView: 4, spaceBetween: 20 },
                                  }}
                                spaceBetween={30}
                                modules={[Autoplay]}
            //   autoplay={{
            //     delay: 10000,
            //     disableOnInteraction: false
            //   }}
                                className="mySwiper"
                              >
                                {comments.map((item, index) => (
                                  <SwiperSlide key={index} className='review_slide my-4'>
                                    <div className='card border border-0 border-bottom border-light shadow-sm' 
                                    style={{ width: "270px" }}>
                                      <div className="card_img mb-2">
                                        {item?.mediaUrl ? (
                                          item.mediaUrl.endsWith('.jpg') || item.mediaUrl.endsWith('.png') ? (
                                            <img
                                              src={item.mediaUrl}
                                              alt={item.title}
                                              style={{ width: '100%', height: '100%' }}
                                            />
                                          ) : (
                                            <video
                                              controls
                                              autoPlay={false}
                                              style={{ maxWidth: '100%', maxHeight: '100%' }}
                                            >
                                              <source
                                            src={item.mediaUrl.startsWith('http:') ? item.mediaUrl.replace('http:', 'https:') : item.mediaUrl}
 type="video/mp4" />
                                            </video>
                                          )
                                        ) : (
                                          <img
                                            src="/feedback.png"
                                            alt={item?.title}
                                            style={{ maxWidth: '100%', maxHeight: '100%' }}
                                          />
                                        )}
                                      </div>
                                      <p className='text-center text-light'>{item?.comment}</p>
                                      <p className='text-center fs-6 fw-bold'>{item?.name}</p>
                                    </div>
                                  </SwiperSlide>
                                ))}
                              </Swiper>
                            )}
                        </div>
                    </div>
                    {loading? (
            <div className='d-flex justify-content-center align-items-center' style={{minHeight:"50vh"}}>
            <Loader />
            </div>
          ) :(
            <div
  className="modal fade"
  id="exampleModal"
  onHide={resetMediaSelection}
  tabIndex={-1}
  aria-labelledby="exampleModalLabel"
  aria-hidden="true"
>
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title text-dark" id="exampleModalLabel">
          Reviews
        </h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
  onClick={resetMediaSelection}
        />
      </div>
      <div className="modal-body">
      <div className="modal-body p-3">
                                        <form action="" onSubmit={handleSubmit(Comment)}>
                                           
                                            <div className="mb-3">
                                                <label className="form-label text-dark">Your Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control text-dark"
                                                    placeholder="Rose Merie"
                                                    required
                                                    {...register('name')}
                                                />
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label text-dark">Email address</label>
                                                <input
                                                    type="email"
                                                    placeholder="asd@gmail.com"
                                                    className="form-control text-dark"
                                                    required
                                                    {...register('email')}
                                                />
                                            </div>

                                            <div className="d-flex gap-2 mb-3">
                                          
                <div className="file-input-container">
                    <label className="file-input-box text-dark">
                        <i><MdOutlinePhotoLibrary /></i>
                        <input
                            type="file"
                            accept="image/*"
                            {...register('image')}
                            className="file-input text-dark"
                            onChange={handleImageChange}
                        />
                        <p className="text-muted m-0 text-dark">Photo</p>
                    </label>
                </div>

                <div className="file-input-container">
                    <label className="file-input-box text-dark">
                        <i><FaVideoSlash /></i>
                        <input
                            type="file"
                            accept="video/*"
                            {...register('video')}
                            className="file-input"
                            onChange={handleVideoChange}
                        />
                        <p className="text-muted m-0 text-dark">Video</p>
                    </label>
                </div>
       
                                              
                                            </div>
                                            {imageSelected && <p className='text-success text-dark'>Image Selected</p>}
        {videoSelected && <p className='text-success text-dark'>Video Selected</p>}

                                            <div className="mb-3">
                                                <label className="form-label text-dark">Write your feedback</label>
                                                <textarea
                                                    rows="5"
                                                    className="form-control text-dark"
                                                    required
                                                    {...register('comment')}
                                                />
                                            </div>
                                            <button type="submit"  
                                            className={`button-submit w-100 bg-dark text-light  d-flex justify-content-center align-items-center${btnLoading ? "btn_loading" : ""}`}
                                            disabled={btnLoading}>
                                            {btnLoading ? <div className="spinner"></div> : "Submit"}
                                        </button>
                                        </form>
                                    </div>
      </div>
     
    </div>
  </div>
</div>

          )

                    }    
            
                    
                </div>
            </div>
        </div>

        
        {!form && (
                        <div className="container mb-5">
                            <div className="border py-5 px-lg-5 px-md-3 px-sm-2 d-flex flex-column justify-content-center align-items-center">
                                <p className="fw-bolder fs-3 text-center">Customer Reviews</p>
                                <p className="text-center fs-5">No review yet. Any feedback? Let us know </p>
                                <div className="">
                                    <button className="button-submit px-3"
                                        data-bs-toggle="modal"
                                         data-bs-target="#exampleModal"
                                    >Write a review</button>
                                </div>
                            </div>
                        </div>
                    )}
    </>
}

export default Review