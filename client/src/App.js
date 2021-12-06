import React from "react";
import logo from "./banana_PNG835.png";
import "./App.css";
import Axios from "axios"; 
import { response } from "express";


function App() {
  // const [data, setData] = React.useState(null);

  // React.useEffect(() => {
  //   fetch("/api")
  //     .then((res) => res.json())
  //     .then((data) => setData(data.message));
  // }, []);

  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>{!data ? "B&C Engine loading..." : data}</p>
  //     </header>
  //   </div>
  // );

  const [usernameReg, setUsernameReg] = useState("");
  const [passwordReg, setPasswordReg] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loginStatus, setLoginStatus] = useState("");

  const register = () => {
    Axios.post("http://localhost:3001/register", {
      username: usernameReg,
      password: passwordReg,
    }).then((response) => {
      console.log(response);
    });
  };


  const login = () => {
    Axios.post("http://localhost:3001/login", {
      username: username,
      password: password,
    }).then((response) => {
      if(!response.data.message){
        setLoginStatus(response.data.message);
      }
      else{
        console.log(response.data);
        setLoginStatus(response.data[0].username);
      }
    });
  };

  return (

    <div className="App">
        <div className="registration">
          <h1>Registration</h1>
            <label>Username</label>
            <input type="text" onChange={(e) => {
              setUsernameReg(e.target.value);
            }}/>

            <label>Password</label>
            <input type="text" onChange={(e) => {
              setPasswordReg(e.target.value);
            }}/>

            <button onClick={register}>Register</button>
        </div>

        <div className="login"> 
            <h1>Login</h1>

            <input type="text" placeholder="Username..." onChange={(e) => {
              setUsername(e.target.value);
            }}/>

            <label>Password</label>
            <input type="text" placeholder="Password..." onChange={(e) => {
              setPassword(e.target.value);
            }}/>

            <button onClick={login}>Login</button>

        </div>

    </div>

  );
}

export default App;