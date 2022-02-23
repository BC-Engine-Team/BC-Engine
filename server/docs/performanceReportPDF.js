module.exports = (performanceReportInfo, billingNumbers, chartReportInfo, chartReportData) => {
    // calculate length of for loop for creating averages on the table
    const calculatedLength = chartReportInfo.employee2Name === null ? chartReportData.length : chartReportData.length / 2
    const today = new Date();

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    const colors = [
        'rgb(255, 139, 77)',
        'rgb(127, 101, 129)',
        'rgb(255, 224, 51)',
        'rgb(65, 144, 164)',
        'rgb(46, 234, 68)'
    ];

    const compareColors = [
        'rgba(255, 192, 159, 0.6)',
        'rgba(191, 175, 192, 0.6)',
        'rgba(255, 238, 147, 0.6)',
        'rgba(160, 206, 217, 0.6)',
        'rgba(173, 247, 182, 0.6)'
    ]

    const colorBorders = [
        'rgb(255, 139, 77)',
        'rgb(127, 101, 129)',
        'rgb(255, 224, 51)',
        'rgb(65, 144, 164)',
        'rgb(46, 234, 68)'
    ]

    const formatTimes = (time) => {
        if (time < 10) time = "0" + time;
        return time;
    }

    const getDateOrdinal = (date) => {
        switch (date) {
            case 1: return "st";
            case 2: return "nd";
            case 3: return "rd";
            default: return "th";
        }
    }

    const getFullDateFormatted = (date) => {
        let str = "";
        return str = str.concat(

        /* month */         months[date.getMonth()], " ",
        /* date */          formatTimes(date.getDate()),
        /* date ordinal */  `<small>${getDateOrdinal(date.getDate())}</small>, `,
        /* year */          date.getFullYear(), " - ",

        /* hours */         formatTimes(date.getHours()), ":",
        /* minutes */       formatTimes(date.getMinutes()), ":",
        /* seconds */       formatTimes(date.getSeconds()));
    }

    const buildChartDatasets = () => {
        let str = "";
        let counter = 0;
        let counterCompare = 0;

        for (let i = 0; i < chartReportData.length; i++) {
            let labelCompare = "";

            if (counter === 5)
                counter = 0;

            if (counterCompare === 5)
                counterCompare = 0;

            if (parseInt(chartReportData[i].employee) !== -1) {
                labelCompare = " - emp";
            }

            str = str.concat("{label: '", chartReportData[i].year, labelCompare, "',",
                "data: [");

            for (let j = 0; j < chartReportData[i].data.length; j++) {
                str = str.concat(chartReportData[i].data[j]);

                if (j + 1 !== chartReportData[i].data.length)
                    str = str.concat(",");
                else
                    str = str.concat("],");
            }

            if (chartReportData[i].employee !== -1) {
                str = str.concat("backgroundColor: '", colors[counterCompare], "'}");
                counterCompare++
            }
            else {
                str = str.concat("backgroundColor: '", compareColors[counter], "',",
                    "borderColor: '", colorBorders[counter], "',",
                    "borderWidth: ", 1, "}");
                counter++
            }

            if (i + 1 !== chartReportData.length)
                str = str.concat(",");
        }

        return str;
    }

    const buildTableHead = (secondRow = undefined) => {
        let str = ''
        let start = secondRow === undefined ? 0 : 6
        let limit = secondRow === undefined ? 6 : 12

        for (let i = start; i < limit; i++) {
            str = str.concat('<th>' + capitalizeFirstLetter(Object.keys(billingNumbers.actual)[i]) + '</th>')
        }
        return str
    }

    const buildTable = (secondRow = undefined) => {
        let str = '<tr> <td><b> Actuals </b></td>'
        let start = secondRow === undefined ? 0 : 6
        let limit = secondRow === undefined ? 6 : 12

        for (let i = start; i < limit; i++) {
            str = str.concat('<td>' + new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(billingNumbers.actual[Object.keys(billingNumbers.actual)[i]]) + '</td>')
        }

        str = str.concat('</tr><tr> <td><b> Objectives </b></td>')

        for (let i = start; i < limit; i++) {
            str = str.concat('<td>' + new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(billingNumbers.objective[Object.keys(billingNumbers.objective)[i]]) + '</td>')
        }

        str = str.concat('</tr>')

        return str
    }

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1)
    }


    let html =
        /*html*/
        `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="utf-8">
            <title>Chart Report - ${chartReportInfo.name}</title>
            <style>
                .clearfix:after {
                    content: "";
                    display: table;
                    clear: both;
                }

                a {
                color: #5D6975;
                    text-decoration: underline;
                }

                body {
                    position: relative;
                    width: 8in;  
                    height: 11in; 
                    margin: 0 auto; 
                    color: #001028;
                    background: #FFFFFF; 
                    font-family: Arial, sans-serif; 
                    font-size: 12px; 
                    font-family: Arial;
                }

                header {
                    padding: 10px 0;
                }

                #logo {
                    display: inline-block;
                    float: left;
                }

                

                h1 {
                    position: relative;
                    border-top: 1px solid  #5D6975;
                    border-bottom: 1px solid  #5D6975;
                    color: #5D6975;
                    font-size: 2.4em;
                    line-height: 79px;
                    font-weight: normal;
                    text-align: center;
                    margin: 0 0 20px 0;
                    vertical-align: text-top
                }

                #main-title {
                    display: inline-block;
                }

                #chartCriteria {
                    float: left;
                }

                #chartCriteria span {
                    color: #5D6975;
                    width: 80px;
                    margin-right: 10px;
                    display: inline-block;
                    font-size: 1em;
                }

                #ReportInfo span {
                    color: #5D6975;
                    width: 120px;
                    display: inline-block;
                    font-size: 1em;
                }

                #ReportInfo {
                    float: right;
                    text-align: left;
                    height: 100%
                    margin: 0px 50px 0px 0px;
                }

                #projected-bonus {
                    background: #ccc;
                    text-align: center;
                    width: 100%;
                    height: 100%;
                    padding-top: 23px;
                    padding-bottom: 23px;
                }


                #chartCriteria div,
                    #ReportInfo div {
                    white-space: nowrap;
                    margin-top: 0.2rem;    
                }

                #notices .notice {
                    color: #5D6975;
                    font-size: 1.2em;
                }

                footer {
                    color: #5D6975;
                    width: 100%;
                    position: absolute;
                    bottom: 10px;
                    border-top: 1px solid #C1CED9;
                    padding: 3px 0;
                    text-align: center;
                    line-height: 0.3em;
                    font-size: 1em;
                }
                
                .secondPageFooter {
                    color: #5D6975;
                    width: 100%;
                    border-top: 1px solid #C1CED9;
                    padding: 8px 0;
                    text-align: center;
                    line-height: 0.8em;
                    margin-top: 314px;
                }

                .title {
                    margin-top: 0;
                    text-align: center;
                    margin-bottom: 0.7rem;
                }

                .table {
                    table-layout: fixed;
                    width: 100%;
                    background: #fff;
                    box-shadow: 0px 5px 12px -12px rgb(0 0 0 / 29%);
                    text-align: center;
                    color: #212529;
                    border-collapse: collapse;
                    border: 1px solid #333 !important;
                    border-radius: 5px;
                }

                .table-last {
                    width: 29%;
                }

                .table thead {
                    background: #333;
                    color: #fff;
                }

                .table thead th {
                    border: none;
                    font-size: 12px;
                    color: #fff;
                    width: 100px;
                }

                .table tbody th {
                    background: #e8ebf8;
                    border-bottom: 2px solid #333 !important;
                    border-right: 1px solid #333 !important;
                    border: none;
                    padding: 7px;
                    font-size: 12px;
                    vertical-align: middle;
                }

                .table tbody td {
                    border-right: solid 1px #333;
                    border-left: solid 1px #333;
                    padding-top: 10px;
                    width: 14%;
                }

                .table tbody tr td:nth-child(even) {
                    background: #ccc;
                }

                .tableTitle {
                    font-size: 25;
                    text-align: center;
                    margin-top: 0.3in;
                }

                canvas {
                    margin-top: 0.3in;
                }
            </style>
        </head>
        <body>
            <header class="clearfix">
                <img id='logo' src="https://i.postimg.cc/rwsyKZ34/logo.png" width="80px" height="80px">
                <h1>Performance Report - ${performanceReportInfo.name}</h1>
                
            <div id="ReportInfo" class="clearfix">
                <h2 class="title">Report Information</h2>
                <div><span>Date Created</span> ${getFullDateFormatted(performanceReportInfo.createdAt)}</div>
                <div><span>Date Last Updated</span> ${getFullDateFormatted(performanceReportInfo.updatedAt)}</div>
                <div><span>Date Report Exported</span> ${getFullDateFormatted(today)}</div>
                <div id='projected-bonus'>
                    <h2 class="title">Projected Bonus</h2>
                    <h3>${new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(performanceReportInfo.projectedBonus)}</h3>
                </div>
            </div>
            
            
            <div id="chartCriteria">
                <h2 class="title" >Chart Criteria</h2>
                <div><span>Name</span> ${chartReportInfo.name}</div>
                <div><span>Start Date</span> ${months[parseInt(chartReportInfo.startDate.substring(5, 7)) - 1]} ${chartReportInfo.startDate.substring(0, 4)}</div>
                <div><span>End Date</span> ${months[parseInt(chartReportInfo.endDate.substring(5, 7)) - 1]} ${chartReportInfo.endDate.substring(0, 4)}</div>
                <div><span>Employee</span> ${chartReportInfo.employee1Name}</div>
                ${chartReportInfo.employee2Name !== null ? `<div><span>Compared With</span> ${chartReportInfo.employee2Name}</div>` : ""}
                <div><span>Age of Account</span> ${chartReportInfo.ageOfAccount}</div>
                <div><span>Account Type</span> ${chartReportInfo.accountType}</div>
                <div><span>Country</span> ${chartReportInfo.country}</div>
                <div><span>Client Type</span> ${chartReportInfo.clientType === "Corr" ? "Correspondant" : chartReportInfo.clientType === "All" ? "All" : "Direct"}</div>
            </div>

            
            
            </header>
            <main>
                <div id="billingNumbersTable">
                    <h2 class='tableTitle'>Actual Billing VS Objectives (Fiscal Year ${billingNumbers.actual.year})</h2>
                    <table class='table'>
                        <thead>
                            <tr>
                                <th></th>
                                ${buildTableHead()}
                            </tr>
                        </thead>
                        <tbody>
                            ${buildTable()}
                        </tbody>
                    </table>
                    <table class='table'>
                        <thead>
                            <tr>
                                <th></th>
                                ${buildTableHead(true)}
                            </tr>
                        </thead>
                        <tbody>
                            ${buildTable(true)}
                        </tbody>
                    </table>
                    <table class='table table-last'>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><b>Actual</b></td>
                                <td>${new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(billingNumbers.actual[Object.keys(billingNumbers.actual)[12]])} </td>
                            </tr>
                            <tr>
                                <td><b>Objective</b></td>
                                <td>${new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(billingNumbers.objective[Object.keys(billingNumbers.objective)[12]])} </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <canvas id="myChart" width="auto" height="140px"></canvas>
            </main>
            
        </body>
        <footer>
            <p>@Copyright 2021-${today.getFullYear()}.</p>
            <p>All rights reserved. Powered by B&C Engine.</p>
        </footer>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.min.js"></script>
        <script>
            const ctx = document.getElementById('myChart');
            const myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: [${months.map((m) => { return "'" + m + "'" })}],
                    datasets: [${buildChartDatasets()}]
                },
                options: {
                    devicePixelRatio: 4,
                    animation: {
                            duration: 0
                    },
                    title: {
                        display: true,
                        text: 'Average Collection Days over Time',
                        fontSize: 25,
                        fontFamily: "'Arial', 'sans-serif'",
                        fontColor: 'black',
                        fontStyle: '400',
                    },
                    legend: {
                        display: true,
                        position: 'right'
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            },
                            scaleLabel: {
                                display: true,
                                labelString: "Days",
                                fontSize: 15
                            }
                        }],
                        xAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: 'Months',
                                fontSize: 15
                            }
                        }]
                    }
                }
            });
        </script>
    </html>
    `

    return html
}