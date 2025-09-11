import React, { useContext, useEffect, useState } from 'react';
import axios from "axios";
import { assets } from '../../assets/assets';
import { StoreContext } from '../../Components/Context/StoreContext';
import './MyOrders.css';

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    if (!token) {
      console.warn("No token found. User might not be logged in.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        url + "/api/order/userorders",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Orders fetched:", response.data);
      if (response.data.success && response.data.data.length > 0) {
        setOrders(response.data.data);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Error fetching orders:", err.response?.data || err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  return (
    <div className='my-orders'>
      <h2>My Orders</h2>

      {loading ? (
        <p>Loading your orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="container">
          {orders.map((order, index) => (
            <div key={index} className='my-orders-order'>
              <img src={assets.parcel_icon} alt="Parcel Icon" />
              <p>
                {order.items.map((item, idx) => (
                  <span key={idx}>
                    {item.name} x {item.quantity}{idx < order.items.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
              <p><b>Total Amount:</b> ₹{order.amount}.00</p>
              <p><b>Items:</b> {order.items.length}</p>
              <p><span>&#9733;</span> <b>{order.status}</b></p>
              <button onClick={fetchOrders}>Track Order</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
