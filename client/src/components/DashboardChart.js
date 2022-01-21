import { Bar } from 'react-chartjs-2';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import Cookies from 'universal-cookie'
import 'chart.js/auto';

const DashboardChart = (props) => {
    let navigate = useNavigate();

    const cookies = new Cookies();

    useEffect(() => {
        if (cookies.get("accessToken") === undefined) {
            navigate("/login");
        }
        else if(cookies.get("role") !== "admin") {
            navigate("/dashboard");
        } 
     
        console.log(props.data)

        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, []);

    //const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


    const [months] = useState();
    

    const [chartData] = useState({
        labels: months,
        datasets: [
            {
                label: props.year,
                data: props.data ,
                backgroundColor: 'rgb(127, 128, 203)'
            }
        ]
    });

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
                            font:{
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