const database = require('../databases').mssql_bosco
const { QueryTypes } = require('sequelize')

exports.getTransactionsStatByYearMonth = async (yearMonthList, employeeId = undefined, clientType = undefined, countryLabel = undefined, ageOfAccount = undefined, db = database) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = this.prepareDuesQuery(yearMonthList, employeeId, clientType, countryLabel, ageOfAccount)

      const data = await db.query(query.queryString, {
        replacements: query.replacements,
        type: QueryTypes.SELECT
      })

      if (data) {
        const returnData = []

        data.forEach(e => {
          returnData.push({
            dueCurrent: e.DUE_CURRENT,
            due1Month: e.DUE_1_MONTH,
            due2Month: e.DUE_2_MONTH,
            due3Month: e.DUE_3_MONTH,
            yearMonth: e.YEAR_MONTH
          })
        })
        resolve(returnData)
      }
      resolve(false)
    } catch (err) {
      const response = {
        status: err.status || 500,
        message: err.message || 'Could not fetch transactions.'
      }
      reject(response)
    }
  })
}

exports.prepareDuesQuery = (yearMonthList, employeeId, clientType, countryLabel, ageOfAccount) => {
  const query = {
    queryString: 'SELECT ACS.DUE_CURRENT, ACS.DUE_1_MONTH, ACS.DUE_2_MONTH, ACS.DUE_3_MONTH, ACS.YEAR_MONTH ',
    replacements: [yearMonthList]
  }

  let fromString = 'FROM ACCOUNTING_CLIENT_STAT ACS '
  let whereString = 'WHERE ACS.YEAR_MONTH in (?) AND ACS.CONNECTION_ID=3 AND ACS.STAT_TYPE=1'

  if (employeeId !== undefined) {
    fromString = fromString.concat(', NAME_CONNECTION NC, NAME_QUALITY NQ1, NAME RESP ')
    whereString = whereString.concat(' AND NC.CONNECTION_ID=3 AND NC.CONNECTION_NAME_ID=CONVERT(NVARCHAR, ACS.ACC_NAME_ID)',
      ' AND NQ1.NAME_ID=NC.NAME_ID AND NQ1.QUALITY_TYPE_ID=5',
      ' AND CONVERT(NVARCHAR,RESP.NAME_ID)=NQ1.DROPDOWN_CODE',
      ' AND NQ1.DROPDOWN_CODE=? ')
    query.replacements.push(employeeId)
  }

  if (clientType !== undefined) {
    fromString = fromString.includes('NAME_CONNECTION NC')
      ? fromString
      : fromString.concat(', NAME_CONNECTION NC ')
    fromString = fromString.concat(', NAME_QUALITY NQ2 ')

    whereString = whereString.includes('NC.CONNECTION_ID=3')
      ? whereString
      : whereString.concat(' AND NC.CONNECTION_ID=3 ')
    whereString = whereString.includes('NC.CONNECTION_NAME_ID=CONVERT(NVARCHAR, ACS.ACC_NAME_ID)')
      ? whereString
      : whereString.concat(' AND NC.CONNECTION_NAME_ID=CONVERT(NVARCHAR, ACS.ACC_NAME_ID) ')
    whereString = whereString.concat(' AND NC.NAME_ID=NQ2.NAME_ID',
      ' AND NQ2.QUALITY_TYPE_ID=3',
      ' AND NQ2.DROPDOWN_CODE=? ')

    query.replacements.push(clientType.toUpperCase())
  }

  if (countryLabel !== undefined) {
    fromString = fromString.concat(', ACCOUNTING_NAME AN ')
    whereString = whereString.concat(' AND ACS.ACC_NAME_ID=AN.ACC_NAME_ID AND AN.ACC_NAME_COUNTRY=? ')
    query.replacements.push(countryLabel)
  }

  if (ageOfAccount !== undefined) {
    switch (ageOfAccount) {
      case '<30':
        query.queryString = "SELECT ACS.DUE_CURRENT, 0 as 'DUE_1_MONTH', 0 as 'DUE_2_MONTH', 0 as 'DUE_3_MONTH', ACS.YEAR_MONTH "
        break
      case '30-60':
        query.queryString = "SELECT 0 as 'DUE_CURRENT', ACS.DUE_1_MONTH, 0 as 'DUE_2_MONTH', 0 as 'DUE_3_MONTH', ACS.YEAR_MONTH "
        break
      case '60-90':
        query.queryString = "SELECT 0 as 'DUE_CURRENT', 0 as 'DUE_1_MONTH', ACS.DUE_2_MONTH, 0 as 'DUE_3_MONTH', ACS.YEAR_MONTH "
        break
      case '>90':
        query.queryString = "SELECT 0 as 'DUE_CURRENT', 0 as 'DUE_1_MONTH', 0 as 'DUE_2_MONTH', ACS.DUE_3_MONTH, ACS.YEAR_MONTH "
        break
    }
  }

  query.queryString = query.queryString.concat(fromString, whereString)

  return query
}
