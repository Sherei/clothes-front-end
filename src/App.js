import React, { useState, useEffect } from 'react';
import Logos from './Components/Home/Logos';
import Navbar from './Components/Navbar/Navbar';
import Home from './Components/Home/Home';
import Products from './Components/Products/Products';
import SingleAdd from './Components/SinglePage/SingleAdd';
import { Cart } from "./Components/cart/Cart"
import Checkout from './Components/Checkout/Checkout';
import Orderplaced from './Components/Placed/Orderplaced';
import UserPanel from './Components/UserPanel/UserPanel';
import OrderDetail from './Components/OrderDetail/OrderDetail';
import Sidebar from './Components/Dashboard/Sidebar';
import { AddProduct } from './Components/Dashboard/AddProduct';
import AddBlog from './Components/Dashboard/AddBlog';
import AllBlog from './Components/Blog/AllBlog';
import SingleBlog from './Components/Blog/SingleBlog';
import Contact from './Components/Contact/Contact';
import Faq from "./Components/Faq/Faq"
import {Login} from "./Components/login/Login"
import Signup from "./Components/Signup/Signup"
import {Error} from "./Components/Error/Error"
import Search from './Components/Search/Search';
import Footer from './Components/Footer/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch } from "react-redux";
import './App.css';
import AddCollections from './Components/Dashboard/AddCollections';
import { Dashboard } from './Components/Dashboard/Dashboard';
import Animation from './Components/Animations/Animation';
import Enteremail from './Components/ForgetPassword/Enteremail/Enteremail';
import { VerifyEmail } from './Components/ForgetPassword/Enteremail/VerifyEmail/VerifyEmail';
import EnterOTP from './Components/Signup/Enterotp/Enterotp';
import Checkinbox from './Components/Signup/Checkinbox/Checkinbox';
import CategoriesProducts from './Components/CategoriesProducts/CategoriesProducts';
import { IoLogoWhatsapp } from "react-icons/io5";
import Review from './Components/Reviews/Review';
import AddBanner from './Components/Dashboard/AddBanner';
// import 'bootstrap/dist/css/bootstrap.min.css';
function App() {

  const dispatch = useDispatch();


  useEffect(() => {
    try {
      axios.post(`${process.env.REACT_APP_BASE_URL}/session-check`, { token: localStorage.getItem('userToken') }).then((res) => {
        if (res.data) {
          dispatch({
            type: 'LOGIN_USER',
            payload: res.data,
          });
        }
      });
    } catch (e) {

    }
  }, []);
  const sendWhatsAppMessage = () => {
    const message = `https://riskibrothers.com/\n\nHow can we help you?`;
    const whatsappURL = `https://wa.me/+923259053922?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, "_blank");
  };

return <>

<div style={{ position: 'relative' }}>
        <div className='whatsapp-button' onClick={sendWhatsAppMessage}>
          <IoLogoWhatsapp />
        </div>
      </div>

    <BrowserRouter>
      <Logos/>
      <Navbar/>
          <Routes>
            
          <Route exact path='/' element={<Home />} />
          <Route exact path='/search' element={<Search />} />
              {/*  User */}
              <Route exact path='/signup' element={<Signup />} />
              <Route exact path='/checkinbox' element={<Checkinbox />} />
              <Route exact path='/enterotp/:email' element={<EnterOTP />} />
              <Route exact path='/enteremail' element={<Enteremail />} />
              <Route exact path='/reset-password/:token' element={<VerifyEmail />} />
              <Route exact path='/animation' element={<Animation />} />
              <Route exact path='/signup/:title/:productId' element={<Signup />} />
              <Route exact path='/login' element={<Login />} />
              <Route exact path='/login/:title/:productId' element={<Login />} />
              <Route exact path='/user-profile/:userId' element={<UserPanel />} />
              <Route exact path='/contact' element={<Contact />} />
              <Route exact path='/faqs' element={<Faq />} />

              {/* Products */}
              <Route exact path='/admin-dashboard-add-product' element={<AddProduct />} />
              <Route exact path='/admin-dashboard-add-product/:productId' element={<AddProduct />} />
              <Route exact path='/Products' element={<Products />} />
              <Route exact path='Product/byCategory/:category' element={<CategoriesProducts />} />
              <Route path='/product/:title/:productId' element={<SingleAdd />} />
              <Route exact path='/Products/:prodctName' element={<Products />} />

              <Route exact path='/reviews' element={<Review />} />

              {/* Cart */}
              <Route exact path='/cart/:userId' element={<Cart />} />
              <Route exact path='/cart-checkout/:userId' element={<Checkout />} />

              {/* Order */}
              <Route path='/order-placed/:userId' element={<Orderplaced />} />
              <Route path='/order-detail/:OrderId' element={<OrderDetail />} />

              {/* Admin */}
              <Route exact path='/admin-dashboard/:userId' element={<Sidebar />} />

              {/* Blog */}
              <Route exact path='/admin-dashboard-add-blog' element={<AddBlog />} />
              <Route exact path='/admin-dashboard-add-blog/:blogId' element={<AddBlog />} />
              <Route path='/blog_detail/:blogId' element={<SingleBlog />} />
              <Route path='/all-blog' element={<AllBlog />} />
               
                {/* Collection */}
                <Route exact path='/admin-dashboard-add-collection' element={<AddCollections />} />
                <Route exact path='/admin-dashboard-add-collection/:collectionId' element={<AddCollections />} />
                <Route exact path='/admin-dashboard-add-banner' element={<AddBanner />} />
                <Route exact path='/admin-dashboard-add-banner/:bannerId' element={<AddBanner />} />

              <Route exact path='*' element={<Home />} />
              
      </Routes>
      <Footer/>
    </BrowserRouter>
    <ToastContainer
          position="top-center"
          autoClose={2500}
          hideProgressBar={true}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover={false}
          theme="light"
        />

  </>
}

export default App;
