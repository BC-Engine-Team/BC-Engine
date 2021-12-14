import React, { useEffect } from 'react'
import UnderConstruction from '../components/UnderConstruction'
import NavB from '../components/NavB'
import { useNavigate } from 'react-router'
import Cookies from 'universal-cookie'

const Reports = () => {
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
            <UnderConstruction pageName="Reports"/>
        </div>
    )
}

export default Reports
