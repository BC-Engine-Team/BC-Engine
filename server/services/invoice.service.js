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
        let invoiceList = [];
        let totalBilled;
        let totalDues;

        await Invoice.findAll({
            where: {
                "INVOICE_TYPE": 1,
                "INVOCIE_DATE": {
                    [Op.between] : [startDate, endDate]
                }
            },
            attributes: [
                'INVOICE_ID', 
                // [mysqldb['mssql_pat'].fn('sum', mysqldb['mssql_pat'].col('FOREIGN_CURR_VALUE')), 'totalBilled']
            ]
        })
        .then(async data => {
            if(data){
                for(let u=0; u<data.length; u++){
                    invoiceList.push(data[u].dataValues.INVOICE_ID);
                    invoiceListAsString.push(data[u].dataValues.INVOICE_ID.toString());
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

        await Invoice.findAll({
            where: {
                'INVOICE_ID': invoiceList
            },
            attributes: [
                [mysqldb['mssql_pat'].fn('sum', mysqldb['mssql_pat'].col('FOREIGN_CURR_VALUE')), 'totalBilled']
            ]
        })
        .then(async data => {
            if(data){
                totalBilled = data[0].dataValues.totalBilled
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
                [mysqldb['mssql_bosco'].fn('sum', mysqldb['mssql_bosco'].col('TRANSACTION_AMOUNT')), 'totalDues']
            ]
        })
        .then(async data => {
            if(data){
                totalDues = data[0].dataValues.totalDues

                total = ((((totalBilled - totalDues) / 12) / totalBilled) * 365)
                resolve(total);
            } 
            resolve(false);
        })
        .catch(err =>{
            const response = {
                status: 500,
                data: {},
                message: err.message || "some error occured"
            }
            console.log(err)
            reject(response);
        });
    });
};