import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import Loader from "../Loader/Loader"
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const AddBanner = () => {

    useEffect(() => {
        window.scrollTo({
            top: 0,
        });
    }, []);

    const cu = useSelector(store => store.userSection.cu);
    const [collection, setCollection] = useState(null);
    const [loading, setLoading] = useState(false);

    let move = useNavigate();

    const { bannerId } = useParams();

    const { register, handleSubmit, reset, formState: { errors }, control } = useForm();

    const { fields, append, remove } = useFieldArray({
        control,
    });

    useEffect(() => {
        if (bannerId) {
            axios.get(`${process.env.REACT_APP_BASE_URL}/banner_edit?id=${bannerId}`).then(function (resp) {
                setCollection(resp.data);
            });
        }
    }, [bannerId]);

    useEffect(() => {
        if (bannerId) {
            reset(collection);
        }
    }, [collection, reset]);

    async function submitCollection(data) {
        window.scrollTo({
            top: 0,
        });

        let cloudinaryUrl = "";
        if (data.image && data.image[0]) {
            const formData = new FormData();
            formData.append('file', data.image[0]);
            formData.append('upload_preset', 'zonfnjjo');
            try {
                const response = await axios.post("https://api.cloudinary.com/v1_1/dlw9hxjr4/image/upload", formData);
                cloudinaryUrl = response.data.url;
            } catch (error) {
                console.error("Error uploading image:", error);
            }
        } else {
            cloudinaryUrl = collection ? collection.image : '';
        }

        setLoading(true);

        try {
            data.image = cloudinaryUrl;
            if (bannerId) {
                await axios.put(`${process.env.REACT_APP_BASE_URL}/banner_update`, data);
                toast.success("Banner updated");
            } else {
                await axios.post(`${process.env.REACT_APP_BASE_URL}/banner`, data);
                toast.success("Banner added");
            }
            move(`/admin-dashboard/${cu._id}`);
        } catch (error) {
            console.error("Error submitting collection:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className='container my-4'>
                <div className='row border py-5 px-4'>
                    <div className='col-lg-12 col-sm-12'>
                        <div className='d-flex justify-content-between'>
                            {!collection ? <h1 className='p_head'>Add Banner</h1> : <h1 className='p_head'>Edit Banner</h1>}
                            <p className='panel_btn' onClick={() => move(`/admin-dashboard/${cu._id}`)}>Admin Panel</p>
                        </div>
                      
                            <form onSubmit={handleSubmit(submitCollection)}>
                                <div className='row'>
                                    <div className='col-lg-6 col-md-6 col-sm-12 my-2'>
                                        <label style={{ fontSize: "17px", fontWeight: "600" }}>Banner Title</label>
                                        <input type="text" {...register('category')}
                                         className="form-control mb-2 mr-sm-2 text-dark" />
                                        {/* {errors.category && <div className='error'>Title is required</div>} */}
                                    </div>
                                    <div className='col-lg-6 col-md-6 col-sm-12 my-2'>
                                        <label style={{ fontSize: "17px", fontWeight: "600" }}>Image *</label>
                                        <input type="file" {...register('image', { required: bannerId ? false : true })} className="form-control mb-2 mr-sm-2" />
                                        {errors.image && <div className='error'>Image is required</div>}
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-lg-12 col-sm-12 my-5'>
                                    <button type="submit"
                    disabled={loading} 
                    className="button-submit px-4 w-100 d-fkex justify-content-center align-items-center">
                                            {collection ? "Update" : "Submit"}
                                        </button>
                                    </div>
                                </div>
                            </form>

                    </div>
                </div>
            </div>
        </>
    );
}

export default AddBanner;
