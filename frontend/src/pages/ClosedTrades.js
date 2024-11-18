import React, { useState, useEffect } from "react";
import axios from "axios";

const ClosedTrades = () => {
  const [closedTrades, setClosedTrades] = useState([]);

  // Fetch closed trades
  useEffect(() => {
    const fetchClosedTrades = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/get_matched_orders");
        setClosedTrades(response.data.matched_orders);
      } catch (error) {
        console.error("Error fetching closed trades:", error);
      }
    };

    fetchClosedTrades();
    // Optionally poll every few seconds
    const interval = setInterval(fetchClosedTrades, 5000); // Fetch trades every 5 seconds
    return () => clearInterval(interval); // Clean up interval on unmount
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Closed Trades</h2>
      {closedTrades.length === 0 ? (
        <p className="text-center text-gray-500">No closed trades to display.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300 shadow-md rounded-md">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="py-2 px-4 border-b border-gray-300">Symbol</th>
                <th className="py-2 px-4 border-b border-gray-300">Buy Order ID</th>
                <th className="py-2 px-4 border-b border-gray-300">Sell Order ID</th>
                <th className="py-2 px-4 border-b border-gray-300">Price</th>
                <th className="py-2 px-4 border-b border-gray-300">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {closedTrades.map((trade, index) => (
                <tr
                  key={index}
                  className={`hover:bg-gray-50 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="py-2 px-4 border-b border-gray-300">{trade.symbol}</td>
                  <td className="py-2 px-4 border-b border-gray-300">{trade.buy_order_id}</td>
                  <td className="py-2 px-4 border-b border-gray-300">{trade.sell_order_id}</td>
                  <td className="py-2 px-4 border-b border-gray-300">{trade.price}</td>
                  <td className="py-2 px-4 border-b border-gray-300">{trade.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ClosedTrades;
