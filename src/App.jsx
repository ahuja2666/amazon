import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage.jsx";
import Profits from "./Profits.jsx";
import Inventory from "./Inventory.jsx";
import ProfitCalculator from "./ProfitCalculator.jsx";
import Payments from "./Payments.jsx";

const App = () => (
  <HashRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/profits" element={<Profits />} />
      <Route path="/profit-calculator" element={<ProfitCalculator />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/payments" element={<Payments />} />
      <Route path="/*" element={<HomePage />} />
    </Routes>
  </HashRouter>
);

export default App;
