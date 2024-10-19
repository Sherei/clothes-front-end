import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { RxCross1 } from "react-icons/rx";
import { toast } from "react-toastify";
import StripePayment from "./PaymentComponent";
import Loader from "../Loader/Loader";
import { v4 as uuidv4 } from 'uuid';
import { useForm } from 'react-hook-form';

import "./checkout.css";

const Checkout = () => {


  const { userId } = useParams();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const cu = useSelector((store) => store.userSection.cu);
  const allCartItems = useSelector((store) => store.Cart.cart);
    const move = useNavigate()
    const dispatch = useDispatch();

    const [payment, setPayment] = useState(true)
  const [setbtnLoading, btnLoading]=useState(false)

    const togglePayment = () => {
        setPayment(!payment)
    }
  useEffect(() => {
    setLoading(true);
    axios.get(`${process.env.REACT_APP_BASE_URL}/addToCart`).then((res) => {
      try {
        if (res) {
          dispatch({
            type: "ADD_TO_CART",
            payload: res.data,
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    });
  }, [dispatch]);

  useEffect(() => {
    if (allCartItems) {
      setCart(allCartItems);
    }
  }, [allCartItems]);

  const filterCart = cart.filter((item) => item.userId === userId);

  const subtotal = filterCart.reduce((acc, item) => acc + item.total, 0);
  const total = subtotal;

  const totalQuantity = filterCart.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const DeleteCartItem = async (itemId) => {
    try {
      setbtnLoading(true);
      const response = await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/deleteCart?id=${itemId}`
      );
      if (response.data.status === "success") {
        dispatch({
          type: "ADD_TO_CART",
          payload: response.data.alldata,
        });
        setbtnLoading(false);
        // toast.success("Item Removed");
      }
    } catch (e) {
      // console.log(e);
    }
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/create-order`,
        {
          userId: cu._id,
          items: filterCart,
          total: total,
          paymentIntentId: paymentIntent.id,
        }
      );

      if (response.data.status === "success") {
        await axios.delete(
          `${process.env.REACT_APP_BASE_URL}/api/clear-cart/${cu._id}`
        );
        toast.success("Order placed successfully!");
        navigate("/order-confirmation", {
          state: { orderId: response.data.orderId },
        });
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to create order. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  async function Order(data) {

    window.scrollTo({
        top: 0
    });

    try {
        setLoading(true);
        const orderItems = [];
        const orderId = uuidv4().replace(/\D/g, '').substr(0, 10);
        filterCart.forEach((item) => {
            const itemData = {
                title: item.title,
                productId: item.productId,
                sn: item.sn,
                category: item.category,
                size: item.size,
                color: item.color,
                image: item.image,
                price: parseFloat(item.price).toString(),
                total: parseFloat(item.total).toString(),
                quantity: parseInt(item.quantity).toString(),
                discount: item.discount,
            };
            orderItems.push(itemData);
        });
        const totalSum = filterCart.reduce((accumulator, item) => {
            return accumulator + item.total;
        }, 0);
        const totalQuantity = filterCart.reduce((accumulator, item) => {
            return accumulator + item.quantity;
        }, 0);

        const shippingFee = () => {
            if (totalQuantity === 1) {
                return 50;
            } else if (totalQuantity === 2) {
                return 70;
            } else {
                return 99;
            }
        };
        const shippingFeeAmount = shippingFee();

        const Ordertotal = totalSum + shippingFeeAmount;
        const orderItemsJSON = JSON.stringify(orderItems);
        data.orderItems = orderItemsJSON;
        data.orderId = orderId;
        data.total = Ordertotal;
        data.userId = userId;
        data.street = data.street;
        data.shipping = shippingFeeAmount;
        data.appartment = data.appartment;

        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/Order`, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.data === "Order is Placed") {
            dispatch({
                type: "ADD_TO_CART",
                payload: response.data.alldata,
            });
            setLoading(false);
            move(`/order-placed/${userId}`)
        }

    } catch (e) {
        // console.log(e);
    }
};


  return (
    <div>
      {loading ? (
        <div
          className="col-12 d-flex justify-content-center align-items-center"
          style={{ height: "80vh" }}
        >
          <Loader />
        </div>
      ) : filterCart?.length > 0 ? (
        <section
          className="min-vh-100 checkout"
          style={{ backgroundColor: "#eee" }}
        >
          <div className="container py-5 h-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col">
                <div className="card">
                  <div className="card-body p-4">
                    <div className="row">
                      <div className="col-lg-8">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                        </div>
                        <h4 className="mb-3 fw-bolder" style={{  }}>Delivery Details</h4>
                            <form action="" onSubmit={handleSubmit(Order)}>
                                <div className="row py-3">
                                    <p className='fs-6' style={{ fontWeight: "600",  }}>Personal Information</p>
                                    <div className="col-md-6 mb-3">
                                        <input type="text" placeholder='First Name*' className="form-control py-2 border" {...register('name1', { required: true })} />
                                        {errors.name1 ? <div className='error'>This Field is required</div> : null}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <input type="text" placeholder='Last Name *' className="form-control py-2 border"{...register('name2', { required: true })} />
                                        {errors.name2 ? <div className='error'>This Field is required</div> : null}

                                    </div>
                                    <div className="col-12 mb-3">
                                        <input type="number" placeholder='Contact Number*' min={0} className="form-control py-2 border" {...register('number1', { required: true })} />
                                        {errors.number1 ? <div className='error'>This Field is required</div> : null}
                                    </div>
                                </div>
                                <hr />
                                <div className="row py-3">
                                    <p className='fs-6' style={{ fontWeight: "600",  }}>Shipping Address</p>
                                    <div className="col-md-12 mb-3">
                                        <input type="text" placeholder='House Number & Street Name*' className="form-control py-2 border" {...register('street', { required: true })} />
                                        {errors.street ? <div className='error'>This Field is required</div> : null}
                                    </div>
                                    <div className="col-md-12 mb-3">
                                        <input type="text" placeholder='Appartment, Suite, Unit, etc' className="form-control py-2 border" {...register('appartment')} />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <input type="text" placeholder='Country*' className="form-control py-2 border" {...register('country', { required: true })} />
                                        {errors.country ? <div className='error'>This Field is required</div> : null}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <input type="text" placeholder='Town/City*' className="form-control py-2 border" {...register('city', { required: true })} />
                                        {errors.city ? <div className='error'>This Field is required</div> : null}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <input type="text" placeholder='Postcode*' min={0} className="form-control py-2 border" {...register('postal', { required: true })} />
                                        {errors.postal ? <div className='error'>This Field is required</div> : null}
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <input type="email" placeholder='E-mail' className="form-control py-2 border" {...register('email')} />
                                   </div>
                                </div>

                                <hr className="mb-4" />
                                <div className='py-3'>
                                    <p className='fs-6' style={{ fontWeight: "600",  }}>Payment Method</p>
                                    <div className="col-md-12 mb-3">
                                        <>
                                            <div className="d-flex gap-2" onClick={()=>setPayment(false)}>
                                                <input
                                                    type="radio"
                                                    name="flexRadioDefault"
                                                    id="flexRadioDefault1"
                                                    defaultChecked="true"
                                                    
                                                />
                                                <p className="m-0" htmlFor="flexRadioDefault1">
                                                    Cash on delivery
                                                </p>
                                            </div>
                                           
                                            <div className="d-flex gap-2 mt-1" onClick={()=>setPayment(true)}>
                                                <input
                                                    type="radio"
                                                    name="flexRadioDefault"
                                                    id="flexRadioDefault2"
                                                    
                                                />
                                                <p className="m-0" htmlFor="flexRadioDefault2">
                                                    Credit Card
                                                </p>
                                            </div>
                                        </>
                                    </div>
                                </div>

                                <hr className="mb-4" />
                                {payment &&

                                <StripePayment
        amount={total}
        onPaymentSuccess={handlePaymentSuccess}
      />
      
    }
                            </form>
                       
                      </div>
                      <div className='col-lg-4 col-md-6 col-sm-12 px-4 pt-5 pt-lg-3'>
                            <div className='row'>
                                <div className='col-12 d-flex justify-content-between'>
                                    <p className='fw-bolder fs-4'>ORDER SUMMARY</p>
                                    <p className='fw-bolder fs-4'>{filterCart?.length}</p>
                                </div>
                            </div>
                            {filterCart?.map((item, index) => {
                                return <>
                                    <div className='row border mb-1 py-3' key={index} style={{position:"relative"}}>
                                            <div className="fs-5" style={{position:"absolute", bottom:"10px", right:"10px",
                                              width:"fit-content",
                                         }} onClick={() => DeleteCartItem(item._id)}>
                                                {btnLoading? <RxCross1/>:"Removing..."}
                                            </div>
                                        <div className='col-3' style={{ position: "relative" }}>
                                            <img className='img-fluid' src={item?.image} alt="No Internet" />
                                            <p className='m-0 cart_number' style={{
                                                top: "-4px",
                                                right: "4px,"
                                            }}>
                                                {item?.quantity}
                                            </p>
                                        </div>
                                        <div className='col-9 d-flex justify-content-between '>
                                            <div>
                                                <p className='m-0'>{item?.title.slice(0, 50)}</p>
                                            </div>
                                            <div className="d-flex justify-content-between flex-column">
                                                <div>
                                                    <p className='text-center fw-bolder'>{`£${item?.total?.toFixed()}`}</p>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            })
                            }

                            <div className='row mt-3 py-3 border' style={{ backgroundColor: "white" }}>
                                <div className='px-3 pt-3 col-12  d-flex justify-content-between align-items-center'>
                                    <p className='fs-6'>Subtotal</p>
                                    <p className='fs-6'>{`£${total?.toFixed()}`}.00</p>
                                </div>
                                <div className='px-3 col-12 d-flex justify-content-between align-items-center'>
                                    <p className=' fs-6'>Shipping</p>
                                    <p className=' fs-6'>Free</p>
                                </div>
                                <div className='px-3 col-12 d-flex justify-content-between align-items-center' style={{ fontWeight: "600" }}>
                                    <p className='fs-5'>Total</p>
                                    <p className='fs-5'>{`£${total?.toFixed()}`}.00</p>
                                </div>
                            </div>
                            <a href="/Products/all">
                  <button
                    className="button-submit px-4 w-100"
                  >
                    Continue Shopping
                  </button>
                </a>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div
          className="px-4 pt-5 d-flex flex-column justify-content-center align-items-center"
          style={{ minHeight: "70vh" }}
        >
          <img src="/cart.png" alt="" style={{ width: "150px" }} />
          <p className="fw-bolder mt-3" style={{ color: "rgb(2,2,94)" }}>
            Your Cart is Empty
          </p>
          <a href="/Products/all">
            <button className="button-submit px-4">Shop our products</button>
          </a>
        </div>
      )}
    </div>
  );
};

export default Checkout;
