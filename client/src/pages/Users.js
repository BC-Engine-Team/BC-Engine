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
import { placeholder } from 'sequelize/dist/lib/operators'

import DeleteUserPopup from '../components/DeleteUserPopup'
import e from 'cors'



const Users = () => {

    //this is to declare the cookies
    let navigate = useNavigate();
    const cookies = new Cookies();

    //this is to declare the users and the counter that returns the list of all users in the user menu
    const [users, setUsers] = useState([{name: "", email: "", role: ""}]);
    let counter = 0;


    //this is to validate if the entries are valid or not
    const [validated, setValidated] = useState(false);
    const [InvalidCredential, setInvalidCredential] = useState("");


    //this is to declare the value of my entries I can modify
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [role, setRole] = useState("");


    //this is to declare the value of the form title and fill the current role
    const [FormTitle, setFormTitle] = useState("");
    const [emailEnable, setEmailEnable] = useState("");
    const [FormSubmit, setFormSubmit] = useState("");

    //This is to activate the delete alert when the delete button is clicked
    const [deleteButtonActivated, setDeleteButtonActivated] = useState(false);


    //this is the error message
    const [errorMessage] = useState({
        email: "This field cannot be empty!",
        newPassword: "This field cannot be empty!",
        confirmNewPassword: "This field cannot be empty!",
        role: "You need to select a role!"
    });


    //this is to declare the form layout
    const [formEnabled, setFormEnabled] = useState({
        table: "container", 
        form: "d-none",
    });

    //this is when the form layout is activated
    const enableForm = () => {
        setFormEnabled({
            table: "container-form-enabled-table",
            form: "container-form-enabled-form",
        });
    }

    //this is when the form layout is deactivated
    const disableForm = () => {
        setFormEnabled({
            table: "container",
            form: "d-none",
        });
    }

    //this is what happens when the user click on the add user menu
    const handleAddUser = () => {
         console.log("Add user");
         enableForm();
         setFormTitle("Add User");
         setEmailEnable("");
         setFormSubmit("Add");
    }

    //this is what happens when the user click on the modify menu
    const handleEditUser = (email, role) => {
        console.log("Edit user with email: " + email);
        enableForm();
        setEmail(email);
        setRole(role);
        setEmailEnable("disable")
        setFormTitle("Edit User");
        setFormSubmit("Save Changes");
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
    }, []);



    //this is the when the user click on the save changes
    const onUpdateClick = (event) => {
        let header = {
            'authorization': "Bearer " + cookies.get("accessToken")
        }
    
        Axios.defaults.withCredentials = true;
    
        let user = {
            email: email,
            password: confirmNewPassword,
            role: role
        };

        Axios.put(`http://localhost:3001/users/modify/${email}`, user, {headers: header}).then((response) =>{
            if(response.data === true)
            {
                console.log("User modified successfully!");
            }

            console.log(response)
        })
        .catch((error) => {
            if(error.response){
                if(error.response.status === 401 || error.response.status === 403){
                    setInvalidCredential("Cannot recognize the email address");
                }
            }
            else if(error.request){
                setInvalidCredential("Can't send the request to modify the user");
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
                    setInvalidCredential("Cannot recognize the email address");
                }
            }
            else if(error.request){
            setInvalidCredential("Can't send the request to delete the user");
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
                        <CloseButton onClick={disableForm}
                                     className='position-absolute top-0 end-0 m-4'/>
                        <div className="container">
                            

                            <Form noValidate 
                                  className="mt-5 mx-5" 
                                  validated={validated}
                                  onSubmit={onUpdateClick}>
                                  <h1 className="display-4 text-center mb-5">{FormTitle}</h1>
                                    {
                                        InvalidCredential.length > 0 ? 
                                        <Alert variant="danger">
                                                {InvalidCredential}
                                        </Alert> :
                                        <></>
                                    }
                                

                                <Form.Group className="mb-4" controlId="floatingEmail">
                                    <Form.Label>Email</Form.Label>
                                        <Form.Control 
                                            required
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={emailEnable}/>

                                        <Form.Control.Feedback type="invalid">
                                            {errorMessage.email}
                                        </Form.Control.Feedback>
                                                
                                </Form.Group>


                                <Form.Group className="mb-4" controlId="floatingNewPassword">
                                    <Form.Label>New Password</Form.Label>
                                        <Form.Control 
                                            required 
                                            type="password" 
                                            value={newPassword} 
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />

                                        <Form.Control.Feedback type="invalid">
                                            {errorMessage.newPassword}
                                        </Form.Control.Feedback>
                                    
                                </Form.Group>


                                <Form.Group className="mb-4" controlId="floatingConfirmNewPassword">
                                    <Form.Label>Confirm New Password</Form.Label>
                                        <Form.Control 
                                            required
                                            type="password"
                                            value={confirmNewPassword}
                                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                                        />

                                        <Form.Control.Feedback type="invalid">
                                            {errorMessage.confirmNewPassword}
                                        </Form.Control.Feedback>
                                </Form.Group>


                                <Form.Group className="mb-4" controlId="floatingModifyRole">
                                        <Form.Label>Role</Form.Label>
                                        <Form.Select required
                                                    size="sm" 
                                                    aria-label="Default select example" 
                                                    value={role} 
                                                    onChange={(e) => setRole(e.target.value)}>

                                            <option value="">Select User</option>
                                            <option value="admin">Admin</option>
                                            <option value="employee">Employee</option>
                                        </Form.Select>

                                        <Form.Control.Feedback type="invalid">
                                            {errorMessage.role}
                                        </Form.Control.Feedback>
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
            <DeleteUserPopup open={deleteButtonActivated} onDelete={() => {onDeleteClick()}} onClose={() => {setDeleteButtonActivated(false)}}/>
        </div>
    )
}
                    
export default Users