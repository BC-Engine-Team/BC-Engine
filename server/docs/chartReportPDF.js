module.exports = (data) => {
    const today = new Date();

    const formatTimes = (time) => {
        if(time < 10) time = "0" + time;
        return time;
    }

    let logoUrl = './template_img/logo.png'

    console.log(logoUrl)

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

    let html =  `
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
                width: 21cm;  
                height: 29.7cm; 
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
                text-align: right;
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
                height: 30px;
                position: absolute;
                bottom: 0;
                border-top: 1px solid #C1CED9;
                padding: 8px 0;
                text-align: center;
            }

            .title {
                margin-top: 0;
                margin-bottom: 0.7rem;
            }
        </style>
      </head>
      <body>
        <header class="clearfix">
          <div id="logo">
            <picture>
                <source srcset="brandingLogo">
                <img src="brandingLogo" width="90" height="90">
            </picture>
            <img src="brandingLogo" width="90" height="90">
          </div>
          <h1>Chart Report - ${data.name}</h1>
          <div id="ReportInfo" class="clearfix">
            <h2 class="title">Report Information</h2>
            <div><span>Date Created</span> ${months[data.createdAt.getMonth()]} ${data.createdAt.getDate()}<small>th</small>, ${data.createdAt.getFullYear()} - ${data.createdAt.getTime()} - ${formatTimes(data.createdAt.getHours())}:${formatTimes(data.createdAt.getMinutes())}:${formatTimes(data.createdAt.getSeconds())}</div>
            <div><span>Date Last Updated</span> ${months[data.updatedAt.getMonth()]} ${data.updatedAt.getDate()}<small>th</small>, ${data.updatedAt.getFullYear()} - ${formatTimes(data.updatedAt.getHours())}:${formatTimes(data.updatedAt.getMinutes())}:${formatTimes(data.updatedAt.getSeconds())}</div>
            <div><span>Date Report Exported</span> ${months[today.getMonth()]} ${today.getDate()}<small>th</small>, ${today.getFullYear()} - ${formatTimes(today.getHours())}:${formatTimes(today.getMinutes())}:${formatTimes(today.getSeconds())}</div>
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
            <p>Chart will go here</p>
        </main>
        <footer>
          Invoice was created on a computer and is valid without the signature and seal.
        </footer>
      </body>
    </html>
    `

    let html1 = html.replaceAll('brandingLogo','file:\\\\\\' + 
    require.resolve('./template_img/logo.png').replace(/\//g,"\\\\"));

    console.log(html1)

    return html1
}