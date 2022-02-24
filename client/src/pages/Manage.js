import React, { useState, useEffect } from 'react'
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

    const [clientsList, setClientsList] = useState([{nameId: 0, name: "", country: "", grading: ""}])
    const [isSorted, setIsSorted] = useState()

    const sortGrading = () => {
        setClientsList(clientsList.sort((a, b) => {
            
            a = a.grading;
            b = b.grading;

            var weight = { '+': -1 },
                aa = a.split(/(?=[+])/),
                bb = b.split(/(?=[+])/);

            if (!isSorted) {
                setIsSorted(true)
                return aa[0][0].localeCompare(bb[0][0])
                    || bb[0].localeCompare(aa[0])
                    || (weight[aa[1]] || 0) - (weight[bb[1]] || 0);
            }
            else {
                setIsSorted(false)
                return bb[0][0].localeCompare(aa[0][0])
                || aa[0].localeCompare(bb[0])
                || (weight[bb[1]] || 0) - (weight[aa[1]] || 0);
            }
        }))
    }

    const clientTable = () => {
        let header = {
            'authorization': "Bearer " + cookies.get("accessToken"),
        }

        Axios.defaults.withCredentials = true;

        Axios.get(`${process.env.REACT_APP_API}/manage/clients`, { headers: header })
            .then((response) => {
                // Temp function to fix grade E issue in front end when sorting
                let data = []
                for(let i = 0; i < response.data.length; i++) {
                    if(response.data[i].grading === 'E')
                    response.data[i].grading = "E+"
                    
                    data.push(response.data[i])
                }
                setClientsList(data);
            })
            .catch((error) => {
                if (error.response) {
                    if (error.response.status === 403 || error.response.status === 401) {
                        alert("You are not authorized to perform this action.");
                    }
                    else {
                        alert("Could not reach b&C Engine...");
                    }
                }
                else if (error.request) {
                    alert("Could not reach b&C Engine...");
                }
            });
    }

    const getArrow = (sorted) => {
        if (sorted === undefined) return '↑↓'
        if (sorted) return '↑';
        return '↓';
    }

    useEffect(() => {
        if (cookies.get("accessToken") === undefined) {
            navigate("/login");
        }
        else if (cookies.get("role") !== "admin") {
            navigate("/dashboard");
        }

        clientTable()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <NavB />
            <div className='d-block'>
                <div className="justify-content-center d-flex">
                    <div className='container-clientTable'>
                        <div className="card shadow my-3 mx-3 uTable">
                            <h4 className="text-center bg-light">{t('manage.clientTable.Title')}</h4>
                            <Table responsive="xl" hover>
                                <thead className='bg-light'>
                                    <tr key="0">
                                        <th className='nameColumnTable '>{t('manage.clientTable.Name')}</th>
                                        <th className='countryColumnTable text-center'>{t('manage.clientTable.Country')}</th>
                                        <th className="text-center">{t('manage.clientTable.ClientGrading')} <button className='gradingSortBTN' onClick={sortGrading}>{getArrow(isSorted)}</button></th>
                                        <th className='text-center'>{t('manage.clientTable.Status')}</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {clientsList.map((c, i) => {
                                        return (
                                            <tr key={i}>
                                                <td className='nameColumnTable'>{c.name}</td>
                                                <td className='countryColumnTable text-center'>{c.country}</td>
                                                <td className='text-center'>{c.grading}</td>
                                                <td className='text-center'>Active</td>
                                            </tr>
                                        );
                                    })}
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