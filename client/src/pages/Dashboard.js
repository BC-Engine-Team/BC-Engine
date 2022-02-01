import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { InputGroup, FormControl, FormLabel, Button, OverlayTrigger, Tooltip as ToolTipBootstrap, FormCheck } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Axios from 'axios';
import Cookies from 'universal-cookie';
import NavB from '../components/NavB';
import '../styles/dashboardPage.css'
import { Oval } from  'react-loader-spinner'
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

    let counter = 1;
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
    const [chartLoading, setChartLoading] = useState(false);
    const [authorized, setAuthorized] = useState(false);

    const [employeeSelect, SetEmployeeSelect] = useState([]);

    // Criteria
    const [compareEmployeeChecked, setCompareEmployeeChecked] = useState(false);
    const [employeeCriteria, SetEmployeeCriteria] = useState({
        id: "All",
        name: "All"
    });

    const createEmployeeCriteria = async () => {
        let listEmployee = [];

        let header = {
            'authorization': "Bearer " + cookies.get("accessToken"),
        }

        await Axios.get(`${process.env.REACT_APP_API}/invoice/employees`, { headers: header })
            .then((res) => {
                if (res.status === 403 && res.status === 401) {
                    setAuthorized(false);
                    return;
                }
                setAuthorized(true);

                for(let i = 0; i < res.data.length; i++) {

                    listEmployee.push({
                        label: res.data[i].firstName + " " + res.data[i].lastName,
                        value: res.data[i].nameID
                    });
                }

                SetEmployeeSelect(listEmployee);
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

    const chart = async (employeeId = undefined) => {
        setChartLoading(true);
        setChartData(fallbackChartData);

        let datasets = [];

        let header = {
            'authorization': "Bearer " + cookies.get("accessToken"),
        }

        const dates = {
            startDate: "2017-01-01",
            endDate: "2020-12-01"
        };

        let param = {};
        if(employeeId !== undefined) {
            param = {
                employeeId: employeeId
            }
        }

        await Axios.get(`${process.env.REACT_APP_API}/invoice/defaultChartAndTable/${dates.startDate}/${dates.endDate}`, { params: param, headers: header })
            .then((res) => {
                if (res.status === 403 && res.status === 401) {
                    setAuthorized(false);
                    return;
                }
                setAuthorized(true);

                let previousYear = parseInt(res.data[0].month.toString().substring(0, 4));
                let data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                let color = colors[0];
                let colorCounter = 0;

                for (let i = 0; i < res.data.length; i++) {
                    let year = parseInt(res.data[i].month.toString().substring(0, 4));
                    let month = parseInt(res.data[i].month.toString().substring(4));
                    let average = parseFloat(res.data[i].average);

                    if (year !== previousYear || res.data[i].month === res.data[res.data.length - 1].month) {
                        if (res.data[i].month === res.data[res.data.length - 1].month) {
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
                setChartLoading(false);
            })
            .catch((error) => {
                setChartLoading(false);

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

    const loadChartData = () => {
        if(!chartLoading) {
            if (employeeCriteria.id !== "All") {
                if(compareEmployeeChecked) {
                    chart();
                } else {
                    chart(employeeCriteria.id);
                }
            }
            else {
                chart();
            }
        }
    }

    useEffect(() => {
        if (cookies.get("accessToken") === undefined) {
            navigate("/login");
        }
        else if (cookies.get("role") !== "admin") {
            setAuthorized(false);
        }

        chart();
        createEmployeeCriteria()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <NavB />
            <div className='mainContainer mainDiv'>
                <div className="justify-content-center main">
                    <div className="container-criteria">
                        <div className="card shadow my-3 mx-3 p-2">
                            <h3 className="text-center">{t('dashboard.criteria.Title')}</h3>

                            <InputGroup className="my-2" >
                                <FormControl
                                    id='chartName'
                                    className="my-1"
                                    placeholder={chartReportNamePlaceHolder}
                                    aria-label="Username"
                                    aria-describedby="basic-addon1"
                                />
                            </InputGroup>

                            <FormLabel htmlFor="employeeCriteriaDashboard" className="ms-1">{t('dashboard.criteria.labels.Employee')}</FormLabel>
                            <InputGroup className="mb-2">
         
                                {employeeCriteria.name !== "All"}
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={employeeCriteria.name !== "All" ?
                                            <ToolTipBootstrap id="compareBTN-tooltip" className="transparent">
                                                {employeeCriteria.name}
                                            </ToolTipBootstrap> : <></>
                                        } >

                                        <FormControl id="employeeCriteriaDashboard" as="select" onChange={e => SetEmployeeCriteria({
                                                id: e.target.value.split("/")[0], 
                                                name: e.target.value.split("/")[1]
                                            })}>

                                            <option key="1" value="All/All">{t('dashboard.criteria.All')}</option>
                                            {employeeSelect.map(e => {
                                                counter++
                                                return (
                                                    <option key={counter} value={e.value + "/" + e.label}>{e.label}</option>
                                                )
                                            })}
                                        </FormControl>
                                    </OverlayTrigger>

                                <OverlayTrigger
                                    placement="top"
                                    overlay={
                                        <ToolTipBootstrap id="compareBTN-tooltip">
                                            {t('dashboard.criteria.Compare')}
                                        </ToolTipBootstrap>
                                    } >

                                    <Button 
                                        id="compareToAllBTN" 
                                        variant="light" 
                                        disabled={employeeCriteria.id === "All"}
                                        onClick={() => setCompareEmployeeChecked(!compareEmployeeChecked)}
                                        className="btn btn-light shadow-sm border inputSelect ms-1">

                                            <FormCheck 
                                            type="switch" 
                                            label={t('dashboard.criteria.CompareBTN')}
                                            disabled={employeeCriteria.id === "All"}
                                            checked={compareEmployeeChecked}
                                            />
                                    </Button>
                                </OverlayTrigger>

                            </InputGroup>
                            
                            <Button
                                onClick={loadChartData}
                                className='my-2 mx-2 d-flex justify-content-center'
                                variant='primary'>
                                    {chartLoading 
                                    ? 
                                    <span className='me-3 align-self-center'>
                                        <Oval 
                                            height="20"
                                            width="20"
                                            color='black'
                                            ariaLabel='loading' />
                                    </span>
                                    : 
                                    <></>}
                                    {loadChartButtonText}
                            </Button>
                        </div>
                    </div>
                    <div className="container-chart">
                        <div className="card shadow my-3 mx-3 p-2 pt-3">
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
                </div>
            </div>
        </div>
    )
}

export default Dashboard