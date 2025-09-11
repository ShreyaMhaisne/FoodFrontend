import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../Components/Context/StoreContext'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {

  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);

  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  })
  const [processing, setProcessing] = useState(false);


  useEffect(() => {
    if (!token) {
      navigate('/cart')
    } else if (getTotalCartAmount() === 0) {
      navigate('/cart')
    }
  }, [token])


  const onChnageHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }))
  }


  const placeOrder = async (event) => {
    event.preventDefault();
    if (!token) {
      alert("You must be logged in to place an order.");
      return;
    }

    const orderItems = [];
    food_list.forEach((item) => {
      const qty = Number(cartItems[item._id] || 0);
      if (qty > 0) {
        orderItems.push({ ...item, quantity: qty });
      }
    });

    if (orderItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 70,
      userId: localStorage.getItem("userId"),
    };

    try {
      setProcessing(true);
      console.log("Sending orderData:", orderData);
      const response = await axios.post(
        url + "/api/order/place",
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Order response:", response.data);

      if (response.data.success && response.data.session_url) {
        window.location.replace(response.data.session_url);
      } else {
        alert(response.data.message || "Error placing order. Check console.");
      }
    } catch (err) {
      console.error("Order error:", err.response?.data || err.message);
      alert("Something went wrong. Check console.");
    } finally {
      setProcessing(false);
    }


  };
  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input required name='firstName' onChange={onChnageHandler} value={data.firstName} type="text" placeholder='First Name' />
          <input required name='lastName' onChange={onChnageHandler} value={data.lastName} type="text" placeholder='Last Name' />
        </div>
        <input required name='email' onChange={onChnageHandler} value={data.email} type="email" placeholder='Email address' />
        <input required name='street' onChange={onChnageHandler} value={data.street} type="text" placeholder='Street' />
        <div className="multi-fields">
          <input required name='city' onChange={onChnageHandler} value={data.city} type="text" placeholder='City' />
          <input required name='state' onChange={onChnageHandler} value={data.state} type="text" placeholder='State' />
        </div>
        <div className="multi-fields">
          <input required name='zipcode' onChange={onChnageHandler} value={data.zipcode} type="text" placeholder='Zip code' />
          <input required name='country' onChange={onChnageHandler} value={data.country} type="text" placeholder='Country' />
        </div>
        <input required name='phone' onChange={onChnageHandler} value={data.phone} type="text" placeholder='Phone' />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Sub Total</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount() === 0 ? 0 : 70}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 70}</b>
            </div>
          </div>
          <button type="submit" disabled={processing || getTotalCartAmount() === 0}>
            {processing ? "Processing..." : "PROCEED TO PAYMENT"}</button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
