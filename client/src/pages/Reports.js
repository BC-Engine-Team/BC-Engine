import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'universal-cookie'
import { useTranslation } from 'react-i18next';
import Axios from 'axios';

import { Button, Table } from 'react-bootstrap'

import NavB from '../components/NavB'
import ConfirmationPopup from '../components/ConfirmationPopup'
import DeleteButton from '../components/DeleteButton'
import EditButton from '../components/EditButton'

const Reports = () => {
    const { t } = useTranslation();
    let navigate = useNavigate();


    const cookies = new Cookies();
    const malfunctionError = t('error.Malfunction');
    const notFoundError = t('error.NotFound')
    
    const [chartReportId, setChartReportId] = useState("");
    const [chartReportName, setChartReportName] = useState("");
    const [deleteButtonActivated, setDeleteButtonActivated] = useState(false);

    const [chartReports, setChartReports] = useState([{
        chartReportId: "",
        name: "",
        startDate: new Date(),
        endDate: new Date(),
        employee1: "",
        employee2: "",
        country: "",
        clientType: "",
        ageOfAccount: "",
        accountType: ""
    }]);

    const handleRefresh = () => {
        let header = {
            'authorization': "Bearer " + cookies.get("accessToken"),
        }

        Axios.defaults.withCredentials = true;

        Axios.get(`${process.env.REACT_APP_API}/reports/chartReport`, { headers: header })
            .then((response) => {
                setChartReports(response.data);
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



    const handleDeleteChartReport = (id, chartReportName) => {
        setChartReportId(id);
        setChartReportName(chartReportName);
        setDeleteButtonActivated(true);
    }


    const onDeleteClick = () => {
        let header = {
            'authorization': "Bearer " + cookies.get("accessToken")
        }

        let data = {
            chartReportId: chartReportId
        }

        Axios.defaults.withCredentials = true;

        Axios.delete(`${process.env.REACT_APP_API}/reports/delete/${chartReportId}`, { headers: header, data: data })
            .then((response) => {
                if (response.status === 200 || response.status === 204) {
                    handleRefresh(); 
                    alert(t('reports.delete.Confirmation')); 
                }    
            })
            .catch((error) => {
                if (error.response) {
                    if (error.response.status === 401 || error.response.status === 403) {
                        alert(t('reports.delete.NotAuthorized'));
                    }
                    else{
                        alert(malfunctionError)
                    }
                }
                else if (error.request) {
                    alert(notFoundError);
                }
            });
            setDeleteButtonActivated(false);
    };


    useEffect(() => {
        if (cookies.get("accessToken") === undefined) {
            navigate("/login");
        }

        handleRefresh();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <NavB />
            <div className='justify-content-center mainContainer'>
                <div>
                    <div className='card shadow'>
                        <Table responsive="xl" hover id='chartReportsTable'>
                            <thead className='bg-light'>
                                <tr key="0">
                                    <th>{t('reports.chartReports.Name')}</th>
                                    <th>{t('reports.chartReports.Employee')}</th>
                                    <th>{t('reports.chartReports.ClientType')}</th>
                                    <th>{t('reports.chartReports.Country')}</th>
                                    <th>{t('reports.chartReports.AgeOfAccount')}</th>
                                    <th>{t('reports.chartReports.AccountType')}</th>
                                    <th>{t('reports.chartReports.StartDate')}</th>
                                    <th>{t('reports.chartReports.EndDate')}</th>
                                    <th>
                                        <div className="d-flex justify-content-center">
                                            <Button
                                                className="btn py-0 shadow-sm border">
                                                {t('reports.chartReports.CreateButton')}
                                            </Button>
                                        </div>
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {chartReports.map(r => {
                                    return (
                                        <tr key={r.chartReportId} id={r.chartReportId}>
                                            <td>{r.name}</td>
                                            <td>{r.employee1Name}{r.employee2Name === null ? "" : ", " + r.employee2Name}</td>
                                            <td>{r.clientType}</td>
                                            <td>{r.country}</td>
                                            <td>{r.ageOfAccount}</td>
                                            <td>{r.accountType}</td>
                                            <td>{r.startDate.toString()}</td>
                                            <td>{r.endDate.toString()}</td>
                                            <td className="py-1">
                                                <div className="d-flex justify-content-center">
                                                    <EditButton />

                                                    <DeleteButton onDelete={() => handleDeleteChartReport(r.chartReportId, r.name)}/>
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

            <ConfirmationPopup 
                open={deleteButtonActivated}
                prompt={t('reports.delete.Title')}
                title={chartReportName}
                onAccept={() => { onDeleteClick() }}
                onClose={() => { setDeleteButtonActivated(false) }}/>

        </div>
    )
}

export default Reports
