import React from "react";
import logo from "./banana_PNG835.png";
import "./App.css";
import Login from "./components/auth/Login";
import { Route } from "react-router-dom";
import { Redirect } from 'react-router'

function App() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <div className="container">
      <Login/>
      <Route exact path="/" render={() => (<Redirect to="/login"/>)}></Route>
    </div>
  );
}

export default App;