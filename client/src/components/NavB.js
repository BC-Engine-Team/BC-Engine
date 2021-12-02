import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import { LinkContainer } from "react-router-bootstrap"
import logo from '../Images/logo.png'

const NavB = () => {
    return (
        <Navbar variant="dark" bg="dark" expand="lg" collapseOnSelect className="mb-2">
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
                        <LinkContainer to="/dashboard">
                            <Nav.Link>Dashboard</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/reports">
                            <Nav.Link>Reports</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/users">
                            <Nav.Link>Users</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/manage">
                            <Nav.Link>Manage</Nav.Link>
                        </LinkContainer>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavB
