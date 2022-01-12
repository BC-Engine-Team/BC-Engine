const databases = require("../data_access_layer/databases");
const Invoice = databases['mssql_pat'].invoice_header;
const Transaction = databases['mssql_bosco'].transactions;
const TransacStatDao = require("../data_access_layer/daos/transac.dao");
const { Op } = require('sequelize');
const { gt, lte } = require("sequelize/dist/lib/operators");


exports.getAllInvoices = async () => {
    return new Promise((resolve, reject) => {
        Invoice.findAll()
        .then(async data => {
            if(data){
                let returnData = [];
                for(let u=0; u<data.length; u++){
                    returnData.push({
                        actorId: data[u].dataValues.actorId,
                        invoiceId: data[u].dataValues.invoiceId,
                        invoiceDate: data[u].dataValues.invoiceDate,
                        invoiceType: data[u].dataValues.invoiceType,
                        foreignCurrencyValue : data[u].dataValues.foreignCurrencyValue
                    });
                }
                resolve(returnData);
            } 
            resolve(false);
        })
        .catch(err =>{
            const response = {
                status: 500,
                data: {},
                message: err.message || "some error occured"
            }
            reject(response);
        });
    });
};

exports.getAllTransactions = async () => {
    return new Promise((resolve, reject) => {
        Transaction.findAll()
            .then(async data => {
                if(data){
                    let returnData = [];
                    for(let u=0; u<data.length; u++){
                        returnData.push({
                            connectionId: data[u].dataValues.connectionId,
                            transactionRef: data[u].dataValues.transactionRef,
                            clearingDueDate: data[u].dataValues.clearingDueDate,
                            transactionAmmount: data[u].dataValues.transactionAmmount
                        });
                    }
                    resolve(returnData);
                } 
                resolve(false);
            })
            .catch(err =>{
                const response = {
                    status: 500,
                    data: {},
                    message: err.message || "some error occured"
                }
                reject(response);
            });
    });
};


exports.getDues = async (yearMonthList) => {
    let totalDuesList = [];

    return new Promise((resolve, reject) => {
        TransacStatDao.getTransactionsStatByYearMonth(yearMonthList).then(async data => {
            if(data){
                yearMonthList.forEach(ym => {
                    let totalDues = 0;
                    data.forEach(e => {
                        if(e.yearMonth === ym){
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
            reject(false);
    
        }).catch(err => {
            reject(err.message);
        });
    });
}

exports.getBilled = async (beginDate, finishDate, yearMonthList) => {
    let billedList = [];
    console.log("billedList");

    return new Promise((resolve, reject) => {
        TransacStatDao.getTransactionsByTransactionDate(beginDate, finishDate).then(async data => {
            if(data){
                finishDate.setMonth(finishDate.getMonth() - 11);
                yearMonthList.forEach(ym => {
                    let billed = 0;
                    data.forEach(e => {
                        if(e.transactionDate < finishDate && e.transactionDate >= beginDate){
                            billed += e.amount;
                        }
                    });
                    billedList.push({
                        month: ym.toString(),
                        billed: billed
                    });
                    finishDate.setMonth(finishDate.getMonth() + 1);
                    beginDate.setMonth(beginDate.getMonth() + 1);
                });
                resolve(billedList);
            }
            reject(false);
        })
        .catch(err => {
            reject(err.message);
        });
    });
}

exports.getAverages = async (startDate, endDate) => {
    const startYear = parseInt(startDate.split('-')[0]);
    let startMonth = parseInt(startDate.split('-')[1]);
    const endYear = parseInt(endDate.split('-')[0]);
    const endMonth = parseInt(endDate.split('-')[1]);

    let yearMonthList = [];
    for(let y = startYear; y <= endYear; y++){
        if(y != startYear) startMonth = 1;
        for(let m = startMonth; m <=12; m++){
            if(y == endYear && m > endMonth) break;
            let yearMonthStr = y.toString();
            if(m < 10) yearMonthStr += '0';
            yearMonthStr += m.toString();
            yearMonthList.push(parseInt(yearMonthStr));
        }
    }

    return new Promise(async (resolve, reject) => {
        let averagesList = [];
        let totalDuesList = [];
        let billedList = [];

        await this.getDues(yearMonthList).then(async data => {
            totalDuesList = data;
        }).catch(err => {
            reject(err.message);
        });

        let beginDate = new Date(`${startDate} 00:00:00`);
        let finishDate = new Date(`${endDate} 00:00:00`);
        beginDate.setMonth(beginDate.getMonth() - 12);

        await this.getBilled(beginDate, finishDate, yearMonthList).then(async data => {
            billedList = data;
        }).catch(err => {
            reject(err.message);
        });


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

exports.testInvoices = async () => {
    const MULTIPLIER = 365;
    const startDateString = "2019-12-01";
    const endDateString = "2020-12-01";
    const startDate = new Date(`${startDateString} 00:00:00`);
    let endDate = new Date(`${endDateString} 00:00:00`);
    let listOfAverageDues = [];
    let listOfBilled = [];
    let listOfAverages = [];

    return new Promise(async (resolve, reject) => {


        await Invoice.findAll({
            where: {
                
            }
        })


        let listOfTransactions = [];
        await Transaction.findAll({
            where: {
                connectionId: 3,
                transactionAmount: {
                    [Op.gt]: 0
                },
                transactionDate: {
                    [Op.lt]: endDate
                }
            }
        }).then(async data => {
            data.forEach(element => {
                listOfTransactions.push(element.dataValues);
            });

            for(let i = 0; i < 12; i++){
                if(i != 0){
                    startDate.setMonth(startDate.getMonth() - 1);
                    endDate.setMonth(endDate.getMonth() - 1);
                }
                
                let total = 0;
    
                listOfTransactions.forEach(t => {
                    if(t.transactionDate < endDate && t.transactionDate >= startDate){
                        total += t.transactionAmount;
                    }
                });
    
                listOfBilled.push(total);
            }
    
            console.log(listOfBilled);
    
            endDate = new Date(`${endDateString} 00:00:00`);
    
            for(let i = 0; i < 12; i++){
                if(i != 0){
                    endDate.setMonth(endDate.getMonth() - 1);
                }
                
                let totalDues = 0;
                let innerEndDate = new Date(endDate.toDateString());
                for(let i = 0; i < 12; i++){
                    if(i != 0){
                        innerEndDate.setMonth(innerEndDate.getMonth() - 1);
                    }
                    let billed = 0;
                    let paid = 0;
                    
                    listOfTransactions.forEach(t => {

                        if(t.transactionDate < innerEndDate){
                            billed += t.transactionAmount;
                        }
                        if(t.clearingLastTransaction < innerEndDate 
                            && t.clearingDueAmount === 0
                            && t.transactionDate < innerEndDate){
                            paid += t.transactionAmount;
                        }
                    });
                    totalDues += (billed - paid);
                }
                listOfAverageDues.push((totalDues / 12));
            }

            console.log(listOfAverageDues);
    
            endDate = new Date(`${endDateString} 00:00:00`);
            for(let i = 0; i < 12; i++){
                if(i != 0){
                    endDate.setMonth(endDate.getMonth() - 1);
                }
                let average = listOfAverageDues[i] / listOfBilled[i] * MULTIPLIER;
                let avgObject = {
                    month: endDate,
                    avg: average
                }
                listOfAverages.push(avgObject);
            }
    
            //console.log(listOfAverages);
            resolve(listOfAverages);

        }).catch(err => {
            reject(err.message);
        });
    });
    
}

exports.getTransactionsBetweenDates = async () => {
    const startDateString = "2018-12-01";
    const endDateString = "2020-10-31";
    const startDate = new Date(`${startDateString} 00:00:00`);
    const endDate = new Date(`${endDateString} 11:59:59`);

    return new Promise(async (resolve, reject) => {
        let invoiceListAsString = [];
        let totalBilled;
        let totalActualDues = 0;
        let totalByMonth = dateRange(startDateString, endDateString);

        await Invoice.findAll({
            where: {
                "INVOICE_TYPE": 1,
                "INVOCIE_DATE": {
                    [Op.between] : [startDate, endDate]
                }
            },
            attributes: [
                'INVOICE_ID',
                'FOREIGN_CURR_VALUE',
                [databases['mssql_pat'].fn('YEAR', databases['mssql_pat'].col('INVOCIE_DATE')), 'year'],
                [databases['mssql_pat'].fn('MONTH', databases['mssql_pat'].col('INVOCIE_DATE')), 'month']
            ],
            group: ['INVOICE_ID', 'FOREIGN_CURR_VALUE', 'INVOCIE_DATE']
        })
        .then(async data => {
            if(data) {
                for(let u = 0; u < data.length; u++) {
                    invoiceListAsString.push(data[u].dataValues.INVOICE_ID.toString());

                    billed = data[u].dataValues.FOREIGN_CURR_VALUE; 
                    month = data[u].dataValues.month;
                    year = data[u].dataValues.year;

                    for(let j = 0; j < totalByMonth.length; j++) {
                        if(year === totalByMonth[j].year && month === totalByMonth[j].month) {
                            totalByMonth[j].billed += billed;
                        }
                    }
                }
            } 
        })
        .catch(err => {
            const response = {
                status: 500,
                data: {},
                message: err.message || "some error occured"
            }
            reject(response);
        });

        Transaction.findAll({
            where: {
                "TRANSACTION_REF" : invoiceListAsString,
                "CLEARING_DUE_DATE": {
                    [Op.lte] : endDate
                }
            },
            attributes: [
                [databases['mssql_bosco'].fn('sum', databases['mssql_bosco'].col('TRANSACTION_AMOUNT')), 'dues'],
                [databases['mssql_bosco'].fn('YEAR', databases['mssql_bosco'].col('CLEARING_DUE_DATE')), 'year'],
                [databases['mssql_bosco'].fn('MONTH', databases['mssql_bosco'].col('CLEARING_DUE_DATE')), 'month']
            ],
            group: ['CLEARING_DUE_DATE']
        })
        .then(async data => {
            if(data) {
                    for(let i = 0; i < data.length; i++) {
                    let dues = data[i].dataValues.dues;
                    let month = data[i].dataValues.month;
                    let year = data[i].dataValues.year;

                    // Separate the values gotten by months to make calculations afterwards
                    for(let j = 0; j < totalByMonth.length; j++) {
                        if(year === totalByMonth[j].year && month === totalByMonth[j].month) {
                            totalByMonth[j].dues += dues;
                        }
                    }
                }
                
                resolve(getTotalsByMonth(totalByMonth));
            }
            resolve(false);
        })
        .catch(err => {
            const response = {
                status: 500,
                data: {},
                message: err.message || "some error occured"
            }
            reject(response);
        });
    });
};

dateRange = (startDate, endDate) => {
    let start      = startDate.split('-');
    let end        = endDate.split('-');
    let startYear  = parseInt(start[0]);
    let endYear    = parseInt(end[0]);
    let dates      = [];
    
    for(var i = startYear; i <= endYear; i++) {
        let endMonth = i != endYear ? 11 : parseInt(end[1]) - 1;
        let startMon = i === startYear ? parseInt(start[1]) - 1 : 0;

        for(let j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j + 1) {
            let month = j + 1;
            let displayMonth = month < 10 ? '0' + month : month;

            dates.push({
                year: i,
                month:  parseInt(displayMonth),
                dues: 0, 
                billed: 0
            });
        }
    }
    return dates;
}

getTotalsByMonth = (totalByMonth) => {
    let total;
    let returnData = [];
    console.log(totalByMonth)

// 23 length -> 12months (11)
// 18 months -> 29 length (11)

    for(let i = 1; i <= totalByMonth.length - 11; i++) {
        let totalBilled = 0;
        let totalActualDues = 0;
        let year;
        let month;

        let start = totalByMonth.length - i;
        let end = (totalByMonth.length - 11) - i;

        console.log(i)
        console.log(start)
        console.log(end)
        console.log("**************")
        for(let j = start; j >= end; j--) {
            if(year === undefined && month === undefined) {
                year = totalByMonth[j].year;

                // Get the month and year for the average
                if(totalByMonth[j].month === 12) {
                    month = 1;
                    year += 1;
                } else {
                    month = totalByMonth[j].month + 1;
                }
            }
            
            console.log(totalByMonth[j].year + " " + totalByMonth[j].month)

            // Find total billing for the year
            totalBilled += totalByMonth[j].billed;

            // Find the actual dues for the year
            totalActualDues += totalByMonth[j].billed - totalByMonth[j].dues;
        }
        console.log("11111111111")
        console.log(month)
        console.log(year)
        console.log(totalActualDues)
        console.log(totalBilled)
        console.log("11111111111")

        // Formula to find the average number of days of collection
        total = Math.round((((totalActualDues / 12) / totalBilled) * 365));

        returnData.push({
            year: year,
            month: month,
            average: total
        });
    }

    return returnData;
}