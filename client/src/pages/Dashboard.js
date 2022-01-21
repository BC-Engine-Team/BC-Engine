import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Axios from 'axios';
import Cookies from 'universal-cookie';
import NavB from '../components/NavB'
import DashboardChart from '../components/DashboardChart';
import ClientTable from '../components/ClientTable'
import '../styles/dashboardPage.css'

const Dashboard = () => {
    let navigate = useNavigate();
    const cookies = new Cookies();

    const [chartData, setChartData] = useState();
    const [clients, setClients] = useState();


    const handleRefreshChart = () => {
        let header = {
            'authorization': "Bearer " + cookies.get("accessToken"),
        }

        Axios.defaults.withCredentials = true;

        Axios.get(`${process.env.REACT_APP_API}/invoice/defaultChart`, { headers: header })
            .then((response) => {
                setChartData(response.data);
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


    const handleRefreshTable = () =>{
        let header = {
            'authorization': 'Bearer' + cookies.get("accessToken"),
        }

        Axios.defaults.withCredentials = true;

        Axios.get(`${process.env.REACT_APP_API}/invoice/defaultTable`, { headers: header })
            .then((response) => {
                setClients(response.data);
            })
            .catch((error) => {
                if(error.response){
                    if(error.response.status === 403 || error.response.status === 401) {
                        console.log(error.response.body);
                    }
                    else{
                        console.log("Malfunction in the B&C Engine...");
                    }
                }
                else if (error.request){
                    console.log("Could not reach B&C Engine...");
                }
            });
    }

    
    useEffect(() => {
        if (cookies.get("accessToken") === undefined) {
            navigate("/login");
        }
        handleRefreshChart();
        handleRefreshTable();
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


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
                            <DashboardChart data={chartData} />
                        </div>
                    </div>
                    <ClientTable data={clients}/>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
