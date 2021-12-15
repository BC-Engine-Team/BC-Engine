import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'universal-cookie'
import NavB from '../components/NavB'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import '../DeleteButton.scss'
import '../EditButton.scss'
import Icon from '@mdi/react'
import { mdiDeleteEmpty } from '@mdi/js';
import { mdiDelete } from '@mdi/js';
import { mdiPencil } from '@mdi/js';
import { mdiPencilOutline } from '@mdi/js';
import Axios from 'axios';


const Users = () => {

    let counter = 0;

    let navigate = useNavigate();
    const cookies = new Cookies();



    const [users, setUsers] = useState([{name: "", email: "", role: ""}]);

    const handleAddUser = () => {
    }

    const handleEditUser = (email) => {
       return(
        <div className="container">
                <div className="card shadow p-3 m-5">

                    <Form noValidate 
                          className="mt-5 mx-5" 
                          validated={validated}
                          onSubmit={onSubmitModification}>

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
                                />

                                <Form.Control.Feedback type="invalid">
                                    {errorMessage.email}
                                </Form.Control.Feedback>
                            
                        </Form.Group>


                        <Form.Group className="mb-5" controlId="floatingNewPassword">
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
       )
    }

    const handleDeleteUser = (email) => {
        
    }


    const handleRefresh = () => {
        let header = {
            'authorization': "Bearer " + cookies.get("accessToken")
        }
    
        Axios.defaults.withCredentials = true;
    
        Axios.get("http://localhost:3001/users/", {headers: header})
        .then((response) => {
            console.log(response.data);
            setUsers(response.data)
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
    const [InvalidCredential, setInvalidCredential] = useState("");

    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [role, setRole] = useState("");

    const [errorMessage] = useState({
        email: "This field cannot be empty!",
        newPassword: "This field cannot be empty!",
        confirmNewPassword: "This field cannot be empty!",
        role: "You need to select a role!"
    });


    //Axios.defaults.withCredentials = true;

    const onSubmitModification = (event) => {
        const form = event.currentTarget;
        if(form.checkValidity() === false || !email.endsWith("benoit-cote.com") || newPassword.localeCompare(confirmNewPassword))
        {
            event.preventDefault();
            event.stopPropagation();
            if(!/^@benoit-cote.com$/.test(email) && email.length > 0){
                errorMessage.email = "This is not the correct email format"
            }
            if(newPassword != confirmNewPassword){
                errorMessage.confirmNewPassword = "Please, make sure that the confirm password is the same as the new password entered above"
            }
        }
        
        else
        {
            let user = {
                email: email,
                newPassword: newPassword,
                confirmNewPassword: confirmNewPassword,
                role: role
            };

            Axios.put("http://localhost:3001/users/modify", user).then((response) =>{

                if(response.data === true)
                {
                    console.log("User modified successfully!");
                }
                console.log(response)
                })
                .catch((error) => {
                    if(error.response){
                        if(error.response.status === 401 || error.response.status === 403){
                            setInvalidCredential("Incorrect email address");
                        }
                    }
                    else if(error.request){
                        setInvalidCredential("Can't send the request to modify the user");
                    }
                });        
        }  
        setValidated(true);
        return false; 
    }
        

    return (
        <div>
            <NavB />
            <div className="container">
                <div className="card shadow m-5">
                    <Table responsive="xl">
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
                                                <button className="btnEdit btn-edit" onClick={handleEditUser(u.email)}>
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

                                                <button className="btnDelete btn-delete" onClick={handleDeleteUser(u.email)}>
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
        </div>
    )
}
                    
export default Users









