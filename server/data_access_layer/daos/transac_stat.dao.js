const databases = require('../databases');
const TransacStatModel = databases['mssql_bosco'].transactions_stat;
const { Op } = require('sequelize');

exports.getTransactionsStatByYearMonth = async (yearMonthList, transacStatModel=TransacStatModel) => {
    return new Promise((resolve, reject) => {
        transacStatModel.findAll({
            where: {
                yearMonth: yearMonthList,
                connectionId: 3
            }
        }).then(async data => {
            if(data){
                let returnData = [];
                for(let i=0; i<data.length;i++){
                    returnData.push(data[i].dataValues);
                }
                resolve(returnData);
            }
            resolve(false);
        }).catch(err => {
            console.log(err);
            reject(err);
        })
    })
}

exports.getTransactionsByTransactionDate = async (startDate, endDate, transacStatModel=TransacStatModel) => {
    return new Promise((resolve, reject) => {
        transacStatModel.findAll({
            where: {
                connectionId: 3,
                amount: {
                    [Op.gt]: 0
                },
                dueCurrent: {
                    [Op.not]: 0
                },
                transactionDate: {
                    [Op.lt]: endDate,
                    [Op.gte]: startDate
                }
            }
        }).then(async data => {
            if(data){
                let returnData = [];
                for(let i=0; i<data.length;i++){
                    returnData.push(data[i].dataValues);
                }
                resolve(returnData);
            }
            resolve(false);
        })
        .catch(err => {
            reject(err);
        });
    })
}