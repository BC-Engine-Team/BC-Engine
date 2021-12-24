const mysqldb = require("../data_access_layer/databases");
const Invoice = mysqldb['mssql_pat'].invoice_header;
const Transaction = mysqldb['mssql_bosco'].transactions;
const { Op } = require('sequelize');


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

exports.getTransactionsBetweenDates = async () => {
    const startDate = new Date("2019-11-01 00:00:00");
    const endDate = new Date("2020-10-31 11:59:59");

    return new Promise(async (resolve, reject) => {
        let invoiceListAsString = [];
        let totalBilled;
        let totalActualDues = 0;
        let totalByMonth = dateRange("2019-11-01", "2020-10-31");

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
                [mysqldb['mssql_pat'].fn('YEAR', mysqldb['mssql_pat'].col('INVOCIE_DATE')), 'year'],
                [mysqldb['mssql_pat'].fn('MONTH', mysqldb['mssql_pat'].col('INVOCIE_DATE')), 'month']
            ],
            group: ['INVOICE_ID', 'FOREIGN_CURR_VALUE', 'INVOCIE_DATE']
        })
        .then(async data => {
            if(data ){
                for(let u=0; u<data.length; u++) {
                    invoiceListAsString.push(data[u].dataValues.INVOICE_ID.toString());

                    billed = data[u].dataValues.FOREIGN_CURR_VALUE;
                    month = data[u].dataValues.month;
                    year = data[u].dataValues.year;

                    for(let j = 0; j < totalByMonth.length; j++) {
                        if(year === totalByMonth[j].year) {

                            for(let k = 0; k < totalByMonth[j].months.length; k++) {
                                if(month === totalByMonth[j].months[k].month) {
                                    totalByMonth[j].months[k].billed += billed
                                }
                            }
                        }
                    }
                }
            } 
        })
        .catch(err =>{
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
                [mysqldb['mssql_bosco'].fn('sum', mysqldb['mssql_bosco'].col('TRANSACTION_AMOUNT')), 'dues'],
                [mysqldb['mssql_bosco'].fn('YEAR', mysqldb['mssql_bosco'].col('CLEARING_DUE_DATE')), 'year'],
                [mysqldb['mssql_bosco'].fn('MONTH', mysqldb['mssql_bosco'].col('CLEARING_DUE_DATE')), 'month']
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
                        if(year === totalByMonth[j].year) {

                            for(let k = 0; k < totalByMonth[j].months.length; k++) {
                                if(month === totalByMonth[j].months[k].month) {
                                    totalByMonth[j].months[k].dues += dues
                                }
                            }
                        }
                    }
                }

                // Find total billing for the year
                for(let j = 0; j < totalByMonth.length; j++) {
                    for(let k = 0; k < totalByMonth[j].months.length; k++) {
                        totalBilled = totalByMonth[j].months[k].billed
                    }
                }

                // Find the actual dues for the year
                for(let j = 0; j < totalByMonth.length; j++) {
                    for(let k = 0; k < totalByMonth[j].months.length; k++) {
                        totalActualDues += totalByMonth[j].months[k].billed - totalByMonth[j].months[k].dues
                    }
                }

                // Formula to find the average number of days of collection
                total = Math.round((((totalActualDues / 12) / totalBilled) * 365))

                let returnData = {
                    average: total
                }
                resolve(returnData);
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

function dateRange(startDate, endDate) {
    var start      = startDate.split('-');
    var end        = endDate.split('-');
    var startYear  = parseInt(start[0]);
    var endYear    = parseInt(end[0]);
    var dates      = [];
    var months     = [];
  
    for(var i = startYear; i <= endYear; i++) {
        var endMonth = i != endYear ? 11 : parseInt(end[1]) - 1;
        var startMon = i === startYear ? parseInt(start[1]) - 1 : 0;

        for(var j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j + 1) {
            var month = j + 1;
            var displayMonth = month < 10 ? '0' + month : month;

            months.push({
                month: parseInt(displayMonth), 
                dues: 0, 
                billed: 0
            });
        }

        dates.push({
            year: i,
            months: months,
        })
        months = [];
    }
    return dates;
}