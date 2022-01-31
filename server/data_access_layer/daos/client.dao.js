const database = require('../databases')['mssql_bosco'];
const ClientModel = database.clients;
const { QueryTypes } = require('sequelize');


exports.getClientByID = async (clientIDList, db=database) => {

    return new Promise(async (resolve, reject) => {

        try{
            const data = await db.query(
                "SELECT DISTINCT N.NAME_ID, ISNULL(N.NAME_1,'')+ISNULL(' '+N.NAME_2,'')+ISNULL(' '+N.NAME_3,'') as NAME, C.COUNTRY_LABEL \
                FROM [Bosco reduction].[dbo].[NAME] N, [Bosco reduction].[dbo].[NAME_CONNECTION] NC, [Bosco reduction].[dbo].[COUNTRY] C \
                WHERE NC.CONNECTION_NAME_ID in (?) \
                AND NC.NAME_ID = N.NAME_ID \
                AND N.LEGAL_COUNTRY_CODE = C.COUNTRY_CODE",
                {
                    replacements: [clientIDList],
                    type: QueryTypes.SELECT
                }
            );
            if(data){
                let returnData = [];
                data.forEach(c => {
                    returnData.push({
                        nameId: c["NAME_ID"],
                        name: c["NAME"],
                        country: c["COUNTRY_LABEL"]
                    });
                });
                resolve(returnData);
            }
            resolve(false);
        }
        catch(err){
            reject(err);
        }
    });
}