import React, { useState } from "react";
import axios from "axios";

const OrderForm = ({ fetchOrders }) => {
  const [userId, setUserId] = useState("");
  const [symbol, setSymbol] = useState("");
  const [orderType, setOrderType] = useState("buy");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const order = {
      user_id: parseInt(userId),
      symbol,
      order_type: orderType,
      price: parseFloat(price),
      quantity: parseFloat(quantity),
    };

    try {
      await axios.post("http://localhost:5000/add_order", order);
      fetchOrders(); // Fetch orders after adding one
      setUserId("");
      setSymbol("");
      setOrderType("buy");
      setPrice("");
      setQuantity("");
    } catch (err) {
      console.error("Error adding order:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md max-w-sm mx-auto">
      <h2 className="text-2xl mb-4">Add Order</h2>
      <div className="mb-4">
        <label className="block mb-2 text-sm">User ID</label>
        <input
          type="number"
          className="w-full p-2 border border-gray-300 rounded"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 text-sm">Symbol</label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 text-sm">Order Type</label>
        <select
          className="w-full p-2 border border-gray-300 rounded"
          value={orderType}
          onChange={(e) => setOrderType(e.target.value)}
        >
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2 text-sm">Price</label>
        <input
          type="number"
          className="w-full p-2 border border-gray-300 rounded"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 text-sm">Quantity</label>
        <input
          type="number"
          className="w-full p-2 border border-gray-300 rounded"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </div>
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
        Add Order
      </button>
    </form>
  );
};

export default OrderForm;
