import { Bar } from 'react-chartjs-2';
import { useState, useEffect } from 'react';
import Cookies from 'universal-cookie'
import 'chart.js/auto';

const DashboardChart = (props) => {
    const cookies = new Cookies();

    const [rawChartData, setRawChartData] = useState([]);

    const [prepChartData, setPrepChartData] = useState([]);

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const label = "2019-12 to 2020-11"

    const [chartData, setChartData] = useState({
        labels: months,
        datasets: [
            {
                label: label,
                data: prepChartData,
                backgroundColor: 'rgb(127, 128, 203)'
            }
        ]
    });

    useEffect(() => {

        console.log("useEffect props.data ->" + props.data);
        prepareDataForChart();


        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, []);

    const prepareDataForChart = () => {
        let preparedData = [];
        console.log("prepare props.data ->" + props.data);
        props.data.forEach(e => {
            preparedData.push(e.average);
        });
        console.log("prepare preparedData 1 ->" + preparedData)
        setPrepChartData(preparedData);
        console.log("prepare preparedData 2 ->" + prepChartData);
        setChartData({
            labels: months,
            datasets: [
                {
                    label: label,
                    data: prepChartData,
                    backgroundColor: 'rgb(127, 128, 203)'
                }
            ]
        })
        console.log("prepare chartData ->" + chartData)
    }

    //const [months, setMonths] = useState();


    return (
        <div className="m-3 chart">
            <Bar
                data={chartData}

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
        </div>
    )
}

export default DashboardChart