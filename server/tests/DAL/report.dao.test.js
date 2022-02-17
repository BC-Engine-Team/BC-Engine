
const {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists
} = require('sequelize-test-helpers')

const [UserModel, ChartReportModel, ChartReportDataModel, PerformanceReportModel, ReportTypeModel, RecipientModel, ReportTypeRecipientModel] = require('../../data_access_layer/models/localdb/localdb.model')(sequelize, dataTypes)
const ReportDAO = require('../../data_access_layer/daos/report.dao')

const returnedPerformanceReports = [
  {
    performanceReportId: 'PerformanceUUID',
    employeeId: 1,
    averageCollectionDay: '35',
    annualBillingObjective: '4500',
    monthlyBillingObjective: '300',
    annualBillingNumber: '200',
    monthlyBillingNumber: '300',
    projectedBonus: '650'
  },
  {
    performanceReportId: 'PerformanceUUID',
    employeeId: 2,
    averageCollectionDay: '35',
    annualBillingObjective: '4500',
    monthlyBillingObjective: '300',
    annualBillingNumber: '200',
    monthlyBillingNumber: '300',
    projectedBonus: '650'
  }
]

const SequelizeMock = require('sequelize-mock')
const dbMock = new SequelizeMock()
const PerformanceReportMock = dbMock.define('performance_reports', returnedPerformanceReports)

describe('Test Report Related Models', () => {
  const ReportTypeInstance = new ReportTypeModel()
  const RecipientInstance = new RecipientModel()
  const PerformanceInstance = new PerformanceReportModel()
  checkModelName(PerformanceReportModel)('performance_reports')
  checkModelName(ReportTypeModel)('report_types')
  checkModelName(RecipientModel)('recipients')
  checkModelName(ReportTypeRecipientModel)('report_type_recipients');

  ['performanceReportId', 'employeeId', 'averageCollectionDay', 'annualBillingObjective', 'monthlyBillingObjective', 'annualBillingNumber', 'monthlyBillingNumber', 'projectedBonus']
    .forEach(checkPropertyExists(PerformanceInstance));

  ['reportTypeId', 'reportTypeName', 'frequency']
    .forEach(checkPropertyExists(ReportTypeInstance));

  ['recipientId', 'name', 'email']
    .forEach(checkPropertyExists(RecipientInstance))
})

describe('Test Report DAO', () => {
  let fakeReportTypeModel
  let fakeReportTypeRecipientModel

  const fakeReportTypeFindAllResponse = [
    {
      dataValues: {
        reportTypeId: 'ReportUUID1',
        reportTypeName: 'ReportName1',
        frequency: 0
      }
    },
    {
      dataValues: {
        reportTypeId: 'ReportUUID2',
        reportTypeName: 'ReportName2',
        frequency: -1
      }
    },
    {
      dataValues: {
        reportTypeId: 'ReportUUID4',
        reportTypeName: 'ReportName4',
        frequency: 2
      }
    }
  ]

  const fakeReportTypeRecipientFindAllResponse = [
    {
      dataValues: {
        report_type_id: 'ReportUUID1',
        recipient_id: 'recUUID1'
      }
    },
    {
      dataValues: {
        report_type_id: 'ReportUUID1',
        recipient_id: 'recUUID2'
      }
    },
    {
      dataValues: {
        report_type_id: 'ReportUUID1',
        recipient_id: 'recUUID3'
      }
    },
    {
      dataValues: {
        report_type_id: 'ReportUUID3',
        recipient_id: 'recUUID4'
      }
    },
    {
      dataValues: {
        report_type_id: 'ReportUUID2',
        recipient_id: 'recUUID5'
      }
    }
  ]
  describe('RD1 - getReportTypesWithRecipientIds', () => {
    describe('RD1.1 - given valid response from reportTypes and reportTypeRecipients models', () => {
      it('RD1.1.1 - should respond with report types with recipients', async () => {
        // arrange
        const expectedResponse = [
          {
            reportTypeId: fakeReportTypeFindAllResponse[0].dataValues.reportTypeId,
            name: fakeReportTypeFindAllResponse[0].dataValues.reportTypeName,
            frequency: fakeReportTypeFindAllResponse[0].dataValues.frequency,
            recipients: {
              recUUID1: {
                name: ''
              },
              recUUID2: {
                name: ''
              },
              recUUID3: {
                name: ''
              }
            }

          },
          {
            reportTypeId: fakeReportTypeFindAllResponse[1].dataValues.reportTypeId,
            name: fakeReportTypeFindAllResponse[1].dataValues.reportTypeName,
            frequency: fakeReportTypeFindAllResponse[1].dataValues.frequency,
            recipients: {
              recUUID5: {
                name: ''
              }
            }

          },
          {
            reportTypeId: fakeReportTypeFindAllResponse[2].dataValues.reportTypeId,
            name: fakeReportTypeFindAllResponse[2].dataValues.reportTypeName,
            frequency: fakeReportTypeFindAllResponse[2].dataValues.frequency,
            recipients: {}
          }
        ]
        fakeReportTypeModel = {
          findAll: () => {
            return Promise.resolve(fakeReportTypeFindAllResponse)
          }
        }
        fakeReportTypeRecipientModel = {
          findAll: () => {
            return Promise.resolve(fakeReportTypeRecipientFindAllResponse)
          }
        }

        // act and assert
        await expect(ReportDAO.getReportTypesWithRecipientIds(fakeReportTypeModel, fakeReportTypeRecipientModel))
          .resolves.toEqual(expectedResponse)
      })
    })

    describe('RD1.2 - given invalid response from reportType model', () => {
      it('RD1.2.1 - when model resolves false, should resolve false', async () => {
        // arrange
        fakeReportTypeModel = {
          findAll: () => {
            return Promise.resolve(false)
          }
        }

        // act and assert
        await expect(ReportDAO.getReportTypesWithRecipientIds(fakeReportTypeModel, fakeReportTypeRecipientModel))
          .resolves.toEqual(false)
      })

      it('RD1.2.2 - when model rejects specified status and message, should reject with specified status and message', async () => {
        // arrange
        const expectedResponse = {
          status: 600,
          message: 'Error.'
        }
        fakeReportTypeModel = {
          findAll: () => {
            return Promise.reject(expectedResponse)
          }
        }

        // act and assert
        await expect(ReportDAO.getReportTypesWithRecipientIds(fakeReportTypeModel, fakeReportTypeRecipientModel))
          .rejects.toEqual(expectedResponse)
      })

      it('RD1.2.3 - when model rejects unspecified status and message, should reject with default status and message', async () => {
        // arrange
        const expectedResponse = {
          status: 500,
          message: 'Malfunction in the B&C Engine.'
        }
        fakeReportTypeModel = {
          findAll: () => {
            return Promise.reject({})
          }
        }

        // act and assert
        await expect(ReportDAO.getReportTypesWithRecipientIds(fakeReportTypeModel, fakeReportTypeRecipientModel))
          .rejects.toEqual(expectedResponse)
      })
    })

    describe('RD1.3 - given invalid response from reportTypeRecipients model', () => {
      it('RD1.3.1 - when model resolves false, should resolve false', async () => {
        // arrange
        fakeReportTypeModel = {
          findAll: () => {
            return Promise.resolve(fakeReportTypeFindAllResponse)
          }
        }
        fakeReportTypeRecipientModel = {
          findAll: () => {
            return Promise.resolve(false)
          }
        }

        // act and assert
        await expect(ReportDAO.getReportTypesWithRecipientIds(fakeReportTypeModel, fakeReportTypeRecipientModel))
          .resolves.toEqual(false)
      })

      it('RD1.3.2 - when model rejects specified status and message, should reject with specified status and message', async () => {
        // arrange
        const expectedResponse = {
          status: 600,
          message: 'Error.'
        }
        fakeReportTypeRecipientModel = {
          findAll: () => {
            return Promise.reject(expectedResponse)
          }
        }

        // act and assert
        await expect(ReportDAO.getReportTypesWithRecipientIds(fakeReportTypeModel, fakeReportTypeRecipientModel))
          .rejects.toEqual(expectedResponse)
      })

      it('RD1.3.3 - when model rejects unspecified status and message, should reject with default status and message', async () => {
        // arrange
        const expectedResponse = {
          status: 500,
          message: 'Malfunction in the B&C Engine.'
        }
        fakeReportTypeRecipientModel = {
          findAll: () => {
            return Promise.reject({})
          }
        }

        // act and assert
        await expect(ReportDAO.getReportTypesWithRecipientIds(fakeReportTypeModel, fakeReportTypeRecipientModel))
          .rejects.toEqual(expectedResponse)
      })
    })
  })

  describe('RD2 - getRecipients', () => {
    const fakeRecipientModelResponse = [
      {
        recipientId: 'recUUID1',
        name: 'name1',
        email: 'email1'
      },
      {
        recipientId: 'recUUID2',
        name: 'name2',
        email: 'email2'
      },
      {
        recipientId: 'recUUID3',
        name: 'name3',
        email: 'email3'
      }
    ]
    let fakeRecipientModel

    describe('RD2.1 - given valid response from recipients model', () => {
      it('RD2.1.1 - should resolve response from model', async () => {
        // arrange
        fakeRecipientModel = {
          findAll: () => {
            return Promise.resolve(fakeRecipientModelResponse)
          }
        }

        // act and assert
        await expect(ReportDAO.getRecipients(fakeRecipientModel))
          .resolves.toEqual(fakeRecipientModelResponse)
      })
    })

    describe('RD2.2 - given invalid response from recipients model', () => {
      it('RD2.2.1 - when model resolves false, should resolve false', async () => {
        // arrange
        fakeRecipientModel = {
          findAll: () => {
            return Promise.resolve(false)
          }
        }

        // act and assert
        await expect(ReportDAO.getRecipients(fakeRecipientModel))
          .resolves.toEqual(false)
      })

      it('RD2.2.2 - when model reject with specified status and message, should reject specified status and message', async () => {
        // arrange
        const expectedResponse = {
          status: 600,
          message: 'Error.'
        }
        fakeRecipientModel = {
          findAll: () => {
            return Promise.reject(expectedResponse)
          }
        }

        // act and assert
        await expect(ReportDAO.getRecipients(fakeRecipientModel))
          .rejects.toEqual(expectedResponse)
      })

      it('RD2.2.3 - when model reject with unspecified status and message, should reject default status and message', async () => {
        // arrange
        const expectedResponse = {
          status: 500,
          message: 'Malfunction in the B&C Engine.'
        }
        fakeRecipientModel = {
          findAll: () => {
            return Promise.reject({})
          }
        }

        // act and assert
        await expect(ReportDAO.getRecipients(fakeRecipientModel))
          .rejects.toEqual(expectedResponse)
      })
    })
  })

  describe('CRD5 - getPerformanceReportsWhenConnectedAsAdmin', () => {
    const PerformanceReport = new PerformanceReportModel()

    afterEach(() => {
      PerformanceReportMock.$queryInterface.$clearResults()
    })

    beforeEach(() => {
      PerformanceReportMock.$queryInterface.$clearResults()
    })

    describe('CRD5.1 - given a userId', () => {
      it('CRD5.1.1 - should return list of performance reports', async () => {
        // arrange
        PerformanceReportMock.$queryInterface.$useHandler(function (query, queryOptions, done) {
          return Promise.resolve(returnedPerformanceReports)
        })

        // act and assert
        await expect(ReportDAO.getPerformanceReports('fakeUserId', PerformanceReportMock)).resolves
          .toEqual(returnedPerformanceReports)
      })

      it('CRD5.1.2 - should resolve false when Model cant fetch data', async () => {
        // arrange
        PerformanceReportMock.$queryInterface.$useHandler(function (query, queryOptions, done) {
          return Promise.resolve(false)
        })

        // act and assert
        await expect(ReportDAO.getPerformanceReports('fakeUserId', PerformanceReportMock)).resolves
          .toEqual(false)
      })

      it('CRD5.1.3 - should reject error when Model throws error with defined status and message', async () => {
        // arrange
        const expectedError = {
          status: 404,
          message: 'Error.'
        }
        PerformanceReportMock.$queryInterface.$useHandler(function (query, queryOptions, done) {
          return Promise.reject(expectedError)
        })

        // act and assert
        await expect(ReportDAO.getPerformanceReports('fakeUserId', PerformanceReportMock)).rejects
          .toEqual(expectedError)
      })

      it('CRD1.1.4 - should reject error with 500 status and predefined message when model does not define them', async () => {
        // arrange
        const expectedError = {
          status: 500,
          message: 'Could not fetch data.'
        }
        PerformanceReportMock.$queryInterface.$useHandler(function (query, queryOptions, done) {
          return Promise.reject({})
        })

        // act and assert
        await expect(ReportDAO.getPerformanceReports('fakeUserId', PerformanceReportMock)).rejects
          .toEqual(expectedError)
      })
    })
  })
})
