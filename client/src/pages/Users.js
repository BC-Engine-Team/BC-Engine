import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'universal-cookie'
import NavB from '../components/NavB'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import '../styles/Edit&DeleteButton.scss'
import '../styles/usersPage.css'
import '../styles/popup.css'
import Axios from 'axios';
import DeleteUserPopup from '../components/DeleteUserPopup'
import UsersForm from '../components/UsersForm'
import DeleteButton from '../components/DeleteButton'
import EditButton from '../components/EditButton'

const Users = () => {
    let navigate = useNavigate();
    let counter = 0;

    const cookies = new Cookies();
    const displayNone = "d-none";

    const [users, setUsers] = useState([{name: "", email: "", role: ""}]);
    const [email, setEmail] = useState("");
    const [deleteButtonActivated, setDeleteButtonActivated] = useState(false);
    const [setInvalidInput] = useState("");

    const [formEnabled, setFormEnabled] = useState({
        table: "container", 
        form: displayNone
    });

    // Default values sent to the UsersForm.js on the edit form
    const [editValues, setEditValues] = useState({
        email: "",
        role: ""
    });

    // Calls functions in the UsersForm.js
    const [isUpdate, setIsUpdate] = useState(true);
    const [isAdd, setIsAdd] = useState(true);
    const [isEdit, setIsEdit] = useState(true);

    // Fixes issue where callback needed its call variable to be defined inside of the function
    const [setTemp] = useState(true);

    const handleDisableForm = useCallback(() => {
        setTemp(isUpdate);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[isUpdate]);
    const handleAddUser = useCallback(() => {
        setTemp(isAdd);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[isAdd]);
    const handleEditUser = useCallback(() => {
        setTemp(isEdit);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[isEdit]);

    const addUser = () => { setIsAdd(!isAdd) }

    const editUser = (email, role) => { 
        setEditValues({
            email: email,
            role: role
        });
        
        // Triggers function call in the UsersForm.js
        setIsEdit(!isEdit);
    }

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

        // Triggers function call in the UsersForm.js
        setIsUpdate(!isUpdate);
    }

    const handleDeleteUser = (email) => {
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

        Axios.delete(`${process.env.REACT_APP_API}/users/delete/${email}`, {headers: header, data: data})
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
                    setInvalidInput("Cannot recognize the email address");
                }
            }
            else if(error.request) {
                setInvalidInput("Cannot send the request to delete the user");
            }
        });

        return false;   
    };

    const handleRefresh = () => {
        let header = {
            'authorization': "Bearer " + cookies.get("accessToken"),
        }
    
        Axios.defaults.withCredentials = true;
    
        Axios.get(`${process.env.REACT_APP_API}/users/`, {headers: header})
        .then((response) => {
            console.log("LOLOLOL")
            console.log(`${process.env.REACT_APP_API}/users/`)
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
                                                onClick={() => addUser()}>
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
                                                    <EditButton onEdit={() => editUser(u.email, u.role)}/>

                                                    <DeleteButton onDelete={() => handleDeleteUser(u.email)} />
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
                        <UsersForm 
                            disableForm = {disableForm}
                            enableForm = {enableForm}
                            handleDisableForm = {handleDisableForm}
                            handleAddUser = {handleAddUser}
                            handleEditUser = {handleEditUser}
                            editValues = {editValues}
                            />
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