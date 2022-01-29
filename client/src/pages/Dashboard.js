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
    const [preparedChartData, setPreparedChartData] = useState();
    const [authorized, setAuthorized] = useState(false);

    const [errors, setErrors] = useState({});
    const [criteria, setCriteria] = useState({
        name: "",
        startYear: 2008,
        startMonth: 0,
        endYear: 2008,
        endMonth: 0
    });

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

    const [latestYear, setLatestYear] = useState(new Date().getFullYear());
    const [latestMonth, setLatestMonth] = useState(new Date().getMonth());
    const [earliestYear, setEarliestYear] = useState(2008);
    const [startYearList, setStartYearList] = useState([]);
    const [endYearList, setEndYearList] = useState([]);
    const [startMonthList, setStartMonthList] = useState([]);
    const [endMonthList, setEndMonthList] = useState([]);

    const chart = async () => {
        let datasets = [];

        let header = {
            'authorization': "Bearer " + cookies.get("accessToken"),
        }

        const dates = {
            startDate: "2017-01-01",
            endDate: "2020-12-01"
        };

        await Axios.get(`${process.env.REACT_APP_API}/invoice/defaultChartAndTable/${dates.startDate}/${dates.endDate}`, { headers: header })
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

                setPreparedChartData(datasets);

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

    const loadChartData = (event) => {
        event.preventDefault();
        event.stopPropagation();

        const newErrors = findCriteriaErrors();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        }
    }

    const findCriteriaErrors = () => {
        const { name, startYear, startMonth, endYear, endMonth } = criteria;
        const newErrors = {};

        // endYear errors
        if (parseInt(endYear) < parseInt(startYear)) newErrors.endYear = "End Year cannot be before Start Year";

        // endMonth errors
        if (endMonth < startMonth && startYear === endYear)
            newErrors.endMonth = "End Month cannot be before Start Month";
        else
            delete newErrors["endMonth"];

        if (endMonth > latestMonth && endYear === latestYear.toString())
            newErrors.endMonth = "End Month cannot exceed current month";

        // startMonth errors
        if (startMonth > latestMonth && startYear === latestYear.toString())
            newErrors.startMonth = "Start Month cannot exceed current month";

        return newErrors;
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
                </div>
            </div>
        </div>
    )
}

export default Dashboard
