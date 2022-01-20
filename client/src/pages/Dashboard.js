import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { InputGroup, FormControl, Button } from 'react-bootstrap'
import Axios from 'axios';
import Cookies from 'universal-cookie';
import NavB from '../components/NavB';
//import DashboardChart from '../components/DashboardChart';
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

    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let label = ""
    let colors = [
        'rgb(255, 192, 159)',
        'rgb(191, 175, 192)',
        'rgb(255, 238, 147)',
        'rgb(160, 206, 217)',
        'rgb(173, 247, 182)'
    ];

    const fallbackChartData = {
        labels: months,
        datasets: [
            {
                label: label,
                data: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
                backgroundColor: 'rgb(127, 128, 203)'
            }
        ]
    }

    const [chartData, setChartData] = useState(fallbackChartData);
    const [preparedChartData, setPreparedChartData] = useState();
    const [authorized, setAuthorized] = useState(false);

    const chart = async () => {
        let datasets = [];

        let header = {
            'authorization': "Bearer " + cookies.get("accessToken"),
        }

        const dates = {
            startDate: "2016-05-01",
            endDate: "2020-11-01"
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

                        console.log(colorCounter)

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

                setChartData({
                    labels: months,
                    datasets: datasets
                });
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

    useEffect(() => {
        if (cookies.get("accessToken") === undefined) {
            navigate("/login");
        }
        else if (cookies.get("role") !== "admin") {
            setAuthorized(false);
        }

        chart();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadChartData = () => {
        if (preparedChartData) {
            setChartData({
                labels: months,
                datasets: preparedChartData
            });
        }

    }

    return (
        <div>
            <NavB />
            <div className='mainContainer mainDiv'>
                <div className="justify-content-center main">
                    <div className="container-criteria">
                        <div className="card shadow my-3 mx-3">
                            <InputGroup className="my-2  px-2" id='chartName'>
                                <FormControl
                                    placeholder="Enter Chart Report Name"
                                    aria-label="Username"
                                    aria-describedby="basic-addon1"
                                />
                            </InputGroup>
                            <Button
                                onClick={loadChartData}
                                className='my-2 mx-2'
                                variant='primary'>Load Chart</Button>
                        </div>
                    </div>
                    <div className="container-chart">
                        <div className="card shadow my-3 mx-3">
                            {chartData &&
                                <Bar
                                    data={chartData.datasets.length === 0 || authorized === false ? fallbackChartData : chartData}

                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        aspectRatio: 4,
                                        scales: {
                                            yAxes: {
                                                title: {
                                                    display: true,
                                                    text: 'Days',
                                                    font: {
                                                        size: 15
                                                    }
                                                }
                                            },
                                            xAxes: {
                                                title: {
                                                    display: true,
                                                    text: 'Months',
                                                    font: {
                                                        size: 15
                                                    }
                                                }
                                            }
                                        },
                                        plugins: {
                                            title: {
                                                display: true,
                                                text: 'Average Collection Days over Time',
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
