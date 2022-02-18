import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button, Col, Row } from 'react-bootstrap'
import Cookies from 'universal-cookie'
import { useTranslation } from 'react-i18next'
import NavB from '../components/NavB'
import '../styles/managePage.css'

const Manage = () => {
    let navigate = useNavigate()
    const cookies = new Cookies()
    const { t } = useTranslation()

    const saveGradingBracketsText = t('gradings.ModifyClientGradingButton')

    const [errors, setErrors] = useState({})
    const grades = ['A+', 'A', 'B', 'C', 'E+']

    const [clientGrading, setClientGrading] = useState({
        maximumGradeAPlus: "",
        minimumGradeAPlus: "",
        averageCollectionTimeGradeAPlus: "",
        maximumGradeA: "",
        minimumGradeA: "",
        averageCollectionTimeGradeA: "",
        maximumGradeB: "",
        minimumGradeB: "",
        averageCollectionTimeGradeB: "",
        maximumGradeC: "",
        minimumGradeC: "",
        averageCollectionTimeGradeC: "",
        maximumGradeEPlus: "",
        minimumGradeEPlus: "",
        averageCollectionTimeGradeEPlus: ""
    })


    const setField = (field, value) => {
        setClientGrading({
            ...clientGrading,
            [field]: value
        })
    }


    const findCriteriaErrors = () => {
        const { maximumGradeAPlus, minimumGradeAPlus, maximumGradeA, minimumGradeA, maximumGradeB, minimumGradeB, maximumGradeC, minimumGradeC, maximumGradeEPlus, minimumGradeEPlus } = clientGrading
        let newErrors = {}


        //maximum grade A+ errors
        if (parseInt(maximumGradeAPlus) < parseInt(minimumGradeAPlus) 
            && parseInt(maximumGradeAPlus) < parseInt(maximumGradeA)
            && parseInt(maximumGradeAPlus) < parseInt(minimumGradeA)
            && parseInt(maximumGradeAPlus) < parseInt(maximumGradeB) 
            && parseInt(maximumGradeAPlus) < parseInt(minimumGradeB) 
            && parseInt(maximumGradeAPlus) < parseInt(maximumGradeC) 
            && parseInt(maximumGradeAPlus) < parseInt(minimumGradeC) 
            && parseInt(maximumGradeAPlus) < parseInt(maximumGradeEPlus) 
            && parseInt(maximumGradeAPlus) < parseInt(minimumGradeEPlus))
            newErrors.minimumGradeAPlus = "The maximum grade A+ is smaller than one or multiple client grading bolow him"

        // minimum grade A+ errors
        if (parseInt(minimumGradeAPlus) > parseInt(maximumGradeAPlus) )
            newErrors.minimumGradeAPlus = "The minimum grade A+ is bigger than maximum grade A+"

        if (parseInt(minimumGradeAPlus) < parseInt(maximumGradeA) 
            && parseInt(minimumGradeAPlus) < parseInt(minimumGradeA) 
            && parseInt(minimumGradeAPlus) < parseInt(maximumGradeB) 
            && parseInt(minimumGradeAPlus) < parseInt(minimumGradeB) 
            && parseInt(minimumGradeAPlus) < parseInt(maximumGradeC) 
            && parseInt(minimumGradeAPlus) < parseInt(minimumGradeC) 
            && parseInt(minimumGradeAPlus) < parseInt(maximumGradeEPlus) 
            && parseInt(minimumGradeAPlus) < parseInt(minimumGradeEPlus))
            newErrors.minimumGradeAPlus = "The minimum grade A+ is smaller than one or multiple client gradings"

        // maximum grade A errors
        if (parseInt(maximumGradeA) > parseInt(minimumGradeAPlus) 
            && parseInt(maximumGradeA) > parseInt(maximumGradeAPlus))
            newErrors.minimumGradeAPlus = "The maximum grade A is bigger than the gradings above"

        if (parseInt(maximumGradeA) < parseInt(minimumGradeA) 
            && parseInt(maximumGradeA) < parseInt(maximumGradeB) 
            && parseInt(maximumGradeA) < parseInt(minimumGradeB) 
            && parseInt(maximumGradeA) < parseInt(maximumGradeC) 
            && parseInt(maximumGradeA) < parseInt(minimumGradeC) 
            && parseInt(maximumGradeA) < parseInt(maximumGradeEPlus) 
            && parseInt(maximumGradeA) < parseInt(minimumGradeEPlus))
            newErrors.minimumGradeAPlus = "The maximum grade A is smaller than one or multiple client gradings"

        // minimum grade A errors
        if (parseInt(minimumGradeA) > parseInt(maximumGradeA) 
            && parseInt(minimumGradeA) > parseInt(minimumGradeAPlus)
            && parseInt(minimumGradeA) > parseInt(maximumGradeAPlus))
            newErrors.minimumGradeAPlus = "The minimum grade A is bigger than the gradings above it"

        if (parseInt(minimumGradeA) < parseInt(maximumGradeB) 
            && parseInt(minimumGradeA) < parseInt(minimumGradeB) 
            && parseInt(minimumGradeA) < parseInt(maximumGradeC) 
            && parseInt(minimumGradeA) < parseInt(minimumGradeC) 
            && parseInt(minimumGradeA) < parseInt(maximumGradeEPlus) 
            && parseInt(minimumGradeA) < parseInt(minimumGradeEPlus))
            newErrors.minimumGradeAPlus = "The minimum grade A is smaller than one or multiple client gradings"

        // maximum grade B errors
        if (parseInt(maximumGradeB) > parseInt(minimumGradeA) 
            && parseInt(maximumGradeB) > parseInt(maximumGradeA) 
            && parseInt(maximumGradeB) > parseInt(minimumGradeAPlus)
            && parseInt(maximumGradeB) > parseInt(maximumGradeAPlus))
            newErrors.minimumGradeAPlus = "The maximum grade A is bigger than the gradings above it"

        if (parseInt(maximumGradeB) < parseInt(minimumGradeB) 
            && parseInt(maximumGradeB) < parseInt(maximumGradeC) 
            && parseInt(maximumGradeB) < parseInt(minimumGradeC) 
            && parseInt(maximumGradeB) < parseInt(maximumGradeEPlus) 
            && parseInt(maximumGradeB) < parseInt(minimumGradeEPlus))
            newErrors.minimumGradeAPlus = "The maximum grade B is smaller than one or multiple client gradings"

        // minimum grade B errors
        if (parseInt(minimumGradeA) > parseInt(maximumGradeA) 
            && parseInt(minimumGradeA) > parseInt(minimumGradeAPlus)
            && parseInt(minimumGradeA) > parseInt(maximumGradeAPlus))
            newErrors.minimumGradeAPlus = "The minimum grade A is bigger than the gradings above it"

        if (parseInt(minimumGradeA) < parseInt(maximumGradeB) 
            && parseInt(minimumGradeA) < parseInt(minimumGradeB) 
            && parseInt(minimumGradeA) < parseInt(maximumGradeC) 
            && parseInt(minimumGradeA) < parseInt(minimumGradeC) 
            && parseInt(minimumGradeA) < parseInt(maximumGradeEPlus) 
            && parseInt(minimumGradeA) < parseInt(minimumGradeEPlus))
            newErrors.minimumGradeAPlus = "The minimum grade A is smaller than one or multiple client gradings"
        
        return newErrors
    };


    const handleSaveGradingBrackets = async (event) => {
        event.preventDefault()
        event.stopPropagation()

        const newErrors = findCriteriaErrors()
        setErrors(newErrors)

        //setConfirmSaveActivated(true)
    }

    useEffect(() => {
        if (cookies.get("accessToken") === undefined) {
            navigate("/login")
        }
        else if (cookies.get("role") !== "admin") {
            navigate("/dashboard")
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
                            
                            <Form.Label class="inputTitle">A+</Form.Label>
                            <Row>
                                <Col sm={6} md={4}>
                                    <Form.Control required
                                            id='maximumGradeA+'
                                            size="md"
                                            type="number"
                                            placeholder="Maximum treshold"
                                            onChange={(g) => setField('maximumGradeAPlus', g.target.value)}
                                            value={clientGrading.maximumGradeAPlus}>
                                    </Form.Control>

                                    <Form.Control.Feedback type="invalid">
                                        
                                    </Form.Control.Feedback>
                                </Col>
                                
                                <Col sm={6} md={4}>
                                    <Form.Control required
                                            id='minimumGradeA+'
                                            size="md"
                                            type="number"
                                            placeholder="Minimum treshold"
                                            onChange={(g) => setField('minimumGradeAPlus', g.target.value)}
                                            value={clientGrading.minimumGradeAPlus}>
                                    </Form.Control>

                                    <Form.Control.Feedback type="invalid">
                                        
                                    </Form.Control.Feedback>
                                </Col>

                                <Col sm={6} md={4}>
                                    <Form.Select required
                                        id='averageCollectionTimeA+'
                                        size="md"
                                        aria-label="Average collection time"
                                        onChange={(g) => setField('averageCollectionTimeGradeAPlus', g.target.value)}
                                        value={clientGrading.averageCollectionTimeGradeAPlus}>
                                            <option value="Over 90 days">Over 90 days</option>
                                            <option value="Between 60 and 90 days">Between 60 and 90 days</option>
                                            <option value="Between 30 and 60 days">Between 30 and 60 days</option>
                                            <option value="30 days or less">30 days or less</option>
                                    </Form.Select>

                                    <Form.Control.Feedback type="invalid">
                                        
                                    </Form.Control.Feedback>
                                </Col>
                            </Row>

                            <Form.Label class="inputTitle">A</Form.Label>
                            <Row>
                                <Col sm={6} md={4}>
                                    <Form.Control required
                                            id='maximumGradeA'
                                            size="md"
                                            type="text"
                                            placeholder="Maximum treshold"
                                            onChange={(g) => setField('maximumGradeA', g.target.value)}
                                            value={clientGrading.maximumGradeA}>
                                    </Form.Control>

                                    <Form.Control.Feedback type="invalid">
                                        
                                    </Form.Control.Feedback>
                                </Col>
                                
                                <Col sm={6} md={4}>
                                    <Form.Control required
                                            id='minimumGradeA'
                                            size="md"
                                            type="text"
                                            placeholder="Minimum treshold"
                                            onChange={(g) => setField('minimumGradeA', g.target.value)}
                                            value={clientGrading.minimumGradeA}>
                                    </Form.Control>

                                    <Form.Control.Feedback type="invalid">
                                        
                                    </Form.Control.Feedback>
                                </Col>

                                <Col sm={6} md={4}>
                                    <Form.Select required
                                        id='averageCollectionTimeA'
                                        size="md"
                                        aria-label="Average collection time"
                                        onChange={(g) => setField('averageCollectionTimeGradeA', g.target.value)}
                                        value={clientGrading.averageCollectionTimeGradeA}>
                                            <option value="Over 90 days">Over 90 days</option>
                                            <option value="Between 60 and 90 days">Between 60 and 90 days</option>
                                            <option value="Between 30 and 60 days">Between 30 and 60 days</option>
                                            <option value="30 days or less">30 days or less</option>
                                    </Form.Select>

                                    <Form.Control.Feedback type="invalid">
                                        
                                    </Form.Control.Feedback>
                                </Col>
                            </Row>

                            <Form.Label class="inputTitle">B</Form.Label>
                            <Row>
                                <Col sm={6} md={4}>
                                    <Form.Control required
                                            id='maximumGradeB'
                                            size="md"
                                            type="text"
                                            placeholder="Maximum treshold"
                                            onChange={(g) => setField('maximumGradeB', g.target.value)}
                                            value={clientGrading.maximumGradeA}>
                                    </Form.Control>

                                    <Form.Control.Feedback type="invalid">
                                        
                                    </Form.Control.Feedback>
                                </Col>
                                
                                <Col sm={6} md={4}>
                                    <Form.Control required
                                            id='minimumGradeB'
                                            size="md"
                                            type="text"
                                            placeholder="Minimum treshold"
                                            onChange={(g) => setField('minimumGradeB', g.target.value)}
                                            value={clientGrading.minimumGradeB}>
                                    </Form.Control>

                                    <Form.Control.Feedback type="invalid">
                                        
                                    </Form.Control.Feedback>
                                </Col>

                                <Col sm={6} md={4}>
                                    <Form.Select required
                                        id='averageCollectionTimeB'
                                        size="md"
                                        aria-label="Average collection time"
                                        onChange={(g) => setField('averageCollectionTimeGradeB', g.target.value)}
                                        value={clientGrading.averageCollectionTimeGradeB}>
                                            <option value="Over 90 days">Over 90 days</option>
                                            <option value="Between 60 and 90 days">Between 60 and 90 days</option>
                                            <option value="Between 30 and 60 days">Between 30 and 60 days</option>
                                            <option value="30 days or less">30 days or less</option>
                                    </Form.Select>

                                    <Form.Control.Feedback type="invalid">
                                        
                                    </Form.Control.Feedback>
                                </Col>
                            </Row>

                            <Form.Label class="inputTitle">C</Form.Label>
                            <Row>
                                <Col sm={6} md={4}>
                                    <Form.Control required
                                            id='maximumGradeC'
                                            size="md"
                                            type="text"
                                            placeholder="Maximum treshold"
                                            onChange={(g) => setField('maximumGradeC', g.target.value)}
                                            value={clientGrading.maximumGradeC}>
                                    </Form.Control>

                                    <Form.Control.Feedback type="invalid">
                                        
                                    </Form.Control.Feedback>
                                </Col>
                                
                                <Col sm={6} md={4}>
                                    <Form.Control required
                                            id='minimumGradeC'
                                            size="md"
                                            type="text"
                                            placeholder="Minimum treshold"
                                            onChange={(g) => setField('minimumGradeC', g.target.value)}
                                            value={clientGrading.minimumGradeC}>
                                    </Form.Control>

                                    <Form.Control.Feedback type="invalid">
                                        
                                    </Form.Control.Feedback>
                                </Col>

                                <Col sm={6} md={4}>
                                    <Form.Select required
                                        id='averageCollectionTimeC'
                                        size="md"
                                        aria-label="Average collection time"
                                        onChange={(g) => setField('averageCollectionTimeGradeC', g.target.value)}
                                        value={clientGrading.averageCollectionTimeGradeC}>
                                            <option value="Over 90 days">Over 90 days</option>
                                            <option value="Between 60 and 90 days">Between 60 and 90 days</option>
                                            <option value="Between 30 and 60 days">Between 30 and 60 days</option>
                                            <option value="30 days or less">30 days or less</option>
                                    </Form.Select>

                                    <Form.Control.Feedback type="invalid">
                                        
                                    </Form.Control.Feedback>
                                </Col>
                            </Row>




                            <Form.Label class="inputTitle">E+</Form.Label>
                            <Row>
                                <Col sm={6} md={4}>
                                    <Form.Control required
                                            id='maximumGradeE+'
                                            size="md"
                                            type="text"
                                            placeholder="Maximum treshold"
                                            onChange={(g) => setField('maximumGradeEPlus', g.target.value)}
                                            value={clientGrading.maximumGradeEPlus}>
                                    </Form.Control>

                                    <Form.Control.Feedback type="invalid">
                                        
                                    </Form.Control.Feedback>
                                </Col>
                                
                                <Col sm={6} md={4}>
                                    <Form.Control required
                                            id='minimumGradeE+'
                                            size="md"
                                            type="text"
                                            placeholder="Minimum treshold"
                                            onChange={(g) => setField('minimumGradeEPlus', g.target.value)}
                                            value={clientGrading.minimumGradeEPlus}>
                                    </Form.Control>

                                    <Form.Control.Feedback type="invalid">
                                        
                                    </Form.Control.Feedback>
                                </Col>

                                <Col sm={6} md={4}>
                                    <Form.Select required
                                        id='averageCollectionTimeE+'
                                        size="md"
                                        aria-label="Average collection time"
                                        onChange={(g) => setField('averageCollectionTimeGradeEPlus', g.target.value)}
                                        value={clientGrading.averageCollectionTimeGradeEPlus}>
                                            <option value="Over 90 days">Over 90 days</option>
                                            <option value="Between 60 and 90 days">Between 60 and 90 days</option>
                                            <option value="Between 30 and 60 days">Between 30 and 60 days</option>
                                            <option value="30 days or less">30 days or less</option>
                                    </Form.Select>

                                    <Form.Control.Feedback type="invalid">
                                        
                                    </Form.Control.Feedback>
                                </Col>
                            </Row>
                            
                            <Row className='mt-2'>
                                <Col md={12}>
                                    <Button
                                        id='saveGradingBracketsButton'
                                        className='my-2 w-100 d-flex justify-content-center'
                                        onClick={handleSaveGradingBrackets}
                                        variant='primary'>
                                        {saveGradingBracketsText}
                                    </Button>
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

                                
                               
                                    
                    // <Col sm={6} md={6}>
                    //     <Form.Select required
                    //         id='startMonthSelect'
                    //         size="sm"
                    //         aria-label="Default select example"
                    //         onChange={(e) => setField('startMonth', e.target.value)}
                    //         value={criteria.startMonth}
                    //         isInvalid={!!errors.startMonth}>

                    //         {monthList.map((m, i) => {
                    //             return (<option key={i} value={i}>{m}</option>);
                    //         })}

                    //     </Form.Select>

                    //     <Form.Control.Feedback type="invalid">
                    //         {errors.startMonth}
                    //     </Form.Control.Feedback>
                    // </Col>
