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

const Users = () => {

    let navigate = useNavigate();
    const cookies = new Cookies();

    const [users, 
        //setUsers - for future use
    ] = useState([
        {
            id: 1,
            name: "Jean",
            email: "Jean@benoit-cote.com",
            role: "admin"
        },
        {
            id: 2,
            name: "Josee",
            email: "Josee@benoit-cote.com",
            role: "employee"
        },
        {
            id: 3,
            name: "Josee",
            email: "Josee@benoit-cote.com",
            role: "employee"
        },
        {
            id: 4,
            name: "Josee",
            email: "Josee@benoit-cote.com",
            role: "employee"
        },
        {
            id: 5,
            name: "Josee",
            email: "Josee@benoit-cote.com",
            role: "employee"
        },
        {
            id: 6,
            name: "Josee",
            email: "Josee@benoit-cote.com",
            role: "employee"
        },
        {
            id: 7,
            name: "Josee",
            email: "Josee@benoit-cote.com",
            role: "employee"
        },
    ]);

    const handleAddUser = () => {
        
    }

    const handleEditUser = (email) => {

    }

    const handleDeleteUser = (email) => {

    }

    useEffect(() => {
        if (cookies.get("accessToken") === undefined) {
            navigate("/login");
        }
        else if(cookies.get("role") !== "admin") {
            navigate("/dashboard");
        } 
    });


    return (
        <div>
            <NavB />
            <div className="container">
                <div className="card shadow m-5">
                    <Table responsive="xl">
                        <thead className='bg-light'>
                            <tr>
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
                        <tbody style={{height: 50}} className='overflow-scroll'>
                            {users.map (u => {
                                return (
                                    <tr>
                                        <td >
                                            <div className="justify-content-center d-flex">
                                                {u.id}
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
                                )
                            })}
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
    )
}

export default Users
