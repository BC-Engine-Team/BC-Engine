import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Table, InputGroup, FormControl, FormLabel, Button, ButtonGroup, OverlayTrigger, DropdownButton, Dropdown, Tooltip as ToolTipBootstrap, FormCheck, Col, Row } from 'react-bootstrap';
import Cookies from 'universal-cookie'
import { useTranslation } from 'react-i18next';
import NavB from '../components/NavB'
import UnderConstruction from '../components/UnderConstruction'
import '../styles/managePage.css';

const Manage = () => {
    let navigate = useNavigate();
    const cookies = new Cookies();
    const { t } = useTranslation();

    useEffect(() => {
        if (cookies.get("accessToken") === undefined) {
            navigate("/login");
        }
        else if (cookies.get("role") !== "admin") {
            navigate("/dashboard");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <NavB />
            <div className='justify-content-center mainContainer'>
                <div className='container-clientGradingBrackets'>
                    <div className='card shadow my-3 mx-3 px-3 py2'>
                        <h3 className="text-center">{t('manage.clientGrading.Title')}</h3>
                        <Form.Group className="my-2" controlId="floatingModifyStartMonth">
                            <Form.Label>A+</Form.Label>
                            <Form.Label>A+</Form.Label>
                            <Row>
                                <Col sm={6} md={6}>
                                    <Form.Select required>


                                    </Form.Select>

                                    <Form.Control.Feedback type="invalid">
                                    </Form.Control.Feedback>
                                </Col>
                                <Col sm={6} md={6}>
                                    <Form.Select required>


                                    </Form.Select>

                                    <Form.Control.Feedback type="invalid">
                                    </Form.Control.Feedback>
                                </Col>
                            </Row>
                        </Form.Group>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Manage
