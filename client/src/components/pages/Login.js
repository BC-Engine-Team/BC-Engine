import { Link } from 'react-router-dom'
import NavB from '../NavB'
import Form from 'react-bootstrap/Form'

const Login = () => {
    return (
        <div>
        <NavB page="login"/>
            <div className="container">
                <div className="card shadow p-3 m-5">
                    <h1 className="display-1 font-weight-bold text-center mt-5">Login</h1>
                    <Form className="mt-5 mx-5">
                        <Form.Group className="mb-4" controlId="formBasicEmail">
                            <Form.Label className="mx-1">Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" required/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label className="mx-1">Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" required/>
                        </Form.Group>
                        <div className="d-flex justify-content-center mt-5 mb-4">
                            <Link to='/dashboard' className="btn btn-light py-1 px-5 shadow-sm border submitButton">Login</Link>
                        </div>
                    </Form>
                </div>
            </div>
        </div>

        
    )
}

export default Login
