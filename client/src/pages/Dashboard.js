import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Axios from 'axios';
import Cookies from 'universal-cookie';
import NavB from '../components/NavB';
import DashboardChart from '../components/DashboardChart';
import '../styles/dashboardPage.css'
import { Bar } from 'react-chartjs-2';

const Dashboard = () => {
    let navigate = useNavigate();
    const cookies = new Cookies();

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const label = "2019-12 to 2020-11"

    const [chartData, setChartData] = useState();
    const [rawChartData, setRawChartData] = useState([]);
    const [prepChartData, setPrepChartData] = useState();
    const [clients, setClients] = useState();




    useEffect(() => {
        if (cookies.get("accessToken") === undefined) {
            navigate("/login");
        }
        else if (cookies.get("role") !== "admin") {
            navigate("/dashboard");
        }

        handleRefresh();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleRefresh = () => {
        let header = {
            'authorization': "Bearer " + cookies.get("accessToken"),
        }

        const dates = {
            startDate: "2019-12-01",
            endDate: "2020-11-01"
        };

        Axios.defaults.withCredentials = true;

        Axios.get(`${process.env.REACT_APP_API}/invoice/defaultChartAndTable/${dates.startDate}/${dates.endDate}`, { headers: header })
            .then((response) => {
                console.log(response);
                setRawChartData([...response.data]);
                let preparedData = [];
                rawChartData.forEach(e => {
                    preparedData.push(e.average);
                });
                setPrepChartData(preparedData);
                //setClients(response.data.clients);
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

    // const prepareDataForChart = () => {
    //     let preparedData = [];
    //     rawChartData.forEach(e => {
    //         preparedData.push(e.average);
    //     });
    //     setPrepChartData(preparedData);
    // }

    return (
        <div>
            <NavB />
            <div className='d-flex realMain'>
                <div className="justify-content-center main">
                    <div className="container-criteria">
                        <div className="card shadow my-3 mx-3">
                            a
                        </div>
                    </div>
                    <div className="container-chart">
                        <div className="card shadow my-3 mx-3">
                            {prepChartData &&
                                <Bar
                                    data={{
                                        labels: months,
                                        datasets: [
                                            {
                                                label: label,
                                                data: prepChartData,
                                                backgroundColor: 'rgb(127, 128, 203)'
                                            }
                                        ]
                                    }}

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
