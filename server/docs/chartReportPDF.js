// const Chart = require('chart.js');

module.exports = (data, averagesList) => {
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

    const compareColors = [
        'rgb(255, 192, 159)',
        'rgb(191, 175, 192)',
        'rgb(255, 238, 147)',
        'rgb(160, 206, 217)',
        'rgb(173, 247, 182)'
    ];

    const colors = [
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

        str = str.concat(months[date.getMonth()], " ");
        str = str.concat(formatTimes(date.getDate()));
        str = str.concat(`<small>${getDateOrdinal(date.getDate())}</small>, `)
        str = str.concat(date.getFullYear(), " - ");
        str = str.concat(formatTimes(date.getHours()), ":");
        str = str.concat(formatTimes(date.getMinutes()), ":");
        str = str.concat(formatTimes(date.getSeconds()));

        return str;
    }

    const buildChartDatasets = () => {
        let str = "";
        let counter = 0;
        let counterCompare = 0;
        let labelCompare = "";

        for(let i = 0; i < averagesList.length; i++) {
            
            if(counter === 5) 
                counter = 0; 

            if(averagesList[i].employee !== -1) {
                labelCompare = " - emp";
            }

            str = str.concat("{label: '", averagesList[i].year, labelCompare, "',");

            str = str.concat("data: [");
            for(let j = 0; j < averagesList[i].data.length; j++) {
                str = str.concat(averagesList[i].data[j]);

                if(j + 1 !== averagesList[i].data.length) 
                    str = str.concat(",");
                else
                    str = str.concat("],");
            }

            if(averagesList[i].employee !== -1) {
                str = str.concat("backgroundColor: '", compareColors[counterCompare], "'}");
                counterCompare++
            } 
            else {
                str = str.concat("backgroundColor: '", colors[counter], "',");
                str = str.concat("borderColor: '", colorBorders[counter], "',");
                str = str.concat("borderWidth: ", 1, "}")
                counter++
            }

            if(i + 1 !== averagesList.length) 
                str = str.concat(",");
        }

        console.log(str)
        return str;
    }

//   <tr>
        //     <td class="service">SEO</td>
        //     <td class="desc">Optimize the site for search engines (SEO)</td>
        //     <td class="unit">$40.00</td>
        //     <td class="qty">20</td>
        //     <td class="total">$800.00</td>
        //   </tr>

    const buildTable = () => {
        let str = "";

        // for(let i = 0; i < averagesList.length; i++) {
        //     for(let j = 0; i < averagesList[i].data.length; j++) {
                
        //     }
        // }
        
        //str = str.concat("<tr>");
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
                    bottom: 0;
                    border-top: 1px solid #C1CED9;
                    padding: 8px 0;
                    text-align: center;
                    line-height: 0.5em;
                }

                .title {
                    margin-top: 0;
                    text-align: center;
                    margin-bottom: 0.7rem;
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
                <div><span>Start Date</span> ${months[parseInt(data.endDate.substring(5, 7)) - 1]} ${data.endDate.substring(0, 4)}</div>
                <div><span>End Date</span> ${months[parseInt(data.startDate.substring(5, 7)) - 1]} ${data.startDate.substring(0, 4)}</div>
                <div><span>Employee</span> ${data.employee1Name}</div>
                ${ data.employee2Name !== null ?  `<div><span>Compared With</span> ${data.employee2Name}</div>` : ""}
                <div><span>Age of Account</span> ${data.ageOfAccount}</div>
                <div><span>Account Type</span> ${data.accountType}</div>
                <div><span>Country</span> ${data.country}</div>
                <div><span>Client Type</span> ${data.clientType === "Corr" ? "Correspondant" : data.clientType === "All" ? "All" : "Direct"}</div>
            </div>
            </header>
            <main>
                <canvas id="myChart" width="auto" height="auto"></canvas>

                <table>
        <thead>
            <tr>
                <th></th>
                ${averagesList.map((ym) => {return `<th>${ym.year}</th>`})}
                <th>AVERAGE DIFFERENCE</th>
            </tr>
        </thead>
        <tbody>
            ${buildTable()}
        </tbody>
      </table>
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
                    labels: [${months.map((m) => {return "'"+m+"'"})}],
                    datasets: [${buildChartDatasets()}]
                },
                options: {
                    devicePixelRatio: 2,
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

    console.log(html)

    return html
}