import React, { useEffect } from 'react'
import { useNavigate } from 'react-router';
import Cookies from 'universal-cookie';
import NavB from '../components/NavB'
import UnderConstruction from '../components/UnderConstruction'
import ClientTable from '../components/ClientTable'


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
            <UnderConstruction pageName="Dashboard"/>
            <ClientTable/>
        </div>
    )
}

export default Dashboard
