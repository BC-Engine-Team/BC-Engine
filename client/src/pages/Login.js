//import { Link } from 'react-router-dom'
import NavB from '../components/NavB'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/esm/FloatingLabel'
import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import { useNavigate } from 'react-router-dom'
import Axios from 'axios'


const Login = () => {
    const [validated, setValidated] = useState(false);
    const [loginStatus, setLoginStatus] = useState(false)

    const [email, setEmail] = useState("first@benoit-cote.com");
    const [password, setPassword] = useState("verySecurePassword");

    const [errorMessage] = useState({
        email: "This field cannot be empty!",
        password: "This field cannot be empty!",
    })

    let navigate = useNavigate();

    Axios.defaults.withCredentials = true;

    const authentification = () => {
        Axios.post("http://localhost:3001/users/authenticate", {
            email: email,
            password: password,
        }).then((response) => {
            console.log(response);
            if(!response.data.auth) {
                setLoginStatus(false);
            } else {
                localStorage.setItem("token", response.data.atoken)
                setLoginStatus(true);
            }
        });
    }

    const userAuthentificated = () => {
        Axios.get("http://localhost:3001/token", {headers: {

        }}).then((response) => {
            console.log(response);
        })
    }

    const handleSubmits = () => {
       
        authentification();
       

        setValidated(true);
        return false;
    };
   
    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        else {
            authentification();
            //navigate("/dashboard");
        }

      setValidated(true);
      return false;
    };

    return (
        <div>
        <NavB page="login"/>
            <div className="container">
                <div className="card shadow p-3 m-5">
                    <h1 className="display-1 font-weight-bold text-center mt-5">Login</h1>
                    
                    <Form 
                        noValidate 
                        className="mt-5 mx-5" 
                        validated={validated} 
                        onSubmit={handleSubmit}>

                        <Form.Group className="mb-4" controlId="floatingEmail">
                            <FloatingLabel controlId="floatingEmail" label="Email address" className="mb-3" >
                                <Form.Control 
                                    required
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />

                                <Form.Control.Feedback type="invalid">
                                    {errorMessage.email}
                                </Form.Control.Feedback>
                            </FloatingLabel>
                        </Form.Group>

                        <Form.Group className="mb-5" controlId="floatingPassword">
                            <FloatingLabel controlId="floatingPassword" label="Password" className="mb-3" >
                                <Form.Control 
                                    required 
                                    type="password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)}
                                />

                                <Form.Control.Feedback type="invalid">
                                    {errorMessage.password}
                                </Form.Control.Feedback>
                            </FloatingLabel>
                        </Form.Group>

                        <div className="d-flex justify-content-center mt-5 mb-4">
                            <Button 
                                type="submit" 
                                className="btn btn-light py-1 px-5 shadow-sm border submitButton">
                                Login
                            </Button>
                        </div>

                    </Form>
                </div>

                <input  required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}/>

                <input  required 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} />
                
                <Button 
                    type="submit" 
                    onClick={handleSubmits}
                    className="btn btn-light py-1 px-5 shadow-sm border submitButton">
                    Login
                </Button>
                <h1>{loginStatus}</h1>
            </div>
        </div>  
    )
}

export default Login
