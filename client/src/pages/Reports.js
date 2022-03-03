import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'universal-cookie'
import { useTranslation } from 'react-i18next';
import Axios from 'axios';

import { Button, Table, Form, ListGroup, ListGroupItem } from 'react-bootstrap'
import { Oval } from 'react-loader-spinner'

import NavB from '../components/NavB'
import DeleteButton from '../components/DeleteButton'
import ExportButton from '../components/ExportButton'
import ConfirmationPopup from '../components/ConfirmationPopup'
import '../styles/reportsPage.css'

const Reports = () => {
    const { t, i18n } = useTranslation();
    let navigate = useNavigate();

    const cookies = new Cookies();
    const malfunctionError = t('error.Malfunction');
    const notFoundError = t('error.NotFound');

    let role = cookies.get("role");

    const [pdfLoading, setPdfLoading] = useState(false);
    const [currentPdfLoading, setCurrentPdfLoading] = useState();

    const [chartReportId, setChartReportId] = useState("");
    const [chartReportName, setChartReportName] = useState("");
    const [deleteButtonActivated, setDeleteButtonActivated] = useState(false);

    const [chartReports, setChartReports] = useState([{
        chartReportId: "",
        name: "",
        startDate: new Date(),
        endDate: new Date(),
        employee1Id: "",
        employee1Name: "",
        employee2Id: "",
        employee2Name: "",
        countryId: "",
        country: "",
        clientType: "",
        ageOfAccount: "",
        accountType: ""
    }]);

    const [performanceReports, setPerformanceReports] = useState([{
        name: '',
        createdAt: '',
        recipient: ''
    }]);

    const [reportTypes, setReportTypes] = useState([]);
    const [selectedReportType, setSelectedReportType] = useState({});
    const [showReportsManagement, setShowReportsManagement] = useState({
        isAdmin: false,
        employee: "container-reportsTable-employee",
        admin: "container-reportsTable"
    });

    const createAndDownloadPDF = (chartReportId, performanceReportId) => {
        setPdfLoading(true);
        setCurrentPdfLoading(chartReportId === undefined ? performanceReportId : chartReportId);

        let url = `${process.env.REACT_APP_API}/reports/`

        url = chartReportId === undefined ? url.concat('createPerformanceReportPdf') : url.concat('createChartReportPdf')

        let header = {
            'authorization': "Bearer " + cookies.get("accessToken"),
        }

        let param = {
            reportId: chartReportId === undefined ? performanceReportId : chartReportId,
            language: i18n.language
        }

        Axios.defaults.withCredentials = true;

        Axios.post(url, param, { headers: header })
            .then((response) => {
                if (response.data === true) {
                    let param = {
                        performanceReportId: chartReportId === undefined ? performanceReportId : chartReportId,
                        chartReportId: chartReportId === undefined ? undefined : chartReportId
                    }

                    Axios.get(`${process.env.REACT_APP_API}/reports/fetchPdf`, { params: param, headers: header, responseType: 'arraybuffer' })
                        .then((res) => {
                            const pdfBlob = new Blob([res.data], { type: 'application/pdf' });

                            const url = URL.createObjectURL(pdfBlob);

                            var element = document.createElement('a');
                            document.body.appendChild(element);
                            element.style = "display: none";
                            element.href = url;
                            element.download = chartReportId === undefined ? `PerformanceReport-${performanceReportId}` : `ChartReport-${chartReportId}`;
                            element.click();
                            document.body.removeChild(element);
                            setPdfLoading(false);
                        })
                        .catch((error) => {
                            setPdfLoading(false);
                            if (error.response) {
                                if (error.response.status === 403 || error.response.status === 401) {
                                    alert("You are not authorized to perform this action.");
                                }
                                else {
                                    alert("Could not fetch pdf file...");
                                }
                            }
                            else if (error.request) {
                                alert("Could not fetch pdf file...");
                            }
                        });
                }
                else {
                    alert("Could not fetch pdf file...");
                }
            })
            .catch((error) => {
                setPdfLoading(false);
                if (error.response) {
                    if (error.response.status === 403 || error.response.status === 401) {
                        alert("You are not authorized to perform this action.");
                    }
                    else {
                        alert("Could not generate pdf file...");
                    }
                }
                else if (error.request) {
                    alert("Could not fetch Chart Report...");
                }
            });
    }

    const handleRefresh = async () => {
        await getChartReports();
        if (cookies.get("role") === 'admin') {
            setShowReportsManagement({
                ...showReportsManagement,
                isAdmin: true
            });
            await getReportTypesAndRecipients();

        }
        await getPerformanceReports();
    }

    const getPerformanceReports = async () => {
        let header = {
            'authorization': "Bearer " + cookies.get("accessToken")
        }
        let url = `${process.env.REACT_APP_API}/reports/performanceReport`

        if (role !== 'admin') {
            url = url.concat(`/${cookies.get('userId')}`)
        }

        Axios.defaults.withCredentials = true;

        await Axios.get(url, { headers: header })
            .then((response) => {
                if (response.data) {
                    setPerformanceReports(response.data);
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


    const getReportTypesAndRecipients = async () => {
        let header = {
            'authorization': "Bearer " + cookies.get("accessToken")
        }

        Axios.defaults.withCredentials = true;

        await Axios.get(`${process.env.REACT_APP_API}/reports/reportTypes`, { headers: header })
            .then((response) => {
                if (response.data) {
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

    const loadChart = (cName, startDate, endDate, emp1, emp2, country, clientType, aOAccount, accountType) => {
        let sMonth = startDate.substring(5, 6)
        let eMonth = endDate.substring(5, 6)
        let sYear = startDate.substring(0, 4)
        let eYear = endDate.substring(0, 4)

        let chartCriteria = {
            name: cName,
            startYear: sYear,
            startMonth: sMonth,
            endYear: eYear,
            endMonth: eMonth,
            employee1: {
                id: emp1.id,
                name: emp1.name
            },
            employee2: {
                id:  emp2.id,
                name: emp2.name
            },
            country: {
                id: country.id,
                name: country.name
            },
            clientType: clientType,
            ageOfAccount: aOAccount,
            accountType: accountType,
        }
        localStorage.setItem("dash_previous_criteria", JSON.stringify(chartCriteria))
        setTimeout(() => {navigate("/Dashboard")}, 1000);
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
            <div className='mainContainer mainDiv'>
                <div className='justify-content-center main'>
                    <div className={showReportsManagement.isAdmin ?
                        showReportsManagement.admin :
                        showReportsManagement.employee} >
                        <div className='card shadow my-3 mx-3 reports-table-card' >
                            <h4 className="text-center bg-light">{t('reports.reports.Title')}</h4>
                            <Table responsive hover id='reportTypesTable'>
                                <thead className='bg-light'>
                                    <tr key="-1">
                                        <th className='performance-table-columns'>{t('reports.reports.NameLabel')}</th>
                                        <th className='performance-table-columns'>{t('reports.reports.DateLabel')}</th>
                                        <th className='performance-table-columns'>{t('reports.reports.EmployeeLabel')}</th>
                                        <th className='performance-table-columns'>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {performanceReports.map((p, i) => {
                                        return (
                                            <tr key={i} id={p.performanceReportId}>
                                                <td className='performance-table-columns'>{p.name}</td>
                                                <td className='performance-table-columns'>{p.createdAt.toString()}</td>
                                                <td className='performance-table-columns'>{p.recipient}</td>
                                                <td className="py-1">
                                                    <div className="d-flex justify-content-center">
                                                        {pdfLoading
                                                            ?
                                                            p.performanceReportId !== currentPdfLoading
                                                                ?
                                                                <ExportButton id={p.performanceReportId} iconColor={{ color: '#666' }} styles={{ pointerEvents: 'none' }} />
                                                                :
                                                                <span className='loadingChartReport align-self-center'>
                                                                    <Oval
                                                                        height="22"
                                                                        width="22"
                                                                        color='black'
                                                                        ariaLabel='loading' />
                                                                </span>

                                                            :
                                                            <ExportButton id={p.performanceReportId} onExport={() => createAndDownloadPDF(undefined, p.performanceReportId)} />
                                                        }
                                                    </div >
                                                </td >
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                    {role === "admin" ?
                        <div className='container-reportsManagement'>
                            <div className='card shadow my-3 mx-3 px-3 py-2 report-management-card'>
                                <h3 className='text-center'>{t('reports.reportsManagement.Title')}</h3>
                                <Form.Group className="my-2" controlId="floatingModifyReportType">
                                    <Form.Label key='reportsManagementTitle'>{t('reports.reportsManagement.reportType.Title')}</Form.Label>
                                    <Form.Select required
                                        id='reportTypeSelect'
                                        size="sm"
                                        aria-label="Default select example">
                                        {reportTypes.map((t, i) => {
                                            return (
                                                <option key={i} value={t.id}>
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
                                                    className="btn py-0 shadow-sm border"
                                                    onClick={() => navigate("/dashboard")}>
                                                    {t('reports.chartReports.CreateButton')}
                                                </Button>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {chartReports.map((r, i) => {
                                        console.log(r)
                                        return (
                                            <tr key={i} id={r.chartReportId}>
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
                                                        <Button id={r.chartReportId} className='mx-2 loadButtonChartReport' onClick={() => loadChart(r.name, r.startDate, r.endDate, {id: r.employee1Id, name: r.employee1Name}, {id: r.employee2Id, name: r.employee2Name}, {id: r.countryId, name: r.country}, r.clientType, r.ageOfAccount, r.accountType)}>Load</Button>
                                                        {pdfLoading
                                                            ?
                                                            r.chartReportId !== currentPdfLoading
                                                                ?
                                                                <ExportButton id={r.chartReportId} iconColor={{ color: '#666' }} styles={{ pointerEvents: 'none' }} />
                                                                :
                                                                <span className='loadingChartReport align-self-center'>
                                                                    <Oval
                                                                        height="22"
                                                                        width="22"
                                                                        color='black'
                                                                        ariaLabel='loading' />
                                                                </span>

                                                            :
                                                            <ExportButton id={r.chartReportId} onExport={() => createAndDownloadPDF(r.chartReportId, undefined)} />
                                                        }
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
