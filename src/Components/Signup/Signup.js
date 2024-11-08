import React, { useState, useEffect } from 'react'
import Benefits from "../Benefits/Benefits"
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router'
import { FaEye, FaEyeSlash, FaRegUser, FaPhoneAlt, FaAddressBook,FaLock } from 'react-icons/fa';
import { MdOutlineAlternateEmail } from "react-icons/md";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import "./signup.css"

const Signup = () => {

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, []);
  const cu = useSelector(store => store.userSection.cu);

    const { title, productId } = useParams();
    const [btnLoading,setBtnLoading]=useState(false)
    const [Error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const move = useNavigate()

    async function SignUp(data) {
        // console.log(data,'data here')
        try {
            setBtnLoading(true)
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/signUp`, data);
            // console.log(response.data.message)
            // console.log(response.data , "here is data ")
            // console.log(response.data.email,"user email is this")
            // console.log(response.data._id,"user id is this")
            if (response.data.message === "User Created. Please verify your email using the OTP sent.") {                
                // if (productId) {
                //     move(`/login/${title.replace(/ /g, '-')}/${productId}`)
                // } else {
                //     move('/login')
                // }
                setBtnLoading(false)
                move(`/enterotp/${response.data.email}`)
                toast.success("Account Created Please verify")
                reset();
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setError('This E-mail is already registered. Please login')
                setBtnLoading(false)
            } else {
                setError('This E-mail is already registered. Please login')
                setBtnLoading(false)
            }
            setBtnLoading(false)
        }
    }

    if(cu._id !=undefined){
        return move("/")
       }
     
    return <>
        <div className='container my-5'>
            <div className='row d-flex justify-content-center px-2'>
                <div className='col-lg-6 col-md-10 col-sm-12 border rounded-3 p-lg-5 p-sm-2'>
                    <div>
                    <p className='fs-2 fw-bold text-center m-0'>Create your Account</p>
                    <p className='text-center text-muted'>Please fill in the infromation below</p>
                    </div>
                    <form className="form" action="" onSubmit={handleSubmit(SignUp)}>
                        {Error &&
                            <div className='error mb-3 py-2 text-light'>{Error}</div>
                        }
                        <div className="flex-column">
                            <label className="text-light">Name *</label>
                        </div>
                        <div className="inputForm text-light">
                            <svg className='mt-3'
                                height={40}
                                viewBox="0 0 32 32"
                                width={40}
                            >
                                <FaRegUser />
                            </svg>
                            <input
                                required="true"
                                autocomplete="off"
                                type="text"
                                placeholder='Enter Your Name'
                                className="input w-100 text-light" {...register('name', { required: true })} />
                        </div>
                        {errors.name ? <div className='error'>Name is required </div> : null}
                        <div className="flex-column">
                            <label className="text-light">Email *</label>
                        </div>
                        <div className="inputForm text-light">
                        <svg className='mt-3'
                                height={40}
                                viewBox="0 0 32 32"
                                width={40}
                            >
                                <MdOutlineAlternateEmail />
                            </svg>
                            <input
                                required="true"
                                autocomplete="off"
                                type="email"
                                placeholder='Enter Your Email'
                                className="input w-100 text-light" {...register('email', {
                                    required: true, validate: function (typedValue) {
                                        if (typedValue.match(
                                            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1, 3}\.[0-9]{1, 3}\.[0-9]{1, 3}\.[0-9]{1, 3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                                        )) {
                                            return true;
                                        } else {
                                            return false;
                                        }
                                    }
                                })} />
                        </div>
                        <div className="flex-column">
                            <label className="text-light">Contact *</label>
                        </div>
                        <div className="inputForm text-light">
                        <svg className='mt-3'
                                height={40}
                                viewBox="0 0 32 32"
                                width={40}
                            >
                                <FaPhoneAlt />
                            </svg>
                            <input
                                required="true"
                                autocomplete="off"
                                type="number"
                                min={0}
                                placeholder='Enter Your Contact Number'
                                className="input w-100 text-light" {...register('number', { required: true })} />
                        </div>
                        {errors.number ? <div className='error'>Contact Number is required </div> : null}
                        <div className="flex-column">
                            <label className="text-light">Shipping Address *</label>
                        </div>
                        <div className="inputForm text-light">
                        <svg className='mt-3'
                                height={40}
                                viewBox="0 0 32 32"
                                width={40}
                            >
                                <FaAddressBook />
                            </svg>
                            <input
                                autocomplete="off"
                                type="text"
                                placeholder='Enter Your Shipping Address'
                                className="input w-100 text-light" {...register('address')} />
                        </div>


                        <div className="flex-column">
                            <label className="text-light">Password *</label>
                        </div>
                        <div className="inputForm text-light">
                        <svg className='mt-3'
                                height={40}
                                viewBox="0 0 32 32"
                                width={40}
                            >
                         <FaLock />
                           </svg>
                            <input
                                required="true"
                                autocomplete="off"
                                placeholder='Enter Your Password'
                                type={showPassword ? "text" : "password"}
                                className="input w-100 text-light"
                                {...register('password', { required: true })} />
                            {errors.password ? <div className='error'>Password is required </div> : null}
                            <span
                                className="password-toggle-btn fs-5"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? <FaEye /> : <FaEyeSlash />}
                            </span>
                        </div>

                        <button className={`button-submit ${btnLoading ? "btn_loading" : ""}`}
                        disabled={btnLoading}>
                            {btnLoading ? <div className="spinner"></div> : "Signup"}
                        </button>

                        <p className="text-light">
                            Already have an account?  &nbsp;&nbsp;
                            {productId && <a href={`/login/${title}/${productId}`}>
                                <span className='register_btn'>
                                    Login
                                </span>
                            </a>}
                            {!productId && <a href="/login">
                                <span className='register_btn'>
                                    Login
                                </span>
                            </a>}
                        </p>
                    </form>
                </div>
            </div>
           
        </div>
        <div className=''>
                <Benefits />
            </div>
    </>
}

export default Signup