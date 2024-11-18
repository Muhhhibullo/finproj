import React from "react";
import OrderForm from "./pages/OrderForm";
import OrderList from "./pages/OrderList";
import ClosedTrades from "./pages/ClosedTrades";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <h1 className="text-4xl text-center mb-8">Order Book</h1>
      <div className="flex flex-col justify-center items-center">
        <div className="flex flew-row w-10/12 justify-between">
          <div className="w-1/2">
            <OrderForm />
          </div>
          <div className="w-1/2">
            <OrderList />
          </div>
        </div>
        <div className="w-2/3">
          <ClosedTrades />
        </div>
      </div>
    </div>
  );
}

export default App;
