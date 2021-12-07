import React from "react";
import "./App.css";
<<<<<<< HEAD
import { response } from "express";


function App() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
     fetch("/api")
       .then((res) => res.json())
       .then((data) => setData(data.message));
   }, []);

   return (
     <div className="App">
       <header className="App-header">
         <img src={logo} className="App-logo" alt="logo" />
         <p>{!data ? "B&C Engine loading..." : data}</p>
       </header>
     </div>
   );
=======
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import Manage from "./pages/Manage";
import Login from "./pages/Login";
import { Navigate, Routes, Route, BrowserRouter } from "react-router-dom";

function App() {
  return (
    <div>
      {/* Routes to pages */}
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
>>>>>>> main
}

export default App;