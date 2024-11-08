import React, { useState, useEffect, useRef } from "react";
import { CgSearch } from "react-icons/cg";
import { FiUser } from "react-icons/fi";
import { HiBars3CenterLeft } from "react-icons/hi2";
import { BsCart } from "react-icons/bs";
import { NavLink } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import axios from "axios";
import { FaBars, FaCross, FaPowerOff } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import {Link} from "react-scroll";
import { IoLogOutOutline } from "react-icons/io5";
import { useParams } from "react-router-dom";
import "./navbar.css"
import Loader from "../Loader/Loader";



const Navbar = () => {

  const dispatch = useDispatch();
  const move = useNavigate();
  const cu = useSelector((store) => store.userSection.cu);
  const allCartItems = useSelector((store) => store.Cart.cart);
  
  const [open, setOpen] = useState(false);
  const { userId } = useParams();
  const [cart, setCart] = useState([]);
  const [openSearch, setOpenSearch]=useState(false)
  const sideNavRef = useRef(null);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/addToCart`).then((res) => {
      try {
        if (res) {
          dispatch({
            type: "ADD_TO_CART",
            payload: res.data,
          });
        }
      } catch (e) {
      }
        });
  }, []);

  useEffect(() => {
    if (allCartItems) {
      setCart(allCartItems);
    }

  }, [allCartItems]);

  const filterCart = cart.filter((item) => item.userId === userId)
 
  const totalQuantity = filterCart.reduce((accumulator, item) => {
    return accumulator + item.quantity;
  }, 0);

  const toggleSearch=()=>{
    setOpenSearch(!openSearch)
    setOpen(false)
  }

  const toggleNav = () => {
    setOpen(!open);
    setOpenSearch(false)
  };

  const handleClickOutside = (event) => {
    if (sideNavRef.current && !sideNavRef.current.contains(event.target)) {
      setOpen(false); // Close the sidebar if clicked outside
    }
  };

  useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);


  
  function Logout() {
    dispatch({
      type: "LOGOUT_USER",
    });
  }

  return <>
    {/* For large screen */}
    <div className="container-fluid px-5 navbar_display" style={{ backgroundColor: "#F2F0F1" }}>
      <div className="d-flex justify-content-between align-items-center no-wrap">
        <div className="d-flex no-wrap align-items-center ">
          <a className="navbar-brand" href="/">
            <img src="/logo.png" alt="" />
          </a>
        </div>
        <div className="d-flex no-wrap align-items-center justify-content-center gap-5 fs-5">
          <div>
            <NavLink className="nav-link" to="/">
              Home
            </NavLink>
          </div>
          <div>
            <NavLink className="nav-link" to="/products/all">
              Shop
            </NavLink>
          </div>
          <div>
            <Link className="nav-link cursor" to="review">
              Reviews
            </Link>
          </div>
          <div>
            <NavLink className="nav-link" to="/contact">
              Contact Us
            </NavLink>
          </div>
          {/* <div>
              <NavLink className="nav-link" to="/faqs">
                Faq's
              </NavLink>
            </div> */}
            <div>
              <NavLink className="nav-link" to="/all-blog">
                Blog
              </NavLink>
            </div>
        </div>
        <div className="small_nav_btn">
          <div className="navbar_right d-flex no-wrap gap-0 fs-3">
            <NavLink
              className="nav-link"
              to="/search"
            ><CgSearch />
            </NavLink>
            {cu.role != "admin" && (
        <NavLink className="nav-link cart-link" to={`/cart/${cu._id}`}>
          <div style={{ position: 'relative' }}>
            <BsCart size={24} />
            {/* {(cu._id != undefined) &&
              <span className="cart-badge">{filterCart?.length}</span>
            } */}
          </div>
        </NavLink>
      )}
            {cu.role === "admin" &&
              <NavLink
                className="nav-link"
                to="/login"
                onClick={Logout}>
               <IoLogOutOutline />
              </NavLink>
            }
            {cu._id &&
              <>
                <NavLink
                  className="nav-link"
                  to={cu?.role === "admin" ? `/admin-dashboard/${cu._id}` : `/user-profile/${cu._id}`}
                >
                  <FiUser />
                </NavLink>
              </>
            }
            {!cu._id &&
              <NavLink
                className="nav-link"
                to="/login"
              >
                <FiUser />
              </NavLink>
            }
          </div>
        </div>
      </div>
    </div>
    {/* Large screen end */}

    {/* For small screen */}

    <div className="container-fluid p-2 navbar_small" style={{ backgroundColor: "#F2F0F1" }}>
      <div className="d-flex no-wrap justify-content-between align-items-center">
        <div className="d-flex justify-content-start align-items-center">
          <button
            className="fs-3 p-0"
            style={{border:"none", outline:"none"}}
            onClick={toggleNav}
          >
            {open ? <RxCross2 /> : <HiBars3CenterLeft />}
          </button>
        </div>
        <div className="d-flex justify-content-center align-items-center">
          <a className="navbar-brand" href="/">
            <img src="/logo.png" alt="" />
          </a>
        </div>
        <div className="small_nav_btn">
          <div className="navbar_right d-flex no-wrap gap-0 fs-3">
            <NavLink
              className="nav-link"
              to='/search'
            ><CgSearch />
            </NavLink>
            {cu.role !== "admin" && (
        <NavLink className="nav-link cart-link" to={`/cart/${cu._id}`}>
          <div style={{ position: 'relative' }}>
            <BsCart size={24} />
            {/* {filterCart?.length > 0 && (
              <span className="cart-badge">{filterCart?.length}</span>
            )} */}
          </div>
        </NavLink>
      )}
            {cu.role === "admin" &&
              <NavLink
                className="nav-link"
                to="/login"
                onClick={Logout}>
                <IoLogOutOutline />
              </NavLink>
            }
            {cu._id &&
              <>
                <NavLink
                  className="nav-link"
                  to={cu?.role === "admin" ? `/admin-dashboard/${cu._id}` : `/user-profile/${cu._id}`}
                >
                  <FiUser />
                </NavLink>
              </>
            }
            {!cu._id &&
              <NavLink
                className="nav-link"
                to="/login"
              >
                <FiUser />
              </NavLink>
            }
          </div>
        </div>
      </div>
    </div>

    {open && (
        <div ref={sideNavRef} className={`side_nav ${open ? 'side_nav_open' : ''}`}>
          <div className="d-flex flex-column gap-3">
            <div>
              <NavLink className="nav-link" to="/" onClick={toggleNav}>
                Home
              </NavLink>
            </div>
            <div>
              <NavLink className="nav-link" to="/products/all" onClick={toggleNav}>
                Shop
              </NavLink>
            </div>
            <div>
              <Link className="nav-link" to="review" onClick={toggleNav}>
                Reviews
              </Link>
            </div>
            <div>
              <NavLink className="nav-link" to="/contact" onClick={toggleNav}>
                Contact Us
              </NavLink>
            </div>
            <div>
              <NavLink className="nav-link" to="/all-blog" onClick={toggleNav}>
                Blog
              </NavLink>
            </div>
            <div>
              <NavLink className="nav-link" to="/faqs" onClick={toggleNav}>
                Faq's
              </NavLink>
            </div>
            
          </div>
        </div>
      )}

    {/* Small screen end */}
  
  </>
}

export default Navbar