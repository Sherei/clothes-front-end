import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";

const Search = () => {

    const [searchValue, setSearchValue] = useState("");
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        window.scrollTo({
          top: 0,
        });
        setLoading(true);
        try {
          axios.get(`${process.env.REACT_APP_BASE_URL}/product`).then((res) => {
            if (res) {
              setProducts(res.data);
            }
          });
        } catch (e) {
        } finally {
          setLoading(false);
        }
      }, []);
    
     
    useEffect(() => {
        const filtered = products?.filter((product) => {
          const searchResult = searchValue?.toLowerCase();
          const title = product?.title?.toLowerCase();
          const category = product?.category?.toLowerCase();
          const titleMatch = title?.includes(searchResult);
          const categoryMatch = category?.includes(searchResult);
          return (
            (titleMatch || categoryMatch )
          );
        });
        setFilteredProducts(filtered);
      }, [searchValue]);
    
    

  return <>
    <div className='container' style={{minHeight:"80vh"}}>
        <div className='row d-flex justify-content-center my-3'>
            <div className='col-lg-6 col-md-8 col-12'>
                <input type="text" 
                 className="form-control"
                 placeholder="Search Anything"
                 onChange={(e)=>setSearchValue(e.target.value)}
                 />
            </div>
        </div>
        <div className="row">
        <div className="col-12 my-4 fs-5">Searching</div>
        {filteredProducts?.length === 0 ? (
          <div className="d-flex justify-content-center min-vh-50">
              <p>No Product found try with different keyword!</p>
          </div>
        ) : (
          <div className="row row-cols-lg-4 row-cols-md-3 row-cols-sm-2 row-cols-2">
            {filteredProducts?.reverse().map((item, index) => (
              <div className="col card" key={index}>
                <a href={`/product/${item.title.replace(/ /g, '-')}/${item._id}`}>
                  <div className="card_img">
                    <img
                      src={item?.images[0]}
                      className="text-center"
                      alt={item?.title}
                    />
                  </div>
                  <p className="card_title">{item?.title}</p>
                  <p className="final_price">
                    ${item?.Fprice.toFixed(0)}
                    {item?.discount > 0 && (
                      <>
                        <span className="mx-2 text-muted discounted_price">
                          <s>${item?.price.toFixed(0)}</s>
                        </span>
                        <span className="mx-2 discount">-{item?.discount}%</span>
                      </>
                    )}
                  </p>
                </a>
              </div>
            ))}
          </div>
        )}
            </div>


    </div>
  </>
}

export default Search