import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'universal-cookie'
import NavB from '../components/NavB'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import CloseButton from 'react-bootstrap/CloseButton'
import '../styles/DeleteButton.scss'
import '../styles/EditButton.scss'
import Icon from '@mdi/react'
import { mdiDeleteEmpty } from '@mdi/js';
import { mdiDelete } from '@mdi/js';
import { mdiPencil } from '@mdi/js';
import { mdiPencilOutline } from '@mdi/js';
import Axios from 'axios';

import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/esm/FloatingLabel'
import Alert from 'react-bootstrap/Alert'

const Users = () => {
    let counter = 0;
    let navigate = useNavigate();
    const cookies = new Cookies();

    const [formEnabled, setFormEnabled] = useState({
        table: "container", 
        form: "d-none",
    });

    const [users, setUsers] = useState([
        {name: "", email: "", role: ""}
    ]);

    const enableForm = () => {
        setFormEnabled({
            table: "container-form-enabled-table",
            form: "container-form-enabled-form",
        });
    }

    const disableForm = () => {
        setFormEnabled({
            table: "container",
            form: "d-none",
        });
    }

    const handleAddUser = () => {
        console.log("Add user");
        enableForm();
        setFormTitle("Add User");
        setFormSubmit("Add");
        setEmail("");
        setPassword1("");
        setPassword2("");
    }

    const handleEditUser = (email) => {
        console.log("Edit user with email: " + email);
        enableForm();

    }

    const handleDeleteUser = (email) => {
        console.log("Delete user with email: " + email);
    }

     const handleRefresh = () => {
        let header = {
            'authorization': "Bearer " + cookies.get("accessToken")
        }
    
        Axios.defaults.withCredentials = true;
    
        Axios.get("http://localhost:3001/users/", {headers: header})
        .then((response) => {
            console.log(response.data);
            setUsers(response.data);
        })
        .catch((error) => {
            if(error.response) {
                if(error.response.status === 403 || error.response.status === 401) {
                    console.log(error.response.satus + " - Error trying to reach B&C Engine");
                }
                else {
                    console.log("Could not reach b&C Engine...");
                }
            }
            else if(error.request) {
                console.log("Could not reach b&C Engine...");
            }
        });
    }

    useEffect(() => {
        if (cookies.get("accessToken") === undefined) {
            navigate("/login");
        }
        else if(cookies.get("role") !== "admin") {
            navigate("/dashboard");
        } 

        handleRefresh();        

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [validated, setValidated] = useState(false);
    const [InvalidInput, setInvalidInput] = useState("");

    const [FormTitle, setFormTitle] = useState("");
    const [FormSubmit, setFormSubmit] = useState("");
    const [email, setEmail] = useState("");
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");

    const [errorMessage] = useState({
        email: "This field cannot be empty!",
        password: "This field cannot be empty!",
    })

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        console.log("in handleSubmit");
    }

    return (
        <div>
            <NavB />
            <div className="justify-content-center mainContainer">
                <div className={formEnabled.table}>
                    <div className="card shadow m-5 uTable">
                        <Table responsive="xl" hover>
                            <thead className='bg-light'>
                                <tr key="0">

                                    <th>
                                        <div className="justify-content-center d-flex">
                                            #
                                        </div>
                                    </th>
                                    <th>NAME</th>
                                    <th>EMAIL</th>
                                    <th>ROLE</th>
                                    <th>
                                        <div className="d-flex justify-content-center">
                                            <Button 
                                                className="btn py-0 shadow-sm border " 
                                                onClick={handleAddUser}>
                                                Add User
                                            </Button>
                                        </div>
                                    </th>

                                </tr>
                            </thead>

                            <tbody>
                                {users.map (u => {
                                    counter++;
                                    return (
                                        <tr key={counter}>

                                            <td>
                                                <div className="justify-content-center d-flex">
                                                    {counter}
                                                </div>
                                            </td>
                                            <td>{u.name}</td>
                                            <td>{u.email}</td>
                                            <td>{u.role}</td>

                                            <td className="py-1">
                                                <div className="d-flex justify-content-center">
                                                    <button className="btnEdit btn-edit" onClick={() => handleEditUser(u.email)}>
                                                        <Icon path={mdiPencil} 
                                                            className="mdi mdi-edit" 
                                                            title="edit Button"
                                                            size={1}
                                                            horizontal/>
                                
                                                        <Icon path={mdiPencilOutline}
                                                            className="mdi mdi-edit-empty" 
                                                            title="edit Button empty"
                                                            size={1}
                                                            horizontal/>
                                                    </button>

                                                    <button className="btnDelete btn-delete" onClick={() => handleDeleteUser(u.email)}>
                                                        <Icon path={mdiDelete} 
                                                            className="mdi mdi-delete" 
                                                            title="delete Button"
                                                            size={1}
                                                            horizontal/>
                                
                                                        <Icon path={mdiDeleteEmpty}
                                                            className="mdi mdi-delete-empty" 
                                                            title="delete Button empty"
                                                            size={1}
                                                            horizontal/>
                                                    </button>
                                                </div>
                                            </td>

                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </div>
                </div>
                <div className={formEnabled.form}>
                    <div className="card shadow m-5 uForm">
                        
                        <CloseButton onClick={disableForm}/>
                        <Form
                            noValidate 
                            className="mt-5 mx-5" 
                            validated={validated} 
                            onSubmit={handleSubmit}>

                            <h1 className="display-4 text-center mb-4">{FormTitle}</h1>

                            {
                            InvalidInput.length > 0 ? 
                            <Alert variant="danger">
                                {InvalidInput}
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
                                        autoComplete='off'
                                    />

                                    <Form.Control.Feedback type="invalid">
                                        {errorMessage.email}
                                    </Form.Control.Feedback>
                                </FloatingLabel>
                            </Form.Group>

                            <Form.Group className="mb-4" controlId="floatingPassword1">
                                <FloatingLabel controlId="floatingPassword1" label="Password" className="mb-3" >
                                    <Form.Control 
                                        required 
                                        type="password" 
                                        value={password1} 
                                        onChange={(e) => setPassword1(e.target.value)}
                                        autoComplete='off'
                                    />

                                    <Form.Control.Feedback type="invalid">
                                        {errorMessage.password}
                                    </Form.Control.Feedback>
                                </FloatingLabel>
                            </Form.Group>

                            <Form.Group className="mb-4" controlId="floatingPassword2">
                                <FloatingLabel controlId="floatingPassword2" label="Confirm Password" className="mb-3" >
                                    <Form.Control 
                                        required 
                                        type="password" 
                                        value={password2} 
                                        onChange={(e) => setPassword2(e.target.value)}
                                        autoComplete='off'
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
                                    {FormSubmit}
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Users
