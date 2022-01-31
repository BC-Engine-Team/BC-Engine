const TransacStatDao = require("../data_access_layer/daos/transac_stat.dao");
const InvoiceAffectDao = require("../data_access_layer/daos/invoice_affect.dao");
const ClientDao = require("../data_access_layer/daos/client.dao");
const ClientGradingDao = require("../data_access_layer/daos/client_grading.dao")
const CountryDao = require("../data_access_layer/daos/country.dao")


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
        let clientList = [];
        let clientGradingList = [];
        let returnData = [];
        let nameIdList = [];

        // Get the list of total dues for each month
        await this.getDues(yearMonthList).then(async data => {
            totalDuesList = data;
        }).catch(err => {
            reject(err);
        });

        // prepare startDate to get billed amount for each month
        let startDate = new Date(`${startDateStr} 00:00:00`);
        startDate.setMonth(startDate.getMonth() - 12);
        let theMonth = startDate.getMonth() + 1;
        startDateStr = startDate.getFullYear() + "-" + theMonth + "-01";

        // Get list of amount billed for each month (previous 12 months)
        await this.getBilled(startDateStr, endDateStr, yearMonthList).then(async data => {
            billedList = data;
        }).catch(err => {
            reject(err);
        });


        //Get list of client based by actor id
        await this.getNamesAndCountries(clientIDList).then(async data => {
            clientList = data;
        }).catch(err => {
            reject(err);
        });


        // Populate average list with average for each month
        if (totalDuesList.length === 0 || billedList.length === 0) return;
        let counter = 0;
        yearMonthList.forEach(ym => {
            let average = totalDuesList[counter].totalDues / billedList[counter].billed * 365;
            averagesList.push({
                month: ym,
                average: average.toFixed(2)
            });
            counter++;
        });
        
        
        clientList.forEach(c => {
            nameIdList.push(c.nameId);
        });


        await this.getClientGrading(nameIdList).then(async data => {
            clientGradingList = data;
        }).catch(err => {
            reject(err);
        });


        for(const c of clientList){
            for(const g of clientGradingList){
                if(c.nameId === g.nameId){
                    c.grading = g.grading;
                    break;
                }
                else if(c.nameId !== g.nameId){
                    c.grading = "N/A"
                }
            }
        }

        returnData.push({
            chart: averagesList,
            table: clientList     
        });

        resolve(returnData);
    });
}


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
            reject(err);
        });
    });
}


//method to get the billed amount
exports.getBilled = async (startDateStr, endDateStr, yearMonthList) => {
    let billedList = [];
    let startDate = new Date(parseInt(startDateStr.substring(5, 7)) + " " + parseInt(startDateStr.substring(8)) + " " + parseInt(startDateStr.substring(0, 4)));
    let endDate = new Date(parseInt(endDateStr.substring(5, 7)) + " " + parseInt(endDateStr.substring(8)) + " " + parseInt(endDateStr.substring(0, 4)));
    endDate.setMonth(endDate.getMonth() - (yearMonthList.length - 1));

    startDate.setUTCHours(0, 0, 0, 0);
    endDate.setUTCHours(0, 0, 0, 0);

    return new Promise(async (resolve, reject) => {
        await InvoiceAffectDao.getInvoicesByDate(startDateStr, endDateStr).then(async data => {
            if (data) {
                yearMonthList.forEach(ym => {
                    let billed = 0;

                    data.forEach(i => {
                        if (i.invoiceDate >= startDate && i.invoiceDate < endDate) {
                            billed += i.amount;
                            clientIDList.push(i.actorId);
                        }
                    });

                    
                    
                    billedList.push({
                        month: ym,
                        billed: billed
                    });

                    startDate.setUTCMonth(startDate.getUTCMonth() + 1);
                    endDate.setUTCMonth(endDate.getUTCMonth() + 1);
                });
                
                clientIDList = [...new Set(clientIDList)];
                resolve(billedList);
            }
            resolve(false);
        }).catch(err => {
            reject(err);
        });
    });
};


let clientIDList = [];

// method to get the names and countries based by clients id
exports.getNamesAndCountries = async (clientsID) => {

    let formattedClientList = [];
    return new Promise(async (resolve, reject) => {
        
        await ClientDao.getClientByID(clientsID).then(async data => {

            if(data){
                data.forEach(i => {
 
                    formattedClientList.push({
                        nameId: i.nameId,
                        name:  i.name,
                        country: i.country,
                        grading: ""
                    });
                });

                resolve(formattedClientList);
            }
            resolve(false);
        }).catch(err => {
            reject(err);
        })
    });
}



//method to get the client grading
exports.getClientGrading = async(idList) => {

    let gradingList = [];

    return new Promise(async (resolve, reject) => {
        await ClientGradingDao.getClientGrading(idList).then(async data => {
            if(data){
                data.forEach(g => {
                    gradingList.push({
                      nameId: g.nameId,
                      grading: g.grading
                    });
                });
                resolve(gradingList);
            }
            resolve(false);
        }).catch(err => {
            reject(err);
        })
    });
}


exports.getCountriesName = async () => {
    let countryList = [];

    return new Promise(async (resolve, reject) => {
        await CountryDao.getAllCountries().then(async data => {
            if(data){
                data.forEach(country => {
                    countryList.push({
                        countryCode: country.countryCode,
                        countryLabel: country.countryLabel
                     });
                });
                resolve(countryList);
            }
            resolve(false);
        }).catch(err => {
            reject(err);
        });
    });
}