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
import Alert from 'react-bootstrap/Alert'

import DeleteUserPopup from '../components/DeleteUserPopup'
import FloatingLabel from 'react-bootstrap/esm/FloatingLabel'


const Users = () => {

    //this is to declare the cookies
    let navigate = useNavigate();
    const cookies = new Cookies();

    //this is to declare the users and the counter that returns the list of all users in the user menu
    const [users, setUsers] = useState([{name: "", email: "", role: ""}]);
    let counter = 0;


    //this is to validate if the entries are valid or not
    const [validated, setValidated] = useState(false);
    

    //this is to declare the value of my entries I can modify
    const [email, setEmail] = useState("");


    //this is to declare the value of the form title and fill the current role for the add and modify menu
    const [FormTitle, setFormTitle] = useState("");
    const [emailEnable, setEmailEnable] = useState("");
    const [FormSubmit, setFormSubmit] = useState("");
    const [passwordEnable, setPasswordEnable] = useState("");
    const [roleEnable, setRoleEnable] = useState("");

    //This is to activate the delete alert when the delete button is clicked
    const [deleteButtonActivated, setDeleteButtonActivated] = useState(false);


    //This is for showing an error message when the request is not good
    const [InvalidInput, setInvalidInput] = useState("");


    //This is for the confirmation screen
    const [onConfirmationScreen, setOnConfirmationScreen] = useState(false);
    const [submitType, setSubmitType] = useState("submit");



    //this is to declare the form layout
    const [formEnabled, setFormEnabled] = useState({
        table: "container", 
        form: "d-none",
    });

    //this is when the form layout is activated
    const [backEnabled, setBackEnabled] = useState({
        backButton: "d-none"
    })



    const enableForm = () => {
        setFormEnabled({
            table: "container-form-enabled-table",
            form: "container-form-enabled-form",
        });
    }

    //this is when the form layout is deactivated
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


    //when you click on the x in the add and modify menu
    const disableForm = () => {
        setValidated(false);
        setSubmitType("submit");
        setOnConfirmationScreen(false);
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


    //This is to handle the go back button when you click on add
    const handleGoBack = () => {
        if(FormTitle === "Confirm creation?"){
            setEmailEnable("");
            setFormTitle("Add User");
            setFormSubmit("Add");
        }
        else if(FormTitle === "Confirm modification?"){
            setEmailEnable("disable");
            setFormTitle("Edit User");
            setFormSubmit("Save Changes");
        }

        setSubmitType("submit");
        setOnConfirmationScreen(false);
        setPasswordEnable("");
        setRoleEnable("");
        disableBackButton();
    }


    //this is what happens when the user click on the add user menu
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
        setForm({
            email: "",
            password1: "",
            password2: "",
            role: ""
        });
    }


    //this is what happens when the user click on the modify menu
    const handleEditUser = (email, role) => {
        console.log("Edit user with email: " + role);
        enableForm();
        setForm({
            email: email,
            password1: "",
            password2: "",
            role: role
        })
        setEmailEnable("disable");
        setPasswordEnable("");
        setRoleEnable("");
        setFormTitle("Edit User");
        setFormSubmit("Save Changes");
        disableBackButton();
    }

    //this is what happens when the user click on the delete menu
    const handleDeleteUser = (email) => {
        console.log("Delete user with email: " + email);
        setEmail(email);
        setDeleteButtonActivated(true);
    }

    //this is what happens when the user refresh the page
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
            if(FormTitle === "Add User"){
                setFormTitle("Confirm creation?");
            }
            else if(FormTitle === "Edit User"){
                setFormTitle("Confirm modification?");
            }
            setFormSubmit("Confirm");
            setEmailEnable("disable");
            setPasswordEnable("disable");
            setRoleEnable("disable");
            enableBackButton();
            setErrors({});
            
        }
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

        if(FormTitle === "Confirm modification?"){
            onUpdateClick();
        }
        else if(FormTitle === "Confirm creation?"){
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
        }else if(!RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})").exec(password1)){
            newErrors.password1 = "Password must be at least 8 characters, contain 1 upper-case and 1 lower-case letter, and contain a number."
        }
        if(password1 !== password2){
            newErrors.password1 = "Passwords must match!";
            newErrors.password2 = "Passwords must match!";
        }
        if(!password2 || password2 === ""){
            newErrors.password2 = "This field cannot be empty!";
        }
        

        // role errors
        if(!role || role === "") newErrors.role = "Must select a role!";

        return newErrors;
    }


    //this is the when the user click on the save changes
    const onUpdateClick = (event) => {
        let header = {
            'authorization': "Bearer " + cookies.get("accessToken")
        }
    
        Axios.defaults.withCredentials = true;
    
        let user = {
            email: form.email,
            password: form.password2,
            role: form.role
        };

        Axios.put(`http://localhost:3001/users/modify/${form.email}`, user, {headers: header}).then((response) =>{
            if(response.data === true)
            {
                console.log("User modified successfully!");
            }
            console.log(response)
            disableForm()
            handleRefresh()
        })
        .catch((error) => {
            if(error.response){
                if(error.response.status === 401 || error.response.status === 403){
                    setInvalidInput("Cannot recognize the email address");
                }
            }
            else if(error.request){
                setInvalidInput("Can't send the request to modify the user");
            }
        });    
        setValidated(true);
        return false;     
    }
    

    //this is when you delete 
    const onDeleteClick = (event) => {
        let header = {
            'authorization': "Bearer " + cookies.get("accessToken")
        }
    
        Axios.defaults.withCredentials = true;

        let user = {
            email: email
        }

        console.log(header);
        Axios.delete(`http://localhost:3001/users/delete/${email}`, {headers: header, data:user}).then((response) =>{

            if(response.data === true)
            {
                console.log("User deleted successfully!");
            }
            console.log(response)
            setDeleteButtonActivated(false);
            handleRefresh();
        })
        .catch((error) => {
            if(error.response){
                if(error.response.status === 401 || error.response.status === 403){
                    setInvalidInput("Cannot recognize the email address");
                }
            }
            else if(error.request){
            setInvalidInput("Can't send the request to delete the user");
            }
        });    
        setValidated(true);
        return false;   
    };


    
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
                                                    <button className="btnEdit btn-edit" onClick={() => handleEditUser(u.email, u.role)}>
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
                                        value={form.email}
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
                                        value={form.password1}
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
                                        value={form.password2}
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
                                            value={form.role}
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
            <DeleteUserPopup open={deleteButtonActivated} onDelete={() => {onDeleteClick()}} onClose={() => {setDeleteButtonActivated(false)}}/>
        </div>
    )
}

export default Users