//import { Link } from 'react-router-dom'
import NavB from '../components/NavB'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/esm/FloatingLabel'
import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import { useNavigate } from 'react-router-dom'


const Login = () => {
    const [validated, setValidated] = useState(false);

    const [change, setChange] = useState({
        email: "a@a.com",
        password: "0"
    });

    const [errorMessage] = useState({
        email: "This field cannot be empty!",
        password: "This field cannot be empty!",
    })

    let navigate = useNavigate();
    
    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        else {
            navigate("/dashboard");
        }

      setValidated(true);
    };

    const handleChange = (mail, pass) => {
        setChange({
            email : mail,
            password : pass,
        })
    }

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
                                    value={change.email}
                                    onChange={(e) => handleChange(e.target.value, change.password)}
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
                                    value={change.password} 
                                    onChange={(e) => handleChange(change.email, e.target.value)}
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
            </div>
        </div>  
    )
}

export default Login
