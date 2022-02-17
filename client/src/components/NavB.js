import { LinkContainer } from 'react-router-bootstrap'
import logo from '../Images/logo.png'
import { useState } from 'react'
import Axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Cookies from 'universal-cookie'
import { useTranslation } from 'react-i18next'
import { Container, NavDropdown, Nav, Navbar } from 'react-bootstrap'

const NavB = (props) => {
  const [page] = useState(props)
  const cookies = new Cookies()
  const { t, i18n } = useTranslation()

  const lngs = {
    en: { nativeName: 'English' },
    fr: { nativeName: 'Français' },
    'en-US': { nativeName: 'English' }
  }

  const DashboardLabel = t('navbar.DashboardLabel')
  const ReportsLabel = t('navbar.ReportsLabel')
  const UsersLabel = t('navbar.UsersLabel')
  const ManageLabel = t('navbar.ManageLabel')
  const GreetingLabel = t('navbar.Greeting')
  const SignOutLabel = t('navbar.SignOutLabel')

  const [languageTitle, setLanguageTitle] = useState(lngs[i18n.language].nativeName)

  let username
  let role

  if (page.page !== 'login') {
    username = cookies.get('username')
    role = cookies.get('role')
  }

  Axios.defaults.withCredentials = true

  const navigate = useNavigate()

  const handleNavClick = (e) => {
    if (page.page === 'dashboard') {
      e.preventDefault()
      props.handleNavClick(e.target.href)
    }
  }

  const logout = () => {
    const refreshToken = cookies.get('refreshToken')

    if (refreshToken !== undefined) {
      const conf = {
        headers: {
          authorization: 'Bearer ' + refreshToken
        }
      }

      Axios.delete(`${process.env.REACT_APP_API}/users/logout`, conf)
        .then((response) => {
          if (response.status === 204) {
            // Future pop-up animation
          }
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 403 || error.response.status === 401) {
              console.log(error.response.status)
            } else {
              console.log('Malfunction in the B&C Engine...')
            }
          } else if (error.request) {
            console.log('Could not reach b&C Engine...')
          }
        })
    }

    navigate('/login')
    cookies.remove('refreshToken')
    cookies.remove('accessToken')
    cookies.remove('username')
    cookies.remove('role')
  }

  return (
    <Navbar variant='dark' bg='dark' expand={page.page === 'login' ? '' : 'md'} className='mb-2' collapseOnSelect={page.page === 'login' ? false : true}>
      <Container fluid className={page.page === 'login' ? 'nav-container' : ''}>
        {page.page === 'login' ?
          <>
            <Navbar.Brand className='nav-brand-login'>
              <img
                alt='logo'
                src={logo}
                width='30'
                height='30'
                className='d-inline-block align-top'
              />
              {' '} B&C Engine
            </Navbar.Brand>

            <Nav className='ms-auto'>
              <NavDropdown title={languageTitle} id='navbar-language-dropdown-login'>
                {Object.keys(lngs).map((lng) => (
                  <NavDropdown.Item
                    id={lng}
                    key={lng}
                    onClick={() => {
                      i18n.changeLanguage(lng)
                      setLanguageTitle(lngs[lng].nativeName)
                    }}
                  >
                    {lngs[lng].nativeName}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
            </Nav>
          </> :
          <>
            <LinkContainer to='/dashboard'>
              <Navbar.Brand>
                <img alt='logo' src={logo} width='30' height='30' className='d-inline-block align-top' />
                {' '} B&C Engine
              </Navbar.Brand>
            </LinkContainer>

            <Navbar.Toggle aria-controls='basic-navbar-nav' />
            <Navbar.Collapse id='basic-navbar-nav'>
              <Nav className='me-auto'>
                <LinkContainer to='/dashboard' className='px-2' onClick={handleNavClick}>
                  <Nav.Link>{DashboardLabel}</Nav.Link>
                </LinkContainer>
                <LinkContainer to='/reports' className='px-2' onClick={handleNavClick}>
                  <Nav.Link>{ReportsLabel}</Nav.Link>
                </LinkContainer>
                {
                  role === 'admin' &&
                  <>
                    <LinkContainer to='/users' className='px-2' onClick={handleNavClick}>
                      <Nav.Link>{UsersLabel}</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to='/manage' className='px-2' onClick={handleNavClick}>
                      <Nav.Link>{ManageLabel}</Nav.Link>
                    </LinkContainer>
                  </>
                }
              </Nav>

              <Nav className='justify-content-end'>
                <Navbar.Text className='me-2'>
                  {GreetingLabel} {username}
                </Navbar.Text>

                <NavDropdown title={languageTitle} id='navbar-language-dropdown'>
                  {Object.keys(lngs).map((lng) => (
                    <NavDropdown.Item
                      id={lng}
                      key={lng}
                      onClick={() => {
                        i18n.changeLanguage(lng)
                        setLanguageTitle(lngs[lng].nativeName)
                      }}
                    >
                      {lngs[lng].nativeName}
                    </NavDropdown.Item>
                  ))}
                </NavDropdown>

                <Nav.Link id='sign_out' onClick={logout}>{SignOutLabel}</Nav.Link>
              </Nav>

            </Navbar.Collapse>
          </>
        }
      </Container>
    </Navbar>
  )
}

export default NavB
