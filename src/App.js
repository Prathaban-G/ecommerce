import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage";
import Dashboard from "./Dashboard";
import UserComponent from "./UserDashboard"; // Import the new component

function App() {
  return (
    <BrowserRouter> {/* ✅ This is the only Router in the app */}
      <Routes>
        <Route path="/" element={<UserComponent />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<LoginPage/>} /> {/* New Route */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
