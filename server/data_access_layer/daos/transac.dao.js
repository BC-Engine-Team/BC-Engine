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