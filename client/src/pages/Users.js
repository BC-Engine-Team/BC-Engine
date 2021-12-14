import React from 'react'
import NavB from '../components/NavB'
import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import '../DeleteButton.scss'

const Users = () => {

    const handleAddUser = () => {
        
    }

    return (
        <div>
            <NavB />
            <div className="container">
                <div className="card shadow p-3 m-5">
                    <Table >
                        <thead>
                            <tr>
                                <th>
                                    <Form.Check type="checkbox" />
                                </th>
                                <th>NAME</th>
                                <th>EMAIL</th>
                                <th>ROLE</th>
                                <th>
                                    <Button 
                                        className="btn py-0 shadow-sm border" 
                                        onClick={handleAddUser}>
                                        Add User
                                    </Button>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <Form.Check type="checkbox" />
                                </td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>
                                <button className="btnDelete btn-delete">
                                    <span className="mdi mdi-delete mdi-24px"></span>
                                    <span className="mdi mdi-delete-empty mdi-24px"></span>
                                    <span>Delete</span>
                                </button>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
    )
}

export default Users
