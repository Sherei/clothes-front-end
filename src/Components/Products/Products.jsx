import React, { useState, useEffect, useRef } from "react";
import { BsFillGridFill, BsListStars } from "react-icons/bs";
import { FaArrowAltCircleRight, FaFilter } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../Loader/Loader";
import axios from "axios";
import "./products.css";

const Products = () => {

  const cu = useSelector((store) => store.userSection.cu);
  const { prodctName } = useParams();
  const [data, setData] = useState([]);
  const [collection, setCollection] = useState([]);
  const [search, setSearch] = useState("");
  const [activeGrid, setActiveGrid] = useState("grid");
  const [sort, setSortOrder] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [minPrice, setMinPrice] = useState(1);
  const [maxPrice, setMaxPrice] = useState(3000);
  const [filter, setFilter] = useState(false);
  const [uniqueSizes, setUniqueSizes] = useState([]);
  const [uniqueColors, setUniqueColors] = useState([]);

  const move = useNavigate();

  const sendWhatsAppMessage = (title) => {
    const message = `I'm interested in product.\n${title}\nCan you provide more details?`;
    const whatsappURL = `https://wa.me/+447392608087?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, "_blank");
  };

  const Filter = () => {
    setFilter(!filter);
  };

  useEffect(() => {
    setCategory(prodctName?.toLowerCase().replace(/-/g, ' '));
  }, [prodctName]);
  

  const handleMaxRangeChange = (e) => {
    const value = parseInt(e.target.value);
    setMaxPrice(value);
  };

  const SearchInput = (e) => {
    setSearch(e.target.value);
  };


  useEffect(() => {
    setLoading(true);
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/products`,
          {
            params: {
              category,
              minPrice: minPrice || undefined,
              maxPrice: maxPrice || undefined,
              size: size || undefined,  // Only pass size if it's defined and not an empty string
              color: color || undefined, // Only pass color if it's defined and not an empty string
              search: search || undefined,
            },
          }
        );
  
        const products = response.data;
        setData(products);
  
        // Extract unique sizes and colors
        const sizesSet = new Set();
        const colorsSet = new Set();
  
        products.forEach((product) => {
          [product.size1, product.size2, product.size3, product.size4, product.size5]
            .forEach((size) => {
              if (size) sizesSet.add(size);
            });
          [product.color1, product.color2, product.color3, product.color4, product.color5]
            .forEach((color) => {
              if (color) colorsSet.add(color);
            });
        });
  
        setUniqueSizes([...sizesSet]);  // Convert Set to array for unique sizes
        setUniqueColors([...colorsSet]);  // Convert Set to array for unique colors
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, [category, minPrice, maxPrice, search, size, color]);


  const RemoveFilter=()=> {
    setCategory("all");
    setSortOrder("");
    setSearch("");
    setActiveGrid("grid");
    setMaxPrice(3000);
    setMinPrice(0);
    setSize('')
    setColor("")
  }

  useEffect(() => {
    setLoading(true)
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/collection`)
      .then((res) => {
        setCollection(res?.data);
        setLoading(false);
      })
      .catch((error) => {
      });
  }, []);

  return (
    <>
      <div className="container-fluid min-vh-100 my-lg-5 my-3" style={{ overflow: "hidden" }}>

        {/* Small Screem Filter Start */}

        <div className={`filter_col_display ${filter ? "showFilter" : "filter_col"}`}>
          <div className="d-flex justify-content-end align-items-center mb-3" style={{ borderBottom: "1px solid lightgray" }}>
            <p className="cursor fs-3" type="button" style={{ color: "red" }} onClick={() => setFilter(false)} >
              <RxCross1 />
            </p>
          </div>
          <p className="fs-4 fw-bold text-dark">Product Categories</p>
          <div>
            {collection.map((collections, index) => {
              return <div key={index}
                className={`cursor d-flex justify-content-between text-dark 
                  ${category == collections.category ? "activeCategory" : ""}`}
                onClick={() => setCategory(collections?.category)}
              >
                <p>{collections?.category}</p>
                <p><FaArrowAltCircleRight /></p>
              </div>
            })}
          </div>
          <div className="mb-2 text-dark">
            <p className="fw-bolder mt-1 p-0">Select Size</p>
            <select
              name="category"
              className="form-select"
              id="category"
              onChange={(e) => setSize(e.target.value)}
            >
              <option value="">All Sizes</option>
              {uniqueSizes.map((size, index) => (
                <option key={index} value={size}>{size}</option>
              ))}
            </select>
          </div>
          <div className="mb-2 text-dark">
            <p className="fw-bolder mt-1 p-0">Select Color</p>
            <select
              name="category"
              className="form-select"
              id="category"
              onChange={(e) => setColor(e.target.value)}
            >
              <option value="">All Colors</option>
              {uniqueColors.map((color, index) => (
                <option key={index} value={color}>{color}</option>
              ))}
              </select>
          </div>
          <div className="mb-2 text-dark">
            <p className="fw-bolder mt-1 p-0">Sort By</p>
            <select
              name="category"
              className="form-select"
              id="category"
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="">All</option>
              <option value="asc">Price (Highest)</option>
              <option value="desc">Price (Lowest)</option>
            </select>
          </div>
          <div className="mt-2 text-dark">
            <p className="mb-2" style={{ fontSize: "16px", fontWeight: "500" }}>Price Range</p>
            <div className="px-2" style={{ position: "relative" }}>
              <div className="d-flex">
                <input
                  type="range"
                  id="minPriceRange"
                  className="w-50"
                  value={1}
                  style={{ height: "2px" }}
                />
                <input
                  type="range"
                  id="maxPriceRange"
                  className="w-50"
                  min={1}
                  max={3000}
                  step={10}
                  value={maxPrice}
                  onChange={handleMaxRangeChange}
                  style={{
                    height: "2px",
                    position: "absolute",
                    top: "0px",
                    right: "4px",
                  }}
                />
              </div>
              <p className="m-0 mt-2 px-3" style={{ color: "red" }}>
                ${minPrice} - ${maxPrice}
              </p>

            </div>
            <button className="button-submit w-100 px-5 border border-dark" onClick={RemoveFilter}>Remove Filter</button>
          </div>
          {/* <button
            className="btn btn-danger text-uppercase my-4 w-100"
            onClick={ClearFilter}
          >
            Clear filter
          </button> */}
        </div>

        {/* Small Screem Filter End */}
        
          {/* Large screen filters Start */}

        <div className="row">

          <div className="col-lg-2 col_hide border p-3">
            <div>
              <p className="fs-6 fw-bolder text-light">Product Categories</p>
            </div>
            <div>
              {collection.map((collections, index) => {
                return <div key={index}
                  className={`cursor d-flex justify-content-between ${category == collections.category ? "activeCategory" : ""}`}
                  onClick={() => setCategory(collections?.category)}
                >
                  <p>{collections?.category}</p>
                  <p><FaArrowAltCircleRight /></p>
                </div>
              })}
            </div>
            <div className="mb-2">
              <p className="fw-bolder mt-1 p-0">Select Size</p>
              <select
                name="category"
                className="form-select"
                id="category"
                onChange={(e) => setSize(e.target.value)}
              >
                <option value="">All Sizes</option>
              {uniqueSizes.map((size, index) => (
                <option key={index} value={size}>{size}</option>
              ))}
              </select>
            </div>
            <div className="mb-2">
              <p className="fw-bolder mt-1 p-0">Select Color</p>
              <select
                name="category"
                className="form-select"
                id="category"
                onChange={(e) => setColor(e.target.value)}
              >
                <option value="">All Colors</option>
                {uniqueColors.map((color, index) => (
                <option key={index} value={color}>{color}</option>
              ))}
              </select>
            </div>

            <div className="mb-2">
              <p className="fw-bolder mt-1 p-0">Sort By</p>
              <select
                name="category"
                className="form-select"
                id="category"
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="">All</option>
                <option value="asc">Price (Highest)</option>
                <option value="desc">Price (Lowest)</option>
              </select>
            </div>
            <div className="mt-2">
              <p className="mb-2" style={{ fontSize: "16px", fontWeight: "500" }}>Price Range</p>
              <div className="px-2" style={{ position: "relative" }}>
                <div className="d-flex">
                  <input
                    type="range"
                    id="minPriceRange"
                    className="w-50"
                    value={1}
                    style={{ height: "2px" }}
                  />
                  <input
                    type="range"
                    id="maxPriceRange"
                    className="w-50"
                    min={1}
                    max={3000}
                    step={10}
                    value={maxPrice}
                    onChange={handleMaxRangeChange}
                    style={{
                      height: "2px",
                      position: "absolute",
                      top: "0px",
                      right: "4px",
                    }}
                  />
                </div>
                <p className="m-0 mt-2 px-3" style={{ color: "red" }}>
                  ${minPrice} - ${maxPrice}
                </p>
              </div>
            </div>
            <button className="button-submit w-100 px-5" onClick={RemoveFilter}>Remove Filter</button>

          </div>

          {/* Large screen filters End */}


          <div className="col-lg-10 col-md-12 col-12">

            <div className="search_bar1 mt-2 mb-3">
              <input
                type="search"
                className="form-control w-100 p-2 border text-dark"
                placeholder="Search Anything"
                value={search}
                onChange={SearchInput}
              />
            </div>

            {/* Products Icons FIlter Buttons */}

            <div className="mb-4 mt-1 mb-3 d-flex align-items-center justify-content-between ">
              <div className="d-flex gap-2">
                <div
                  className={`grid_icon ${activeGrid === "grid" ? "active" : ""
                    }`}
                  onClick={() => setActiveGrid("grid")}
                >
                  <BsFillGridFill />
                </div>
                {/* <div
                  className={`grid_icon ${activeGrid === "list" ? "active" : ""
                    }`}
                  onClick={() => setActiveGrid("list")}
                >
                  <BsListStars />
                </div> */}
              </div>
              <p className="fw-bolder m-0">
                {data?.filter((item) => (item.stock === undefined || item.stock === false)).length} Products
              </p>
              <div className="search_bar">
                <input
                  type="search"
                  className="form-control w-100 p-2 border text-dark"
                  placeholder="Search Anything"
                  value={search}
                  onChange={SearchInput}
                />

              </div>
              <button className="fs-4 filter_btn_display text-light" role="button" onClick={Filter}>
                <FaFilter />
              </button>
            </div>

            {/* Card Grid */}
            <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-sm-2 g-4 my-4">

              {(data?.length === 0 || loading) && (
                <div className='d-flex justify-content-center align-items-center' style={{ minHeight: "50vh" }}>
                  {loading ? <Loader /> : (
                    data?.length === 0 ? "No Product available" : null
                  )}
                </div>
              )}
              {(activeGrid === "grid" && !loading && data?.length > 0) &&
                data.map((product, index) => (
                  <div className='p-2' key={index} >
                 <div className="col card border-0 border-bottom border-light shadow-sm">
                    <a href={`/product/${product.title.replace(/ /g, '-')}/${product._id}`}>
                      <div className="card_img">
                        <img src={product?.images[0]} className="text-center" alt={product?.title} />
                        <div className='overlay'>
                                                {product.images[1] && <img src={product?.images[1]} alt="" />}
                                            </div>
                      </div>
                      <p className="card_title">{product?.title}</p>
                      <p className="final_price">
                        ${product?.Fprice.toFixed(0)}
                        {product?.discount > 0 && (
                          <>
                            <span className="mx-2 text-muted discounted_price"><s>${product?.price.toFixed(0)}</s></span>
                            <span className="mx-2 discount">-{product?.discount}%</span>
                          </>
                        )}
                      </p>
                    </a>
                  </div>
                  </div>
                ))}
            </div>

            {/* Card List */}
            <div className="row row-cols-1 row-cols-md-3 row-cols-lg-3 row-cols-sm-2 my-4">
              {(activeGrid === "list" && !loading && data?.length > 0) &&
                data.map((product, index) => {
                  return (
                    <>
                      <div className="col card px-4" key={index} style={{maxHeight:"200px"}}>
                        <div className="grid_box border p-2">
                          <div className="card_img">
                            <img src={product?.images[0]} className="text-center" alt={product?.title} />
                          </div>
                          <div className="d-flex flex-column justify-content-between">
                            <p className="">{product?.title}</p>
                            <p className="fw-bolder text-start">
                              ${product?.Fprice.toFixed(0)}
                              {product?.discount > 0 && (
                                <>
                                  <span className="mx-2 text-muted discounted_price"><s>${product?.price.toFixed(0)}</s></span>
                                  <span className="mx-2 discount">-{product?.discount}%</span>
                                </>
                              )}
                            </p>
                            <a href={`/product/${product.title.replace(/ /g, '-')}/${product._id}`}>
                            <button className="button-submit w-100 px-3">View Detail</button>                            
                            </a>
                          </div>

                        </div>
                      </div>
                    </>
                  );
                })}
            </div>
          </div>

        </div>


      </div >
    </>
  );
};

export default Products;



