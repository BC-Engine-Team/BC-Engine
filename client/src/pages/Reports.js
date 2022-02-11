import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'universal-cookie'
import { useTranslation } from 'react-i18next';
import Axios from 'axios';

import { Button, Table, Form, ListGroup, ListGroupItem } from 'react-bootstrap'
import '../styles/reportsPage.css';

import NavB from '../components/NavB'
import ConfirmationPopup from '../components/ConfirmationPopup'
import DeleteButton from '../components/DeleteButton'
import { BiExport } from "react-icons/bi";

const Reports = () => {
    const { t } = useTranslation();
    let navigate = useNavigate();

    const cookies = new Cookies();
    const malfunctionError = t('error.Malfunction');
    const notFoundError = t('error.NotFound')

    let role = cookies.get("role");

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

    const [reportTypes, setReportTypes] = useState([]);
    const [selectedReportType, setSelectedReportType] = useState({});
    const [showReportsManagement, setShowReportsManagement] = useState({
        isAdmin: false,
        employee: "container-reportsTable-employee",
        admin: "container-reportsTable"
    });

    const handleRefresh = async () => {
        await getChartReports();
        if (cookies.get("role") === 'admin') {
            setShowReportsManagement({
                ...showReportsManagement,
                isAdmin: true
            });
            await getReportTypesAndRecipients();
        }

    }

    const getReportTypesAndRecipients = async () => {
        let header = {
            'authorization': "Bearer " + cookies.get("accessToken"),
        }

        Axios.defaults.withCredentials = true;

        await Axios.get(`${process.env.REACT_APP_API}/reports/reportTypes`, { headers: header })
            .then((response) => {
                console.log(response)
                if (response.data) {
                    console.log(response.data)
                    setReportTypes(response.data);
                    setSelectedReportType(response.data[0]);
                    return;
                }
                alert("The response from the B&C Engine was invalid.");
            })
            .catch((error) => {
                if (error.response) {
                    if (error.response.status === 403 || error.response.status === 401) {
                        alert("You are not authorized to perform this action.");
                    }
                    else {
                        alert("Malfunction in the B&C Engine.");
                    }
                }
                else if (error.request) {
                    alert("Could not reach b&C Engine...");
                }
            });
    }

    const getChartReports = async () => {
        let header = {
            'authorization': "Bearer " + cookies.get("accessToken")
        }

        Axios.defaults.withCredentials = true;
        await Axios.get(`${process.env.REACT_APP_API}/reports/chartReport`, { headers: header })
            .then((response) => {
                setChartReports(response.data);
            })
            .catch((error) => {
                if (error.response) {
                    if (error.response.status === 403 || error.response.status === 401) {
                        alert("You are not authorized to perform this action.");
                    }
                    else {
                        alert("Malfunction in the B&C Engine.");
                    }
                }
                else if (error.request) {
                    alert("Could not reach b&C Engine...");
                }
            });
    };

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
                    else {
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
            <div className=' mainContainer mainDiv'>
                <div className='justify-content-center main'>
                    <div className={showReportsManagement.isAdmin ?
                        showReportsManagement.admin :
                        showReportsManagement.employee} >
                        <div className='card shadow my-3 mx-3' >
                            <h4 className="text-center bg-light">{t('reports.reports.Title')}</h4>
                            <Table responsive hover id='reportTypesTable'>
                                <thead className='bg-light'>
                                    <tr key="0">
                                        <th>{t('reports.reports.NameLabel')}</th>
                                        <th>{t('reports.reports.EmployeeLabel')}</th>
                                        <th>{t('reports.reports.DateLabel')}</th>
                                        <th className='text-center'>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>

                                </tbody>
                            </Table>
                        </div>
                    </div>
                    {role === "admin" ?
                        <div className='container-reportsManagement'>
                            <div className='card shadow my-3 mx-3 px-3 py-2'>
                                <h3 className='text-center'>{t('reports.reportsManagement.Title')}</h3>
                                <Form.Group className="my-2" controlId="floatingModifyReportType">
                                    <Form.Label>{t('reports.reportsManagement.reportType.Title')}</Form.Label>
                                    <Form.Select required
                                        id='reportTypeSelect'
                                        size="sm"
                                        aria-label="Default select example">
                                        {reportTypes.map((t) => {
                                            return (
                                                <option key={t.id} value={t.id}>
                                                    {t.name}
                                                </option>)
                                        })}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="my-2" controlId="floatingModifyFrequency">
                                    <Form.Label>{t('reports.reportsManagement.frequency.Title')}</Form.Label>
                                    <Form.Select required
                                        id='reportFreqSelect'
                                        size="sm"
                                        aria-label="Default select example"
                                        disabled={true}>
                                        <option key={selectedReportType.frequency} value={selectedReportType.frequency}>
                                            {selectedReportType.frequency === -2 ? t('reports.reportsManagement.frequency.Week') :
                                                selectedReportType.frequency === -1 ? t('reports.reportsManagement.frequency.BiWeek') :
                                                    selectedReportType.frequency === 0 ? t('reports.reportsManagement.frequency.Month') :
                                                        selectedReportType.frequency === 1 ? t('reports.reportsManagement.frequency.BiMonth') :
                                                            selectedReportType.frequency === 2 ? t('reports.reportsManagement.frequency.Yearly') :
                                                                t('reports.reportsManagement.frequency.Month')}
                                        </option>
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="my-2" controlId="floatingModifyFrequency">
                                    <Form.Label>{t('reports.reportsManagement.recipients.Title')}</Form.Label>
                                    <ListGroup id='reportRecipientList'>
                                        {selectedReportType.recipients ? Object.keys(selectedReportType.recipients).map((rId, i) => {
                                            return (
                                                <ListGroupItem
                                                    key={i}
                                                    value={rId}
                                                    id={rId}>
                                                    <Form.Check label={selectedReportType.recipients[rId].name}
                                                        defaultChecked={selectedReportType.recipients[rId].isRecipient} />
                                                </ListGroupItem>
                                            );
                                        }) : <></>}
                                    </ListGroup>
                                </Form.Group>
                            </div>
                        </div>
                        :
                        <></>
                    }

                    <div className='container-chartReports'>
                        <div className='card shadow my-3 mx-3'>
                            <h4 className="text-center bg-light">{t('reports.chartReports.Title')}</h4>
                            <Table responsive hover id='chartReportsTable'>
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

                                                        <BiExport size={"1.7rem"} className="pt-1" />
                                                        <DeleteButton onDelete={() => handleDeleteChartReport(r.chartReportId, r.name)} />
                                                    </div >
                                                </td >
                                            </tr >
                                        );
                                    })}
                                </tbody >
                            </Table >
                        </div >
                    </div >
                </div>
            </div >
            <ConfirmationPopup
                open={deleteButtonActivated}
                prompt={t('reports.delete.Title')}
                title={chartReportName}
                onAccept={() => { onDeleteClick() }}
                onClose={() => { setDeleteButtonActivated(false) }} />
        </div>
    )
}

export default Reports
