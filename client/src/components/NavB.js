import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import { LinkContainer } from "react-router-bootstrap"
import logo from '../Images/logo.png'
import { useState } from 'react'

const NavB = (props) => {
    const [state, setState] = useState(props)
    var username = "User";

    if(state.page === "login") {
        return (
            <Navbar variant="dark" bg="dark" className="mb-2">
                <Container fluid className="justify-content-center">
                    <Navbar.Brand>
                        <img alt="logo" src={logo} width="30" height="30" className="d-inline-block align-top" />
                        {' '} B&C Engine
                    </Navbar.Brand>
                </Container>
            </Navbar>
        )
    }
    else {
        return (
            <Navbar variant="dark" bg="dark" expand="md" collapseOnSelect className="mb-2">
                <Container fluid>
                    <LinkContainer to="/dashboard">
                        <Navbar.Brand>
                            <img alt="logo" src={logo} width="30" height="30" className="d-inline-block align-top" />
                            {' '} B&C Engine
                        </Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
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
                        <Nav className="justify-content-end">
                            <Navbar.Text className="me-3">
                                Signed in as: {username}
                            </Navbar.Text>
                            <LinkContainer to="/login">
                                <Nav.Link>Sign out</Nav.Link>
                            </LinkContainer>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        )
    }
}

export default NavB
