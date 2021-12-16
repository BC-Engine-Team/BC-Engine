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

    const [backEnabled, setBackEnabled] = useState({
        backButton: "d-none"
    })

    const [users, setUsers] = useState([
        {name: "", email: "", role: ""}
    ]);

    const enableForm = () => {
        setFormEnabled({
            table: "container-form-enabled-table",
            form: "container-form-enabled-form",
        });
    }

    const enableBackButton = () => {
        setBackEnabled({
            backButton: "btn btn-light py-2 px-5 my-1 shadow-sm border"
        })
    }

    const disableBackButton = () => {
        setBackEnabled({
            backButton: "d-none"
        })
    }

    const disableForm = () => {
        setValidated(false);
        Array.from(document.querySelectorAll("input")).forEach(
            input => (input.value = "")
        );
        Array.from(document.querySelectorAll("select")).forEach(
            select => (select.value = "")
        );
        setFormEnabled({
            table: "container",
            form: "d-none",
        });
    }

    const handleAddUser = () => {
        console.log("Add user");
        enableForm();
        
        setInvalidInput("");
        setEmailEnable("");
        setPasswordEnable("");
        setRoleEnable("");
        setFormTitle("Add User");
        setFormSubmit("Add");
        disableBackButton();
        setErrors({});
        setForm({});

    }

    const handleGoBack = () => {
        setSubmitType("submit");
        setOnConfirmationScreen(false);
        //setInvalidInput("");
        setEmailEnable("");
        setPasswordEnable("");
        setRoleEnable("");
        setFormTitle("Add User");
        setFormSubmit("Add");
        disableBackButton();
    }

    const handleEditUser = (email) => {
        console.log("Edit user with email: " + email);
        enableForm();
        setEmailEnable("disable");

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

    const [onConfirmationScreen, setOnConfirmationScreen] = useState(false);

    const [FormTitle, setFormTitle] = useState("");
    const [FormSubmit, setFormSubmit] = useState("");
    const [submitType, setSubmitType] = useState("submit");
    const [emailEnable, setEmailEnable] = useState("");
    const [passwordEnable, setPasswordEnable] = useState("");
    const [roleEnable, setRoleEnable] = useState("");



    const [form, setForm] = useState({});
    const [errors, setErrors] = useState({});

    const setField = (field, value) => {
        setForm({
          ...form,
          [field]: value
        });

        if ( !!errors[field] ){
            setErrors({
                ...errors,
                [field]: null
              });
        } 
    }
    

    const handleSubmit = (event) => {
        // const form = event.currentTarget;
        // if (form.checkValidity() === false) {
        //     event.preventDefault();
        //     event.stopPropagation();
        // }

        setInvalidInput("");
        console.log(InvalidInput.length);
        console.log("in handleSubmit");
        event.preventDefault();
        event.stopPropagation();

        const newErrors = findFormErrors();

        if(Object.keys(newErrors).length > 0){
            setErrors(newErrors);
        }
        else if(InvalidInput.length === 0){
            setSubmitType("button");
            setOnConfirmationScreen(true);
            setFormTitle("Looks good?");
            setFormSubmit("Confirm");
            setEmailEnable("disable");
            setPasswordEnable("disable");
            setRoleEnable("disable");
            enableBackButton();
            setErrors({});
            
        }

        

        //setValidated(true);
    }

    const handleConfirm = (event) => {
        event.preventDefault();
        event.stopPropagation();
        console.log("in handleConfirm...-------------------------------------------------------------------");
        let header = {
            'authorization': "Bearer " + cookies.get("accessToken")
        }

        let data = {
            email: form.email,
            password: form.password1,
            role: form.role
        }

        Axios.post("http://localhost:3001/users/", data, {headers: header})
        .then((response) => {
            console.log(response);

            if(response.status === 200 || response.status === 201) {
                disableForm();
                handleRefresh();
            }
        })
        .catch((error) => {
            if (error.response) {
                if(error.response.status === 403 || error.response.status === 401){
                    setInvalidInput(error.response.data.message);
                    navigate("/login");
                }
                else {
                    console.log(error.response.data.message);
                    setInvalidInput(error.response.data.message);
                    console.log(InvalidInput);
                    handleGoBack();
                }
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                setInvalidInput("Could not reach B&C Engine...");
              }
        });
    }

    const findFormErrors = () => {
        const {email, password1, password2, role} = form;
        const newErrors = {}

        // email errors
        if(!email || email === "") newErrors.email = "This field cannot empty!";
        else if(!email.endsWith("@benoit-cote.com")) newErrors.email = "Invalid email. Must end with 'benoit-cote.com'.";
        
        // password errors
        if(!password1 || password1 === ""){
                newErrors.password1 = "This field cannot empty!";
        }
        if(!password2 || password2 === ""){
            newErrors.password2 = "This field cannot be empty!";
        }
        if(!RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})").exec(password1)) newErrors.password1 = "Password must be at least 8 characters, contain 1 upper-case and 1 lower-case letter, and contain a number."
        else if(password1 !== password2){
            newErrors.password1 = "Passwords must match!";
            newErrors.password2 = "Passwords must match!";
        }

        // role errors
        if(!role || role === "") newErrors.role = "Must select a role!";

        return newErrors;
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
                        
                        <CloseButton 
                            className="position-absolute top-0 end-0 m-4"
                            onClick={disableForm}/>
                        <Form
                            noValidate 
                            className="mt-4 mx-5 uForm" 
                            validated={validated} 
                            onSubmit={handleSubmit}>

                            <h1 className="display-4 text-center mb-5">{FormTitle}</h1>

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
                                        defaultValue={form.email}
                                        onChange={(e) => setField('email', e.target.value)}
                                        autoComplete='new-email'
                                        disabled={emailEnable}
                                        isInvalid={!!errors.email}
                                    />

                                    <Form.Control.Feedback type="invalid">
                                        {errors.email}
                                    </Form.Control.Feedback>
                                </FloatingLabel>
                            </Form.Group>

                            <Form.Group className="mb-4" controlId="floatingPassword1">
                                <FloatingLabel controlId="floatingPassword1" label="Password" className="mb-3" >
                                    <Form.Control 
                                        required 
                                        type="password" 
                                        defaultValue={form.password1}
                                        onChange={(e) => setField('password1', e.target.value)}
                                        autoComplete='new-password'
                                        disabled={passwordEnable}
                                        isInvalid={!!errors.password1}
                                    />

                                    <Form.Control.Feedback type="invalid">
                                        {errors.password1}
                                    </Form.Control.Feedback>
                                </FloatingLabel>
                            </Form.Group>

                            <Form.Group className="mb-4" controlId="floatingPassword2">
                                <FloatingLabel controlId="floatingPassword2" label="Confirm Password" className="mb-3" >
                                    <Form.Control 
                                        required 
                                        type="password" 
                                        defaultValue={form.password2} 
                                        onChange={(e) => setField('password2', e.target.value)}
                                        autoComplete='off'
                                        disabled={passwordEnable}
                                        isInvalid={!!errors.password2}
                                    />

                                    <Form.Control.Feedback type="invalid">
                                        {errors.password2}
                                    </Form.Control.Feedback>
                                </FloatingLabel>
                            </Form.Group>
                            
                            <Form.Group className="mb-4" controlId="floatingModifyRole">
                                <Form.Label>Role</Form.Label>
                                <Form.Select required
                                            size="sm" 
                                            aria-label="Default select example" 
                                            defaultValue={form.role} 
                                            onChange={(e) => setField('role', e.target.value)}
                                            selected=""
                                            disabled={roleEnable}
                                            isInvalid={!!errors.role}>

                                    <option value="">Select User</option>
                                    <option value="admin">Admin</option>
                                    <option value="employee">Employee</option>
                                </Form.Select>

                                <Form.Control.Feedback type="invalid">
                                    
                                </Form.Control.Feedback>
                            </Form.Group>

                            <div className="d-flex justify-content-center mt-3 mb-4 position-aboslute bottom-0">
                                <Button 
                                    type={submitType} 
                                    className="btn btn-light py-2 px-5 my-1 mx-2 shadow-sm border submitButton"
                                    style={{display: 'inline-block'}}
                                    onClick={onConfirmationScreen ? handleConfirm : undefined}>
                                    {FormSubmit}
                                </Button>
                                

                                <Button 
                                    className={backEnabled.backButton}
                                    style={{display: 'inline-block'}}
                                    onClick={handleGoBack}>
                                    
                                    Go back
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
