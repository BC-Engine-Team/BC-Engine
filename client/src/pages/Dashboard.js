import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import Cookies from 'universal-cookie';
import NavB from '../components/NavB';
import DashboardChart from '../components/DashboardChart';
import '../styles/dashboardPage.css'

const Dashboard = () => {
    let navigate = useNavigate();
    const cookies = new Cookies();

    useEffect(() => {
        if (cookies.get("accessToken") === undefined) {
            navigate("/login");
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <NavB />
            <div className="justify-content-center mainContainer">
                <div className="d-inline-block container-criteria">
                    <div className="card shadow ms-5 me-4 my-5">
                        a
                    </div>
                </div>
                <div className="d-inline-block container-chart">
                    <div className="card shadow ms-4 me-5 my-5">
                        <DashboardChart data="" year=""/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
