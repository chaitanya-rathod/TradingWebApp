import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // Assuming you're using axios for making API calls
import './Orders.css';
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch orders from the backend when the component loads
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Replace the URL with your API endpoint to fetch orders from your database
        const response = await axios.get("http://localhost:3002/orders");
        setOrders(response.data); // Assuming response.data contains the list of orders
      } catch (err) {
        setError("Failed to fetch orders");
      } finally {
        setLoading(false); // Set loading to false after the API call
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <p>Loading orders...</p>; // Show loading state
  }

  if (error) {
    return <p>{error}</p>; // Show error message if the API call fails
  }

  return (
    <div className="orders">
      {/* If there are orders, display them. Otherwise, show "no orders" message */}
      {orders.length > 0 ? (
        <div className="order-list">
          <h3>Your Orders</h3>
          <ul>
            {orders.map((order) => (
              <li key={order.id}>
                <p>Order ID: {order.id}</p>
                <p>Product: {order.name}</p>
                <p>Quantity: {order.qty}</p>
                <p>Total Price: ₹{order.price}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="no-orders">
          <p>You haven't placed any orders today</p>

          <Link to={"/"} className="btn">
            Get started
          </Link>
        </div>
      )}
    </div>
  );
};

export default Orders;
