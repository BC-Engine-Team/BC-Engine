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
import DeleteUserPopup from '../components/DeleteUserPopup'
import UsersForm from '../components/UsersForm'

const Users = () => {
    let navigate = useNavigate();
    let counter = 0;

    const cookies = new Cookies();
    const displayNone = "d-none";

    const [users, setUsers] = useState([{name: "", email: "", role: ""}]);
    const [email, setEmail] = useState("");
    const [deleteButtonActivated, setDeleteButtonActivated] = useState(false);

    const [formEnabled, setFormEnabled] = useState({
        table: "container", 
        form: displayNone
    });

    const enableForm = () => {
        setFormEnabled({
            table: "container-form-enabled-table",
            form: "container-form-enabled-form"
        });
    }

    const disableForm = () => {
        handleRefresh();
        setFormEnabled({
            table: "container",
            form: "d-none"
        });
    }
    module.exports = {disableForm}

    const handleAddUser = () => {
        enableForm();
        UsersForm.handleAddUser();
    }
    module.exports = {handleAddUser}

    const handleEditUser = (email, role) => {
        enableForm();
        UsersForm.handleEditUser(email, role);
    }

    const handleDeleteUser = (email) => {
        console.log("Delete user with email: " + email);
        disableForm();
        setEmail(email);
        setDeleteButtonActivated(true);
    }

    const onDeleteClick = () => {
        let header = {
            'authorization': "Bearer " + cookies.get("accessToken")
        }

        let data = {
            email: email
        }
    
        Axios.defaults.withCredentials = true;

        Axios.delete(`http://localhost:3001/users/delete/${email}`, {headers: header, data: data})
        .then((response) => {
            if(response.data === true)
            {
                console.log("User deleted successfully!");
            }

            setDeleteButtonActivated(false);
            handleRefresh();
        })
        .catch((error) => {
            if(error.response) {
                if(error.response.status === 401 || error.response.status === 403) {
                    UsersForm.setInvalidInput("Cannot recognize the email address");
                }
            }
            else if(error.request) {
                UsersForm.setInvalidInput("Can't send the request to delete the user");
            }
        });

        return false;   
    };

    const handleRefresh = () => {
        let header = {
            'authorization': "Bearer " + cookies.get("accessToken"),
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
                                                className="btn py-0 shadow-sm border" 
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
                            
                        <UsersForm />
                    </div>
                </div>
            </div>
            <DeleteUserPopup
                open={deleteButtonActivated}
                onDelete={() => {onDeleteClick()}}
                onClose={() => {setDeleteButtonActivated(false)}}/>
        </div>
    )
}

export default Users