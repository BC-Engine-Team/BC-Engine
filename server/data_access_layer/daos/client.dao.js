const database = require('../databases')['mssql_bosco'];
const ClientModel = database.clients;
const { Op, QueryTypes } = require('sequelize');


exports.getClientByID = async (clientIDList, clientModel=ClientModel) => {

    return new Promise((resolve, reject) => {

        try{
            const data = database.query(
                "SELECT N.NAME_ID, N.NAME_1, N.NAME_2, N.NAME_3, C.COUNTRY_LABEL \
                FROM [Bosco reduction].[dbo].[NAME] N, [Bosco reduction].[dbo].[NAME_CONNECTION] NC, [Bosco reduction].[dbo].[COUNTRY] C \
                WHERE NC.CONNECTION_NAME_ID in ? \
                AND NC.NAME_ID = N.NAME_ID \
                AND N.LEGAL_COUNTRY_CODE = C.COUNTRY_CODE",
                {
                    replacements: [clientIDList],
                    type: QueryTypes.SELECT
                }
            );
            
            if(data) resolve(data);
            reject(false);
        }
        catch(err){
            reject(err);
        }
    });
}


// if(data){
//     let returnData = [];
//     for(let i=0; i<data.length;i++){
//         returnData.push(data[i].dataValues);
//     }
//     resolve(returnData);
// }
// resolve(false);