import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Axios from 'axios'

import NavB from '../components/NavB'

import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/esm/FloatingLabel'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'



const Login = () => {
    const [validated, setValidated] = useState(false);

    const [InvalidCredential, setInvalidCredential] = useState("");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [errorMessage] = useState({
        email: "This field cannot be empty!",
        password: "This field cannot be empty!",
    })

    let navigate = useNavigate();

    Axios.defaults.withCredentials = true;

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        else {
            event.preventDefault();
            
            let data = {
                email: email,
                password: password,
            }
    
            Axios.post("http://localhost:3001/users/authenticate", data)
            .then((response) => {
                console.log(response);

                if(response.data.auth === true) {
                    localStorage.setItem("accessToken", response.data.aToken);
                    localStorage.setItem("refreshToken", response.headers['authorization']);
                    localStorage.setItem("username", response.data.authenticatedUser.name);
                    localStorage.setItem("role", response.data.authenticatedUser.role);

                    navigate("/dashboard");
                }
                else
                {
                    setInvalidCredential("Incorrect email or password.");
                }
            })
            .catch((error) => {
                if (error.response) {
                    if(error.response.status === 403 || error.response.status === 401){
                        setInvalidCredential("Incorrect email or password.");
                    }
                    else {
                        setInvalidCredential("Could not reach B&C Engine...");
                    }
                  } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    setInvalidCredential("Could not reach B&C Engine...");
                  }
            });
        }

      setValidated(true);
      return false;
    };

    return (
        <div>
        <NavB page="login"/>
            <div className="container">
                <div className="card shadow p-3 m-5">
                    <h1 className="display-1 font-weight-bold text-center mt-5 mb-4">Login</h1>
                    
                    <Form 
                        noValidate 
                        className="mt-5 mx-5" 
                        validated={validated} 
                        onSubmit={handleSubmit}>
                        
                        {
                            InvalidCredential.length > 0 ? 
                            <Alert variant="danger">
                                {InvalidCredential}
                            </Alert> :
                            <></>
                        }
                        
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
                                className="btn btn-light py-2 px-5 my-1 shadow-sm border submitButton">
                                Login
                            </Button>
                        </div>

                    </Form>
                </div>
            </div>
        </div>  
    )
}

export default Login
