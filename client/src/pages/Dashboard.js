import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Form, Table, InputGroup, FormControl, FormLabel, Button, ButtonGroup, OverlayTrigger, DropdownButton, Dropdown, Tooltip as ToolTipBootstrap, FormCheck, Col, Row } from 'react-bootstrap';
import ConfirmationPopup from '../components/ConfirmationPopup';
import { useTranslation } from 'react-i18next';
import Axios from 'axios';
import Cookies from 'universal-cookie';
import NavB from '../components/NavB'
import '../styles/clientTable.css'
import '../styles/dashboardPage.css'
import { Oval } from 'react-loader-spinner'
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard = () => {
    let navigate = useNavigate();
    const cookies = new Cookies();
    const { t } = useTranslation();

    // variables used for internationalization
    const chartReportNamePlaceHolder = t('dashboard.criteria.NamePlaceHolder');
    const loadChartButtonText = t('dashboard.criteria.LoadChartButton');
    const saveChartButtonText = t('dashboard.criteria.SaveChartButton');
    const chartTitle = t('dashboard.chart.Title');
    const chartXLabel = t('dashboard.chart.XAxisLabel');
    const chartYLabel = t('dashboard.chart.YAxisLabel');
    const months = [
        t('dashboard.chart.months.Jan'),
        t('dashboard.chart.months.Feb'),
        t('dashboard.chart.months.Mar'),
        t('dashboard.chart.months.Apr'),
        t('dashboard.chart.months.May'),
        t('dashboard.chart.months.Jun'),
        t('dashboard.chart.months.Jul'),
        t('dashboard.chart.months.Aug'),
        t('dashboard.chart.months.Sep'),
        t('dashboard.chart.months.Oct'),
        t('dashboard.chart.months.Nov'),
        t('dashboard.chart.months.Dec')
    ];
    const chartFallbackLegendLabel = t('dashboard.chart.FallbackLegendLabel');

    let colors = [
        'rgb(255, 192, 159)',
        'rgb(191, 175, 192)',
        'rgb(255, 238, 147)',
        'rgb(160, 206, 217)',
        'rgb(173, 247, 182)'
    ];

    let compareColors = [
        'rgb(255, 139, 77)',
        'rgb(127, 101, 129)',
        'rgb(255, 224, 51)',
        'rgb(65, 144, 164)',
        'rgb(46, 234, 68)'
    ]

    const fallbackChartData = [
        {
            label: chartFallbackLegendLabel,
            data: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
            backgroundColor: 'rgb(127, 128, 203)'
        }
    ];

    const [chartData, setChartData] = useState(fallbackChartData);
    const [chartLoading, setChartLoading] = useState(false);
    const [confirmSaveActivated, setConfirmSaveActivated] = useState(false);
    const [chartSaved, setChartSaved] = useState(true);
    const [navClicked, setNavClicked] = useState(false);
    const [pageToNavigateTo, setPageToNavigateTo] = useState("/reports");

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const earliestYear = 2009;
    const [authorized, setAuthorized] = useState(false);
    const [clientNameCountry, setClientNameCountry] = useState([{ name: "", country: "", clientgrading: "" }]);


    // Criteria
    const [employeeSelect, setEmployeeSelect] = useState([]);
    const [compareEmployeeChecked, setCompareEmployeeChecked] = useState(false);

    const [criteria, setCriteria] = useState({
        name: "",
        startYear: currentYear - 2,
        startMonth: 0,
        endYear: currentMonth === 0 ? currentYear - 1 : currentYear,
        endMonth: currentMonth === 0 ? 11 : currentMonth - 1,
        employee1: {
            id: -1,
            name: "All"
        },
        employee2: {
            id: compareEmployeeChecked ? -1 : null,
            name: compareEmployeeChecked ? "All" : null
        },
        country: {
            id: -1,
            name: "All"
        },
        clientType: "Any",
        ageOfAccount: "All",
        accountType: 'Receivable',
    });
    const [errors, setErrors] = useState({});

    const [yearList, setYearList] = useState([]);
    const [monthList, setMonthList] = useState([]);

    const [countries, setCountries] = useState([{ countryCode: "", countryLabel: "" }]);

    const setField = (field, value) => {
        if (field === 'employee1' && parseInt(value.id) === -1) {
            setCompareEmployeeChecked(false);
            setCriteria({
                ...criteria,
                [field]: value,
                'employee2': { id: null, name: null }
            });
        }
        else {
            if (field === 'employee2') {
                setCompareEmployeeChecked(!compareEmployeeChecked);
            }

            setCriteria({
                ...criteria,
                [field]: value
            });
        }

        if (!!errors[field]) {
            setErrors({
                ...errors,
                [field]: null
            });
        }

        setChartSaved(false);
    };

    const createEmployeeCriteria = async () => {
        let listEmployee = [];

        let header = {
            'authorization': "Bearer " + cookies.get("accessToken"),
        }

        await Axios.get(`${process.env.REACT_APP_API}/invoice/employees`, { headers: header })
            .then((res) => {
                if (res.status === 403 && res.status === 401) {
                    setAuthorized(false);
                    return;
                }
                setAuthorized(true);

                for (let i = 0; i < res.data.length; i++) {
                    listEmployee.push({
                        name: res.data[i].name,
                        id: res.data[i].nameID
                    });
                }
                setEmployeeSelect(listEmployee);
            })
            .catch((error) => {
                if (error.response) {
                    if (error.response.status === 403 || error.response.status === 401) {
                        alert(error.response.body);
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

    //to display the list of all countries in the select box
    const countrySelectBox = async () => {
        let countryList = [];

        let header = {
            'authorization': "Bearer " + cookies.get("accessToken"),
        }

        await Axios.get(`${process.env.REACT_APP_API}/invoice/getCountries`, { headers: header })
            .then(async (res) => {
                if (res.status === 403 && res.status === 401) {
                    setAuthorized(false);
                    return;
                }
                setAuthorized(true);

                for (let i = 0; i < res.data.length; i++) {
                    countryList.push({
                        countryCode: res.data[i].countryCode,
                        countryLabel: res.data[i].countryLabel
                    });
                }
                setCountries(countryList);
            })
            .catch((error) => {
                if (error.response) {
                    if (error.response.status === 403 || error.response.status === 401) {
                        alert(error.response.body);
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

    const chart = async (compare = false) => {
        setChartLoading(true);
        setChartData(fallbackChartData);
        localStorage.setItem("dash_previous_criteria", JSON.stringify(criteria));
        let compareData = [];
        let arrayLength = 1;
        if (compare) arrayLength = 2;
        for (let c = 0; c < arrayLength; c++) {
            let clientInfoList = [];

            let header = {
                'authorization': "Bearer " + cookies.get("accessToken"),
            }

            let startDate = new Date(criteria.startYear, criteria.startMonth, 1).toISOString().split("T")[0];
            let endDate = new Date(criteria.endYear, criteria.endMonth, 1).toISOString().split("T")[0];

            let param = {
                employeeId: parseInt(criteria.employee1.id) === -1 ? undefined : criteria.employee1.id,
                clientType: criteria.clientType === "Any" ? undefined : criteria.clientType,
                countryCode: parseInt(criteria.country.id) === -1 ? undefined : criteria.country.id,
                countryLabel: parseInt(criteria.country.id) === -1 ? undefined : criteria.country.name
            };

            if (c === 1) {
                param = {
                    ...param,
                    employeeId: undefined
                };
            }

            await Axios.get(`${process.env.REACT_APP_API}/invoice/defaultChartAndTable/${startDate}/${endDate}`, { params: param, headers: header })
                .then((res) => {
                    if (res.status === 403 && res.status === 401) {
                        setAuthorized(false);
                        return;
                    }
                    setAuthorized(true);

                    let datasets = [];
                    let groupedChartData = res.data[0].chart;

                    let colorCounter = 0;

                    for (let i = 0; i < Object.keys(groupedChartData).length; i++) {
                        let data = [];
                        const dataGroup = groupedChartData[Object.keys(groupedChartData)[i]];
                        let startMonth = parseInt(dataGroup[0].month.toString().substring(4)) - 1;
                        let endMonth = parseInt(dataGroup[dataGroup.length - 1].month.toString().substring(4)) - 1;
                        let counter = 0;

                        for (let j = 0; j < 12; j++) {
                            if (j >= startMonth && j <= endMonth) {
                                data.push(parseFloat(dataGroup[counter].average));
                                counter++;
                            }
                            else {
                                data.push(0);
                            }
                        }

                        let datasetLabel = groupedChartData[Object.keys(groupedChartData)[i]][0]['group'];
                        let colorBG = colors[colorCounter];

                        if (compare && c === 0) {
                            datasetLabel = groupedChartData[Object.keys(groupedChartData)[i]][0]['group'].toString().concat(" - emp");
                            colorBG = compareColors[colorCounter]
                        }

                        datasets.push({
                            label: datasetLabel,
                            data: data,
                            backgroundColor: colorBG
                        });

                        colorCounter++;
                        if (colorCounter === colors.length - 1) colorCounter = 0;
                    }

                    for (let i = 0; i < res.data[0].table.length; i++) {
                        clientInfoList.push({
                            name: res.data[0].table[i].name,
                            country: res.data[0].table[i].country,
                            clientgrading: res.data[0].table[i].grading
                        });
                    }

                    if (compare && c === 0) {
                        compareData = datasets;
                    }
                    else if (compare && c === 1) {
                        for (let d = 0; d < compareData.length; d++) {
                            datasets.push(compareData[d]);
                        }

                        setChartData(datasets);
                        setChartLoading(false);
                    }
                    else if (!compare) {
                        setChartData(datasets);
                        setChartLoading(false);
                    }

                    localStorage.setItem("dash_previous_chart_data", JSON.stringify(datasets));

                    setClientNameCountry(clientInfoList);
                })
                .catch((error) => {
                    setChartLoading(false);

                    if (error.response) {
                        if (error.response.status === 403 || error.response.status === 401) {
                            alert("You are not authorized to perform this action.");
                        }
                        else {
                            alert("Malfunction in the B&C Engine...");
                        }
                    }
                    else if (error.request) {
                        alert("Could not reach b&C Engine...");
                    }
                });
            /*eslint no-loop-func: 0*/
        }
    }

    const initCriteria = async () => {
        // init time frame selections
        let yearList = [];
        for (let i = earliestYear; i <= currentYear; i++) {
            yearList.push(i);
        }
        setYearList(yearList);
        setMonthList(months);

        countrySelectBox();

        createEmployeeCriteria();
    };

    const findCriteriaErrors = () => {
        const { name, startYear, startMonth, endYear, endMonth } = criteria;
        let newErrors = {};

        // name errors
        if (name.length === 0)
            newErrors.name = t("error.Empty");

        // endYear errors
        if (parseInt(endYear) < parseInt(startYear))
            newErrors.endYear = t("dashboard.criteria.EndYearExceedError");

        // endMonth errors
        if (parseInt(endMonth) < parseInt(startMonth) && parseInt(startYear) === parseInt(endYear))
            newErrors.endMonth = t("dashboard.criteria.EndMonthExceedError");

        if (parseInt(endMonth) > parseInt(currentMonth) && parseInt(endYear) === parseInt(currentYear.toString()))
            newErrors.endMonth = t("dashboard.criteria.EndMonthExceedCurrentError");

        // startMonth errors
        if (startMonth > currentMonth && startYear === currentYear.toString())
            newErrors.startMonth = t("dashboard.criteria.StartMonthExceedCurrentError");

        return newErrors;
    };

    const handleSaveChartReport = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        const newErrors = findCriteriaErrors();

        setErrors(newErrors);
        if (Object.keys(newErrors).length !== 0) return;

        const previouslyLoadedCriteriaStr = localStorage.getItem('dash_previous_criteria');
        let previouslyLoadedCriteria = JSON.parse(previouslyLoadedCriteriaStr);
        delete previouslyLoadedCriteria['name'];
        let criteriaWithoutName = Object.assign({}, criteria);
        delete criteriaWithoutName['name'];
        if (!chartSaved && JSON.stringify(previouslyLoadedCriteria) !== JSON.stringify(criteriaWithoutName)) {
            alert("Please load the chart by clicking on the 'Load Chart' button before saving it.")
            return;
        }

        setConfirmSaveActivated(true);
    }

    const onSaveConfirmClick = async () => {
        if (!chartLoading) {

            let header = {
                'authorization': "Bearer " + cookies.get("accessToken"),
            }

            let data = {
                chartReport: {
                    name: criteria.name,
                    startDate: new Date(criteria.startYear, criteria.startMonth, 1),
                    endDate: new Date(criteria.endYear, criteria.endMonth, 1),
                    employee1Id: criteria.employee1.id,
                    employee1Name: criteria.employee1.name,
                    employee2Id: compareEmployeeChecked ? -1 : null,
                    employee2Name: compareEmployeeChecked ? "All" : null,
                    countryId: criteria.country.id,
                    country: criteria.country.name,
                    clientType: criteria.clientType,
                    ageOfAccount: criteria.ageOfAccount,
                    accountType: criteria.accountType,
                    user_user_id: cookies.get("userId")
                },
                chartReportData: chartData
            }

            Axios.post(`${process.env.REACT_APP_API}/reports/chartReport`, data, { headers: header })
                .then((response) => {
                    if (response.status === 200 || response.status === 201) {
                        setChartSaved(true);
                        alert("Chart Report has been saved successfully!");
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
                        // The request was made but no response was received
                        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                        // http.ClientRequest in node.js
                        alert("Could not reach the B&C Engine.");
                    }
                });
            setConfirmSaveActivated(false);
        }
    }

    const loadChartData = async () => {
        if (!chartLoading) {
            const newErrors = findCriteriaErrors();

            if (Object.keys(newErrors).length !== 0) {
                if (!(Object.keys(newErrors).length === 1 && Object.keys(newErrors)[0].toString() === 'name')) {
                    delete newErrors['name'];
                    setErrors(newErrors);
                    return;
                }
            }

            await chart(compareEmployeeChecked);
        }
    };


    // handle clicks to other pages when unsaved work on Chart Report
    const handleNavClick = async (whereTo) => {
        setPageToNavigateTo("/" + whereTo.split("/").at(-1));
        if (chartSaved) {
            navigate("/" + whereTo.split("/").at(-1))
        }
        setNavClicked(true)
    }

    useEffect(() => {
        if (cookies.get("accessToken") === undefined) {
            navigate("/login");
        }

        initCriteria();
        chart();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <div>
            <NavB page="dashboard"
                handleNavClick={handleNavClick} />
            <div className='mainContainer mainDiv'>
                <div className="justify-content-center main">
                    <div className="container-criteria">
                        <div className="card shadow my-3 mx-3 px-3 py-2">
                            <h3 className="text-center">{t('dashboard.criteria.Title')}</h3>

                            <InputGroup className="my-2" >
                                <FormControl
                                    id='chartName'
                                    className="my-1"
                                    placeholder={chartReportNamePlaceHolder}
                                    aria-label="Username"
                                    aria-describedby="basic-addon1"
                                    onChange={(e) => setField('name', e.target.value)}
                                    value={criteria.name}
                                    isInvalid={!!errors.name}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.name}
                                </Form.Control.Feedback>
                            </InputGroup>

                            <Form.Group className="my-2" controlId="floatingModifyStartMonth">
                                <Form.Label>{t('dashboard.criteria.StartDateLabel')}</Form.Label>
                                <Row>
                                    <Col sm={6} md={6}>
                                        <Form.Select required
                                            id='startYearSelect'
                                            size="sm"
                                            aria-label="Default select example"
                                            onChange={(e) => setField('startYear', e.target.value)}
                                            value={criteria.startYear}
                                            isInvalid={!!errors.startYear}>

                                            {yearList.map((y, i) => {
                                                return (
                                                    <option key={i} value={y}>{y}</option>
                                                );
                                            })}

                                        </Form.Select>

                                        <Form.Control.Feedback type="invalid">
                                            {errors.startYear}
                                        </Form.Control.Feedback>
                                    </Col>
                                    <Col sm={6} md={6}>
                                        <Form.Select required
                                            id='startMonthSelect'
                                            size="sm"
                                            aria-label="Default select example"
                                            onChange={(e) => setField('startMonth', e.target.value)}
                                            value={criteria.startMonth}
                                            isInvalid={!!errors.startMonth}>

                                            {monthList.map((m, i) => {
                                                return (<option key={i} value={i}>{m}</option>);
                                            })}

                                        </Form.Select>

                                        <Form.Control.Feedback type="invalid">
                                            {errors.startMonth}
                                        </Form.Control.Feedback>
                                    </Col>
                                </Row>
                            </Form.Group>

                            <Form.Group className="my-2" controlId="floatingModifyEndMonth">
                                <Form.Label>{t('dashboard.criteria.EndDateLabel')}</Form.Label>
                                <Row>
                                    <Col sm={6} md={6}>
                                        <Form.Select required
                                            id='endYearSelect'
                                            size="sm"
                                            aria-label="Default select example"
                                            onChange={(e) => setField('endYear', e.target.value)}
                                            value={criteria.endYear}
                                            isInvalid={!!errors.endYear}>

                                            {yearList.map((y, i) => {
                                                return (
                                                    <option key={i} value={y}>{y}</option>
                                                );
                                            })}
                                        </Form.Select>

                                        <Form.Control.Feedback type="invalid">
                                            {errors.endYear}
                                        </Form.Control.Feedback>
                                    </Col>
                                    <Col sm={6} md={6}>
                                        <Form.Select required
                                            id='endMonthSelect'
                                            size="sm"
                                            aria-label="Default select example"
                                            onChange={(e) => setField('endMonth', e.target.value)}
                                            value={criteria.endMonth}
                                            isInvalid={!!errors.endMonth}>

                                            {monthList.map((m, i) => {
                                                return (<option key={i} value={i}>{m}</option>);
                                            })}
                                        </Form.Select>

                                        <Form.Control.Feedback type="invalid">
                                            {errors.endMonth}
                                        </Form.Control.Feedback>
                                    </Col>
                                </Row>
                            </Form.Group>


                            <Row>
                                <FormLabel htmlFor="countryCriteriaDashboard" className="mt-2">{t('dashboard.criteria.labels.Country')}</FormLabel>
                                <InputGroup className="mb-2">

                                    <Form.Select id="countryCriteriaDashboard"
                                        onChange={(e) => {
                                            setField('country', {
                                                id: e.target.value,
                                                name: e.target.options[e.target.selectedIndex].text
                                            });
                                        }}>
                                        <option key={-1} value={-1}>{t('dashboard.criteria.All')}</option>
                                        {countries.map(c => {
                                            return (
                                                <option key={c.countryCode} value={c.countryCode}>{c.countryLabel}</option>
                                            )
                                        })}
                                    </Form.Select>
                                </InputGroup>
                            </Row>

                            <Row>
                                <FormLabel htmlFor="employeeCriteriaDashboard" className="mt-2">{t('dashboard.criteria.labels.Employee')}</FormLabel>
                                <InputGroup className="mb-2">

                                    <OverlayTrigger
                                        placement="top"
                                        overlay={criteria.employee1.name !== "All" ?
                                            <ToolTipBootstrap id="compareBTN-tooltip" className="transparent">
                                                {criteria.employee1.name}
                                            </ToolTipBootstrap> : <></>
                                        } >

                                        <Form.Select id="employeeCriteriaDashboard" onChange={(e) => {
                                            setField('employee1', {
                                                id: e.target.value,
                                                name: e.target.options[e.target.selectedIndex].text
                                            });
                                        }}>

                                            <option key={-1} value={-1}>{t('dashboard.criteria.All')}</option>
                                            {employeeSelect.map(e => {
                                                return (
                                                    <option key={e.id} value={e.id}>{e.name}</option>
                                                )
                                            })}
                                        </Form.Select>
                                    </OverlayTrigger>

                                    <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            <ToolTipBootstrap id="compareBTN-tooltip">
                                                {t('dashboard.criteria.Compare')}
                                            </ToolTipBootstrap>
                                        } >

                                        <Button
                                            id="compareToAllBTN"
                                            variant="light"
                                            disabled={parseInt(criteria.employee1.id) === -1}
                                            onClick={() => setField('employee2', {
                                                id: compareEmployeeChecked ? null : -1,
                                                name: compareEmployeeChecked ? null : "All"
                                            })}
                                            className="btn btn-light shadow-sm border inputSelect ms-1">

                                            <FormCheck
                                                type="switch"
                                                label={t('dashboard.criteria.CompareBTN')}
                                                disabled={parseInt(criteria.employee1.id) === -1}
                                                checked={compareEmployeeChecked}
                                            />
                                        </Button>
                                    </OverlayTrigger>
                                </InputGroup>
                            </Row>

                            <Row>
                                <FormLabel htmlFor="clientTypeCriteriaDashboard" className="mt-2">{t('dashboard.criteria.labels.ClientType')}</FormLabel>
                                <InputGroup className="mb-2">
                                    <Form.Select id="clientTypeCriteriaDashboard" onChange={(e) => {
                                        setField('clientType', e.target.value);
                                    }}>
                                        <option key={0} value={"Any"}>{t('dashboard.criteria.clientType.Any')}</option>
                                        <option key={1} value={"CORRES"}>{t('dashboard.criteria.clientType.Corr')}</option>
                                        <option key={2} value={"DIRECT"}>{t('dashboard.criteria.clientType.Direct')}</option>

                                    </Form.Select>
                                </InputGroup>
                            </Row>

                            <Row className='mt-2'>
                                <Col sm={6} md={6} className="pe-1">
                                    <Button
                                        id='loadChartButton'
                                        onClick={loadChartData}
                                        className='my-2 d-flex justify-content-center'
                                        style={{ width: "100%" }}
                                        variant='primary'>
                                        {chartLoading
                                            ?
                                            <span className='me-3 align-self-center'>
                                                <Oval
                                                    height="20"
                                                    width="20"
                                                    color='black'
                                                    ariaLabel='loading' />
                                            </span>
                                            :
                                            <></>}
                                        {loadChartButtonText}
                                    </Button>
                                </Col>
                                <Col sm={6} md={6} className="ps-1">
                                    <Button
                                        id='saveChartButton'
                                        onClick={handleSaveChartReport}
                                        className='my-2 d-flex justify-content-center'
                                        style={{ width: "100%" }}
                                        variant='primary'>
                                        {saveChartButtonText}
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    </div>
                    <div className="container-chart">
                        <div className="card shadow my-3 mx-3 p-2 pt-3">
                            {chartData &&
                                <Bar
                                    id='chart'
                                    data={{
                                        labels: months,
                                        datasets: chartData.length === 0 || authorized === false ? fallbackChartData : chartData
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        aspectRatio: 4,
                                        scales: {
                                            yAxes: {
                                                title: {
                                                    display: true,
                                                    text: chartYLabel,
                                                    font: {
                                                        size: 15
                                                    }
                                                }
                                            },
                                            xAxes: {
                                                title: {
                                                    display: true,
                                                    text: chartXLabel,
                                                    font: {
                                                        size: 15
                                                    }
                                                }
                                            }
                                        },
                                        plugins: {
                                            title: {
                                                display: true,
                                                text: chartTitle,
                                                font: {
                                                    size: 25,
                                                    family: 'system-ui',
                                                    weight: '600'

                                                },
                                                color: 'black'
                                            },
                                            legend: {
                                                display: true,
                                                position: 'right'
                                            }
                                        }
                                    }}
                                />
                            }
                        </div>
                    </div>
                    <div className="container-table">
                        <div className="card shadow my-3 mx-3 uTable">

                            <Table id='table' responsive="xl" hover>

                                <thead className='bg-light'>
                                    <tr key="0">
                                        <th className='row-style'>{t('dashboard.table.Name')}</th>
                                        <th className='row-style'>{t('dashboard.table.Country')}</th>
                                        <th className='row-style'>{t('dashboard.table.AverageCollectionDays')}</th>
                                        <th className='row-style'>{t('dashboard.table.AmountOwed')}</th>
                                        <th className='row-style'>{t('dashboard.table.AmountDue')}</th>
                                        <th className='row-style'>{t('dashboard.table.ClientGrading')}</th>
                                        <th className='row-style'>{t('dashboard.table.CurrentStatus')}</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {clientNameCountry.map((client, index) => {
                                        return (
                                            <tr key={index}>
                                                <td id="clientName">{client.name}</td>
                                                <td id="clientCountry" className='row-style'>{client.country}</td>
                                                <td id="clientAverageCollectionDays" className='row-style'>0</td>
                                                <td id="clientAmountOwed" className='amount-owed'>0</td>
                                                <td id="clientAmountDue" className='amount-due'>0</td>
                                                <td id="clientGrading" className='row-style'>{client.clientgrading}</td>
                                                <td id="clientStatus" className='row-style'>Active</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>

                            <ButtonGroup className='col-md-5 w-auto ms-auto client-swap'>

                                <DropdownButton title={t('dashboard.dropdownButtonTable.Title')} variant="Default" id="bg-vertical-dropdown-3" className='rowsViewerSelectionStyle'>
                                    <Dropdown.Item eventKey="1">{t('dashboard.dropdownButtonTable.Option1')}</Dropdown.Item>
                                    <Dropdown.Item eventKey="2">{t('dashboard.dropdownButtonTable.Option2')}</Dropdown.Item>
                                    <Dropdown.Item eventKey="3">{t('dashboard.dropdownButtonTable.Option3')}</Dropdown.Item>
                                </DropdownButton>

                                <button className='left-button'>&#60;</button>
                                <button className='right-button'>&#62;</button>
                            </ButtonGroup>
                        </div>
                    </div>
                </div>
            </div>
            <ConfirmationPopup
                open={confirmSaveActivated}
                prompt={t('dashboard.criteria.SaveConfirmPrompt')}
                title={criteria.name}
                onAccept={() => { onSaveConfirmClick() }}
                onClose={() => { setConfirmSaveActivated(false) }}
            />
            <ConfirmationPopup
                open={navClicked && !chartSaved}
                prompt="Are you sure you want to discard changes made to "
                title={criteria.name}
                onAccept={() => { navigate(pageToNavigateTo) }}
                onClose={() => { setNavClicked(false) }} />
        </div >
    )
}

export default Dashboard