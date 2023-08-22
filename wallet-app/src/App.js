import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/dashboard/Dashboard";
import MyNavbar from "./components/Navbar/MyNavbar";
import RegisterForm from "./components/RegisterForm";
import Recharge from "./components/dashboard/recharge/Recharge";
import Transfer from "./components/dashboard/transfer/Transfer";
import TransactionList from "./components/dashboard/statement/TransactionList";

function App() {
  return (
    <Router>
      <MyNavbar />
      <Routes>
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/recharge" element={<Recharge />} />
        <Route path="/transfer" element={<Transfer />} />
        <Route path="/transactions" element={<TransactionList />} />
      </Routes>
    </Router>
  );
}

export default App;
