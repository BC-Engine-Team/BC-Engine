import React from "react";
import logo from "./banana_PNG835.png";
import "./App.css";
import Login from "./components/auth/Login";

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
        <Login />
      </header>
      
    </div>
  );
}

export default App;