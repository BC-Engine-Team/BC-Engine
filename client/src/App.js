import React from "react";
import "./App.css";
import Login from "./components/pages/Login";
import Dashboard from "./components/pages/Dashboard";
import Reports from "./components/pages/Reports";
import Users from "./components/pages/Users";
import Manage from "./components/pages/Manage";
import { Navigate, Routes, Route, BrowserRouter } from "react-router-dom";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Navigate replace to="login" />}/>
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/dashboard" element={<Dashboard />} />
          <Route exact path="/reports" element={<Reports />} />
          <Route exact path="/users" element={<Users />} />
          <Route exact path="/manage" element={<Manage />} />
        </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
// element={<Navigate replace to="login" />}