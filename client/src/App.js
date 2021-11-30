import React from "react";
import "./App.css";
import Login from "./components/pages/Login";
import Dashboard from "./components/pages/Dashboard";
import { Navigate, Routes, Route, BrowserRouter } from "react-router-dom";

function App() {
  return (
    <div className="container">
      <BrowserRouter>
      <Navigate to="/login" />
        <Routes>
          <Route exact path="/" >
            <Route path="login" element={<Login />} />
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;