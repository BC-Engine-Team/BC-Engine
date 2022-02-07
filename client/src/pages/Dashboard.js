import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Axios from 'axios';
import Cookies from 'universal-cookie';
import NavB from '../components/NavB'
import '../styles/clientTable.css'
import '../styles/dashboardPage.css'
import { InputGroup, FormControl, Button, ButtonGroup, DropdownButton, Dropdown, Form, Table, FormLabel, OverlayTrigger, Tooltip as ToolTipBootstrap, FormCheck  } from 'react-bootstrap'
import { Oval } from  'react-loader-spinner'
import { useTranslation } from 'react-i18next';
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

    let counter = 1;
    let navigate = useNavigate();
    const cookies = new Cookies();
    const { t } = useTranslation();

    // variables used for internationalization
    const chartReportNamePlaceHolder = t('dashboard.criteria.NamePlaceHolder');
    const loadChartButtonText = t('dashboard.criteria.LoadChartButton');
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
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const earliestYear = 2009;
    const [authorized, setAuthorized] = useState(false);
    const [clientNameCountry, setClientNameCountry] = useState([{ name: "", country: "", clientgrading: "" }]);
    const [countries, setCountries] = useState([{ countryLabel: "" }]);
    const [filteredCountry, setFilteredCountry] = useState({country: ""});
    const [errors, setErrors] = useState({});
    
    const [criteria, setCriteria] = useState({
        name: "",
        startYear: currentYear - 2,
        startMonth: 0,
        endYear: currentMonth === 0 ? currentYear - 1 : currentYear,
        endMonth: currentMonth === 0 ? 11 : currentMonth - 1
    });

    const [startYearList, setStartYearList] = useState([]);
    const [endYearList, setEndYearList] = useState([]);
    const [startMonthList, setStartMonthList] = useState([]);
    const [endMonthList, setEndMonthList] = useState([]);

    const [employeeSelect, SetEmployeeSelect] = useState([]);

    // Criteria
    const [compareEmployeeChecked, setCompareEmployeeChecked] = useState(false);
    const [employeeCriteria, SetEmployeeCriteria] = useState({
        id: "All",
        name: "All"
    });

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

                for(let i = 0; i < res.data.length; i++) {

                    listEmployee.push({
                        label: res.data[i].firstName + " " + res.data[i].lastName,
                        value: res.data[i].nameID
                    });
                }

                SetEmployeeSelect(listEmployee);
            })
            .catch((error) => {
                if (error.response) {
                    if (error.response.status === 403 || error.response.status === 401) {
                        console.log(error.response.body);
                    }
                    else {
                        console.log("Malfunction in the B&C Engine...");
                    }
                }
                else if (error.request) {
                    console.log("Could not reach b&C Engine...");
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

                for(let i = 0; i < res.data.length; i++)
                {
                    countryList.push({
                        countryLabel: res.data[i].countryLabel
                    });
                }
                setCountries(countryList);
            });
    }



    const chart = async (employeeId = undefined, countryCode = undefined, compare = false) => {
        setChartLoading(true);
        setChartData(fallbackChartData);
        let compareData = [];

        let arrayLength = 1;
        if(compare) arrayLength = 2;
        for(let c = 0; c < arrayLength; c++) {
            let clientInfoList = [];

            let header = {
                'authorization': "Bearer " + cookies.get("accessToken"),
            }

            let startDate = new Date(criteria.startYear, criteria.startMonth, 1).toISOString().split("T")[0];
            let endDate = new Date(criteria.endYear, criteria.endMonth, 1).toISOString().split("T")[0];

            let param = {};

            if(employeeId !== undefined && countryCode === undefined) {
                param = {
                    employeeId: employeeId
                }
            }
            else if(employeeId === undefined && countryCode !== undefined) {
                param = {
                    country: countryCode
                }
            }
            else if (employeeId !== undefined && countryCode !== undefined){
                param = {
                    employeeId: employeeId,
                    country: countryCode
                }
            }


            if(c === 1) {
                param = {};
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
                            data.push(dataGroup[counter].average);
                            counter++;
                        }
                        else {
                            data.push(0);
                        }
                    }

                    let datasetLabel = groupedChartData[Object.keys(groupedChartData)[i]][0]['group'];
                    let colorBG = colors[colorCounter];

                    if(compare && c === 0) {
                        datasetLabel = groupedChartData[Object.keys(groupedChartData)[i]][0]['group'].toString().concat(" - employee");
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

                if(compare && c === 0) {
                    compareData = datasets;
                }
                else if(compare && c === 1) {
                    for(let d = 0; d < compareData.length; d++) {
                        datasets.push(compareData[d]);
                    }

                    setChartData(datasets);
                    setChartLoading(false);
                }
                else if(!compare){
                    setChartData(datasets);
                    setChartLoading(false);
                }
                
                setClientNameCountry(clientInfoList);
            })
            .catch((error) => {
                setChartLoading(false);

                if (error.response) {
                    if (error.response.status === 403 || error.response.status === 401) {
                        console.log(error.response.body);
                    }
                    else {
                        console.log("Malfunction in the B&C Engine...");
                    }
                }
                else if (error.request) {
                    console.log("Could not reach b&C Engine...");
                }
            });
            /*eslint no-loop-func: 0*/
        }
    }


    //button to load the data and filtered the parameters of the chart method
    const loadChartData = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        if(!chartLoading) {
            const newErrors = findCriteriaErrors();

            setErrors(newErrors);
            if (Object.keys(newErrors).length !== 0) return;

            if (employeeCriteria.id !== "All") {
                
                if(compareEmployeeChecked) {
                    await chart(employeeCriteria.id, undefined, true);
                } else {
                    await chart(employeeCriteria.id, undefined, false);
                }
            }            
            else {
                await chart(undefined, filteredCountry, false);
            }
        }
    }

    const setField = (field, value) => {
        setCriteria({
            ...criteria,
            [field]: value
        });

        if (!!errors[field]) {
            setErrors({
                ...errors,
                [field]: null
            });
        }
    };

    const findCriteriaErrors = () => {
        const { startYear, startMonth, endYear, endMonth } = criteria;
        let newErrors = {};

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
    }

    const initCriteria = async () => {
        let yearList = [];
        for (let i = earliestYear; i <= currentYear; i++) {
            yearList.push(i);
        }
        setStartYearList(yearList);
        setEndYearList(yearList);

        setStartMonthList(months);
        setEndMonthList(months);
    }


    
    // assign the country selected inside the filteredCountry field
    const countryFiltering = (country) => {
        setFilteredCountry(country)
    }

    
    
    useEffect(() => {
        if (cookies.get("accessToken") === undefined) {
            navigate("/login");
        }
        else if (cookies.get("role") !== "admin") {
            setAuthorized(false);
        }

        chart();
        countrySelectBox();
        createEmployeeCriteria();
        initCriteria();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
        

    return (
        <div>
            <NavB />
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
                                />
                            </InputGroup>

                            <Form.Group className="my-2" controlId="floatingModifyStartMonth">
                                <Form.Label>{t('dashboard.criteria.StartDateLabel')}</Form.Label>
                                <div className='row'>
                                    <div className='col-md-6 col-sm-6'>
                                        <Form.Select required
                                            id='startYearSelect'
                                            size="sm"
                                            aria-label="Default select example"
                                            onChange={(e) => setField('startYear', e.target.value)}
                                            value={criteria.startYear}
                                            isInvalid={!!errors.startYear}>

                                            {startYearList.map((y, i) => {
                                                return (
                                                    <option key={i} value={y}>{y}</option>
                                                );
                                            })}

                                        </Form.Select>

                                        <Form.Control.Feedback type="invalid">
                                            {errors.startYear}
                                        </Form.Control.Feedback>
                                    </div>
                                    <div className='col-md-6 col-sm-6'>
                                        <Form.Select required
                                            id='startMonthSelect'
                                            size="sm"
                                            aria-label="Default select example"
                                            onChange={(e) => setField('startMonth', e.target.value)}
                                            value={criteria.startMonth}
                                            isInvalid={!!errors.startMonth}>

                                            {startMonthList.map((m, i) => {
                                                return (<option key={i} value={i}>{m}</option>);
                                            })}

                                        </Form.Select>

                                        <Form.Control.Feedback type="invalid">
                                            {errors.startMonth}
                                        </Form.Control.Feedback>
                                    </div>
                                </div>
                            </Form.Group>

                            <Form.Group className="my-2" controlId="floatingModifyEndMonth">
                                <Form.Label>{t('dashboard.criteria.EndDateLabel')}</Form.Label>
                                <div className='row'>
                                    <div className='col-md-6 col-sm-6'>
                                        <Form.Select required
                                            id='endYearSelect'
                                            size="sm"
                                            aria-label="Default select example"
                                            onChange={(e) => setField('endYear', e.target.value)}
                                            value={criteria.endYear}
                                            isInvalid={!!errors.endYear}>

                                            {endYearList.map((y, i) => {
                                                return (
                                                    <option key={i} value={y}>{y}</option>
                                                );
                                            })}
                                        </Form.Select>

                                        <Form.Control.Feedback type="invalid">
                                            {errors.endYear}
                                        </Form.Control.Feedback>
                                    </div>
                                    <div className='col-md-6 col-sm-6'>
                                        <Form.Select required
                                            id='endMonthSelect'
                                            size="sm"
                                            aria-label="Default select example"
                                            onChange={(e) => setField('endMonth', e.target.value)}
                                            value={criteria.endMonth}
                                            isInvalid={!!errors.endMonth}>

                                            {endMonthList.map((m, i) => {
                                                return (<option key={i} value={i}>{m}</option>);
                                            })}
                                        </Form.Select>

                                        <Form.Control.Feedback type="invalid">
                                            {errors.endMonth}
                                        </Form.Control.Feedback>
                                    </div>
                                </div>
                            </Form.Group>


                            <Form.Group className="my-2" controlId="floatingModifyStartMonth">
                                <Form.Label>Country</Form.Label>
                                <Form.Select
                                    className='my-2 px-2'
                                    onChange={e => countryFiltering(e.target.value)}>

                                    <option value="all">All countries</option>
                                    {countries.map ((country, index) => {
                                        return(
                                            <option key={index} value={country.countryLabel}> {country.countryLabel} </option>    
                                        );
                                    })}
                                </Form.Select>
                            </Form.Group>


                            <FormLabel htmlFor="employeeCriteriaDashboard" className="mt-2">{t('dashboard.criteria.labels.Employee')}</FormLabel>
                            <InputGroup className="mb-2">
         
                                {employeeCriteria.name !== "All"}
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={employeeCriteria.name !== "All" ?
                                            <ToolTipBootstrap id="compareBTN-tooltip" className="transparent">
                                                {employeeCriteria.name}
                                            </ToolTipBootstrap> : <></>
                                        } >

                                        <FormControl id="employeeCriteriaDashboard" as="select" onChange={e => SetEmployeeCriteria({
                                                id: e.target.value.split("/")[0], 
                                                name: e.target.value.split("/")[1]
                                            })}>

                                            <option key="1" value="All/All">{t('dashboard.criteria.All')}</option>
                                            {employeeSelect.map(e => {
                                                counter++
                                                return (
                                                    <option key={counter} value={e.value + "/" + e.label}>{e.label}</option>
                                                )
                                            })}
                                        </FormControl>
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
                                        disabled={employeeCriteria.id === "All"}
                                        onClick={() => setCompareEmployeeChecked(!compareEmployeeChecked)}
                                        className="btn btn-light shadow-sm border inputSelect ms-1">

                                            <FormCheck 
                                            type="switch" 
                                            label={t('dashboard.criteria.CompareBTN')}
                                            disabled={employeeCriteria.id === "All"}
                                            checked={compareEmployeeChecked}
                                            />
                                    </Button>
                                </OverlayTrigger>

                            </InputGroup>

                            <Button
                                id='loadChartButton'
                                onClick={loadChartData}
                                className='my-2 d-flex justify-content-center'
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
        </div>
    )
}

export default Dashboard