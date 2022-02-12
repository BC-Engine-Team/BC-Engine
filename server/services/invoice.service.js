const TransacStatDao = require("../data_access_layer/daos/transac_stat.dao");
const InvoiceAffectDao = require("../data_access_layer/daos/invoice_affect.dao");
const NameQualityDao = require("../data_access_layer/daos/name_quality.dao");
const ClientDao = require("../data_access_layer/daos/name.dao");
const ClientGradingDao = require("../data_access_layer/daos/client_grading.dao")



exports.getAverages = async (startDateStr, endDateStr, employeeId = undefined, clientType = undefined) => {
    return new Promise(async (resolve, reject) => {
        // List to hold the final response
        let returnData = [];

        // Lists used for main calculation
        let averagesList = [];
        let totalDuesList = [];
        let billedList = [];

        // List used to filter Bills by employee
        let clientsByEmployee;

        // Lists used for the Clients Table
        let clientIDList = [];
        let clientGradingList = [];
        let clientList = [];

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

        if (employeeId !== undefined) {
            clientsByEmployee = [];
            await this.getClientsByEmployee(employeeId).then(async data => {
                clientsByEmployee = data;
            }).catch(err => {
                reject(err);
            });
        }

        // Get the list of total dues for each month
        await this.getDues(yearMonthList, employeeId, clientType).then(async data => {
            totalDuesList = data;
        }).catch(err => {
            reject(err);
        });

        // prepare startDate to get billed amount for each month
        startDate.setMonth(startDate.getMonth() - 12);
        let theMonth = startDate.getMonth() + 1;
        startDateStr = startDate.getFullYear() + "-" + theMonth + "-01";

        // Get list of amount billed for each month (previous 12 months)
        await this.getBilled(startDateStr, endDateStr, yearMonthList, employeeId, clientType).then(async data => {
            billedList = data.billedList;
            clientIDList = data.clientIDList;
        }).catch(err => {
            reject(err);
        });

        // Get List of Client Id, Name and Country
        await this.getNamesAndCountries(clientIDList).then(async data => {
            clientList = data;
        }).catch(err => {
            reject(err);
        });

        let nameIdList = [];
        clientList.forEach(c => {
            nameIdList.push(c.nameId);
        });

        // Get List of Client Id and Client Grading
        await this.getClientGrading(nameIdList.length === 0 ? [-1000] : nameIdList).then(async data => {
            clientGradingList = data;
        }).catch(err => {
            reject(err);
        });

        // Associate clients with the appropriate grading
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

        // Group averages List by year
        const groupedAverages = averagesList.reduce((groups, item) => ({
            ...groups,
            [item.group]: [...(groups[item.group] || []), item]
        }), {});

        returnData.push({
            chart: groupedAverages,
            table: clientList
        });

        resolve(returnData);
    });
}

exports.prepareDuesQuery = (yearMonthList, employeeId, clientType) => {
    let query = {
        queryString: "SELECT ACS.DUE_CURRENT, ACS.DUE_1_MONTH, ACS.DUE_2_MONTH, ACS.DUE_3_MONTH, ACS.YEAR_MONTH ",
        replacements: [yearMonthList]
    };

    let fromString = "FROM ACCOUNTING_CLIENT_STAT ACS ";
    let whereString = "WHERE ACS.YEAR_MONTH in (?) AND ACS.CONNECTION_ID=3 AND ACS.STAT_TYPE=1";

    if (employeeId !== undefined) {
        fromString = fromString.concat(", NAME_CONNECTION NC, NAME_QUALITY NQ1, NAME RESP ");
        whereString = whereString.concat(" AND NC.CONNECTION_ID=3 AND NC.CONNECTION_NAME_ID=CONVERT(NVARCHAR,ACS.ACC_NAME_ID) \
                                            AND NQ1.NAME_ID=NC.NAME_ID AND NQ1.QUALITY_TYPE_ID=5 \
                                            AND CONVERT(NVARCHAR,RESP.NAME_ID)=NQ1.DROPDOWN_CODE \
                                            AND NQ1.DROPDOWN_CODE=? ");
        query.replacements.push(employeeId);
    }

    if (clientType !== undefined) {
        fromString = fromString.includes("NAME_CONNECTION NC") ?
            fromString : fromString.concat(", NAME_CONNECTION NC ");
        fromString = fromString.concat(", NAME_QUALITY NQ2 ");

        whereString = whereString.includes("AND NC.CONNECTION_ID=3") ?
            whereString : whereString.concat(" AND NC.CONNECTION_ID=3 ");
        whereString = whereString.includes("AND NC.CONNECTION_NAME_ID=CONVERT(NVARCHAR, ACS.ACC_NAME_ID)") ?
            whereString : whereString.concat(" AND NC.CONNECTION_NAME_ID=CONVERT(NVARCHAR, ACS.ACC_NAME_ID) ");
        whereString = whereString.concat("AND NC.NAME_ID=NQ2.NAME_ID\
                                            AND NQ2.QUALITY_TYPE_ID=3\
                                            AND NQ2.DROPDOWN_CODE=?");
        query.replacements.push(clientType.toUpperCase());
    }

    query.queryString = query.queryString.concat(fromString, whereString);

    return query;
}



exports.getDues = async (yearMonthList, employeeId = undefined, clientType = undefined) => {
    return new Promise(async (resolve, reject) => {
        let totalDuesList = [];

        let preparedQuery = this.prepareDuesQuery(yearMonthList, employeeId, clientType);

        await TransacStatDao.getTransactionsStatByYearMonth(preparedQuery)
            .then(async data => {
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
            })
            .catch(err => {
                const response = {
                    status: err.status || 500,
                    message: err.message || "Could not get dues."
                };
                reject(response);
            })

        // const getDues_ = (ymList, data) => {
        //     ymList.forEach(ym => {
        //         let totalDues = 0;
        //         data.forEach(e => {
        //             if (e.yearMonth === ym) {
        //                 totalDues += (e.dueCurrent + e.due1Month + e.due2Month + e.due3Month);
        //             }
        //         });
        //         totalDuesList.push({
        //             month: ym.toString(),
        //             totalDues: totalDues.toFixed(2)
        //         });
        //     });
        //     resolve(totalDuesList);
        // }

        // if (employeeId === undefined) {
        //     await TransacStatDao.getTransactionsStatByYearMonth(yearMonthList, clientType).then(async data => {
        //         if (data) getDues_(yearMonthList, data);
        //         else resolve(false);
        //     }).catch(err => {
        //         reject(err);
        //     });
        // }
        // else {
        //     await TransacStatDao.getTransactionsStatByYearMonthAndEmployee(yearMonthList, employeeId).then(async data => {
        //         if (data) getDues_(yearMonthList, data);
        //         else resolve(false);
        //     }).catch(err => {
        //         reject(err);
        //     });
        // }
    });
}

exports.prepareBilledQuery = (startDate, endDate, employeeId, clientType) => {
    let query = {
        queryString: "SELECT IH.INVOCIE_DATE, IH.ACTOR_ID, BIA.AFFECT_AMOUNT ",
        replacements: [startDate, endDate]
    };

    let fromString = "FROM  BOSCO_INVOICE_AFFECT BIA, INVOICE_HEADER IH ";
    let whereString = "WHERE IH.INVOICE_TYPE in (1,4) AND IH.INVOICE_PREVIEW=0 \
                        AND IH.INVOCIE_DATE BETWEEN ? AND ? \
                        AND BIA.INVOICE_ID=IH.INVOICE_ID AND \
                        BIA.AFFECT_ACCOUNT LIKE '%1200%' ";

    if (employeeId !== undefined) {
        fromString = fromString.concat(" LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_CONNECTION NC ON NC.CONNECTION_ID=1",
            " AND NC.CONNECTION_NAME_ID=CONVERT(nvarchar, IH.ACTOR_ID) ",
            " LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_QUALITY NQ1 ",
            " ON NQ1.NAME_ID=NC.NAME_ID ",
            " AND NQ1.QUALITY_TYPE_ID=5 ");
        whereString = whereString.concat(" AND NQ1.DROPDOWN_CODE=? ");
        query.replacements.push(employeeId);
    }

    if (clientType !== undefined) {
        fromString = fromString.includes("LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_CONNECTION NC ON NC.CONNECTION_ID=1 AND NC.CONNECTION_NAME_ID=CONVERT(nvarchar, IH.ACTOR_ID)") ?
            fromString : fromString.concat(" LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_CONNECTION NC ON NC.CONNECTION_ID=1 AND NC.CONNECTION_NAME_ID=CONVERT(nvarchar, IH.ACTOR_ID) ");
        fromString = fromString.concat(" LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_QUALITY NQ2 ",
            " ON NQ2.NAME_ID=NC.NAME_ID ",
            " AND NQ2.QUALITY_TYPE_ID=3 ");
        whereString = whereString.concat(" AND NQ2.DROPDOWN_CODE=? ");
        query.replacements.push(clientType.toUpperCase());
    }

    query.queryString = query.queryString.concat(fromString, whereString);

    return query;
}

exports.getBilled = async (startDateStr, endDateStr, yearMonthList, employeeId = undefined, clientType = undefined) => {

    let startDate = new Date(parseInt(startDateStr.substring(5, 7)) + " " + parseInt(startDateStr.substring(8)) + " " + parseInt(startDateStr.substring(0, 4)));
    let endDate = new Date(parseInt(endDateStr.substring(5, 7)) + " " + parseInt(endDateStr.substring(8)) + " " + parseInt(endDateStr.substring(0, 4)));
    endDate.setMonth(endDate.getMonth() - (yearMonthList.length - 1));

    startDate.setUTCHours(0, 0, 0, 0);
    endDate.setUTCHours(0, 0, 0, 0);

    return new Promise(async (resolve, reject) => {

        let preparedQuery = this.prepareBilledQuery(startDateStr, endDateStr, employeeId, clientType);

        await InvoiceAffectDao.getInvoicesByDate(preparedQuery)
            .then(async data => {
                if (data) {
                    let billedList = [];
                    let clientIDList = [];
                    let returnData = {};

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

                    returnData = {
                        billedList: billedList,
                        clientIDList: clientIDList
                    };

                    resolve(returnData);
                }
                resolve(false);
            })
            .catch(err => {
                console.log(err)
                const response = {
                    status: err.status || 500,
                    message: err.message || "Could not fetch bills."
                }
                reject(response);
            });

        // const getBilled_ = (yearMonthLists, data) => {
        //     let billedList = [];
        //     let clientIDList = [];
        //     let returnData = {};

        //     yearMonthLists.forEach(ym => {
        //         let billed = 0;

        //         data.forEach(i => {
        //             if (i.invoiceDate >= startDate && i.invoiceDate < endDate) {
        //                 billed += i.amount;
        //                 clientIDList.push(i.actorId);
        //             }
        //         });

        //         billedList.push({
        //             month: ym,
        //             billed: billed
        //         });

        //         startDate.setUTCMonth(startDate.getUTCMonth() + 1);
        //         endDate.setUTCMonth(endDate.getUTCMonth() + 1);
        //     });
        //     clientIDList = [...new Set(clientIDList)];

        //     returnData = {
        //         billedList: billedList,
        //         clientIDList: clientIDList
        //     };

        //     resolve(returnData);
        // }

        // if (clientsList === undefined) {
        //     await InvoiceAffectDao.getInvoicesByDate(startDateStr, endDateStr).then(async data => {
        //         if (data) getBilled_(yearMonthList, data);
        //         else resolve(false);
        //     }).catch(err => {
        //         reject(err);
        //     })
        // }
        // else {
        //     if (clientsList.length === 0) {
        //         getBilled_(yearMonthList, [{ invoiceDate: null, billed: null, actorId: null }])
        //     }
        //     else {
        //         await InvoiceAffectDao.getInvoicesByDateAndEmployee(startDateStr, endDateStr, clientsList).then(async data => {
        //             if (data) getBilled_(yearMonthList, data);
        //             else resolve(false);
        //         }).catch(err => {
        //             reject(err);
        //         });
        //     }
        // }
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
exports.getNamesAndCountries = async (clientsID) => {

    let formattedClientList = [];
    return new Promise(async (resolve, reject) => {
        await ClientDao.getClientByID(clientsID.length === 0 ? [-1000] : clientsID).then(async data => {

            if (data) {
                data.forEach(i => {

                    formattedClientList.push({
                        nameId: i.nameId,
                        name: i.name,
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