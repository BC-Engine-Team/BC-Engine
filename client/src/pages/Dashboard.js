import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Axios from 'axios';
import Cookies from 'universal-cookie';
import NavB from '../components/NavB';
import DashboardChart from '../components/DashboardChart';
import '../styles/dashboardPage.css'

const Dashboard = () => {
    let navigate = useNavigate();
    const cookies = new Cookies();

    const [rawChartData, setRawChartData] = useState();


    useEffect(() => {
        if (cookies.get("accessToken") === undefined) {
            navigate("/login");
        }

        let header = {
            'authorization': "Bearer " + cookies.get("accessToken"),
        }

        Axios.defaults.withCredentials = true;

        Axios.get("http://localhost:3001/invoice/defaultChartTest", { headers: header })
            .then((response) => {
                setRawChartData(response.data);
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
                            <DashboardChart data={rawChartData} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
