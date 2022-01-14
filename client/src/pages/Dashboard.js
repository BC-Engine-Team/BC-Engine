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

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const label = ""
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
        let averages = [];

        let header = {
            'authorization': "Bearer " + cookies.get("accessToken"),
        }

        const dates = {
            startDate: "2019-12-01",
            endDate: "2020-11-01"
        };

        await Axios.get(`${process.env.REACT_APP_API}/invoice/defaultChartAndTable/${dates.startDate}/${dates.endDate}`, { headers: header })
            .then((res) => {
                if (res.status === 403 && res.status === 401) {
                    setAuthorized(false);
                    return;
                }

                setAuthorized(true);

                for (let i = 0; i < res.data.length; i++) {
                    averages.push(parseFloat(res.data[i].average));
                }

                setPreparedChartData(averages);

                setChartData({
                    labels: months,
                    datasets: [
                        {
                            label: label,
                            data: averages,
                            backgroundColor: 'rgb(127, 128, 203)'
                        }
                    ]
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
        setChartData({
            labels: months,
            datasets: [
                {
                    label: label,
                    data: preparedChartData,
                    backgroundColor: 'rgb(127, 128, 203)'
                }
            ]
        })
    }

    return (
        <div>
            <NavB />
            <div className='d-flex realMain'>
                <div className="justify-content-center main">
                    <div className="container-criteria">
                        <div className="card shadow my-3 mx-3">
                            <InputGroup className="my-2  px-2">
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
                                                    size: 20
                                                }
                                            },
                                            legend: {
                                                display: true,
                                                position: 'right',
                                                rtl: true
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
