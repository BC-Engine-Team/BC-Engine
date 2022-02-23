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
    let counter = 0;

    const [errors, setErrors] = useState({ aPlus: {}, a: {}, b: {}, c: {}, ePlus: {} })
    const [clientGradingSaved, setClientGradingSaved] = useState(true);
    const [confirmSaveGradingActivated, setConfirmSaveGradingActivated] = useState(false);
    const [clientGrading, setClientGrading] = useState({
        aPlus: {
            grade: 'A+',
            maximum: 0,
            minimum: 0,
            averageCollectionTime: ""
        },
        a: {
            grade: 'A',
            maximum: 0,
            minimum: 0,
            averageCollectionTime: ""
        },
        b: {
            grade: 'B',
            maximum: 0,
            minimum: 0,
            averageCollectionTime: ""
        },
        c: {
            grade: 'C',
            maximum: 0,
            minimum: 0,
            averageCollectionTime: ""
        },
        ePlus: {
            grade: 'E+',
            maximum: 0,
            minimum: 0,
            averageCollectionTime: ""
        }
    });

    const setField = (field, value, index) => {
        setClientGrading({
            ...clientGrading,
            [index]: {
                ...clientGrading[index],
                [field]: value
            }
        })

        if (!!errors[field]) {
            setErrors({
                ...errors,
                [index]: {
                    ...errors[index],
                    [field]: null
                }
            });
        }
        setClientGradingSaved(false);
    }

    const findGradingCriteriaErrors = () => {
        const errorHiger = 0
        const errorLower = 1
        const errorMin = 2
        const errorDropdown = 3
        const errorNoNum = 4

        let newErrors = {aPlus:{}, a:{}, b:{}, c:{}, ePlus:{}}

        // Maximum lower than the lower grading brackets error
        // A+
        if (parseInt(clientGrading.aPlus.maximum) <= parseInt(clientGrading.a.maximum)
            && parseInt(clientGrading.aPlus.maximum) <= parseInt(clientGrading.a.minimum)
            && parseInt(clientGrading.aPlus.maximum) <= parseInt(clientGrading.b.maximum) 
            && parseInt(clientGrading.aPlus.maximum) <= parseInt(clientGrading.b.minimum) 
            && parseInt(clientGrading.aPlus.maximum) <= parseInt(clientGrading.c.maximum) 
            && parseInt(clientGrading.aPlus.maximum) <= parseInt(clientGrading.c.minimum) 
            && parseInt(clientGrading.aPlus.maximum) <= parseInt(clientGrading.ePlus.maximum) 
            && parseInt(clientGrading.aPlus.maximum) <= parseInt(clientGrading.ePlus.minimum))
                newErrors.aPlus.maximum = errorHiger
        // A
        if (parseInt(clientGrading.a.maximum) <= parseInt(clientGrading.b.maximum) 
            && parseInt(clientGrading.a.maximum) <= parseInt(clientGrading.b.minimum) 
            && parseInt(clientGrading.a.maximum) <= parseInt(clientGrading.c.maximum) 
            && parseInt(clientGrading.a.maximum) <= parseInt(clientGrading.c.minimum) 
            && parseInt(clientGrading.a.maximum) <= parseInt(clientGrading.ePlus.maximum) 
            && parseInt(clientGrading.a.maximum) <= parseInt(clientGrading.ePlus.minimum))
                newErrors.a.maximum = errorHiger
        // B
        if (parseInt(clientGrading.b.maximum) <= parseInt(clientGrading.c.maximum) 
            && parseInt(clientGrading.b.maximum) <= parseInt(clientGrading.c.minimum) 
            && parseInt(clientGrading.b.maximum) <= parseInt(clientGrading.ePlus.maximum) 
            && parseInt(clientGrading.b.maximum) <= parseInt(clientGrading.ePlus.minimum))
                newErrors.b.maximum = errorHiger
        // C   
        if (parseInt(clientGrading.c.maximum) <= parseInt(clientGrading.ePlus.maximum) 
            && parseInt(clientGrading.c.maximum) <= parseInt(clientGrading.ePlus.minimum))
                newErrors.c.maximum = errorHiger

        // Maximum higer than the higer grading brackets error
        // A
        if (parseInt(clientGrading.a.maximum) >= parseInt(clientGrading.aPlus.minimum) 
            && parseInt(clientGrading.a.maximum) >= parseInt(clientGrading.aPlus.maximum))
                newErrors.a.maximum = errorLower
        // B
        if (parseInt(clientGrading.b.maximum) >= parseInt(clientGrading.a.minimum) 
            && parseInt(clientGrading.b.maximum) >= parseInt(clientGrading.a.maximum) 
            && parseInt(clientGrading.b.maximum) >= parseInt(clientGrading.aPlus.minimum)
            && parseInt(clientGrading.b.maximum) >= parseInt(clientGrading.aPlus.maximum))
                newErrors.b.maximum = errorLower
        // C
        if (parseInt(clientGrading.c.maximum) >= parseInt(clientGrading.b.minimum)
            && parseInt(clientGrading.c.maximum) >= parseInt(clientGrading.b.maximum) 
            && parseInt(clientGrading.c.maximum) >= parseInt(clientGrading.a.minimum) 
            && parseInt(clientGrading.c.maximum) >= parseInt(clientGrading.a.maximum) 
            && parseInt(clientGrading.c.maximum) >= parseInt(clientGrading.aPlus.minimum)
            && parseInt(clientGrading.c.maximum) >= parseInt(clientGrading.aPlus.maximum))
                newErrors.c.maximum = errorLower
        // E+
        if (parseInt(clientGrading.ePlus.maximum) >= parseInt(clientGrading.c.minimum)
            && parseInt(clientGrading.ePlus.maximum) >= parseInt(clientGrading.c.maximum)
            && parseInt(clientGrading.ePlus.maximum) >= parseInt(clientGrading.b.minimum)
            && parseInt(clientGrading.ePlus.maximum) >= parseInt(clientGrading.b.maximum) 
            && parseInt(clientGrading.ePlus.maximum) >= parseInt(clientGrading.a.minimum) 
            && parseInt(clientGrading.ePlus.maximum) >= parseInt(clientGrading.a.maximum) 
            && parseInt(clientGrading.ePlus.maximum) >= parseInt(clientGrading.aPlus.minimum)
            && parseInt(clientGrading.ePlus.maximum) >= parseInt(clientGrading.aPlus.maximum))
                newErrors.ePlus.maximum = errorLower

        // Minimum lower than maximum error
        //A+
        if (parseInt(clientGrading.aPlus.minimum) >= parseInt(clientGrading.aPlus.maximum))
            newErrors.aPlus.minimum = errorMin
        // A
        if (parseInt(clientGrading.a.minimum) >= parseInt(clientGrading.a.maximum))
            newErrors.aPlus.minimum = errorMin
        // B
        if (parseInt(clientGrading.b.minimum) >= parseInt(clientGrading.b.maximum))
            newErrors.aPlus.minimum = errorMin
        // C
        if (parseInt(clientGrading.c.minimum) >= parseInt(clientGrading.c.maximum))
            newErrors.aPlus.minimum = errorMin
        // E+
        if (parseInt(clientGrading.ePlus.minimum) >= parseInt(clientGrading.ePlus.maximum))
            newErrors.aPlus.minimum = errorMin
            
        // Minimum higer than higher grading brackets error
        // A
        if (parseInt(clientGrading.a.minimum) >= parseInt(clientGrading.aPlus.minimum)
            && parseInt(clientGrading.a.minimum) >= parseInt(clientGrading.aPlus.maximum))
                newErrors.a.minimum = errorLower
        // B
        if (parseInt(clientGrading.b.minimum) >= parseInt(clientGrading.a.minimum) 
            && parseInt(clientGrading.b.minimum) >= parseInt(clientGrading.a.maximum) 
            && parseInt(clientGrading.b.minimum) >= parseInt(clientGrading.aPlus.minimum)
            && parseInt(clientGrading.b.minimum) >= parseInt(clientGrading.aPlus.maximum))
                newErrors.b.minimum = errorLower
        // C
        if (parseInt(clientGrading.c.minimum) >= parseInt(clientGrading.b.minimum)
            && parseInt(clientGrading.c.minimum) >= parseInt(clientGrading.b.maximum) 
            && parseInt(clientGrading.c.minimum) >= parseInt(clientGrading.a.minimum) 
            && parseInt(clientGrading.c.minimum) >= parseInt(clientGrading.a.maximum) 
            && parseInt(clientGrading.c.minimum) >= parseInt(clientGrading.aPlus.minimum)
            && parseInt(clientGrading.c.minimum) >= parseInt(clientGrading.aPlus.maximum))
                newErrors.c.minimum = errorLower
        // E+
        if (parseInt(clientGrading.ePlus.minimum) >= parseInt(clientGrading.c.minimum)
            && parseInt(clientGrading.ePlus.minimum) >= parseInt(clientGrading.c.maximum)
            && parseInt(clientGrading.ePlus.minimum) >= parseInt(clientGrading.b.minimum)
            && parseInt(clientGrading.ePlus.minimum) >= parseInt(clientGrading.b.maximum) 
            && parseInt(clientGrading.ePlus.minimum) >= parseInt(clientGrading.a.minimum) 
            && parseInt(clientGrading.ePlus.minimum) >= parseInt(clientGrading.a.maximum) 
            && parseInt(clientGrading.ePlus.minimum) >= parseInt(clientGrading.aPlus.minimum)
            && parseInt(clientGrading.ePlus.minimum) >= parseInt(clientGrading.aPlus.maximum))
                newErrors.ePlus.minimum = errorLower


        // Minimum lower than lower grading brackets error
        // A 
        if (parseInt(clientGrading.a.minimum) <= parseInt(clientGrading.b.maximum) 
            && parseInt(clientGrading.a.minimum) <= parseInt(clientGrading.b.minimum) 
            && parseInt(clientGrading.a.minimum) <= parseInt(clientGrading.c.maximum) 
            && parseInt(clientGrading.a.minimum) <= parseInt(clientGrading.c.minimum) 
            && parseInt(clientGrading.a.minimum) <= parseInt(clientGrading.ePlus.maximum) 
            && parseInt(clientGrading.a.minimum) <= parseInt(clientGrading.ePlus.minimum))
                newErrors.a.minimum = errorHiger
        // B
        if (parseInt(clientGrading.b.minimum) <= parseInt(clientGrading.c.maximum) 
            && parseInt(clientGrading.b.minimum) <= parseInt(clientGrading.c.minimum) 
            && parseInt(clientGrading.b.minimum) <= parseInt(clientGrading.ePlus.maximum) 
            && parseInt(clientGrading.b.minimum) <= parseInt(clientGrading.ePlus.minimum))
                newErrors.b.minimum = errorHiger
        // C
        if (parseInt(clientGrading.c.minimum) <= parseInt(clientGrading.ePlus.maximum) 
            && parseInt(clientGrading.c.minimum) <= parseInt(clientGrading.ePlus.minimum))
                newErrors.c.minimum = errorHiger


        // No option is selected in average collection time error
        if (clientGrading.aPlus.averageCollectionTime === "")
            newErrors.aPlus.averageCollectionTime = errorDropdown
        if (clientGrading.a.averageCollectionTime === "")
            newErrors.a.averageCollectionTime = errorDropdown
        if (clientGrading.b.averageCollectionTime === "")
            newErrors.b.averageCollectionTime = errorDropdown
        if (clientGrading.c.averageCollectionTime === "")
            newErrors.c.averageCollectionTime = errorDropdown
        if (clientGrading.ePlus.averageCollectionTime === "")
            newErrors.ePlus.averageCollectionTime = errorDropdown

        // No entries on the numbering
        if(clientGrading.aPlus.maximum === 0)
            newErrors.a.maximum = errorNoNum
        if(clientGrading.aPlus.minimum === 0)
            newErrors.a.minimum = errorNoNum
        if(clientGrading.a.maximum === 0)
            newErrors.a.maximum = errorNoNum
        if(clientGrading.a.minimum === 0)
            newErrors.a.minimum = errorNoNum
        if(clientGrading.b.maximum === 0)
            newErrors.b.maximum = errorNoNum
        if(clientGrading.b.minimum === 0)
            newErrors.b.minimum = errorNoNum
        if(clientGrading.c.maximum === 0)
            newErrors.c.maximum = errorNoNum
        if(clientGrading.c.minimum === 0)
            newErrors.c.minimum = errorNoNum
        if(clientGrading.ePlus.maximum === 0)
            newErrors.ePlus.maximum = errorNoNum
        if(clientGrading.ePlus.minimum === 0)
            newErrors.ePlus.minimum = errorNoNum

        console.log(newErrors)
        return newErrors
    };

    const getErrorName = (error) => {
        switch(error) {
            case 0:
                return t('manage.gradingTable.error.Higher')
            case 1:
                return t('manage.gradingTable.error.Lower')
            case 2:
                return t('manage.gradingTable.error.Min')
            case 3:
                return t('manage.gradingTable.error.Dropdown')
            case 4:
                return t('manage.gradingTable.error.NoNum')
            default:
                return ""
        }
    }

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
                        aPlus: {
                            grade: 'A+',
                            maximum: parseInt(response.data.maximumGradeAPlus),
                            minimum: parseInt(response.data.minimumGradeAPlus),
                            averageCollectionTime: response.data.averageCollectionTimeGradeAPlus
                        },
                        a: {
                            grade: 'A',
                            maximum: parseInt(response.data.maximumGradeA),
                            minimum: parseInt(response.data.minimumGradeA),
                            averageCollectionTime: response.data.averageCollectionTimeGradeA
                        },
                        b: {
                            grade: 'B',
                            maximum: parseInt(response.data.maximumGradeB),
                            minimum: parseInt(response.data.minimumGradeB),
                            averageCollectionTime: response.data.averageCollectionTimeGradeB
                        },
                        c: {
                            grade: 'C',
                            maximum: parseInt(response.data.maximumGradeC),
                            minimum: parseInt(response.data.minimumGradeC),
                            averageCollectionTime: response.data.averageCollectionTimeGradeC
                        },
                        ePlus: {
                            grade: 'E+',
                            maximum: parseInt(response.data.maximumGradeEPlus),
                            minimum: parseInt(response.data.minimumGradeEPlus),
                            averageCollectionTime: response.data.averageCollectionTimeGradeEPlus
                        },
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
            maximumGradeAPlus: clientGrading.aPlus.maximum,
            minimumGradeAPlus: clientGrading.aPlus.minimum,
            averageCollectionTimeGradeAPlus: clientGrading.aPlus.averageCollectionTime,
            maximumGradeA: clientGrading.a.maximum,
            minimumGradeA: clientGrading.a.minimum,
            averageCollectionTimeGradeA: clientGrading.a.averageCollectionTime,
            maximumGradeB: clientGrading.b.maximum,
            minimumGradeB: clientGrading.b.minimum,
            averageCollectionTimeGradeB: clientGrading.b.averageCollectionTime,
            maximumGradeC: clientGrading.c.maximum,
            minimumGradeC: clientGrading.c.minimum,
            averageCollectionTimeGradeC: clientGrading.c.averageCollectionTime,
            maximumGradeEPlus: clientGrading.ePlus.maximum,
            minimumGradeEPlus: clientGrading.ePlus.minimum,
            averageCollectionTimeGradeEPlus: clientGrading.ePlus.averageCollectionTime,
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
            <div className='d-block'>
                <div className="justify-content-center d-flex">
                    <div className='container-clientGradingBrackets'>
                        <div className='card shadow my-3 mx-3 px-3 py2'>
                            <h3 className="text-center">{t('manage.gradingTable.Title')}</h3>
                            <Form.Group className="my-2">
                                
                                <Row className="mb-2">
                                    <Col xs={1}/>
                                    <Col xs={3} className='tableHeader'>
                                        <Form.Label>{window.innerWidth <= 400 ? "Min" : "Minimum"}</Form.Label>
                                    </Col>
                                    <Col xs={3} className='tableHeader'>
                                        <Form.Label>{window.innerWidth <= 400 ? "Max" : "Maximum"}</Form.Label>
                                    </Col>
                                    <Col xs={5} className='tableHeader'>
                                        <Form.Label className="text-center">{t('manage.gradingTable.AverageTitle')}</Form.Label>
                                    </Col>
                                </Row>

                                {Object.keys(clientGrading).map((key) => {
                                    counter++
                                    if(counter > 5)
                                        counter = 0;
                                    return (
                                        <Row className="mb-4">
                                            <Col xs={1} className="manageColTitleForm">
                                                <Form.Label className="inputTitle">{clientGrading[key].grade}</Form.Label>
                                            </Col>

                                            <Col xs={3} className="manageColForm">
                                                <Form.Control required
                                                        id={'minimumGrade' + key.grade}
                                                        size="md"
                                                        type="number"
                                                        placeholder={t('manage.gradingTable.MinPlaceholder')}
                                                        onChange={(g) => setField('minimum', g.target.value, key)}
                                                        value={clientGrading[key].minimum}
                                                        isInvalid={!!errors[key].minimum}>
                                                </Form.Control>

                                                <Form.Control.Feedback type="invalid">
                                                    {getErrorName(errors[key].minimum)}
                                                </Form.Control.Feedback>
                                            </Col>

                                            <Col xs={3} className="manageColForm">
                                                <Form.Control required
                                                        id={'maximumGrade' + clientGrading[key].grade}
                                                        className="manageMaximumGrade"
                                                        size="md"
                                                        type="number"
                                                        placeholder={t('manage.gradingTable.MaxPlaceholder')}
                                                        onChange={(g) => setField('maximum', g.target.value, key)}
                                                        value={clientGrading[key].maximum}
                                                        isInvalid={!!errors[key].maximum}>
                                                </Form.Control>

                                                <Form.Control.Feedback type="invalid">
                                                    {getErrorName(errors[key].maximum)}
                                                </Form.Control.Feedback>
                                            </Col>

                                            <Col xs={5} className="manageColForm">
                                                <Form.Select required
                                                    id={'averageCollectionTime' + clientGrading[key].grade}
                                                    className="manageAverageCollectionTime"
                                                    size="md"
                                                    aria-label="Average collection time"
                                                    onChange={(g) => setField('averageCollectionTime', g.target.value, key)}
                                                    value={clientGrading[key].averageCollectionTime}
                                                    isInvalid={!!errors[key].averageCollectionTime}>
                                                        <option key={()=>{return counter.toString()+"1"}} value="">{t('manage.gradingTable.averagesSelect.Default')}</option>
                                                        <option key={()=>{return counter.toString()+"2"}} value="<30">{t('manage.gradingTable.averagesSelect.Less30')}</option>
                                                        <option key={()=>{return counter.toString()+"3"}} value="30-60">{t('manage.gradingTable.averagesSelect.Between30And60')}</option>
                                                        <option key={()=>{return counter.toString()+"4"}} value="60-90">{t('manage.gradingTable.averagesSelect.Between60And90')}</option>
                                                        <option key={()=>{return counter.toString()+"5"}} value=">90">{t('manage.gradingTable.averagesSelect.Over90')}</option>
                                                </Form.Select>
                                                <Form.Control.Feedback type="invalid">
                                                    {getErrorName(errors[key].averageCollectionTime)}
                                                </Form.Control.Feedback>
                                            </Col>
                                        </Row>
                                    )
                                })}

                                <Row className='mt-2'>
                                    <Col md={12}>
                                        <Button
                                            id='saveGradingBracketsButton'
                                            className='my-2 w-100 d-flex justify-content-center'
                                            onClick={handleSaveGradingBrackets}
                                            variant='primary'>
                                            {t('manage.gradingTable.Button')}
                                        </Button>
                                    </Col>
                                </Row>
                            </Form.Group>
                        </div>
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