import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'universal-cookie'
import NavB from '../components/NavB'
import UnderConstruction from '../components/UnderConstruction'

const Users = () => {

    let navigate = useNavigate();
    const cookies = new Cookies();

    useEffect(() => {
        if (cookies.get("accessToken") === undefined) {
            navigate("/login");
        }
        else if(cookies.get("role") !== "admin") {
            navigate("/dashboard");
        } 
    });

    return (
        <div>
            <NavB />
            <UnderConstruction pageName="Users"/>
        </div>
    )
}

export default Users
