const databases = require('../databases')
const ReportTypeModel = databases.localdb.reportTypes
const RecipientsModel = databases.localdb.recipients
const ReportTypeRecipientsModel = databases.localdb.reportTypeRecipients
const PerformanceReportModel = databases.localdb.performanceReport

exports.getReportTypesWithRecipientIds = async (reportTypesModel = ReportTypeModel, reportTypeRecipients = ReportTypeRecipientsModel) => {
  return new Promise((resolve, reject) => {
    reportTypesModel.findAll()
      .then(async reportTypes => {
        if (reportTypes) {
          const returnData = {
            reportTypes: []
          }
          const types = []
          for (let i = 0; i < reportTypes.length; i++) {
            types.push({
              reportTypeId: reportTypes[i].dataValues.reportTypeId,
              name: reportTypes[i].dataValues.reportTypeName,
              frequency: reportTypes[i].dataValues.frequency
            })
          }
          returnData.reportTypes = types
          returnData.recipients = await reportTypeRecipients.findAll()
          return returnData
        }
        resolve(false)
      })
      .then(async data => {
        if (data.recipients) {
          for (let i = 0; i < data.reportTypes.length; i++) {
            data.reportTypes[i].recipients = {}
            for (let j = 0; j < data.recipients.length; j++) {
              if (data.reportTypes[i].reportTypeId === data.recipients[j].dataValues.report_type_id &&
                                !(data.recipients[j].dataValues.recipient_id in data.reportTypes[i].recipients)) {
                data.reportTypes[i].recipients[data.recipients[j].dataValues.recipient_id] = { name: '' }
              }
            }
          }
          resolve(data.reportTypes)
        }
        resolve(false)
      })
      .catch(err => {
        const response = {
          status: err.status || 500,
          message: err.message || 'Malfunction in the B&C Engine.'
        }
        reject(response)
      })
  })
}

exports.getRecipients = async (recipientsModel = RecipientsModel) => {
  return new Promise((resolve, reject) => {
    recipientsModel.findAll()
      .then(async reportRecipients => {
        if (reportRecipients) {
          const returnData = []
          for (let i = 0; i < reportRecipients.length; i++) {
            returnData.push({
              recipientId: reportRecipients[i].recipientId,
              name: reportRecipients[i].name,
              email: reportRecipients[i].email
            })
          }
          resolve(returnData)
        }
        resolve(false)
      })
      .catch(err => {
        const response = {
          status: err.status || 500,
          message: err.message || 'Malfunction in the B&C Engine.'
        }
        reject(response)
      })
  })
}

// Reports Types related functions
exports.getPerformanceReports = async (userId, performanceReportModel = PerformanceReportModel) => {
  return new Promise((resolve, reject) => {
    performanceReportModel.findAll().then(async data => {
      if (data) {
        resolve(data)
      }
      resolve(false)
    })
      .catch(async err => {
        const response = {
          status: err.status || 500,
          message: err.message || 'Could not fetch data.'
        }
        reject(response)
      })
  })
}
