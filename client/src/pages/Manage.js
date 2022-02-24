import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'universal-cookie'
import NavB from '../components/NavB'
import { Table } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
import Axios from 'axios';

import '../styles/managePage.css'


const Manage = () => {
    let navigate = useNavigate();
    const cookies = new Cookies();
    const { t } = useTranslation();

    useEffect(() => {
        if (cookies.get("accessToken") === undefined) {
            navigate("/login");
        }
        else if (cookies.get("role") !== "admin") {
            navigate("/dashboard");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <NavB />
            <div className='d-block'>
                <div className="justify-content-center d-flex">
                    <div className='container-clientTable'>
                        <div className="card shadow m-5">
                            <h4 className="text-center bg-light">{t('manage.clientTable.Title')}</h4>
                            <Table responsive="xl" hover>
                                <thead className='bg-light'>
                                    <tr key="0">
                                        <th>{t('manage.clientTable.Name')}</th>
                                        <th>{t('manage.clientTable.Country')}</th>
                                        <th>{t('manage.clientTable.ClientGrading')}</th>
                                        <th>{t('manage.clientTable.Status')}</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {/* {users.map(u => {
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
                                                        <EditButton onEdit={() => editUser(u.email, u.role)} />
                                                        <DeleteButton onDelete={() => handleDeleteUser(u.email)} />
                                                    </div>
                                                </td>

                                            </tr>
                                        );
                                    })} */}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Manage
