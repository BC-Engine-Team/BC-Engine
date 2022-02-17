const database = require('../databases').mssql_bosco
const { QueryTypes } = require('sequelize')

exports.getClientsInClientIdList = async (clientIDList, db = database) => {
  return new Promise(async (resolve, reject) => {
    try {
      const queryString = ''.concat("SELECT DISTINCT N.NAME_ID, ISNULL(N.NAME_1,'')+ISNULL(' '+N.NAME_2,'')+ISNULL(' '+N.NAME_3,'') as NAME, C.COUNTRY_LABEL, NQ.DROPDOWN_CODE as 'GRADING'",
        ' FROM NAME N LEFT OUTER JOIN NAME_QUALITY NQ ON NQ.NAME_ID=N.NAME_ID AND NQ.QUALITY_TYPE_ID=15, COUNTRY C, NAME_CONNECTION NC',
        ' WHERE C.COUNTRY_CODE=N.LEGAL_COUNTRY_CODE AND NC.CONNECTION_NAME_ID IN (?) AND NC.NAME_ID=N.NAME_ID ORDER BY NAME')

      const data = await db.query(queryString,
        {
          replacements: [clientIDList],
          type: QueryTypes.SELECT
        }
      )
      if (data) {
        const returnData = []
        data.forEach(c => {
          returnData.push({
            nameId: c.NAME_ID,
            name: c.NAME,
            country: c.COUNTRY_LABEL,
            grading: c.GRADING === null ? 'N/A' : c.GRADING
          })
        })
        resolve(returnData)
      }
      resolve(false)
    } catch (err) {
      const response = {
        status: err.status || 500,
        message: err.message || 'Could not fetch clients.'
      }
      reject(response)
    }
  })
}

exports.getAllEmployeeNames = async (db = database) => {
  return new Promise(async (resolve, reject) => {
    try {
      const queryString = "".concat("SELECT ISNULL(NAME_1,'') + ISNULL(' '+NAME_2,'') + ISNULL(' '+NAME_3,'') AS FULLNAME, NAME_ID ",
        "FROM NAME ",
        "WHERE NAME_ID IN ",
        "( SELECT DISTINCT DROPDOWN_CODE FROM NAME_QUALITY WHERE DROPDOWN_ID = 5 ) ",
        "ORDER BY NAME_1")

      const data = await db.query(queryString,
        {
          type: QueryTypes.SELECT
        }
      )
      if (data) {
        const returnData = []
        data.forEach(c => {
          returnData.push({
            nameID: c.NAME_ID,
            name: c.FULLNAME
          })
        })
        resolve(returnData)
      }
      resolve(false)
    } catch (err) {
      reject(err)
    }
  })
}
