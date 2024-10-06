import React, { useState, useEffect, useRef } from "react";
import { CgSearch } from "react-icons/cg";
import { FiUser } from "react-icons/fi";
import { HiBars3CenterLeft } from "react-icons/hi2";
import { BsCart } from "react-icons/bs";
import { NavLink } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import axios from "axios";
import "./navbar.css"
import { FaBars, FaCross, FaPowerOff } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import {Link} from "react-scroll";
import { IoLogOutOutline } from "react-icons/io5";



const Navbar = () => {

  const move = useNavigate();
  const cu = useSelector((store) => store.userSection.cu);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const sideNavRef = useRef(null); // To reference the side nav element

  const toggleNav = () => {
    setOpen(!open);
  };

  // Handle clicks outside the sidebar
  const handleClickOutside = (event) => {
    if (sideNavRef.current && !sideNavRef.current.contains(event.target)) {
      setOpen(false); // Close the sidebar if clicked outside
    }
  };

  useEffect(() => {
    if (open) {
      // Add event listener when sidebar is open
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      // Remove event listener when sidebar is closed
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Cleanup the event listener when the component unmounts or sidebar closes
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);
  function Logout() {
    dispatch({
      type: "LOGOUT_USER",
    });
    move("/login");
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
              to={`/products/all`}
            ><CgSearch />
            </NavLink>
            {cu.role != "admin" &&
              <NavLink
                className="nav-link"
                to={`/cart/${cu._id}`}
              ><BsCart />
              </NavLink>
            }
            {cu.role === "admin" &&
              <NavLink
                className="nav-link"
                onClick={Logout}>
               <IoLogOutOutline />
              </NavLink>
            }
            {cu._id &&
              <>
                <NavLink
                  className="nav-link"
                  to={cu?.role === "admin" ? `/admin-dashboard` : `/user-profile/${cu._id}`}
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
              to={`/products/all`}
            ><CgSearch />
            </NavLink>
            {cu.role != "admin" &&
              <NavLink
                className="nav-link"
                to={`/cart/${cu._id}`}
              ><BsCart />
              </NavLink>
            }
            {cu.role === "admin" &&
              <NavLink
                className="nav-link"
                onClick={Logout}>
                <IoLogOutOutline />
              </NavLink>
            }
            {cu._id &&
              <>
                <NavLink
                  className="nav-link"
                  to={cu?.role === "admin" ? `/admin-dashboard` : `/user-profile/${cu._id}`}
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