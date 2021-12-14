import React, { useEffect } from 'react'
import { useNavigate } from 'react-router';
import Cookies from 'universal-cookie';
import NavB from '../components/NavB'
import UnderConstruction from '../components/UnderConstruction'

const Dashboard = () => {
    let navigate = useNavigate();
    const cookies = new Cookies();

    useEffect(() => {
        if (cookies.get("accessToken") === undefined) {
            navigate("/login");
        }
    });

    return (
        <div>
            <NavB />
            <UnderConstruction pageName="Dashboard"/>
        </div>
    )
}

export default Dashboard
