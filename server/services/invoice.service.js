const TransacStatDao = require("../data_access_layer/daos/transac_stat.dao");
const InvoiceAffectDao = require("../data_access_layer/daos/invoice_affect.dao");
const ClientDao = require("../data_access_layer/daos/name.dao");
const ClientGradingDao = require("../data_access_layer/daos/client_grading.dao")
const CountryDao = require("../data_access_layer/daos/country.dao")
const NameQualityDao = require("../data_access_layer/daos/name_quality.dao");


let clientIDList = [];

exports.getAverages = async (startDateStr, endDateStr,  employeeId = undefined, countryCode = undefined) => {

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
        let clientsList;
        let nameIdList = [];
        let clientGradingList = [];
        let returnData = [];


        let startDate = new Date(`${startDateStr} 00:00:00`);
        let endDate = new Date(`${endDateStr} 00:00:00`);
        if (startDate > endDate) {
            const response = {
                status: 400,
                message: "Invalid date order."
            }
            reject(response);
        }

        let yearMonthList = this.getYearMonth(startDateStr, endDateStr);


        // prepare the clientsList from the specified employee if there is a country or not
        if(employeeId !== undefined) {
            clientsList = [];
            await this.getClientsByEmployee(employeeId).then(async data => {
                clientsList = data;
            }).catch(err => {
                reject(err);
            });
        }
        

        // prepare startDate to get billed amount for each month
        startDate.setMonth(startDate.getMonth() - 12);
        let theMonth = startDate.getMonth() + 1;
        startDateStr = startDate.getFullYear() + "-" + theMonth + "-01";


        // Get the list of total dues for each month
        await this.getDues(yearMonthList, employeeId, countryCode).then(async data => {
            totalDuesList = data;
        }).catch(err => {
            reject(err);
        });


        // Get list of amount billed for each month (previous 12 months)
        await this.getBilled(startDateStr, endDateStr, yearMonthList, clientsList, countryCode).then(async data => {
            billedList = data;
        }).catch(err => {
            reject(err);
        });

        //Get list of client based by actor id
        await this.getNamesAndCountries(clientIDList, employeeId, countryCode).then(async data => {
            clientList = data;
        }).catch(err => {
            reject(err);
        });


        // Populate average list with average for each month
        if (totalDuesList.length === 0 || billedList.length === 0) return;
        let counter = 0;
        yearMonthList.forEach(ym => {
            let average = totalDuesList[counter].totalDues / billedList[counter].billed * 365;
            let year = parseInt(ym.toString().substring(0, 4));
            averagesList.push({
                month: ym,
                average: average.toFixed(2),
                group: year
            });
            counter++;
        });


        const groupedAverages = averagesList.reduce((groups, item) => ({
            ...groups,
            [item.group]: [...(groups[item.group] || []), item]
        }), {});


        clientList.forEach(c => {
            nameIdList.push(c.nameId);
        });

        if(nameIdList.length !== 0) {
            await this.getClientGrading(nameIdList).then(async data => {
                clientGradingList = data;
            }).catch(err => {
                reject(err);
            });
        }
        
        for (const c of clientList) {
            for (const g of clientGradingList) {
                if (c.nameId === g.nameId) {
                    c.grading = g.grading;
                    break;
                }
                else if (c.nameId !== g.nameId) {
                    c.grading = "N/A"
                }
            }
        }

        returnData.push({
            chart: groupedAverages,
            table: clientList
        });

        resolve(returnData);
    });
}


exports.getDues = async (yearMonthList, employeeId = undefined, countryCode = undefined) => {
    let totalDuesList = [];

    return new Promise(async (resolve, reject) => {

        const getDues_ = (ymList, data) => {
            ymList.forEach(ym => {
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

        if(employeeId !== undefined && countryCode === undefined) {
            await TransacStatDao.getTransactionsStatByYearMonthAndEmployee(yearMonthList, employeeId).then(async data => {
                if (data) getDues_(yearMonthList, data);
                else resolve(false);
            }).catch(err => {
                reject(err);
            });
        }
        else if (employeeId === undefined && countryCode !== undefined){
            await TransacStatDao.getTransactionsStatByYearMonthAndCountry(yearMonthList, countryCode).then(async data => {
                if (data) getDues_(yearMonthList, data);
                else resolve(false);
            }).catch(err => {
                reject(err);
            });
        }
        else if (employeeId !== undefined && countryCode !== undefined){
            await TransacStatDao.getTransactionsStatByYearMonthAndEmployeeAndCountry(yearMonthList, employeeId, countryCode).then(async data => {
                if (data) getDues_(yearMonthList, data);
                else resolve(false);
            }).catch(err => {
                reject(err);
            });
        }
        else {
            await TransacStatDao.getTransactionsStatByYearMonth(yearMonthList).then(async data => {
                if (data) getDues_(yearMonthList, data);
                else resolve(false);
            }).catch(err => {
                reject(err);
            });
        }
    });
}






//method to get the bill amount
exports.getBilled = async (startDateStr, endDateStr, yearMonthList, clientsList = undefined, countryCode = undefined) => {
    let billedList = [];
    let startDate = new Date(parseInt(startDateStr.substring(5, 7)) + " " + parseInt(startDateStr.substring(8)) + " " + parseInt(startDateStr.substring(0, 4)));
    let endDate = new Date(parseInt(endDateStr.substring(5, 7)) + " " + parseInt(endDateStr.substring(8)) + " " + parseInt(endDateStr.substring(0, 4)));
    endDate.setMonth(endDate.getMonth() - (yearMonthList.length - 1));

    startDate.setUTCHours(0, 0, 0, 0);
    endDate.setUTCHours(0, 0, 0, 0);

    return new Promise(async (resolve, reject) => {

        const getBilled_ = (yearMonthLists, data) => {
            yearMonthLists.forEach(ym => {
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

        if (clientsList !== undefined && countryCode === undefined) {
            await InvoiceAffectDao.getInvoicesByDateAndEmployee(startDateStr, endDateStr, clientsList).then(async data => {
                if (data) getBilled_(yearMonthList, data);
                else resolve(false);
            }).catch(err => {
                reject(err);
            })
        }

        else if (clientsList === undefined && countryCode !== undefined) {
            await InvoiceAffectDao.getInvoicesByDateAndCountry(startDateStr, endDateStr, countryCode).then(async data => {
                if (data) getBilled_(yearMonthList, data);
                else resolve(false);
            }).catch(err => {
                reject(err);
            })
        }

        else if (clientsList !== undefined && countryCode !== undefined) {
            await InvoiceAffectDao.getInvoicesByDateAndEmployeeAndCountry(startDateStr, endDateStr, clientsList, countryCode).then(async data => {
                if (data) getBilled_(yearMonthList, data);
                else resolve(false);
            }).catch(err => {
                reject(err);
            })
        }

        else {
            await InvoiceAffectDao.getInvoicesByDate(startDateStr, endDateStr).then(async data => {
                if (data) getBilled_(yearMonthList, data);
                else resolve(false);
            }).catch(err => {
                reject(err);
            })
        } 
    });
}



exports.getClientsByEmployee = async (employeeId) => {
    return new Promise(async (resolve, reject) => {
        await NameQualityDao.getClientsByEmployee(employeeId).then(async data => {
            if (data) resolve(data)
            resolve(false);
        }).catch(err => {
            reject(err);
        });
    });
}




exports.getYearMonth = (startDateStr, endDateStr) => {
    let yearMonthList = [];

    const startYear = parseInt(startDateStr.split('-')[0]);
    let startMonth = parseInt(startDateStr.split('-')[1]);
    const endYear = parseInt(endDateStr.split('-')[0]);
    const endMonth = parseInt(endDateStr.split('-')[1]);

    // make list of yearMonth [201911,202001,202002,...] to select dues
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

    return yearMonthList;
}


// method to get the names and countries based by clients id
exports.getNamesAndCountries = async (clientsID, employeeId = undefined, countryCode = undefined) => {

    let formattedClientList = [];
    return new Promise(async (resolve, reject) => {
        

        const getNamesAndCountries_ = (formattedClientList, data) => {
           
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


        if (countryCode !== undefined && employeeId === undefined){
            await ClientDao.getClientByIDAndCountry(clientsID, countryCode).then(async data => {
                if (data) getNamesAndCountries_(formattedClientList, data);
                else resolve(false);
            }).catch(err => {
                reject(err);
            })
        }
        else if (countryCode === undefined && employeeId !== undefined){
            await ClientDao.getClientByIDAndEmployee(clientsID, employeeId).then(async data => {
                if (data) getNamesAndCountries_(formattedClientList, data);
                else resolve(false);
            }).catch(err => {
                reject(err);
            })
        }
        else if (countryCode !== undefined && employeeId !== undefined){
            await ClientDao.getClientByIDAndEmployeeAndCountry(clientsID, employeeId, countryCode).then(async data => {
                if (data) getNamesAndCountries_(formattedClientList, data);
                else resolve(false);
            }).catch(err => {
                reject(err);
            })
        }
        else{
            await ClientDao.getClientByID(clientsID).then(async data => {
                if (data) getNamesAndCountries_(formattedClientList, data);
                else resolve(false);
            }).catch(err => {
                reject(err);
            })
        }
    });
}



//method to get the client grading
exports.getClientGrading = async (idList) => {

    let gradingList = [];

    return new Promise(async (resolve, reject) => {
        await ClientGradingDao.getClientGrading(idList).then(async data => {
            if (data) {
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