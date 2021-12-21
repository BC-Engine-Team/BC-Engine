import { Bar } from 'react-chartjs-2';
import { useState } from 'react';
import 'chart.js/auto';

const DashboardChart = (props) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    const [chartData] = useState({
        labels: months,
        datasets: [
            {
                label: '2021',
                data: [ 67, 82, 69, 32, 52, 26, 10, 12, 69, 95, 10, 110 ],
                backgroundColor: 'rgb(127, 128, 203)'
            },
            {
                label: '2020',
                data: [ 59, 79, 23, 32, 78, 39, 11, 100, 45, 90, 16, 95 ],
                backgroundColor: 'rgb(203, 127, 154)'
            }
        ],
    });

    return (
        <div className="m-3 chart">
            <Bar 
                data={chartData} 
                
                options={{
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