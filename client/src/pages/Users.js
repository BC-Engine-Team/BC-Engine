import { useState } from 'react'
import Axios from 'axios'

import React from 'react'
import Table from 'react-bootstrap/Table'
import NavB from '../components/NavB'

import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/esm/FloatingLabel'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'


const Users = () => {

    const [validated, setValidated] = useState(false);
    const [InvalidCredential, setInvalidCredential] = useState("");

    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [role, setRole] = useState("");

    const [errorMessage] = useState({
        email: "This field cannot be empty!",
        newPassword: "This field cannot be empty!",
        confirmNewPassword: "This field cannot be empty!",
        role: "You need to select a role"
    });

    Axios.defaults.withCredentials = true;

    const onSubmitModification = (event) => {
        const form = event.currentTarget;
        if(form.checkValidity() === false){
            event.preventDefault();
            event.stopPropagation();
        }
        else
        {
            event.preventDefault();

            let user = {
                email: email,
                newPassword: newPassword,
                confirmNewPassword: confirmNewPassword,
                role: role
            };

            Axios.put("http://localhost:3001/users/modify/{email}", user).then((response) =>{

                if(response.data === true)
                {
                    console.log("User modified successfully!");
                }
                else
                {
                    setInvalidCredential("Incorrect email address")
                    console.log("Incorrect email address");
                }

                console.log(response)
                })
                .catch((error) => {
                    if(error.response){
                        if(error.response.status === 401){
                            setInvalidCredential("Unauthorized");
                        }
                    }
                });
            
                setValidated(true);
                return false;
        }   
    }
        


    return (
        <div>
            <NavB />
            <div className="container">
                <div className="card shadow p-3 m-5">
                    <Table striped bordered hover size="sm">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Mark Benoit</td>
                                <td>mark@benoitetcote.com</td>
                                <td>Admin</td>
                                <td><Button variant="outline-primary">Modify User</Button>{' '}</td>
                                <td><Button variant="outline-danger">Delete User</Button>{' '}</td>
                            </tr>
                            <tr>
                                <td>Alexander Benoit</td>
                                <td>alexander@benoitetcote.com</td>
                                <td>Employee</td>
                                <td><Button variant="outline-primary">Modify User</Button>{' '}</td>
                                <td><Button variant="outline-danger">Delete User</Button>{' '}</td>
                            </tr>
                            <tr>
                                <td>Raphael Cote</td>
                                <td>raphael@benoitetcote.com</td>
                                <td>Admin</td>
                                <td><Button variant="outline-primary">Modify User</Button>{' '}</td>
                                <td><Button variant="outline-danger">Delete User</Button>{' '}</td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
            </div>


            <div className="container">
                <div className="card shadow p-3 m-5">
                    <Form noValidate 
                          className="mt-5 mx-5" 
                          validated={validated}
                          onSubmit={onSubmitModification}
                          
                          >

                        {
                            InvalidCredential.length > 0 ? 
                            <Alert variant="danger">
                                {InvalidCredential}
                            </Alert> :
                            <></>
                        }


                        <Form.Group className="mb-4" controlId="floatingEmail">
                            <FloatingLabel controlId="floatingEmail" label="Email" className="mb-3" >
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


                        <Form.Group className="mb-5" controlId="floatingNewPassword">
                            <FloatingLabel controlId="floatingNewPassword" label="New Password" className="mb-3" >
                                <Form.Control 
                                    required 
                                    type="password" 
                                    value={newPassword} 
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />

                                <Form.Control.Feedback type="invalid">
                                    {errorMessage.newPassword}
                                </Form.Control.Feedback>
                            </FloatingLabel>
                        </Form.Group>


                        <Form.Group className="mb-4" controlId="floatingConfirmNewPassword">
                            <FloatingLabel controlId="floatingConfirmNewPassword" label="Confirm New Password" className="mb-3" >
                                <Form.Control 
                                    required
                                    type="password"
                                    value={confirmNewPassword}
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                />

                                <Form.Control.Feedback type="invalid">
                                    {errorMessage.confirmNewPassword}
                                </Form.Control.Feedback>
                            </FloatingLabel>
                        </Form.Group>


                        <Form.Group className="mb-4" controlId="floatingModifyRole">
                                <Form.Label>Role</Form.Label>
                                <Form.Select required
                                             size="sm" 
                                             aria-label="Default select example" 
                                             value={role} 
                                             onChange={(e) => setRole(e.target.value)}>

                                    <option>Select Role</option>
                                    <option value="Admin">Admin</option>
                                    <option value="User">User</option>
                                </Form.Select>

                                <Form.Control.Feedback type="invalid">
                                    {errorMessage.role}
                                </Form.Control.Feedback>
                        </Form.Group>



                        <div className="d-flex justify-content-center mt-5 mb-4">
                            <Button 
                                type="submit" 
                                className="btn btn-light py-2 px-5 my-1 shadow-sm border submitButton">
                                Save Changes
                            </Button>
                        </div>

                    </Form>
                </div>
            </div>
        </div>
    )
}
                    
export default Users
