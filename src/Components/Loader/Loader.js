import React from 'react'
import FadeLoader from "react-spinners/FadeLoader";

const Loader = () => {

    return <>
    <div className='d-flex justify-content-center align-items-center' style={{zIndex: "100"}}>
                <FadeLoader   color="white" />
            {/* <div>
                <p className='text-white m-0'>Please Wait </p>
            </div> */}

        </div>
    </>
}

export default Loader