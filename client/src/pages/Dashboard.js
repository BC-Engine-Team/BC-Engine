import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Axios from 'axios';
import Cookies from 'universal-cookie';
import NavB from '../components/NavB'
import Table from 'react-bootstrap/Table'
import '../styles/clientTable.css'
import '../styles/dashboardPage.css'
import { InputGroup, FormControl, Button, ButtonGroup, DropdownButton, Dropdown, Form } from 'react-bootstrap'

import { useTranslation } from 'react-i18next';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard = () => {
    let navigate = useNavigate();
    const cookies = new Cookies();
    const { t } = useTranslation();

    // variables used for internationalization
    const chartReportNamePlaceHolder = t('dashboard.criteria.NamePlaceHolder');
    const loadChartButtonText = t('dashboard.criteria.LoadChartButton');
    const chartTitle = t('dashboard.chart.Title');
    const chartXLabel = t('dashboard.chart.XAxisLabel');
    const chartYLabel = t('dashboard.chart.YAxisLabel');
    const months = [
        t('dashboard.chart.months.Jan'),
        t('dashboard.chart.months.Feb'),
        t('dashboard.chart.months.Mar'),
        t('dashboard.chart.months.Apr'),
        t('dashboard.chart.months.May'),
        t('dashboard.chart.months.Jun'),
        t('dashboard.chart.months.Jul'),
        t('dashboard.chart.months.Aug'),
        t('dashboard.chart.months.Sep'),
        t('dashboard.chart.months.Oct'),
        t('dashboard.chart.months.Nov'),
        t('dashboard.chart.months.Dec')
    ];
    const chartFallbackLegendLabel = t('dashboard.chart.FallbackLegendLabel');

    let label = ""
    let colors = [
        'rgb(255, 192, 159)',
        'rgb(191, 175, 192)',
        'rgb(255, 238, 147)',
        'rgb(160, 206, 217)',
        'rgb(173, 247, 182)'
    ];

    const fallbackChartData = [
        {
            label: chartFallbackLegendLabel,
            data: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
            backgroundColor: 'rgb(127, 128, 203)'
        }
    ];

    

    const [chartData, setChartData] = useState(fallbackChartData);
    const [authorized, setAuthorized] = useState(false);
    const [clientNameCountry, setClientNameCountry] = useState([{name: "", country: "", clientgrading: ""}]);
    const [countries, setCountries] = useState([{countryCode: "", countryLabel: ""}]);
   

    const chart = async () => {
        let datasets = [];
        let clientInfoList = [];
        
        let header = {
            'authorization': "Bearer " + cookies.get("accessToken"),
        }

        const dates = {
            startDate: "2018-01-01",
            endDate: "2020-01-01"
        };

        await Axios.get(`${process.env.REACT_APP_API}/invoice/defaultChartAndTable/${dates.startDate}/${dates.endDate}`, { headers: header })
            .then(async (res) => {
                if (res.status === 403 && res.status === 401) {
                    setAuthorized(false);
                    return;
                }
                setAuthorized(true);

                let previousYear = parseInt(res.data[0].chart[0].month.toString().substring(0, 4));
                let data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                let color = colors[0];
                let colorCounter = 0;

                for (let i = 0; i < res.data[0].chart.length; i++) {
                    let year = parseInt(res.data[0].chart[i].month.toString().substring(0, 4));
                    let month = parseInt(res.data[0].chart[i].month.toString().substring(4));
                    let average = parseFloat(res.data[0].chart[i].average);

                    if (year !== previousYear || res.data[0].chart[i].month === res.data[0].chart[res.data[0].chart.length - 1].month) {
                        if (res.data[0].chart[i].month === res.data[0].chart[res.data[0].chart.length - 1].month) {
                            for (let x = 0; x < data.length; x++) {
                                if ((month - 1) === x) {
                                    data[x] = average;
                                }
                            }
                        }

                        color = colors[colorCounter];
                        colorCounter++;
                        if (colorCounter === colors.length) colorCounter = 0;

                        label = previousYear;
                        datasets.push({
                            label: label,
                            data: data,
                            backgroundColor: color
                        });
                        
                        previousYear = year;
                        data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    }


                    for (let x = 0; x < data.length; x++) {
                        if ((month - 1) === x) {
                            data[x] = average;
                        }
                    }
                }

                setChartData(datasets);

                for(let i = 0; i < res.data[0].table.length; i++)
                {
                    clientInfoList.push({
                        name: res.data[0].table[i].name,
                        country: res.data[0].table[i].country,
                        clientgrading: res.data[0].table[i].grading
                    });
                }


                setClientNameCountry(clientInfoList);
            })
            .catch((error) => {
                if (error.response) {
                    if (error.response.status === 403 || error.response.status === 401) {
                        console.log(error.response.body);
                    }
                    else {
                        console.log("Malfunction in the B&C Engine...");
                    }
                }
                else if (error.request) {
                    console.log("Could not reach b&C Engine...");
                }
            });
    }


    const countrySelectBox = async () => {

        let countryList = [];

        let header = {
            'authorization': "Bearer " + cookies.get("accessToken"),
        }

        await Axios.get(`${process.env.REACT_APP_API}/invoice/getCountries`, { headers: header })
            .then(async (res) => {
                if (res.status === 403 && res.status === 401) {
                    setAuthorized(false);
                    return;
                }
                setAuthorized(true);

                for(let i = 0; i < res.data.length; i++)
                {
                    countryList.push({
                        countryCode: res.data[i].countryCode,
                        countryLabel: res.data[i].countryLabel
                    });
                }
                setCountries(countryList);
            });
    }


    
    useEffect(() => {
        if (cookies.get("accessToken") === undefined) {
            navigate("/login");
        }
        else if (cookies.get("role") !== "admin") {
            setAuthorized(false);
        }

        chart();
        countrySelectBox();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
        

    const loadChartData = () => {
        setChartData(chartData);
    }



    return (
        <div>
            <NavB />
            <div className='mainContainer mainDiv'>
                <div className="justify-content-center main">
                    <div className="container-criteria">
                        <div className="card shadow my-3 mx-3">
                            <InputGroup className="my-2  px-2" >
                                <FormControl
                                    id='chartName'
                                    placeholder={chartReportNamePlaceHolder}
                                    aria-label="Username"
                                    aria-describedby="basic-addon1"
                                />
                            </InputGroup>

                            
                            <Form.Group className="my-2  px-2" controlId="floatingModifyStartMonth">
                                <Form.Label>Country</Form.Label>
                                <Form.Select 
                                    className='my-2 px-2'>
                                    <option value="*">All countries</option>
                                    {countries.map ((country, index) => {
                                        return(
                                            <option key={index} value={country.countryCode}>{country.countryLabel}</option>    
                                        );
                                    })}
                                </Form.Select>
                            </Form.Group>

                            <Button
                                onClick={loadChartData}
                                className='my-2 mx-2'
                                variant='primary'>{loadChartButtonText}</Button>
                        </div>
                    </div>
                    <div className="container-chart">
                        <div className="card shadow my-3 mx-3">
                            {chartData &&
                                <Bar
                                    id='chart'
                                    data={{
                                        labels: months,
                                        datasets: chartData.length === 0 || authorized === false ? fallbackChartData : chartData
                                    }}

                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        aspectRatio: 4,
                                        scales: {
                                            yAxes: {
                                                title: {
                                                    display: true,
                                                    text: chartYLabel,
                                                    font: {
                                                        size: 15
                                                    }
                                                }
                                            },
                                            xAxes: {
                                                title: {
                                                    display: true,
                                                    text: chartXLabel,
                                                    font: {
                                                        size: 15
                                                    }
                                                }
                                            }
                                        },
                                        plugins: {
                                            title: {
                                                display: true,
                                                text: chartTitle,
                                                font: {
                                                    size: 25,
                                                    family: 'system-ui',
                                                    weight: '600'

                                                },
                                                color: 'black'
                                            },
                                            legend: {
                                                display: true,
                                                position: 'right'
                                            }
                                        }
                                    }}

                                />
                            }
                        </div>
                    </div>
                    <div className="container-table">
                        <div className="card shadow my-3 mx-3 uTable">

                            <Table id='table' responsive="xl" hover>

                                <thead className='bg-light'>
                                    <tr key="0">
                                        <th className='row-style'>{t('dashboard.table.Name')}</th>
                                        <th className='row-style'>{t('dashboard.table.Country')}</th>
                                        <th className='row-style'>{t('dashboard.table.AverageCollectionDays')}</th>
                                        <th className='row-style'>{t('dashboard.table.AmountOwed')}</th>
                                        <th className='row-style'>{t('dashboard.table.AmountDue')}</th>
                                        <th className='row-style'>{t('dashboard.table.ClientGrading')}</th>
                                        <th className='row-style'>{t('dashboard.table.CurrentStatus')}</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {clientNameCountry.map ((client, index) => {
                                        return(
                                            <tr key={index}>
                                                <td id="clientName">{client.name}</td>
                                                <td id= "clientCountry" className='row-style'>{client.country}</td>
                                                <td id="clientAverageCollectionDays" className='row-style'>23</td>
                                                <td id="clientAmountOwed" className='amount-owed'>55645</td>
                                                <td id="clientAmountDue" className='amount-due'>66643</td>
                                                <td id="clientGrading" className='row-style'>{client.clientgrading}</td>
                                                <td id="clientStatus" className='row-style'>Active</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>

                            <ButtonGroup className='col-md-5 w-auto ms-auto client-swap'>

                                <DropdownButton title={t('dashboard.dropdownButtonTable.Title')} variant="Default" id="bg-vertical-dropdown-3" className='rowsViewerSelectionStyle'>
                                    <Dropdown.Item eventKey="1">{t('dashboard.dropdownButtonTable.Option1')}</Dropdown.Item>
                                    <Dropdown.Item eventKey="2">{t('dashboard.dropdownButtonTable.Option2')}</Dropdown.Item>
                                    <Dropdown.Item eventKey="3">{t('dashboard.dropdownButtonTable.Option3')}</Dropdown.Item>
                                </DropdownButton>

                                <button className='left-button'>&#60;</button>
                                <button className='right-button'>&#62;</button>
                            </ButtonGroup>

                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
