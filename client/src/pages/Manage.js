import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button, Col, Row } from 'react-bootstrap'
import Cookies from 'universal-cookie'
import Axios from 'axios';
import { useTranslation } from 'react-i18next'
import ConfirmationPopup from '../components/ConfirmationPopup';
import NavB from '../components/NavB'
import { Table } from 'react-bootstrap'
import '../styles/managePage.css'


const Manage = () => {
    let navigate = useNavigate()
    const cookies = new Cookies()
    const { t } = useTranslation()
    
    const [errors, setErrors] = useState({ aPlus: {}, a: {}, b: {}, c: {}, ePlus: {} })
    const [clientGradingSaved, setClientGradingSaved] = useState(true);
    const [minTitle, setMinTitle] = useState('Minimum');
    const [maxTitle, setMaxTitle] = useState('Maximum');
    const [confirmSaveGradingActivated, setConfirmSaveGradingActivated] = useState(false);
    const [clientsList, setClientsList] = useState([{nameId: 0, name: "", country: "", grading: ""}])
    const [isSorted, setIsSorted] = useState()

    const [clientGrading, setClientGrading] = useState({
        aPlus: {
            grade: 'A+',
            maximum: 0,
            minimum: 0,
            averageCollectionTime: 0
        },
        a: {
            grade: 'A',
            maximum: 0,
            minimum: 0,
            averageCollectionTime: 0
        },
        b: {
            grade: 'B',
            maximum: 0,
            minimum: 0,
            averageCollectionTime: 0
        },
        c: {
            grade: 'C',
            maximum: 0,
            minimum: 0,
            averageCollectionTime: 0
        },
        ePlus: {
            grade: 'E+',
            maximum: 0,
            minimum: 0,
            averageCollectionTime: 0
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
        const errorHigher = 0
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
                newErrors.aPlus.maximum = errorHigher
        // A
        if (parseInt(clientGrading.a.maximum) <= parseInt(clientGrading.b.maximum) 
            && parseInt(clientGrading.a.maximum) <= parseInt(clientGrading.b.minimum) 
            && parseInt(clientGrading.a.maximum) <= parseInt(clientGrading.c.maximum) 
            && parseInt(clientGrading.a.maximum) <= parseInt(clientGrading.c.minimum) 
            && parseInt(clientGrading.a.maximum) <= parseInt(clientGrading.ePlus.maximum) 
            && parseInt(clientGrading.a.maximum) <= parseInt(clientGrading.ePlus.minimum))
                newErrors.a.maximum = errorHigher
        // B
        if (parseInt(clientGrading.b.maximum) <= parseInt(clientGrading.c.maximum) 
            && parseInt(clientGrading.b.maximum) <= parseInt(clientGrading.c.minimum) 
            && parseInt(clientGrading.b.maximum) <= parseInt(clientGrading.ePlus.maximum) 
            && parseInt(clientGrading.b.maximum) <= parseInt(clientGrading.ePlus.minimum))
                newErrors.b.maximum = errorHigher
        // C   
        if (parseInt(clientGrading.c.maximum) <= parseInt(clientGrading.ePlus.maximum) 
            && parseInt(clientGrading.c.maximum) <= parseInt(clientGrading.ePlus.minimum))
                newErrors.c.maximum = errorHigher

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
                newErrors.a.minimum = errorHigher
        // B
        if (parseInt(clientGrading.b.minimum) <= parseInt(clientGrading.c.maximum) 
            && parseInt(clientGrading.b.minimum) <= parseInt(clientGrading.c.minimum) 
            && parseInt(clientGrading.b.minimum) <= parseInt(clientGrading.ePlus.maximum) 
            && parseInt(clientGrading.b.minimum) <= parseInt(clientGrading.ePlus.minimum))
                newErrors.b.minimum = errorHigher
        // C
        if (parseInt(clientGrading.c.minimum) <= parseInt(clientGrading.ePlus.maximum) 
            && parseInt(clientGrading.c.minimum) <= parseInt(clientGrading.ePlus.minimum))
                newErrors.c.minimum = errorHigher


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
        if(clientGrading.a.maximum === 0)
            newErrors.a.maximum = errorNoNum
        if(clientGrading.b.maximum === 0)
            newErrors.b.maximum = errorNoNum
        if(clientGrading.c.maximum === 0)
            newErrors.c.maximum = errorNoNum
        if(clientGrading.ePlus.maximum === 0)
            newErrors.ePlus.maximum = errorNoNum

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
        event.preventDefault();
        event.stopPropagation();

        const newErrors = findGradingCriteriaErrors();

        let errorCount = 0;
        Object.keys(newErrors).map((k) => {
            if(newErrors[k].minimum !== undefined 
            || newErrors[k].maximum !== undefined 
            || newErrors[k].averageCollectionTime !== undefined) 
                errorCount++
        })
        if(errorCount > 0) return

        setConfirmSaveGradingActivated(true);
    }

    const sortGrading = () => {
        setClientsList(clientsList.sort((a, b) => {
            
            a = a.grading;
            b = b.grading;

            var weight = { '+': -1 },
                aa = a.split(/(?=[+])/),
                bb = b.split(/(?=[+])/);

            if (!isSorted) {
                setIsSorted(true)
                return aa[0][0].localeCompare(bb[0][0])
                    || bb[0].localeCompare(aa[0])
                    || (weight[aa[1]] || 0) - (weight[bb[1]] || 0);
            }
            else {
                setIsSorted(false)
                return bb[0][0].localeCompare(aa[0][0])
                || aa[0].localeCompare(bb[0])
                || (weight[bb[1]] || 0) - (weight[aa[1]] || 0);
            }
        }))
    }

    const clientTable = () => {

        Axios.defaults.withCredentials = true;

        let header = {
            'authorization': "Bearer " + cookies.get("accessToken"),
        }

        Axios.get(`${process.env.REACT_APP_API}/manage/clients`, { headers: header })
            .then((response) => {
                // Temp function to fix grade E issue in front end when sorting
                let data = []
                for(let i = 0; i < response.data.length; i++) {
                    if(response.data[i].grading === 'E')
                    response.data[i].grading = "E+"
                    
                    data.push(response.data[i])
                }
                setClientsList(data);
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

        

    const getCurrentClientGradingInformations = async () => { 

        Axios.defaults.withCredentials = true;

        let header = {
            'authorization': "Bearer " + cookies.get("accessToken"),
        }

        Axios.get(`${process.env.REACT_APP_API}/manage/getClientGrading`, { headers: header })
            .then((response) => {
                if (response.status === 200 || response.status === 201) {


                    let setValue = {
                        aPlus: {
                            grade: 'A+',
                            maximum: parseInt(response.data.maximumGradeAPlus),
                            minimum: parseInt(response.data.minimumGradeAPlus),
                            averageCollectionTime: parseInt(response.data.averageCollectionTimeGradeAPlus)
                        },
                        a: {
                            grade: 'A',
                            maximum: parseInt(response.data.maximumGradeA),
                            minimum: parseInt(response.data.minimumGradeA),
                            averageCollectionTime: parseInt(response.data.averageCollectionTimeGradeA)
                        },
                        b: {
                            grade: 'B',
                            maximum: parseInt(response.data.maximumGradeB),
                            minimum: parseInt(response.data.minimumGradeB),
                            averageCollectionTime: parseInt(response.data.averageCollectionTimeGradeB)
                        },
                        c: {
                            grade: 'C',
                            maximum: parseInt(response.data.maximumGradeC),
                            minimum: parseInt(response.data.minimumGradeC),
                            averageCollectionTime: parseInt(response.data.averageCollectionTimeGradeC)
                        },
                        ePlus: {
                            grade: 'E+',
                            maximum: parseInt(response.data.maximumGradeEPlus),
                            minimum: parseInt(response.data.minimumGradeEPlus),
                            averageCollectionTime: parseInt(response.data.averageCollectionTimeGradeEPlus)
                        },
                    }
                    
                    setClientGrading(setValue);
                    return;
                }
                alert("The response from the B&C Engine was invalid.");
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
                    alert("Client grading has been modified successfully!");
                    sendNewClientGradingBracketsInCompanyDatabase(data);
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

    const changeMaxMinTitle = () => {
        if (window.innerWidth <= 400) {
            setMaxTitle('Max')
            setMinTitle('Min')
        }
        else if(window.innerWidth > 400) {
            setMaxTitle('Maximum')
            setMinTitle('Minimum')
        }
    }

    const sendNewClientGradingBracketsInCompanyDatabase = async (clientGradingGroup) => {
        let header = {
            'authorization': "Bearer " + cookies.get("accessToken"),
        }

        Axios.put(`${process.env.REACT_APP_API}/manage/modifyClientGradingInDatabase`, clientGradingGroup, { headers: header })
            .then((response) => {
                if (response.status === 200 || response.status === 201) {
                    alert("New client grading sent to the company database!");
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
    }



    const getArrow = (sorted) => {
        if (sorted === undefined) return '↑↓'
        if (sorted) return '↑';
        return '↓';
    }

    useEffect(() => {
        changeMaxMinTitle();
        window.addEventListener("resize", changeMaxMinTitle);

        if (cookies.get("accessToken") === undefined) {
            navigate("/login")
        }
        else if (cookies.get("role") !== "admin") {
            navigate("/dashboard")
        }

        getCurrentClientGradingInformations();
        clientTable();
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
                                            <Form.Label>{minTitle} ($)</Form.Label>
                                        </Col>
                                        <Col xs={3} className='tableHeader'>
                                            <Form.Label>{maxTitle} ($)</Form.Label>
                                        </Col>
                                        <Col xs={5} className='tableHeader'>
                                            <Form.Label className="text-center">{t('manage.gradingTable.AverageTitle')}</Form.Label>
                                        </Col>
                                    </Row>

                                    {Object.keys(clientGrading).map((k) => {
                                        return (
                                            <Row key={clientGrading[k].grade} className="mb-4">
                                                <Col xs={1} className="manageColTitleForm">
                                                    <Form.Label className="inputTitle">{clientGrading[k].grade}</Form.Label>
                                                </Col>

                                                <Col xs={3} className="manageColForm">
                                                    <Form.Control required
                                                            id={'minimumGrade' + clientGrading[k].grade}
                                                            key={'minimumGrade' + clientGrading[k].grade}
                                                            size="md"
                                                            type="number"
                                                            placeholder={t('manage.gradingTable.MinPlaceholder')}
                                                            onChange={(g) => setField('minimum', g.target.value, k)}
                                                            value={clientGrading[k].minimum}
                                                            isInvalid={!!errors[k].minimum}>
                                                    </Form.Control>

                                                    <Form.Control.Feedback type="invalid">
                                                        {getErrorName(errors[k].minimum)}
                                                    </Form.Control.Feedback>
                                                </Col>

                                                <Col xs={3} className="manageColForm">
                                                    <Form.Control required
                                                            id={'maximumGrade' + clientGrading[k].grade}
                                                            key={'maximumGrade' + clientGrading[k].grade}
                                                            className="manageMaximumGrade"
                                                            size="md"
                                                            type="number"
                                                            placeholder={t('manage.gradingTable.MaxPlaceholder')}
                                                            onChange={(g) => setField('maximum', g.target.value, k)}
                                                            value={clientGrading[k].maximum}
                                                            isInvalid={!!errors[k].maximum}>
                                                    </Form.Control>

                                                    <Form.Control.Feedback type="invalid">
                                                        {getErrorName(errors[k].maximum)}
                                                    </Form.Control.Feedback>
                                                </Col>

                                                <Col xs={5} className="manageColForm">
                                                    <Form.Select required
                                                        id={'averageCollectionTime' + clientGrading[k].grade}
                                                        key={'averageCollectionTime' + clientGrading[k].grade}
                                                        className="manageAverageCollectionTime"
                                                        size="md"
                                                        aria-label="Average collection time"
                                                        onChange={(g) => setField('averageCollectionTime', g.target.value, k)}
                                                        value={clientGrading[k].averageCollectionTime}
                                                        isInvalid={!!errors[k].averageCollectionTime}>
                                                            <option key={clientGrading[k].grade + "-1"} id={clientGrading[k].grade + "-1"} value={0}>{t('manage.gradingTable.averagesSelect.Default')}</option>
                                                            <option key={clientGrading[k].grade + "-2"} id={clientGrading[k].grade + "-2"} value={30}>{t('manage.gradingTable.averagesSelect.Less30')}</option>
                                                            <option key={clientGrading[k].grade + "-3"} id={clientGrading[k].grade + "-3"} value={60}>{t('manage.gradingTable.averagesSelect.Between30And60')}</option>
                                                            <option key={clientGrading[k].grade + "-4"} id={clientGrading[k].grade + "-4"} value={90}>{t('manage.gradingTable.averagesSelect.Between60And90')}</option>
                                                            <option key={clientGrading[k].grade + "-5"} id={clientGrading[k].grade + "-5"} value={1}>{t('manage.gradingTable.averagesSelect.Over90')}</option>
                                                    </Form.Select>
                                                    <Form.Control.Feedback type="invalid">
                                                        {getErrorName(errors[k].averageCollectionTime)}
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
                    <div className='container-clientTable'>
                        <div className="card shadow my-3 mx-3 uTable">
                            <h4 className="text-center bg-light">{t('manage.clientTable.Title')}</h4>
                            <Table responsive="xl" hover>
                                <thead className='bg-light'>
                                    <tr key="0">
                                        <th className='nameColumnTable '>{t('manage.clientTable.Name')}</th>
                                        <th className='countryColumnTable text-center'>{t('manage.clientTable.Country')}</th>
                                        <th className="text-center">{t('manage.clientTable.ClientGrading')} <button className='gradingSortBTN' onClick={sortGrading}>{getArrow(isSorted)}</button></th>
                                        <th className='text-center'>{t('manage.clientTable.Status')}</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {clientsList.map((c, i) => {
                                        return (
                                            <tr key={i}>
                                                <td className='nameColumnTable'>{c.name}</td>
                                                <td className='countryColumnTable text-center'>{c.country}</td>
                                                <td className='text-center'>{c.grading}</td>
                                                <td className='text-center'>Active</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
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
        </div>
    )
}

export default Manage