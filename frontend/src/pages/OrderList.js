import React, { useEffect, useState } from "react";
import axios from "axios";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [symbol, setSymbol] = useState("BTC/USDT");

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:5000/get_orders/${symbol}`);
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [symbol]);

  return (
    <div className="bg-white p-6 rounded shadow-md max-w-3xl mx-auto mt-8">
      <h2 className="text-2xl mb-4">Order Book</h2>
      <div className="mb-4">
        <label className="block mb-2 text-sm">Select Symbol</label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        />
        <button onClick={fetchOrders} className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 mt-2">
          Fetch Orders
        </button>
      </div>

      <h3 className="text-lg font-semibold">Buy Orders</h3>
      <div className="mb-4">
        {orders.buy_orders &&
          orders.buy_orders.map((order) => (
            <div key={order.order_id} className="border p-2 mb-2 rounded">
              <p>Price: {order.price}</p>
              <p>Quantity: {order.quantity}</p>
              <p>User ID: {order.user_id}</p>
            </div>
          ))}
      </div>

      <h3 className="text-lg font-semibold">Sell Orders</h3>
      <div className="mb-4">
        {orders.sell_orders &&
          orders.sell_orders.map((order) => (
            <div key={order.order_id} className="border p-2 mb-2 rounded">
              <p>Price: {order.price}</p>
              <p>Quantity: {order.quantity}</p>
              <p>User ID: {order.user_id}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default OrderList;
