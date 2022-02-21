import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button, Col, Row } from 'react-bootstrap'
import Cookies from 'universal-cookie'
import Axios from 'axios';
import { useTranslation } from 'react-i18next'
import ConfirmationPopup from '../components/ConfirmationPopup';
import NavB from '../components/NavB'
import '../styles/managePage.css'

const Manage = () => {
    let navigate = useNavigate()
    const cookies = new Cookies()
    const { t } = useTranslation()

    const saveGradingBracketsText = t('gradings.ModifyClientGradingButton')

    const [errors, setErrors] = useState({})
    const [clientGradingSaved, setClientGradingSaved] = useState(true);
    const [confirmSaveGradingActivated, setConfirmSaveGradingActivated] = useState(false);

    const [clientGrading, setClientGrading] = useState({
        maximumGradeAPlus: undefined,
        minimumGradeAPlus: undefined,
        averageCollectionTimeGradeAPlus: undefined,
        maximumGradeA: undefined,
        minimumGradeA: undefined,
        averageCollectionTimeGradeA: undefined,
        maximumGradeB: undefined,
        minimumGradeB: undefined,
        averageCollectionTimeGradeB: undefined,
        maximumGradeC: undefined,
        minimumGradeC: undefined,
        averageCollectionTimeGradeC: undefined,
        maximumGradeEPlus: undefined,
        minimumGradeEPlus: undefined,
        averageCollectionTimeGradeEPlus: undefined
    })


    const setField = (field, value) => {
        setClientGrading({
            ...clientGrading,
            [field]: value
        })

        if (!!errors[field]) {
            setErrors({
                ...errors,
                [field]: null
            });
        }

        setClientGradingSaved(false);
    }


    const findGradingCriteriaErrors = () => {
        const { maximumGradeAPlus, minimumGradeAPlus, averageCollectionTimeGradeAPlus, maximumGradeA, minimumGradeA, averageCollectionTimeGradeA,maximumGradeB, minimumGradeB, averageCollectionTimeGradeB, maximumGradeC, minimumGradeC, averageCollectionTimeGradeC, maximumGradeEPlus, minimumGradeEPlus, averageCollectionTimeGradeEPlus } = clientGrading
        let newErrors = {}
        
        //maximum grade A+ errors
        if (parseInt(maximumGradeAPlus) <= parseInt(minimumGradeAPlus) 
            && parseInt(maximumGradeAPlus) <= parseInt(maximumGradeA)
            && parseInt(maximumGradeAPlus) <= parseInt(minimumGradeA)
            && parseInt(maximumGradeAPlus) <= parseInt(maximumGradeB) 
            && parseInt(maximumGradeAPlus) <= parseInt(minimumGradeB) 
            && parseInt(maximumGradeAPlus) <= parseInt(maximumGradeC) 
            && parseInt(maximumGradeAPlus) <= parseInt(minimumGradeC) 
            && parseInt(maximumGradeAPlus) <= parseInt(maximumGradeEPlus) 
            && parseInt(maximumGradeAPlus) <= parseInt(minimumGradeEPlus))
            newErrors.maximumGradeAPlus = "The maximum of grade A+ is smaller or the same than one or multiple client grading below him"

        // minimum grade A+ errors
        if (parseInt(minimumGradeAPlus) >= parseInt(maximumGradeAPlus) )
            newErrors.minimumGradeAPlus = "The minimum of grade A+ is bigger or the same than maximum grade A+"

        if (parseInt(minimumGradeAPlus) <= parseInt(maximumGradeA) 
            && parseInt(minimumGradeAPlus) <= parseInt(minimumGradeA) 
            && parseInt(minimumGradeAPlus) <= parseInt(maximumGradeB) 
            && parseInt(minimumGradeAPlus) <= parseInt(minimumGradeB) 
            && parseInt(minimumGradeAPlus) <= parseInt(maximumGradeC) 
            && parseInt(minimumGradeAPlus) <= parseInt(minimumGradeC) 
            && parseInt(minimumGradeAPlus) <= parseInt(maximumGradeEPlus) 
            && parseInt(minimumGradeAPlus) <= parseInt(minimumGradeEPlus))
            newErrors.minimumGradeAPlus = "The minimum of grade A+ is smaller or the same than one or multiple client gradings"

        // maximum grade A errors
        if (parseInt(maximumGradeA) >= parseInt(minimumGradeAPlus) 
            && parseInt(maximumGradeA) >= parseInt(maximumGradeAPlus))
            newErrors.maximumGradeA = "The maximum of grade A is bigger or the same than the gradings above"

        if (parseInt(maximumGradeA) <= parseInt(minimumGradeA) 
            && parseInt(maximumGradeA) <= parseInt(maximumGradeB) 
            && parseInt(maximumGradeA) <= parseInt(minimumGradeB) 
            && parseInt(maximumGradeA) <= parseInt(maximumGradeC) 
            && parseInt(maximumGradeA) <= parseInt(minimumGradeC) 
            && parseInt(maximumGradeA) <= parseInt(maximumGradeEPlus) 
            && parseInt(maximumGradeA) <= parseInt(minimumGradeEPlus))
            newErrors.maximumGradeA = "The maximum of grade A is smaller or the same than one or multiple client gradings below"

        // minimum grade A errors
        if (parseInt(minimumGradeA) >= parseInt(maximumGradeA) 
            && parseInt(minimumGradeA) >= parseInt(minimumGradeAPlus)
            && parseInt(minimumGradeA) >= parseInt(maximumGradeAPlus))
            newErrors.minimumGradeA = "The minimum of grade A is bigger or the same than the gradings above"

        if (parseInt(minimumGradeA) <= parseInt(maximumGradeB) 
            && parseInt(minimumGradeA) <= parseInt(minimumGradeB) 
            && parseInt(minimumGradeA) <= parseInt(maximumGradeC) 
            && parseInt(minimumGradeA) <= parseInt(minimumGradeC) 
            && parseInt(minimumGradeA) <= parseInt(maximumGradeEPlus) 
            && parseInt(minimumGradeA) <= parseInt(minimumGradeEPlus))
            newErrors.minimumGradeA = "The minimum of grade A is smaller or the same than one or multiple client gradings below"

        // maximum grade B errors
        if (parseInt(maximumGradeB) >= parseInt(minimumGradeA) 
            && parseInt(maximumGradeB) >= parseInt(maximumGradeA) 
            && parseInt(maximumGradeB) >= parseInt(minimumGradeAPlus)
            && parseInt(maximumGradeB) >= parseInt(maximumGradeAPlus))
            newErrors.maximumGradeB = "The maximum of grade B is bigger or the same than the gradings above"

        if (parseInt(maximumGradeB) <= parseInt(minimumGradeB) 
            && parseInt(maximumGradeB) <= parseInt(maximumGradeC) 
            && parseInt(maximumGradeB) <= parseInt(minimumGradeC) 
            && parseInt(maximumGradeB) <= parseInt(maximumGradeEPlus) 
            && parseInt(maximumGradeB) <= parseInt(minimumGradeEPlus))
            newErrors.maximumGradeB = "The maximum of grade B is smaller or the same than one or multiple client gradings below"

        // minimum grade B errors
        if (parseInt(minimumGradeB) >= parseInt(maximumGradeB) 
            && parseInt(minimumGradeB) >= parseInt(minimumGradeA) 
            && parseInt(minimumGradeB) >= parseInt(maximumGradeA) 
            && parseInt(minimumGradeB) >= parseInt(minimumGradeAPlus)
            && parseInt(minimumGradeB) >= parseInt(maximumGradeAPlus))
            newErrors.minimumGradeB = "The minimum of grade B is bigger or the same than the gradings above"

        if (parseInt(minimumGradeB) <= parseInt(maximumGradeC) 
            && parseInt(minimumGradeB) <= parseInt(minimumGradeC) 
            && parseInt(minimumGradeB) <= parseInt(maximumGradeEPlus) 
            && parseInt(minimumGradeB) <= parseInt(minimumGradeEPlus))
            newErrors.minimumGradeB = "The minimum of grade B is smaller or the same than one or multiple client gradings below"
        
        //maximum grade C errors
        if (parseInt(maximumGradeC) >= parseInt(minimumGradeB)
            && parseInt(maximumGradeC) >= parseInt(maximumGradeB) 
            && parseInt(maximumGradeC) >= parseInt(minimumGradeA) 
            && parseInt(maximumGradeC) >= parseInt(maximumGradeA) 
            && parseInt(maximumGradeC) >= parseInt(minimumGradeAPlus)
            && parseInt(maximumGradeC) >= parseInt(maximumGradeAPlus))
            newErrors.maximumGradeC = "The maximum of grade C is bigger or the same than the gradings above"

        if (parseInt(maximumGradeC) <= parseInt(minimumGradeC) 
            && parseInt(maximumGradeC) <= parseInt(maximumGradeEPlus) 
            && parseInt(maximumGradeC) <= parseInt(minimumGradeEPlus))
            newErrors.maximumGradeC = "The maximum of grade C is smaller or the same than one or multiple client gradings below"

        //minimum grade C errors
        if (parseInt(minimumGradeC) >= parseInt(maximumGradeC)
            && parseInt(minimumGradeC) >= parseInt(minimumGradeB)
            && parseInt(minimumGradeC) >= parseInt(maximumGradeB) 
            && parseInt(minimumGradeC) >= parseInt(minimumGradeA) 
            && parseInt(minimumGradeC) >= parseInt(maximumGradeA) 
            && parseInt(minimumGradeC) >= parseInt(minimumGradeAPlus)
            && parseInt(minimumGradeC) >= parseInt(maximumGradeAPlus))
            newErrors.minimumGradeC = "The minimum of grade C is bigger or the same than the gradings above"

        if (parseInt(minimumGradeC) <= parseInt(maximumGradeEPlus) 
            && parseInt(minimumGradeC) <= parseInt(minimumGradeEPlus))
            newErrors.minimumGradeC = "The minimum of grade C is smaller or the same than one or multiple client gradings below"

        //maximum grade E+ errors
        if (parseInt(maximumGradeEPlus) >= parseInt(minimumGradeC)
            && parseInt(maximumGradeEPlus) >= parseInt(maximumGradeC)
            && parseInt(maximumGradeEPlus) >= parseInt(minimumGradeB)
            && parseInt(maximumGradeEPlus) >= parseInt(maximumGradeB) 
            && parseInt(maximumGradeEPlus) >= parseInt(minimumGradeA) 
            && parseInt(maximumGradeEPlus) >= parseInt(maximumGradeA) 
            && parseInt(maximumGradeEPlus) >= parseInt(minimumGradeAPlus)
            && parseInt(maximumGradeEPlus) >= parseInt(maximumGradeAPlus))
            newErrors.maximumGradeEPlus = "The maximum of grade E+ is bigger or the same than the gradings above"

        if (parseInt(maximumGradeEPlus) <= parseInt(minimumGradeEPlus))
            newErrors.maximumGradeEPlus = "The maximum of grade E+ is smaller or the same than one or multiple client gradings below"
        
        //minimum grade E+ errors
        if (parseInt(minimumGradeEPlus) >= parseInt(maximumGradeEPlus)
            && parseInt(minimumGradeEPlus) >= parseInt(minimumGradeC)
            && parseInt(minimumGradeEPlus) >= parseInt(maximumGradeC)
            && parseInt(minimumGradeEPlus) >= parseInt(minimumGradeB)
            && parseInt(minimumGradeEPlus) >= parseInt(maximumGradeB) 
            && parseInt(minimumGradeEPlus) >= parseInt(minimumGradeA) 
            && parseInt(minimumGradeEPlus) >= parseInt(maximumGradeA) 
            && parseInt(minimumGradeEPlus) >= parseInt(minimumGradeAPlus)
            && parseInt(minimumGradeEPlus) >= parseInt(maximumGradeAPlus))
            newErrors.minimumGradeEPlus = "The minimum of grade E+ is bigger or the same than the gradings above"


        //if no option is selected in average collection time
        if (averageCollectionTimeGradeAPlus === "")
            newErrors.averageCollectionTimeGradeAPlus = "Please select an option"

        if (averageCollectionTimeGradeA === "")
            newErrors.averageCollectionTimeGradeA = "Please select an option"

        if (averageCollectionTimeGradeB === "")
            newErrors.averageCollectionTimeGradeB = "Please select an option"

        if (averageCollectionTimeGradeC === "")
            newErrors.averageCollectionTimeGradeC = "Please select an option"

        if (averageCollectionTimeGradeEPlus === "")
            newErrors.averageCollectionTimeGradeEPlus = "Please select an option"

        //if there are no entries on the numbering

        if(maximumGradeAPlus === 0)
            newErrors.maximumGradeAPlus = "Please enter a number"
        if(minimumGradeAPlus === 0)
            newErrors.minimumGradeAPlus = "Please enter a number"
        if(maximumGradeA === 0)
            newErrors.maximumGradeA = "Please enter a number"
        if(minimumGradeA === 0)
            newErrors.minimumGradeA = "Please enter a number"
        if(maximumGradeB === 0)
            newErrors.maximumGradeB = "Please enter a number"
        if(minimumGradeB === 0)
            newErrors.minimumGradeB = "Please enter a number"
        if(maximumGradeC === 0)
            newErrors.maximumGradeC = "Please enter a number"
        if(minimumGradeC === 0)
            newErrors.minimumGradeC = "Please enter a number"
        if(maximumGradeEPlus === 0)
            newErrors.maximumGradeEPlus = "Please enter a number"
        if(minimumGradeEPlus === 0)
            newErrors.minimumGradeEPlus = "Please enter a number"

        return newErrors
    };


    const handleSaveGradingBrackets = async (event) => {
        event.preventDefault()
        event.stopPropagation()

        const newErrors = findGradingCriteriaErrors()
        setErrors(newErrors)
        if (Object.keys(newErrors).length !== 0) return;
        
        // const previouslyLoadedCriteriaStr = localStorage.getItem('dash_previous_criteria');
        // let previouslyLoadedCriteria = JSON.parse(previouslyLoadedCriteriaStr);
        // delete previouslyLoadedCriteria['name'];
        // let criteriaWithoutName = Object.assign({}, criteria);
        // delete criteriaWithoutName['name'];

        setConfirmSaveGradingActivated(true)
    }


    const getCurrentClientGradingInformations = async () => {

        let header = {
            'authorization': "Bearer " + cookies.get("accessToken"),
        }

        Axios.get(`${process.env.REACT_APP_API}/manage/getClientGrading`, { headers: header })
            .then((response) => {
                if (response.status === 200 || response.status === 201) {

                    console.log(response.data);

                    let setValue = {
                        maximumGradeAPlus: parseInt(response.data.maximumGradeAPlus),
                        minimumGradeAPlus: parseInt(response.data.minimumGradeAPlus),
                        averageCollectionTimeGradeAPlus: response.data.averageCollectionTimeGradeAPlus,
                        maximumGradeA: parseInt(response.data.maximumGradeA),
                        minimumGradeA: parseInt(response.data.minimumGradeA),
                        averageCollectionTimeGradeA: response.data.averageCollectionTimeGradeA,
                        maximumGradeB: parseInt(response.data.maximumGradeB),
                        minimumGradeB: parseInt(response.data.minimumGradeB),
                        averageCollectionTimeGradeB: response.data.averageCollectionTimeGradeB,
                        maximumGradeC: parseInt(response.data.maximumGradeC),
                        minimumGradeC: parseInt(response.data.minimumGradeC),
                        averageCollectionTimeGradeC: response.data.averageCollectionTimeGradeC,
                        maximumGradeEPlus: parseInt(response.data.maximumGradeEPlus),
                        minimumGradeEPlus: parseInt(response.data.minimumGradeEPlus),
                        averageCollectionTimeGradeEPlus: response.data.averageCollectionTimeGradeEPlus
                    }

                    setClientGrading(setValue);
                    return;
                }
                alert("The response from the B&C Engine was invalid.");
            })
            .catch((error) => {
                if (error.response) {
                    if (error.response.status === 403 || error.response.status === 401) {
                        alert("You are not authorized to perform this action.");
                    }
                    else {
                        alert("Malfunction in the B&C Engine.");
                    }
                }
                else if (error.request) {
                    alert("Could not reach b&C Engine...");
                }
            });
    }

    
    const onSaveGradingConfirmClick = async () => {

        let header = {
            'authorization': "Bearer " + cookies.get("accessToken"),
        }

        let data = {
            maximumGradeAPlus: clientGrading.maximumGradeAPlus,
            minimumGradeAPlus: clientGrading.minimumGradeAPlus,
            averageCollectionTimeGradeAPlus: clientGrading.averageCollectionTimeGradeAPlus,
            maximumGradeA: clientGrading.maximumGradeA,
            minimumGradeA: clientGrading.minimumGradeA,
            averageCollectionTimeGradeA: clientGrading.averageCollectionTimeGradeA,
            maximumGradeB: clientGrading.maximumGradeB,
            minimumGradeB: clientGrading.minimumGradeB,
            averageCollectionTimeGradeB: clientGrading.averageCollectionTimeGradeB,
            maximumGradeC: clientGrading.maximumGradeC,
            minimumGradeC: clientGrading.minimumGradeC,
            averageCollectionTimeGradeC: clientGrading.averageCollectionTimeGradeC,
            maximumGradeEPlus: clientGrading.maximumGradeEPlus,
            minimumGradeEPlus: clientGrading.minimumGradeEPlus,
            averageCollectionTimeGradeEPlus: clientGrading.averageCollectionTimeGradeEPlus
        }

        Axios.put(`${process.env.REACT_APP_API}/manage/modifyClientGrading`, data, { headers: header })
            .then((response) => {
                if (response.status === 200 || response.status === 201) {
                    setClientGradingSaved(true);
                    alert("Client grading has been modified successfully!");
                }
            })
            .catch((error) => {
                if (error.response) {
                    if (error.response.status === 403 || error.response.status === 401) {
                        navigate("/login");
                        alert("You are not authorized to perform this action.");
                    }
                    else {
                        alert("Malfunction in the B&C Engine.");
                    }
                } else if (error.request) {
                    alert("Could not reach the B&C Engine.");
                }
            });
        setConfirmSaveGradingActivated(false);
    }


    useEffect(() => {
        if (cookies.get("accessToken") === undefined) {
            navigate("/login")
        }
        else if (cookies.get("role") !== "admin") {
            navigate("/dashboard")
        }

        getCurrentClientGradingInformations();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



    return (
        <div>
            <NavB />
            <div className='justify-content-center mainContainer'>
                <div className='container-clientGradingBrackets'>
                    <div className='card shadow my-3 mx-3 px-3 py2'>
                        <h3 className="text-center">{t('manage.clientGrading.Title')}</h3>
                        <Form.Group className="my-2">
                            

                            <Row>
                                <Col>
                                    <Form.Label id="mainTitle">Minimum</Form.Label>
                                </Col>
                                <Col>
                                    <Form.Label id="mainTitle2">Maximum</Form.Label>
                                </Col>
                                <Col>
                                    <Form.Label id="mainTitle3">Average Collection days</Form.Label>
                                </Col>
                            </Row>

                            <Row className="manageRowForm">
                                <Col sm={6} md={1}>
                                    <Form.Label className="inputTitle">A+</Form.Label>
                                </Col>

                                <Col sm={6} md={3}>
                                    <Form.Control required
                                            id='minimumGradeA+'
                                            size="md"
                                            type="number"
                                            placeholder="Minimum treshold"
                                            onChange={(g) => setField('minimumGradeAPlus', g.target.value)}
                                            value={clientGrading.minimumGradeAPlus}
                                            isInvalid={!!errors.minimumGradeAPlus}>
                                    </Form.Control>

                                    <Form.Control.Feedback type="invalid">
                                        {errors.minimumGradeAPlus}
                                    </Form.Control.Feedback>
                                </Col>


                                
                                <Col sm={6} md={3}>
                                    <Form.Control required
                                            id='maximumGradeA+'
                                            className="manageMaximumGrade"
                                            size="md"
                                            type="number"
                                            placeholder="Maximum treshold"
                                            onChange={(g) => setField('maximumGradeAPlus', g.target.value)}
                                            value={clientGrading.maximumGradeAPlus}
                                            isInvalid={!!errors.maximumGradeAPlus}>
                                    </Form.Control>

                                    <Form.Control.Feedback type="invalid">
                                        {errors.maximumGradeAPlus}
                                    </Form.Control.Feedback>
                                </Col>


                                <Col sm={6} md={4}>
                                    <Form.Control required
                                        as="select"
                                        id='averageCollectionTimeA+'
                                        className="manageAverageCollectionTime"
                                        size="md"
                                        aria-label="Average collection time"
                                        onChange={(g) => setField('averageCollectionTimeGradeAPlus', g.target.value)}
                                        value={clientGrading.averageCollectionTimeGradeAPlus}
                                        isInvalid={!!errors.averageCollectionTimeGradeAPlus}>
                                            <option value="">Select Average Collection Time</option>
                                            <option value="<30">30 days or less</option>
                                            <option value="30-60">Between 30 and 60 days</option>
                                            <option value="60-90">Between 60 and 90 days</option>
                                            <option value=">90">Over 90 days</option>
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.averageCollectionTimeGradeAPlus}
                                    </Form.Control.Feedback>
                                </Col>
                            </Row>

                        

                            <Row className="manageRowForm">

                                <Col sm={6} md={1}>
                                    <Form.Label className="inputTitle">A</Form.Label>
                                </Col>

                                <Col sm={6} md={3}>
                                    <Form.Control required
                                            id='minimumGradeA'
                                            size="md"
                                            type="number"
                                            placeholder="Minimum treshold"
                                            onChange={(g) => setField('minimumGradeA', g.target.value)}
                                            value={clientGrading.minimumGradeA}
                                            isInvalid={!!errors.minimumGradeA}>
                                    </Form.Control>

                                    <Form.Control.Feedback type="invalid">
                                        {errors.minimumGradeA}
                                    </Form.Control.Feedback>
                                </Col>
                                

                                <Col sm={6} md={3}>
                                    <Form.Control required
                                            id='maximumGradeA'
                                            className="manageMaximumGrade"
                                            size="md"
                                            type="number"
                                            placeholder="Maximum treshold"
                                            onChange={(g) => setField('maximumGradeA', g.target.value)}
                                            value={clientGrading.maximumGradeA}
                                            isInvalid={!!errors.maximumGradeA}>
                                    </Form.Control>

                                    <Form.Control.Feedback type="invalid">
                                        {errors.maximumGradeA}
                                    </Form.Control.Feedback>
                                </Col>


                                <Col sm={6} md={4}>
                                    <Form.Control required
                                        as="select"
                                        id='averageCollectionTimeA'
                                        className="manageAverageCollectionTime"
                                        size="md"
                                        aria-label="Average collection time"
                                        onChange={(g) => setField('averageCollectionTimeGradeA', g.target.value)}
                                        value={clientGrading.averageCollectionTimeGradeA}
                                        isInvalid={!!errors.averageCollectionTimeGradeA}>
                                            <option value="">Select Average Collection Time</option>
                                            <option value="<30">30 days or less</option>
                                            <option value="30-60">Between 30 and 60 days</option>
                                            <option value="60-90">Between 60 and 90 days</option>
                                            <option value=">90">Over 90 days</option>
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.averageCollectionTimeGradeA}
                                    </Form.Control.Feedback>
                                </Col>
                            </Row>

                            <Row className="manageRowForm">

                                <Col sm={6} md={1}>
                                    <Form.Label className="inputTitle">B</Form.Label>
                                </Col>

                                <Col sm={6} md={3}>
                                    <Form.Control required
                                            id='minimumGradeB'
                                            size="md"
                                            type="number"
                                            placeholder="Minimum treshold"
                                            onChange={(g) => setField('minimumGradeB', g.target.value)}
                                            value={clientGrading.minimumGradeB}
                                            isInvalid={!!errors.minimumGradeB}>
                                    </Form.Control>

                                    <Form.Control.Feedback type="invalid">
                                        {errors.minimumGradeB}
                                    </Form.Control.Feedback>
                                </Col>
                                

                                
                                <Col sm={6} md={3}>
                                    <Form.Control required
                                            id='maximumGradeB'
                                            className="manageMaximumGrade"
                                            size="md"
                                            type="number"
                                            placeholder="Maximum treshold"
                                            onChange={(g) => setField('maximumGradeB', g.target.value)}
                                            value={clientGrading.maximumGradeB}
                                            isInvalid={!!errors.maximumGradeB}>
                                    </Form.Control>

                                    <Form.Control.Feedback type="invalid">
                                        {errors.maximumGradeB}
                                    </Form.Control.Feedback>
                                </Col>



                                <Col sm={6} md={4}>
                                    <Form.Control required
                                        as="select"
                                        id='averageCollectionTimeB'
                                        className="manageAverageCollectionTime"
                                        size="md"
                                        aria-label="Average collection time"
                                        onChange={(g) => setField('averageCollectionTimeGradeB', g.target.value)}
                                        value={clientGrading.averageCollectionTimeGradeB}
                                        isInvalid={!!errors.averageCollectionTimeGradeB}>
                                            <option value="">Select Average Collection Time</option>
                                            <option value="<30">30 days or less</option>
                                            <option value="30-60">Between 30 and 60 days</option>
                                            <option value="60-90">Between 60 and 90 days</option>
                                            <option value=">90">Over 90 days</option>
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.averageCollectionTimeGradeB}
                                    </Form.Control.Feedback>
                                </Col>
                            </Row>


                            <Row className="manageRowForm">

                                <Col sm={6} md={1}>
                                    <Form.Label className="inputTitle">C</Form.Label>
                                </Col>


                                <Col sm={6} md={3}>
                                    <Form.Control required
                                            id='minimumGradeC'
                                            size="md"
                                            type="number"
                                            placeholder="Minimum treshold"
                                            onChange={(g) => setField('minimumGradeC', g.target.value)}
                                            value={clientGrading.minimumGradeC}
                                            isInvalid={!!errors.minimumGradeC}>
                                    </Form.Control>

                                    <Form.Control.Feedback type="invalid">
                                        {errors.minimumGradeC}
                                    </Form.Control.Feedback>
                                </Col>


                                <Col sm={6} md={3}>
                                    <Form.Control required
                                            id='maximumGradeC'
                                            className="manageMaximumGrade"
                                            size="md"
                                            type="number"
                                            placeholder="Maximum treshold"
                                            onChange={(g) => setField('maximumGradeC', g.target.value)}
                                            value={clientGrading.maximumGradeC}
                                            isInvalid={!!errors.maximumGradeC}>
                                    </Form.Control>

                                    <Form.Control.Feedback type="invalid">
                                        {errors.maximumGradeC}
                                    </Form.Control.Feedback>
                                </Col>


                                <Col sm={6} md={4}>
                                    <Form.Control required
                                        as="select"
                                        id='averageCollectionTimeC'
                                        className="manageAverageCollectionTime"
                                        size="md"
                                        aria-label="Average collection time"
                                        onChange={(g) => setField('averageCollectionTimeGradeC', g.target.value)}
                                        value={clientGrading.averageCollectionTimeGradeC}
                                        isInvalid={!!errors.averageCollectionTimeGradeC}>
                                            <option value="">Select Average Collection Time</option>
                                            <option value="<30">30 days or less</option>
                                            <option value="30-60">Between 30 and 60 days</option>
                                            <option value="60-90">Between 60 and 90 days</option>
                                            <option value=">90">Over 90 days</option>
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.averageCollectionTimeGradeC}
                                    </Form.Control.Feedback>
                                </Col>
                            </Row>


                            <Row className="manageRowForm">
                                <Col sm={6} md={1}>
                                    <Form.Label className="inputTitle">E+</Form.Label>
                                </Col>

                                <Col sm={6} md={3}>
                                    <Form.Control required
                                            id='minimumGradeE+'
                                            size="md"
                                            type="number"
                                            placeholder="Minimum treshold"
                                            onChange={(g) => setField('minimumGradeEPlus', g.target.value)}
                                            value={clientGrading.minimumGradeEPlus}
                                            isInvalid={!!errors.minimumGradeEPlus}>
                                    </Form.Control>

                                    <Form.Control.Feedback type="invalid">
                                        {errors.minimumGradeEPlus}
                                    </Form.Control.Feedback>
                                </Col>



                                
                                <Col sm={6} md={3}>
                                    <Form.Control required
                                            id='maximumGradeE+'
                                            className="manageMaximumGrade"
                                            size="md"
                                            type="number"
                                            placeholder="Maximum treshold"
                                            onChange={(g) => setField('maximumGradeEPlus', g.target.value)}
                                            value={clientGrading.maximumGradeEPlus}
                                            isInvalid={!!errors.maximumGradeEPlus}>
                                    </Form.Control>

                                    <Form.Control.Feedback type="invalid">
                                        {errors.maximumGradeEPlus}
                                    </Form.Control.Feedback>
                                </Col>


                                <Col sm={6} md={4}>
                                    <Form.Control required
                                        as="select"
                                        id='averageCollectionTimeE+'
                                        className="manageAverageCollectionTime"
                                        size="md"
                                        aria-label="Average collection time"
                                        onChange={(g) => setField('averageCollectionTimeGradeEPlus', g.target.value)}
                                        value={clientGrading.averageCollectionTimeGradeEPlus}
                                        isInvalid={!!errors.averageCollectionTimeGradeEPlus}>
                                            <option value="">Select Average Collection Time</option>
                                            <option value="<30">30 days or less</option>
                                            <option value="30-60">Between 30 and 60 days</option>
                                            <option value="60-90">Between 60 and 90 days</option>
                                            <option value=">90">Over 90 days</option>
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.averageCollectionTimeGradeEPlus}
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
            <ConfirmationPopup
                open={confirmSaveGradingActivated}
                prompt={t('dashboard.criteria.SaveConfirmPrompt')}
                onAccept={() => { onSaveGradingConfirmClick() }}
                onClose={() => { setConfirmSaveGradingActivated(false) }}
            />
        </div>
    )
}

export default Manage