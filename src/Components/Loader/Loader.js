import React from 'react'
import FadeLoader from "react-spinners/FadeLoader";

const Loader = () => {

    return <>
    <div className='d-flex justify-content-center align-items-center' style={{minHeight:"50vh"}}>
    <div className='d-flex flex-column gap-2 px-5 py-3 align-items-center' style={{
            width: "fit-contet",
            height: "fit-content",
            // boxShadow: "rgba(0, 0, 0, 0.24) 0px 1px 8px",
            zIndex: "100"
        }}>
            <div>
                <FadeLoader   color="white" />
            </div>
            <div>
                <p className='text-white m-0'>Please Wait </p>
            </div>

        </div>
    </div>


    </>
}

export default Loader