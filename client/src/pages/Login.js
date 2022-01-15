import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Axios from 'axios'
import Cookies from 'universal-cookie'

import Icon from '@mdi/react'
import { mdiEye } from '@mdi/js';
import { mdiEyeOff } from '@mdi/js';

import NavB from '../components/NavB'

import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/esm/FloatingLabel'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'

const Login = () => {
    const [showPass, setShowPass] = useState(false);
    const [validated, setValidated] = useState(false);
    const [validationError, setValidationError] = useState(false);

    const [InvalidCredential, setInvalidCredential] = useState("");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [errorMessage, setErrorMessage] = useState({
        email: "This field cannot be empty!",
        password: "This field cannot be empty!",
    });

    const cookies = new Cookies();
    let navigate = useNavigate();

    Axios.defaults.withCredentials = true;

    const handleSubmit = async (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            setValidated(true);
        }
        else {
            setInvalidCredential("");
            event.preventDefault();
            
            let data = {
                email: email,
                password: password,
            }

            await Axios.post(`${process.env.REACT_APP_API}/users/authenticate`, data)
            .then((response) => {
                if(response.data.auth === true) {

                    let aToken = response.data.aToken.toString();
                    let rToken = response.headers['authorization'].toString();
                    let username = response.data.authenticatedUser.name.toString();
                    let role = response.data.authenticatedUser.role.toString();
                   
                    cookies.set("accessToken", aToken, {path: "/", expires: new Date(new Date().getTime() + 15 * 60 * 1000)});
                    cookies.set("refreshToken", rToken, {path: "/"});
                    cookies.set("username", username, {path: "/"});
                    cookies.set("role", role, {path: "/"});

                    navigate("/dashboard");
                }
                else
                {
                    setInvalidCredential("Incorrect email or password.");
                    setErrorMessage({
                        email: "This field cannot be empty!",
                        password: "This field cannot be empty!"
                    });
                }
            }).catch((error) => {

                if(error.response){
                    if(error.response.status === 403 || error.response.status === 401){
                        setInvalidCredential("Incorrect email or password.");
                        setErrorMessage({
                            email: "This field cannot be empty!",
                            password: "This field cannot be empty!"
                        });
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

      return false;
    };

    const showHide = () => {
        if(showPass) setShowPass(false);
        else setShowPass(true);
    }

    useEffect(() => {
        if(InvalidCredential !== "" && !validationError) {
            setValidationError(true)
            setValidated(false)
            setErrorMessage({
                email: "",
                password: "",
            })
        }
        else if (validationError) {
            setValidated(true);
            setValidationError(false);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [InvalidCredential]);

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
                                    isInvalid={validationError}
                                    onChange={(e) => setEmail(e.target.value)}
                                />

                                <Form.Control.Feedback type="invalid">
                                    {errorMessage.email}
                                </Form.Control.Feedback>
                            </FloatingLabel>
                        </Form.Group>

                        <Form.Group className="mb-5" controlId="floatingPassword">
                            <FloatingLabel controlId="floatingPassword" label="Password" className="mb-3 inputWithShowHide" >
                                <Form.Control 
                                    required 
                                    type={showPass ? "text" : "password"} 
                                    value={password} 
                                    isInvalid={validationError}
                                    onChange={(e) => setPassword(e.target.value)}
                                />

                                <Icon 
                                    className='showHideBTN'
                                    path={showPass ? mdiEye : mdiEyeOff}
                                    onClick={showHide} 
                                    size={1} />

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
