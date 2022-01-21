const TransacStatDao = require("../data_access_layer/daos/transac.dao");
const InvoiceAffectDao = require("../data_access_layer/daos/invoice_affect.dao");
const ClientDao = require("../data_access_layer/daos/client.dao");
const { addListener } = require("nodemon");



//method to get the dues
exports.getDues = async (yearMonthList) => {
    let totalDuesList = [];

    return new Promise(async (resolve, reject) => {
        await TransacStatDao.getTransactionsStatByYearMonth(yearMonthList).then(async data => {
            if (data) {

                yearMonthList.forEach(ym => {
                    let totalDues = 0;
                    data.forEach(e => {
                        if (e.yearMonth === ym) {
                            totalDues += (e.dueCurrent + e.due1Month + e.due2Month + e.due3Month);
                        }
                    });
                    totalDuesList.push({
                        month: ym.toString(),
                        totalDues: totalDues.toFixed(2)
                    });
                });
                resolve(totalDuesList);
            }
            resolve(false);

        }).catch(err => {
            reject(err.message);
        });
    });
}




//method to get the billed amount
exports.getBilled = async (startDateStr, endDateStr, yearMonthList) => {
    let billedList = [];
    let startDate = new Date(parseInt(startDateStr.substring(5, 7)) + " " + parseInt(startDateStr.substring(8)) + " " + parseInt(startDateStr.substring(0, 4)));
    let endDate = new Date(parseInt(endDateStr.substring(5, 7)) + " " + parseInt(endDateStr.substring(8)) + " " + parseInt(endDateStr.substring(0, 4)));
    endDate.setMonth(endDate.getMonth() - 11);


    return new Promise(async (resolve, reject) => {
        await InvoiceAffectDao.getInvoicesByDate(startDateStr, endDateStr).then(async data => {
            if (data) {
                yearMonthList.forEach(ym => {
                    let billed = 0;

                    data.forEach(i => {

                        clientIDList.push(i['ACTOR_ID']);

                        if (i['INVOCIE_DATE'] >= startDate && i['INVOCIE_DATE'] < endDate) {
                            billed += i['AFFECT_AMOUNT'];
                        }
                    });

                    billedList.push({
                        month: ym,
                        billed: billed
                    });

                    startDate.setMonth(startDate.getMonth() + 1);
                    endDate.setMonth(endDate.getMonth() + 1);
                });
                resolve(billedList);
            }
            resolve(false);
        });
    });
}



let clientIDList = [];

//method to get the names and countries based by clients id
exports.getNamesAndCountries = async() => {

    let formattedClientList = [];
    let formattedName = "";

    return new Promise(async (resolve, reject) => {
        
        await ClientDao.getClientByID(clientIDList).then(async data => {
            if(data){
                data.forEach(i => {
                    formattedName = i["NAME_1"] + " " + i["NAME_2"] + " " + i["NAME_3"];

                    formattedClientList.push({
                        name: formattedName,
                        country: i["COUNTRY_LABEL"]
                    });

                });
                resolve(formattedClientList);
            }
            resolve(false);
        });
    });
}




//to get the averages for the chart
exports.getAverages = async (startDateStr, endDateStr) => {
    const startYear = parseInt(startDateStr.split('-')[0]);
    let startMonth = parseInt(startDateStr.split('-')[1]);
    const endYear = parseInt(endDateStr.split('-')[0]);
    const endMonth = parseInt(endDateStr.split('-')[1]);


    // make list of yearMonth [201911,202001,202002,...] to select dues
    let yearMonthList = [];
    for (let y = startYear; y <= endYear; y++) {
        if (y != startYear) startMonth = 1;
        for (let m = startMonth; m <= 12; m++) {
            if (y == endYear && m > endMonth) break;
            let yearMonthStr = y.toString();
            if (m < 10) yearMonthStr += '0';
            yearMonthStr += m.toString();
            yearMonthList.push(parseInt(yearMonthStr));
        }
    }


    return new Promise(async (resolve, reject) => {
        let averagesList = [];
        let totalDuesList = [];
        let billedList = [];

        // Get the list of total dues for each month
        await this.getDues(yearMonthList).then(async data => {
            totalDuesList = data;
        }).catch(err => {
            reject(err.message);
        });

        // prepare startDate to get billed
        let startDate = new Date(`${startDateStr} 00:00:00`);
        startDate.setMonth(startDate.getMonth() - 12);
        let theMonth = startDate.getMonth() + 1;
        startDateStr = startDate.getFullYear() + "-" + theMonth + "-01";

        // Get list of amount billed for each month (previous 12 months)
        await this.getBilled(startDateStr, endDateStr, yearMonthList).then(async data => {
            billedList = data;
        }).catch(err => {
            reject(err.message);
        });


        // Populate average list with average for each month
        let counter = 0;
        yearMonthList.forEach(ym => {
            let average = totalDuesList[counter].totalDues / billedList[counter].billed * 365;
            averagesList.push({
                month: ym,
                average: average.toFixed(2)
            });
            counter++;
        });
        
        resolve(averagesList);
    });
}