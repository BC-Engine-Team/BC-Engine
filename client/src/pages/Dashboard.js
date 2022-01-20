import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { InputGroup, FormControl, FormLabel, Button, OverlayTrigger, Tooltip as ToolTipBootstrap, FormCheck } from 'react-bootstrap'
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

    let counter = 1;
    let navigate = useNavigate();
    const cookies = new Cookies();

    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let label = ""

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
    }

    const chart = async () => {
        let averages = [];
        let datasets = [];

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

                let data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                let red = 127;
                let green = 128;
                let blue = 203;
                let color = 'rgb(' + red + ',' + green + ',' + blue + ')';

                let previousYear = parseInt(res.data[0].month.toString().substring(0, 4));

                //months = [];
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
                        red = Math.floor((Math.random() * 255) + 1);
                        green = Math.floor((Math.random() * 255) + 1);
                        blue = Math.floor((Math.random() * 255) + 1);
                        color = 'rgb(' + red + ',' + green + ',' + blue + ')';
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

                setPreparedChartData(averages);

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
        createEmployeeCriteria()

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
            <div className='mainContainer mainDiv'>
                <div className="justify-content-center main">
                    <div className="container-criteria">
                        <div className="card shadow m-3 p-3">
                            <h3 className="text-center">Chart Criteria</h3>

                            <InputGroup className="my-2" id='chartName'>
                                <FormControl
                                    className="my-1"
                                    placeholder="Enter Chart Report Name"
                                    aria-label="Username"
                                    aria-describedby="basic-addon1"
                                />
                            </InputGroup>

                            <FormLabel htmlFor="inputPassword5" className="ms-1">Employee</FormLabel>
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

                                            <option key="1" value="All/All">All</option>
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
                                            Compare selected employee with all employees
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
                                            label="Compare"
                                            disabled={employeeCriteria.id === "All"}
                                            checked={compareEmployeeChecked}
                                            />
                                    </Button>
                                </OverlayTrigger>

                                
                            </InputGroup>
                            
                            <Button
                                onClick={loadChartData}
                                className='my-2'
                                variant='primary'>
                                Load Chart
                            </Button>
                        </div>
                    </div>
                    <div className="container-chart">
                        <div className="card shadow my-3 mx-3 p-2 pt-3">
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
                                                    weight: "600"
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
