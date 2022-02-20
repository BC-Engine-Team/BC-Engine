module.exports = (data, averagesList) => {
    // calculate length of for loop for creating averages on the table
    const calculatedLength = data.employee2Name === null ? averagesList.length : averagesList.length / 2
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
        if(time < 10) time = "0" + time;
        return time;
    }

    const getDateOrdinal = (date) => {
        switch(date) {
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
        let labelCompare = "";

        for(let i = 0; i < averagesList.length; i++) {
            
            if(counter === 5) 
                counter = 0; 

            if(counterCompare === 5)
                counterCompare = 0;

            if(averagesList[i].employee !== -1) {
                labelCompare = " - emp";
            }

            str = str.concat("{label: '", averagesList[i].year, labelCompare, "',", 
                             "data: [");

            for(let j = 0; j < averagesList[i].data.length; j++) {
                str = str.concat(averagesList[i].data[j]);

                if(j + 1 !== averagesList[i].data.length) 
                    str = str.concat(",");
                else
                    str = str.concat("],");
            }

            if(averagesList[i].employee !== -1) {
                str = str.concat("backgroundColor: '", colors[counterCompare], "'}");
                counterCompare++
            } 
            else {
                str = str.concat("backgroundColor: '", compareColors[counter], "',",
                                 "borderColor: '", colorBorders[counter], "',",
                                 "borderWidth: ", 1, "}");
                counter++
            }

            if(i + 1 !== averagesList.length) 
                str = str.concat(",");
        }

        return str;
    }

    const buildTable = () => {
        let str = "";

        for(let i = 0; i < months.length; i++) {
            let averageNormal = 0,
                averageCounter = 0,
                compareAverage = 0,
                compareAverageCounter = 0,
                counter = 0,
                compareCounter = 0;  

            // creating table row
            str = str.concat("<tr>", "<th class='monthColumn'>", months[i], "</th>")

            for(let j = 0; j < averagesList.length; j++) {
                if(counter === 5) 
                counter = 0; 

                if(compareCounter === 5) 
                compareCounter = 0; 

                // creating table cell...
                // for employee 
                if(averagesList[j].employee !== -1) {
                    str = str.concat("<td style='background-color:", colors[counter], "'>", averagesList[j].data[i] !== 0 ? averagesList[j].data[i] : "N/A", "</td>")
                    counter++

                    if(averagesList[j].data[i] !== 0) {
                        averageNormal += averagesList[j].data[i];
                        averageCounter++
                    }

                    if((j + 1) === calculatedLength || ((j + 1) === averagesList.length && data.employee2Name !== null)) {
                        averageNormal /= averageCounter;
                        str = str.concat("<td style='border:1px solid #333; border-top: none; border-bottom: none;'>", averageNormal.toFixed(2), "</td>")
                    }
                }
                // for All
                else {
                    str = str.concat("<td style='background-color:", compareColors[compareCounter], "'>", averagesList[j].data[i] !== 0 ? averagesList[j].data[i] : "N/A", "</td>")
                    compareCounter++

                    if(averagesList[j].data[i] !== 0) {
                        compareAverage += averagesList[j].data[i];
                        compareAverageCounter++
                    }
                    
                    if((j + 1) === calculatedLength) {
                        compareAverage /= compareAverageCounter;
                        str = str.concat("<td style='border: 1px solid #333; border-top: none; border-bottom: none;'>", compareAverage.toFixed(2), "</td>")
                    }

                }
            }
            str = str.concat("</tr>")
        }
        return str;
    }

    const buildTableHead = () => {
        let str = "";

        for(let i = 0; i < averagesList.length; i++) {
            str = str.concat("<th>", averagesList[i].year, "</th>")

            if(i + 1 === calculatedLength || i + 1 === averagesList.length && data.employee2Name !== null) {
                str = str.concat("<th>AVERAGE</th>")
            }
        }
        return str;
    }

    let html =  
    /*html*/
    `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="utf-8">
            <title>Chart Report - ${data.name}</title>
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
                    margin-bottom: 30px;
                }

                #logo {
                    text-align: center;
                    margin-bottom: 10px;
                }

                #logo picture {
                    width: 90px;
                }

                h1 {
                    border-top: 1px solid  #5D6975;
                    border-bottom: 1px solid  #5D6975;
                    color: #5D6975;
                    font-size: 2.4em;
                    line-height: 1.4em;
                    font-weight: normal;
                    text-align: center;
                    margin: 0 0 20px 0;
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
                    bottom: 14px;
                    border-top: 1px solid #C1CED9;
                    padding: 8px 0;
                    text-align: center;
                    line-height: 0.8em;
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
                    width: 100%;
                    background: #fff;
                    box-shadow: 0px 5px 12px -12px rgb(0 0 0 / 29%);
                    text-align: center;
                    color: #212529;
                    border-collapse: collapse;
                    border: 1px solid #333 !important;
                }

                .table thead {
                    background: #333;
                    color: #fff;
                }

                .table thead th {
                    border: none;
                    padding: 7px 0;
                    font-size: 12px;
                    color: #fff;
                }

                .monthColumn {
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
                    border-bottom: 1px solid #333 !important;
                }

                .tableTitle {
                    font-size: 25;
                    text-align: center;
                    margin-top: 0.7in;
                }
            </style>
        </head>
        <body>
            <header class="clearfix">
            <div id="logo">
                <img src="https://i.postimg.cc/rwsyKZ34/logo.png" width="90px" height="90px">
            </div>
            <h1>Chart Report - ${data.name}</h1>
            <div id="ReportInfo" class="clearfix">
                <h2 class="title">Report Information</h2>
                <div><span>Date Created</span> ${getFullDateFormatted(data.createdAt)}</div>
                <div><span>Date Last Updated</span> ${getFullDateFormatted(data.updatedAt)}</div>
                <div><span>Date Report Exported</span> ${getFullDateFormatted(today)}</div>
            </div>
            <div id="chartCriteria">
                <h2 class="title" >Chart Criteria</h2>
                <div><span>Name</span> ${data.name}</div>
                <div><span>Start Date</span> ${months[parseInt(data.startDate.substring(5, 7)) - 1]} ${data.startDate.substring(0, 4)}</div>
                <div><span>End Date</span> ${months[parseInt(data.endDate.substring(5, 7)) - 1]} ${data.endDate.substring(0, 4)}</div>
                <div><span>Employee</span> ${data.employee1Name}</div>
                ${data.employee2Name !== null ?  `<div><span>Compared With</span> ${data.employee2Name}</div>` : ""}
                <div><span>Age of Account</span> ${data.ageOfAccount}</div>
                <div><span>Account Type</span> ${data.accountType}</div>
                <div><span>Country</span> ${data.country}</div>
                <div><span>Client Type</span> ${data.clientType === "Corr" ? "Correspondant" : data.clientType === "All" ? "All" : "Direct"}</div>
            </div>
            </header>
            <main>
                <canvas id="myChart" width="auto" height="200px"></canvas>
            </main>
        </body>
        <footer>
            <p>@Copyright 2021-${today.getFullYear()}.</p>
            <p>All rights reserved. Powered by B&C Engine.</p>
        </footer>
        <div style="page-break-after:always;"></div>
        <body>
            <header class="clearfix">
            <div id="logo">
                <img src="https://i.postimg.cc/rwsyKZ34/logo.png" width="90px" height="90px">
            </div>
            <h1>Chart Report - ${data.name}</h1>
            <main>
                <h2 class="tableTitle">Chart Raw Data (Days)</h2>
                <table class="table">
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
            </main>
            <div class="secondPageFooter">
                <p>@Copyright 2021-${today.getFullYear()}.</p>
                <p>All rights reserved. Powered by B&C Engine.</p>
            </div>
        </body>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.min.js"></script>
        <script>
            const ctx = document.getElementById('myChart');
            const myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: [${months.map((m) => {return "'" + m + "'"})}],
                    datasets: [${buildChartDatasets()}]
                },
                options: {
                    devicePixelRatio: 4,
                    title: {
                        display: true,
                        text: 'Average Collection Days over Time',
                        fontSize: 25,
                        fontFamily: "'Arial', 'sans-serif'",
                        fontColor: 'black',
                        fontStyle: '400'
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