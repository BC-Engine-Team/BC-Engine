import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { InputGroup, FormControl, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';

import Form from 'react-bootstrap/Form'

import Axios from 'axios';
import Cookies from 'universal-cookie';
import NavB from '../components/NavB';
import '../styles/dashboardPage.css'
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

    const [errors, setErrors] = useState({});
    const [criteria, setCriteria] = useState({
        name: "",
        startYear: 2019,
        startMonth: 0,
        endYear: 2021,
        endMonth: 6
    });



    const latestYear = new Date().getFullYear();
    const latestMonth = new Date().getMonth();
    const earliestYear = 2009;
    const [startYearList, setStartYearList] = useState([]);
    const [endYearList, setEndYearList] = useState([]);
    const [startMonthList, setStartMonthList] = useState([]);
    const [endMonthList, setEndMonthList] = useState([]);

    const chart = async () => {
        let header = {
            'authorization': "Bearer " + cookies.get("accessToken"),
        }

        let startDate = new Date(criteria.startYear, criteria.startMonth, 1).toISOString().split("T")[0];
        let endDate = new Date(criteria.endYear, criteria.endMonth, 1).toISOString().split("T")[0];

        await Axios.get(`${process.env.REACT_APP_API}/invoice/defaultChartAndTable/${startDate}/${endDate}`, { headers: header })
            .then((res) => {
                if (res.status === 403 && res.status === 401) {
                    setAuthorized(false);
                    return;
                }
                setAuthorized(true);

                let datasets = [];
                let groupedChartData = res.data;

                let colorCounter = 0;
                for (let i = 0; i < Object.keys(groupedChartData).length; i++) {
                    const data = groupedChartData[Object.keys(groupedChartData)[i]].map(m => m.average)
                    datasets.push({
                        label: groupedChartData[Object.keys(groupedChartData)[i]][0]['group'],
                        data: data,
                        backgroundColor: colors[colorCounter]
                    });

                    colorCounter++;
                    if (colorCounter === colors.length - 1) colorCounter = 0;
                }

                setChartData(datasets);
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

    const loadChartData = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        const newErrors = findCriteriaErrors();

        setErrors(newErrors);
        if (Object.keys(newErrors).length !== 0) return;
        await chart();
    }

    const setField = (field, value) => {
        setCriteria({
            ...criteria,
            [field]: value
        });

        if (!!errors[field]) {
            setErrors({
                ...errors,
                [field]: null
            });
        }
    };

    const findCriteriaErrors = () => {
        const { startYear, startMonth, endYear, endMonth } = criteria;
        let newErrors = {};

        // endYear errors
        if (parseInt(endYear) < parseInt(startYear))
            newErrors.endYear = t("dashboard.criteria.EndYearExceedError");

        // endMonth errors
        if (parseInt(endMonth) < parseInt(startMonth) && parseInt(startYear) === parseInt(endYear))
            newErrors.endMonth = t("dashboard.criteria.EndMonthExceedError");

        if (parseInt(endMonth) > latestMonth && endYear === latestYear.toString())
            newErrors.endMonth = t("dashboard.criteria.EndMonthExceedCurrentError");

        // startMonth errors
        if (startMonth > latestMonth && startYear === latestYear.toString())
            newErrors.startMonth = t("dashboard.criteria.StartMonthExceedCurrentError");

        return newErrors;
    }

    const initCriteria = async () => {
        let yearList = [];
        for (let i = earliestYear; i <= latestYear; i++) {
            yearList.push(i);
        }
        setStartYearList(yearList);
        setEndYearList(yearList);

        setStartMonthList(months);
        setEndMonthList(months);
    }

    useEffect(() => {
        if (cookies.get("accessToken") === undefined) {
            navigate("/login");
        }
        else if (cookies.get("role") !== "admin") {
            setAuthorized(false);
        }

        chart();
        initCriteria();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

                            <Form.Group className="my-2  px-2" controlId="floatingModifyStartDate">
                                <Form.Label>{t('dashboard.criteria.StartDateLabel')}</Form.Label>
                                <div className='row'>
                                    <div className='col-md-6 col-sm-6'>
                                        <Form.Select required
                                            size="sm"
                                            aria-label="Default select example"
                                            onChange={(e) => setField('startYear', e.target.value)}
                                            value={criteria.startYear}
                                            isInvalid={!!errors.startYear}>

                                            {startYearList.map((y, i) => {
                                                return (
                                                    <option key={i} value={y}>{y}</option>
                                                );
                                            })}

                                        </Form.Select>

                                        <Form.Control.Feedback type="invalid">
                                            {errors.startYear}
                                        </Form.Control.Feedback>
                                    </div>
                                    <div className='col-md-6 col-sm-6'>
                                        <Form.Select required
                                            size="sm"
                                            aria-label="Default select example"
                                            onChange={(e) => setField('startMonth', e.target.value)}
                                            value={criteria.startMonth}
                                            isInvalid={!!errors.startMonth}>

                                            {startMonthList.map((m, i) => {
                                                return (<option key={i} value={i}>{m}</option>);
                                            })}

                                        </Form.Select>

                                        <Form.Control.Feedback type="invalid">
                                            {errors.startMonth}
                                        </Form.Control.Feedback>
                                    </div>
                                </div>
                            </Form.Group>

                            <Form.Group className="my-2  px-2" controlId="floatingModifyStartDate">
                                <Form.Label>{t('dashboard.criteria.EndDateLabel')}</Form.Label>
                                <div className='row'>
                                    <div className='col-md-6 col-sm-6'>
                                        <Form.Select required
                                            size="sm"
                                            aria-label="Default select example"
                                            onChange={(e) => setField('endYear', e.target.value)}
                                            value={criteria.endYear}
                                            isInvalid={!!errors.endYear}>

                                            {endYearList.map((y, i) => {
                                                return (
                                                    <option key={i} value={y}>{y}</option>
                                                );
                                            })}
                                        </Form.Select>

                                        <Form.Control.Feedback type="invalid">
                                            {errors.endYear}
                                        </Form.Control.Feedback>
                                    </div>
                                    <div className='col-md-6 col-sm-6'>
                                        <Form.Select required
                                            size="sm"
                                            aria-label="Default select example"
                                            onChange={(e) => setField('endMonth', e.target.value)}
                                            value={criteria.endMonth}
                                            isInvalid={!!errors.endMonth}>

                                            {endMonthList.map((m, i) => {
                                                return (<option key={i} value={i}>{m}</option>);
                                            })}
                                        </Form.Select>

                                        <Form.Control.Feedback type="invalid">
                                            {errors.endMonth}
                                        </Form.Control.Feedback>
                                    </div>
                                </div>
                            </Form.Group>

                            <Button
                                onClick={loadChartData}
                                className='my-2 mx-2'
                                variant='primary'>{loadChartButtonText}
                            </Button>
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
                </div>
            </div>
        </div>
    )
}

export default Dashboard
