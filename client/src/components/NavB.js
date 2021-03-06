import { LinkContainer } from "react-router-bootstrap"
import logo from '../Images/logo.png'
import french from '../Images/french.png'
import english from '../Images/english.png'
import { useEffect, useState } from 'react'
import Axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Cookies from 'universal-cookie'
import { useTranslation } from 'react-i18next';
import { Container, NavDropdown, Nav, Navbar } from 'react-bootstrap'

const NavB = (props) => {
    const [page] = useState(props);
    const cookies = new Cookies();
    const { t, i18n } = useTranslation();
    let navigate = useNavigate();

    const lngs = {
        en: { nativeName: 'English' },
        fr: { nativeName: 'Français' },
        'en-US': { nativeName: 'English' },
        'en-CA': { nativeName: 'English' },
        'fr-CA': { nativeName: 'Français'}
    };

    const DashboardLabel = t('navbar.DashboardLabel');
    const ReportsLabel = t('navbar.ReportsLabel');
    const UsersLabel = t('navbar.UsersLabel');
    const ManageLabel = t('navbar.ManageLabel');
    const GreetingLabel = t('navbar.Greeting');
    const SignOutLabel = t('navbar.SignOutLabel');

    const [languageTitle, setLanguageTitle] = useState(lngs[i18n.language].nativeName);
    const [frenchNav, setFrenchNav] = useState('md')

    let username;
    let role;

    if (page.page !== "login") {
        username = cookies.get("username");
        role = cookies.get("role");
    }

    const handleNavClick = (e) => {

        if (page.page === "dashboard") {
            e.preventDefault();
            props.handleNavClick(e.target.href);
        }
    }

    const logout = () => {
        let refreshToken = cookies.get("refreshToken");

        Axios.defaults.withCredentials = true;

        if (refreshToken !== undefined) {

            let conf = {
                headers: {
                    authorization: "Bearer " + refreshToken
                }
            };

            Axios.delete(`${process.env.REACT_APP_API}/users/logout`, conf)
                .then((response) => {

                    if (response.status === 204) {
                        // Future pop-up animation
                    }
                })
                .catch((error) => {
                    if (error.response) {
                        if (error.response.status === 403 || error.response.status === 401) {
                            alert(error.response.status);
                        }
                        else {
                            alert("Malfunction in the B&C Engine...");
                        }
                    }
                    else if (error.request) {
                        alert("Could not reach b&C Engine...");
                    }
                });
        }

        navigate("/login");
        cookies.remove("refreshToken");
        cookies.remove("accessToken");
        cookies.remove("username");
        cookies.remove("role");
    }

    useEffect(() => {
        if(languageTitle === 'Français')
            setFrenchNav('lg')
        else
            setFrenchNav('md');

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lngs])

    useEffect(() => {
        setLanguageTitle(lngs[i18n.language].nativeName)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    //For Login page navBar
    if (page.page === "login") {
        return (
            <Navbar variant="dark" bg="dark" className="mb-2">
                <Container fluid className="navContainer">
                    <Navbar.Brand className="navBrandLogin">
                        <img
                            alt="logo"
                            src={logo}
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                        />
                        {' '} B&C Engine
                    </Navbar.Brand>

                    <Nav className="ms-auto">
                        <NavDropdown title={languageTitle} id="navbar-language-dropdown-login">
                            {Object.keys(lngs).map((lng, i) => {
                                if(lng === 'en' || lng === 'fr')
                                    return (
                                        <NavDropdown.Item
                                            id={lng}
                                            key={i}
                                            onClick={() => {
                                                i18n.changeLanguage(lng);
                                                setLanguageTitle(lngs[lng].nativeName);
                                            }}>
                                            {lng === 'en' 
                                            ? 
                                            <img key={i} src={english} alt='english_flag' width='20px' />
                                            : 
                                            <img key={i} src={french} alt='french_flag' width='20px' />}
                                            {" " + lngs[lng].nativeName}
                                        </NavDropdown.Item>
                                    )
                                return null
                            })}
                        </NavDropdown>
                    </Nav>
                </Container>
            </Navbar>
        )
    }

    // When user is loged in, show app's Admin navBar
    else {
        return (
            <Navbar variant="dark" bg="dark" expand={frenchNav} className="mb-2" collapseOnSelect>
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
                                        <Nav.Link>{DashboardLabel}</Nav.Link>
                                    </LinkContainer>
                                    <LinkContainer to="/reports" className="px-2" onClick={handleNavClick}>
                                        <Nav.Link >{ReportsLabel}</Nav.Link>
                                    </LinkContainer>
                                    <LinkContainer to="/users" className="px-2" onClick={handleNavClick}>
                                        <Nav.Link >{UsersLabel}</Nav.Link>
                                    </LinkContainer>
                                    <LinkContainer to="/manage" className="px-2" onClick={handleNavClick}>
                                        <Nav.Link>{ManageLabel}</Nav.Link>
                                    </LinkContainer>
                                </Nav>
                                :
                                <Nav className="me-auto">
                                    <LinkContainer to="/dashboard" className="px-2" onClick={handleNavClick}>
                                        <Nav.Link>{DashboardLabel}</Nav.Link>
                                    </LinkContainer>
                                    <LinkContainer to="/reports" className="px-2" onClick={handleNavClick}>
                                        <Nav.Link>{ReportsLabel}</Nav.Link>
                                    </LinkContainer>
                                </Nav>
                        }

                        <Nav className="justify-content-end">
                            <Navbar.Text className="me-2">
                                {GreetingLabel} {username}
                            </Navbar.Text>

                            <NavDropdown title={languageTitle} id="navbar-language-dropdown">
                                {Object.keys(lngs).map((lng, i) => {
                                    if(lng === 'en' || lng === 'fr')
                                        return (
                                            <NavDropdown.Item
                                                id={lng}
                                                key={i}
                                                onClick={() => {
                                                    i18n.changeLanguage(lng);
                                                    setLanguageTitle(lngs[lng].nativeName);
                                                }}>
                                                {lng === 'en' 
                                                ? 
                                                <img key={i} src={english} alt='english_flag' width='20px' />
                                                : 
                                                <img key={i} src={french} alt='french_flag' width='20px' />}
                                                {" " + lngs[lng].nativeName}
                                            </NavDropdown.Item>
                                        )
                                    return null
                                })}
                            </NavDropdown>

                            <Nav.Link id="sign_out" onClick={logout}>{SignOutLabel}</Nav.Link>
                        </Nav>

                    </Navbar.Collapse>
                </Container>
            </Navbar>
        )
    }
}

export default NavB