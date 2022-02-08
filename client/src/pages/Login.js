import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Axios from 'axios'
import Cookies from 'universal-cookie'
import { useTranslation } from 'react-i18next';

import Icon from '@mdi/react'
import { mdiEye, mdiEyeOff } from '@mdi/js';

import NavB from '../components/NavB'
import Form from 'react-bootstrap/Form'
import { Alert, Button, FloatingLabel } from 'react-bootstrap'

const Login = () => {
    const cookies = new Cookies();
    const { t } = useTranslation();
    let navigate = useNavigate();

    const emptyError = t('error.Empty');
    const incorrectError = t('error.Incorrect');
    const notFoundError = t('error.NotFound');

    const [showPass, setShowPass] = useState(false);
    const [validated, setValidated] = useState(false);
    const [validationError, setValidationError] = useState(false);

    const [InvalidCredential, setInvalidCredential] = useState("");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [errorMessage, setErrorMessage] = useState({
        email: emptyError,
        password: emptyError,
    });

    Axios.defaults.withCredentials = true;

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            setValidated(true);
        }
        else {
            setInvalidCredential("");
            event.preventDefault();

            let data = {
                email: email,
                password: password,
            }

            Axios.post(`${process.env.REACT_APP_API}/users/authenticate`, data)
                .then((response) => {
                    if (response.data.auth === true) {

                        let aToken = response.data.aToken.toString();
                        let rToken = response.headers['authorization'].toString();
                        let username = response.data.authenticatedUser.name.toString();
                        let role = response.data.authenticatedUser.role.toString();
                        let userId = response.data.authenticatedUser.userId.toString();

                        cookies.set("accessToken", aToken, { path: "/", expires: new Date(new Date().getTime() + 15 * 60 * 1000) });
                        cookies.set("refreshToken", rToken, { path: "/" });
                        cookies.set("username", username, { path: "/" });
                        cookies.set("role", role, { path: "/" });
                        cookies.set("userId", userId, { path: "/" });

                        navigate("/dashboard");
                    }
                    else {
                        setInvalidCredential(incorrectError);
                        setErrorMessage({
                            email: emptyError,
                            password: emptyError
                        });
                    }
                }).catch((error) => {

                    if (error.response) {
                        if (error.response.status === 403 || error.response.status === 401) {
                            setInvalidCredential(incorrectError);
                            setErrorMessage({
                                email: emptyError,
                                password: emptyError
                            });
                        }
                        else {
                            setInvalidCredential(incorrectError);
                        }
                    }
                    else if (error.request) {
                        // The request was made but no response was received
                        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                        // http.ClientRequest in node.js
                        setInvalidCredential(notFoundError);
                    }
                });
        }

        return false;
    };

    const showHide = () => {
        if (showPass) setShowPass(false);
        else setShowPass(true);
    }

    useEffect(() => {
        if (InvalidCredential !== "" && !validationError) {
            setValidationError(true)
            setValidated(false)
            setErrorMessage({
                email: "",
                password: "",
            })
        }
        else if (validationError) {
            setValidated(true);
            setValidationError(false);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [InvalidCredential]);

    return (
        <div>
            <NavB page="login" />
            <div className="container">
                <div className="card shadow p-3 m-5">
                    <h1 className="display-1 font-weight-bold text-center mt-5 mb-4">{t('login.Title')}</h1>

                    <Form
                        noValidate
                        className="mt-5 mx-5"
                        validated={validated}
                        onSubmit={handleSubmit}>

                        {
                            InvalidCredential.length > 0 ?
                                <Alert variant="danger">
                                    {InvalidCredential}
                                </Alert> :
                                <></>
                        }

                        <Form.Group className="mb-4" controlId="floatingEmail">
                            <FloatingLabel controlId="floatingEmail" label={t('form.EmailAddress')} className="mb-3" >
                                <Form.Control
                                    required
                                    type="email"
                                    value={email}
                                    isInvalid={validationError}
                                    onChange={(e) => setEmail(e.target.value)}
                                />

                                <Form.Control.Feedback type="invalid">
                                    {errorMessage.email}
                                </Form.Control.Feedback>
                            </FloatingLabel>
                        </Form.Group>

                        <Form.Group className="mb-5" controlId="floatingPassword">
                            <FloatingLabel controlId="floatingPassword" label={t('form.Password')} className="mb-3 inputWithShowHide" >
                                <Form.Control
                                    required
                                    type={showPass ? "text" : "password"}
                                    value={password}
                                    isInvalid={validationError}
                                    onChange={(e) => setPassword(e.target.value)}
                                />

                                <Icon
                                    className='showHideBTN'
                                    path={showPass ? mdiEye : mdiEyeOff}
                                    onClick={showHide}
                                    size={1} />

                                <Form.Control.Feedback type="invalid">
                                    {errorMessage.password}
                                </Form.Control.Feedback>
                            </FloatingLabel>
                        </Form.Group >

                        <div className="d-flex justify-content-center mt-5 mb-4">
                            <Button
                                id='loginButton'
                                type="submit"
                                className="btn btn-light py-2 px-5 my-1 shadow-sm border submitButton">
                                {t('login.SubmitButton')}
                            </Button>
                        </div>

                    </Form >
                </div >
            </div >
        </div >
    )
}

export default Login
