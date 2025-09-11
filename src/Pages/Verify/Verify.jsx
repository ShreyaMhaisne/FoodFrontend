import React, { useContext, useEffect } from 'react'
import "./Verify.css"
import { useNavigate, useSearchParams } from 'react-router-dom'
import { StoreContext } from '../../Components/Context/StoreContext';
import axios from "axios";

const Verify = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const success = searchParams.get("success")
    const orderID = searchParams.get("orderId")
    const { url,token } = useContext(StoreContext);
    const navigate = useNavigate();

    const verifyPayment = async () => {
        const response = await axios.post(url + "/api/order/verify", { success, orderId: orderID });
        if (response.data.success) {
            navigate("/myorders");
        } else {
            navigate("/")
        }
    }

   useEffect(() => {
  if (token) verifyPayment();
}, [token]);


    return (
        <div className='verify'>
            <div className="spinner"></div>
        </div>
    )
}

export default Verify
