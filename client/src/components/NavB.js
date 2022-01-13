import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import { LinkContainer } from "react-router-bootstrap"
import logo from '../Images/logo.png'
import { useState } from 'react'
import Axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Cookies from 'universal-cookie'

const NavB = (props) => {
    const [page] = useState(props);
    const cookies = new Cookies();

    let username;
    let role;

    if (page.page !== "login") {
        username = cookies.get("username");
        role = cookies.get("role");
    }

    Axios.defaults.withCredentials = true;

    let navigate = useNavigate();

    const logout = () => {
        let refreshToken = cookies.get("refreshToken");

        if (refreshToken === undefined) {
            cookies.remove("refreshToken");
            cookies.remove("accessToken");
            cookies.remove("username");
            cookies.remove("role"); 
            navigate("/login");
        }
        else {
            navigate("/login");
            cookies.remove("refreshToken");
            cookies.remove("accessToken");
            cookies.remove("username");
            cookies.remove("role");
            let conf = {
                headers: {
                    authorization: "Bearer " + refreshToken
                }
            };
    
            Axios.delete("http://localhost:3001/users/logout", conf)
            .then((response) => {

                if(response.status === 204) {     
                    cookies.remove("refreshToken");
                    cookies.remove("accessToken");
                    cookies.remove("username");
                    cookies.remove("role");
                    navigate("/login");
                }       
            })
            .catch((error) => {
                if(error.response) {
                    if(error.response.status === 403 || error.response.status === 401) {
                        console.log(error.response.body);
                    }
                    else {
                        console.log("Malfunction in the B&C Engine...");
                    }
                }
                else if(error.request) {
                    console.log("Could not reach b&C Engine...");
                }
                cookies.remove("refreshToken");
                cookies.remove("accessToken");
                cookies.remove("username");
                cookies.remove("role");
                navigate("/login");
            });
        }
    }

    //For Login page navBar
    if(page.page === "login") {
        return (
            <Navbar variant="dark" bg="dark" className="mb-2">
                <Container fluid className="justify-content-center">
                    <Navbar.Brand>
                        <img
                            alt="logo" 
                            src={logo} 
                            width="30" 
                            height="30" 
                            className="d-inline-block align-top" 
                        />
                        {' '} B&C Engine
                    </Navbar.Brand>
                </Container>
            </Navbar>
        )
    }

    //When user is loged in, show app's Admin navBar
    else {
        return (
            <Navbar variant="dark" bg="dark" expand="md" className="mb-2" collapseOnSelect>
                <Container fluid>

                    <LinkContainer to="/dashboard">
                        <Navbar.Brand>
                            <img alt="logo" src={logo} width="30" height="30" className="d-inline-block align-top" />
                            {' '} B&C Engine
                        </Navbar.Brand>
                    </LinkContainer>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">

                        { // if user is admin, show all tabs else, show only dsahboard and reports
                        role === "admin" ?
                            <Nav className="me-auto">
                                <LinkContainer to="/dashboard" className="px-2">
                                    <Nav.Link>Dashboard</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/reports" className="px-2">
                                    <Nav.Link>Reports</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/users" className="px-2">
                                    <Nav.Link>Users</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/manage" className="px-2">
                                    <Nav.Link>Manage</Nav.Link>
                                </LinkContainer>
                            </Nav> 
                            :
                            <Nav className="me-auto">
                                <LinkContainer to="/dashboard" className="px-2">
                                    <Nav.Link>Dashboard</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/reports" className="px-2">
                                    <Nav.Link>Reports</Nav.Link>
                                </LinkContainer>
                            </Nav>
                        }

                        <Nav className="justify-content-end">
                            <Navbar.Text className="me-3">
                                Hello, {username}
                            </Navbar.Text>
                            <Nav.Link id="sign_out" onClick={logout}>Sign out</Nav.Link>
                        </Nav>

                    </Navbar.Collapse>
                </Container>
            </Navbar>
        )
    }
}

export default NavB
