const databases = require('../databases');
const ClientModel = databases['mssql_bosco'].clients;
const { Op } = require('sequelize');


exports.getClientByID = async (clientIDList, clientModel=ClientModel) => {
    return new Promise((resolve, reject) => {
        clientModel.findAll({
            where: {
                nameId: clientIDList
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