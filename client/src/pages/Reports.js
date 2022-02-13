import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'universal-cookie'
import { useTranslation } from 'react-i18next';
import Axios from 'axios';
import { Oval } from 'react-loader-spinner'
import { Button, Table } from 'react-bootstrap'
import '../styles/reportsPage.css';
import NavB from '../components/NavB'
import DeleteButton from '../components/DeleteButton'
import ExportButton from '../components/ExportButton'

const Reports = () => {
    const { t } = useTranslation();
    let navigate = useNavigate();
    const cookies = new Cookies();

    const [pdfLoading, setPdfLoading] = useState(false);

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

    const createAndDownloadPDF = (ReportId) => {
        setPdfLoading(true);
        console.log(pdfLoading)
        let header = {
            'authorization': "Bearer " + cookies.get("accessToken"),
        }

        let param = {
            reportid: ReportId
        }

        Axios.defaults.withCredentials = true;

        Axios.post(`${process.env.REACT_APP_API}/reports/createPdf`, param, { headers: header })
            .then((response) => {
                if(response.data === true) {
                    Axios.get(`${process.env.REACT_APP_API}/reports/fetchPdf`, { params: param, headers: header, responseType: 'arraybuffer' })
                    .then((res) => {
                        const pdfBlob = new Blob([res.data], { type: 'application/pdf' });

                        const url = URL.createObjectURL(pdfBlob);

                        var element = document.createElement('a');
                        document.body.appendChild(element);
                        element.style = "display: none";
                        element.href = url;
                        element.download = `ChartReport-${ReportId}`;
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
                    alert("Could not reach b&C Engine...");
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
                    alert("Could not generate pdf file...");
                }
            });
    }

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
                                                    {pdfLoading 
                                                    ?   
                                                    <span className='loadingChartReport align-self-center'>
                                                        <Oval
                                                            height="22"
                                                            width="22"
                                                            color='black'
                                                            ariaLabel='loading' />
                                                    </span>
                                                    :
                                                    <ExportButton onExport={() => createAndDownloadPDF(r.chartReportId)} />
                                                    }
                                                    <DeleteButton />
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
        </div>
    )
}

export default Reports
