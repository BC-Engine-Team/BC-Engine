const sinon = require('sinon')
const { expect } = require('@jest/globals')

const InvoiceService = require('../../services/invoice.service')
const TransacStatDao = require('../../data_access_layer/daos/transac_stat.dao')
const InvoiceAffectDao = require('../../data_access_layer/daos/invoice_affect.dao')
const ClientDao = require('../../data_access_layer/daos/name.dao')
const CountryDao = require('../../data_access_layer/daos/country.dao')

const yearMonthList = [202011, 202012, 202101]
const clientIDList = [32590, 36052, 37960]

const fakeBilledList = {
  billedList: [
    {
      month: 202011,
      billed: 100
    },
    {
      month: 202012,
      billed: 150
    },
    {
      month: 202101,
      billed: 125
    }
  ],
  clientIDList: [54998, 63379, 54332]
}

const fakeDuesList = [
  {
    month: 202011,
    totalDues: 50
  },
  {
    month: 202012,
    totalDues: 25
  },
  {
    month: 202101,
    totalDues: 10
  }
]

const fakeTransacStatList = [
  {
    yearMonth: 202011,
    dueCurrent: 50,
    due1Month: 100,
    due2Month: 30,
    due3Month: 10
  },
  {
    yearMonth: 202012,
    dueCurrent: 50,
    due1Month: 100,
    due2Month: 30,
    due3Month: 10
  },
  {
    yearMonth: 202101,
    dueCurrent: 50,
    due1Month: 100,
    due2Month: 30,
    due3Month: 10
  }
]

const fakeInvoiceAffectList = [
  {
    invoiceDate: new Date(2020, 9, 15),
    actorId: 22222,
    amount: 50
  },
  {
    invoiceDate: new Date(2020, 10, 15),
    actorId: 33333,
    amount: 50
  },
  {
    invoiceDate: new Date(2020, 11, 15),
    actorId: 44444,
    amount: 50
  }
]

const fakeExpectedGetAverageResponse = [
  {
    chart: {
      2020: [
        {
          month: 202011,
          average: (fakeDuesList[0].totalDues / fakeBilledList.billedList[0].billed * 365).toFixed(2),
          group: 2020
        },
        {
          month: 202012,
          average: (fakeDuesList[1].totalDues / fakeBilledList.billedList[1].billed * 365).toFixed(2),
          group: 2020
        }
      ],
      2021: [
        {
          month: 202101,
          average: (fakeDuesList[2].totalDues / fakeBilledList.billedList[2].billed * 365).toFixed(2),
          group: 2021
        }
      ]
    },
    table: [
      {
        nameId: 32590,
        name: 'IRIS DYNAMICS LTD',
        country: 'Canada',
        grading: 'C'
      },
      {
        nameId: 36052,
        name: 'Moussa Cisse KEITA',
        country: 'Canada',
        grading: 'N/A'
      },
      {
        nameId: 37960,
        name: 'FROST BROWN TODD LLC',
        country: 'United States',
        grading: 'N/A'
      }
    ]
  }
]

const fakeGetClientInformationDaoResponse = [
  {
    nameId: 32590,
    name: 'IRIS DYNAMICS LTD',
    country: 'Canada',
    grading: 'C'
  },
  {
    nameId: 36052,
    name: 'Moussa Cisse KEITA',
    country: 'Canada',
    grading: 'N/A'
  },
  {
    nameId: 37960,
    name: 'FROST BROWN TODD LLC',
    country: 'United States',
    grading: 'N/A'
  }
]

const fakeCountriesList = [
  {
    countryLabel: 'Albania'
  },
  {
    countryLabel: 'Italy'
  },
  {
    countryLabel: 'Morocco'
  }
]

const sandbox = sinon.createSandbox()

// the methods in invoice services
let getBilledSpy = jest.spyOn(InvoiceService, 'getBilled')
  .mockImplementation(() => new Promise((resolve) => {
    resolve(fakeBilledList)
  }))

let getDuesSpy = jest.spyOn(InvoiceService, 'getDues')
  .mockImplementation(() => new Promise((resolve) => {
    resolve(fakeDuesList)
  }))

let getClientInformationSpy = jest.spyOn(InvoiceService, 'getClientInformation')
  .mockImplementation(() => new Promise((resolve) => {
    console.log('whatf FhASBRFIhWASEBFiwsnebfgiojnaswzeiogjn')
    resolve(fakeClientNameCountryList)
  }))

// the dao objects to get data from database
let transacStatDaoSpy = jest.spyOn(TransacStatDao, 'getTransactionsStatByYearMonth')
  .mockImplementation(() => new Promise((resolve) => {
    resolve(fakeTransacStatList)
  }))

let invoiceAffectDaoSpy = jest.spyOn(InvoiceAffectDao, 'getInvoicesByDate')
  .mockImplementation(() => new Promise((resolve) => {
    resolve(fakeInvoiceAffectList)
  }))

let countryDaoSpy = jest.spyOn(CountryDao, 'getAllCountries')
  .mockImplementation(() => new Promise((resolve) => {
    resolve(fakeCountriesList)
  }))

let getClientsInClientIdListDaoSpy = jest.spyOn(ClientDao, 'getClientsInClientIdList')
  .mockImplementation(() => new Promise((resolve) => {
    resolve(fakeGetClientInformationDaoResponse)
  }))

describe('Test Invoice Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    sandbox.restore()
  })

  afterAll(() => {
    process.exit
  })

  describe('IS1 - getAverages', () => {
    describe('IS1.1 - given two dates', () => {
      it('IS1.1.1 - should respond with the list of averages per month with group key', async () => {
        // arrange
        getClientInformationSpy = jest.spyOn(InvoiceService, 'getClientInformation')
          .mockImplementation(() => new Promise((resolve) => {
            resolve(fakeGetClientInformationDaoResponse)
          }))

        // act
        const response = await InvoiceService.getAverages('2020-11-01', '2021-01-01')

        // assert
        expect(response).toEqual(fakeExpectedGetAverageResponse)
        expect(getDuesSpy).toBeCalledTimes(1)
        expect(getDuesSpy).toBeCalledWith(yearMonthList, undefined, undefined, undefined, undefined)
      })

      it('IS1.1.3 - should respond with error thrown by getDues', async () => {
        // arrange
        getDuesSpy = jest.spyOn(InvoiceService, 'getDues')
          .mockImplementation(() => new Promise((resolve, reject) => {
            reject({ message: 'getDues failed' })
          }))

        // act and assert
        await expect(InvoiceService.getAverages('2020-11-01', '2021-01-01')).rejects
          .toEqual({ message: 'getDues failed' })
      })

      it('IS1.1.4 - should respond with error thrown by getBilled', async () => {
        // arrange
        getDuesSpy = jest.spyOn(InvoiceService, 'getDues')
          .mockImplementation(() => new Promise((resolve) => {
            resolve(fakeDuesList)
          }))

        getBilledSpy = jest.spyOn(InvoiceService, 'getBilled')
          .mockImplementation(() => new Promise((resolve, reject) => {
            reject({ message: 'getBilled failed' })
          }))

        // act and assert
        await expect(InvoiceService.getAverages('2020-11-01', '2021-01-01')).rejects
          .toEqual({ message: 'getBilled failed' })
      })

      it('IS1.1.5 - should respond with error message 400 when start date is after end date', async () => {
        // arrange
        const startDate = '2020-11-01'
        const endDate = '2019-11-01'
        const expectedError = {
          status: 400,
          message: 'Invalid date order.'
        }

        // act and assert
        await expect(InvoiceService.getAverages(startDate, endDate)).rejects
          .toEqual(expectedError)
      })

      it('IS1.1.6 - should respond with specified error thrown by getClientInformation', async () => {
        // arrange
        const expectedResponse = {
          status: 600,
          message: 'Error.'
        }
        getDuesSpy = jest.spyOn(InvoiceService, 'getDues')
          .mockImplementation(() => new Promise((resolve) => {
            resolve(fakeDuesList)
          }))

        getBilledSpy = jest.spyOn(InvoiceService, 'getBilled')
          .mockImplementation(() => new Promise((resolve) => {
            resolve(fakeBilledList)
          }))
        getClientSpy = jest.spyOn(InvoiceService, 'getClientInformation')
          .mockImplementation(() => new Promise((resolve, reject) => {
            reject(expectedResponse)
          }))

        // act and assert
        await expect(InvoiceService.getAverages('2020-11-01', '2021-01-01')).rejects
          .toEqual(expectedResponse)
      })

      it('IS1.1.7 - should respond with unspecified error thrown by getClientInformation', async () => {
        // arrange
        const expectedResponse = {
          status: 500,
          message: 'Could not fetch clients.'
        }
        getDuesSpy = jest.spyOn(InvoiceService, 'getDues')
          .mockImplementation(() => new Promise((resolve) => {
            resolve(fakeDuesList)
          }))

        getBilledSpy = jest.spyOn(InvoiceService, 'getBilled')
          .mockImplementation(() => new Promise((resolve) => {
            resolve(fakeBilledList)
          }))
        getClientSpy = jest.spyOn(InvoiceService, 'getClientInformation')
          .mockImplementation(() => new Promise((resolve, reject) => {
            reject({})
          }))

        // act and assert
        await expect(InvoiceService.getAverages('2020-11-01', '2021-01-01')).rejects
          .toEqual(expectedResponse)
      })
    })

    describe('IS1.2 - given an empty clientIdList is passed to getCLientInformation', () => {
      it('IS1.2.1 - should call getClientInformation with [-1000]', async () => {
        // arrange
        getDuesSpy = jest.spyOn(InvoiceService, 'getDues')
          .mockImplementation(() => new Promise((resolve) => {
            resolve(fakeDuesList)
          }))
        getClientSpy = jest.spyOn(InvoiceService, 'getClientInformation')
          .mockImplementation(() => new Promise((resolve) => {
            resolve('expectedResponse')
          }))
        getBilledSpy = jest.spyOn(InvoiceService, 'getBilled')
          .mockImplementation(() => new Promise((resolve) => {
            const returnObject = fakeBilledList
            returnObject.clientIDList = []
            resolve(returnObject)
          }))

        // act and assert
        await InvoiceService.getAverages('2020-11-01', '2021-01-01')

        expect(getClientInformationSpy).toHaveBeenCalledWith([-1000])
      })
    })
  })

  describe('IS2 - getDues', () => {
    describe('IS2.1 - given a valid yearMonthList and nothing else', () => {
      it('IS2.1.1 - should return totalDuesList', async () => {
        // arrange
        getDuesSpy.mockRestore()
        const expectedList = [
          {
            month: '202011',
            totalDues: '190.00'
          },
          {
            month: '202012',
            totalDues: '190.00'
          },
          {
            month: '202101',
            totalDues: '190.00'
          }
        ]

        // act
        const response = await InvoiceService.getDues(yearMonthList)

        // assert
        expect(response).toEqual(expectedList)
        expect(transacStatDaoSpy).toHaveBeenCalledTimes(1)
        expect(transacStatDaoSpy).toHaveBeenCalledWith(yearMonthList, undefined, undefined, undefined, undefined)
      })

      it('IS2.1.2 - when dao throws unspecified error status and message, should reject with default status and message ', async () => {
        // arrange
        const expectedResponse = {
          status: 500,
          message: 'Could not get dues.'
        }
        transacStatDaoSpy = jest.spyOn(TransacStatDao, 'getTransactionsStatByYearMonth')
          .mockImplementation(() => new Promise((resolve, reject) => {
            reject({})
          }))

        // act and assert
        await expect(InvoiceService.getDues(yearMonthList)).rejects
          .toEqual(expectedResponse)
      })

      it('IS2.1.3 - should resolve with false when dao resolves false', async () => {
        // arrange
        transacStatDaoSpy = jest.spyOn(TransacStatDao, 'getTransactionsStatByYearMonth')
          .mockImplementation(() => new Promise((resolve, reject) => {
            resolve(false)
          }))

        // act and assert
        await expect(InvoiceService.getDues(yearMonthList)).resolves
          .toEqual(false)
      })
    })

    describe('IS2.2 - given a valid yearMonthList and employeeId', () => {
      it('IS2.2.1 - should return totalDuesList', async () => {
        // arrange
        const employeeId = 22769
        const expectedList = [
          {
            month: '202011',
            totalDues: '190.00'
          },
          {
            month: '202012',
            totalDues: '190.00'
          },
          {
            month: '202101',
            totalDues: '190.00'
          }
        ]

        transacStatDaoSpy = jest.spyOn(TransacStatDao, 'getTransactionsStatByYearMonth')
          .mockImplementation(() => new Promise((resolve, reject) => {
            resolve(fakeTransacStatList)
          }))

        // act
        const response = await InvoiceService.getDues(yearMonthList, employeeId)

        // assert
        expect(response).toEqual(expectedList)
        expect(transacStatDaoSpy).toHaveBeenCalledWith(yearMonthList, employeeId, undefined, undefined, undefined)
      })
    })

    describe('IS2.3 - given a valid yearMonthList and countryCode', () => {
      it('IS2.3.1 - should return totalDuesList', async () => {
        // arrange
        const countryName = 'Canada'
        const expectedList = [
          {
            month: '202011',
            totalDues: '190.00'
          },
          {
            month: '202012',
            totalDues: '190.00'
          },
          {
            month: '202101',
            totalDues: '190.00'
          }
        ]

        transacStatDaoSpy = jest.spyOn(TransacStatDao, 'getTransactionsStatByYearMonth')
          .mockImplementation(() => new Promise((resolve, reject) => {
            resolve(fakeTransacStatList)
          }))

        // act
        const response = await InvoiceService.getDues(yearMonthList, undefined, undefined, countryName)

        // assert
        expect(response).toEqual(expectedList)
        expect(transacStatDaoSpy).toHaveBeenCalledWith(yearMonthList, undefined, undefined, countryName, undefined)
      })
    })

    describe('IS2.4 - given a valid yearMonthList, employeeId and country', () => {
      it('IS2.4.1 - should return totalDuesList', async () => {
        // arrange
        const employeeId = 22769
        const countryName = 'Canada'
        const expectedList = [
          {
            month: '202011',
            totalDues: '190.00'
          },
          {
            month: '202012',
            totalDues: '190.00'
          },
          {
            month: '202101',
            totalDues: '190.00'
          }
        ]

        transacStatDaoSpy = jest.spyOn(TransacStatDao, 'getTransactionsStatByYearMonth')
          .mockImplementation(() => new Promise((resolve, reject) => {
            resolve(fakeTransacStatList)
          }))

        // act
        const response = await InvoiceService.getDues(yearMonthList, employeeId, undefined, countryName)

        // assert
        expect(response).toEqual(expectedList)
        expect(transacStatDaoSpy).toHaveBeenCalledWith(yearMonthList, employeeId, undefined, countryName, undefined)
      })
    })
  })

  describe('IS3 - getBilled', () => {
    describe('IS3.1 - given a valid start and end date str and yearMonthList', () => {
      const startDateStr = '2019-11-01'
      const endDateStr = '2021-01-01'

      it('IS3.1.1 - should return billed', async () => {
        // arrange
        getBilledSpy.mockRestore()
        const expectedResponse = {
          billedList: [
            {
              month: 202011,
              billed: 50
            },
            {
              month: 202012,
              billed: 100
            },
            {
              month: 202101,
              billed: 150
            }
          ],
          clientIDList: [22222, 33333, 44444]
        }

        // act
        const response = await InvoiceService.getBilled(startDateStr, endDateStr, yearMonthList)

        // assert
        expect(response).toEqual(expectedResponse)
        expect(invoiceAffectDaoSpy).toHaveBeenCalledWith(startDateStr, endDateStr, undefined, undefined, undefined, undefined)
      })

      it('IS3.1.2 - when dao throws error with specified status and message, should reject with specified status and message', async () => {
        // arrange
        const expectedResponse = {
          status: 600,
          message: 'Error.'
        }
        invoiceAffectDaoSpy = jest.spyOn(InvoiceAffectDao, 'getInvoicesByDate')
          .mockImplementation(() => new Promise((resolve, reject) => {
            reject(expectedResponse)
          }))

        // act and assert
        await expect(InvoiceService.getBilled(startDateStr, endDateStr, yearMonthList)).rejects
          .toEqual(expectedResponse)
      })

      it('IS3.1.3 - when dao throws error with unspecified status and message, should reject with default status and message', async () => {
        // arrange
        const expectedResponse = {
          status: 500,
          message: 'Could not fetch bills.'
        }
        invoiceAffectDaoSpy = jest.spyOn(InvoiceAffectDao, 'getInvoicesByDate')
          .mockImplementation(() => new Promise((resolve, reject) => {
            reject({})
          }))

        // act and assert
        await expect(InvoiceService.getBilled(startDateStr, endDateStr, yearMonthList)).rejects
          .toEqual(expectedResponse)
      })

      it('IS3.1.4 - should resolve with false when dao resolves with false', async () => {
        // arrange
        invoiceAffectDaoSpy = jest.spyOn(InvoiceAffectDao, 'getInvoicesByDate')
          .mockImplementation(() => new Promise((resolve) => {
            resolve(false)
          }))

        // act and assert
        await expect(InvoiceService.getBilled(startDateStr, endDateStr, yearMonthList)).resolves
          .toEqual(false)
      })
    })

    describe('IS3.2 - given a valid start and end date str, yearMonthList and employeeId', () => {
      const startDateStr = '2019-11-01'
      const endDateStr = '2021-01-01'
      const employeeId = 12345

      it('IS3.2.1 - should return billed', async () => {
        // arrange

        const expectedResponse = {
          billedList: [
            {
              month: 202011,
              billed: 50
            },
            {
              month: 202012,
              billed: 100
            },
            {
              month: 202101,
              billed: 150
            }
          ],
          clientIDList: [22222, 33333, 44444]
        }

        invoiceAffectDaoSpy = jest.spyOn(InvoiceAffectDao, 'getInvoicesByDate')
          .mockImplementation(() => new Promise((resolve, reject) => {
            resolve(fakeInvoiceAffectList)
          }))

        // act
        const response = await InvoiceService.getBilled(startDateStr, endDateStr, yearMonthList, employeeId)

        // assert
        expect(response).toEqual(expectedResponse)
        expect(invoiceAffectDaoSpy).toHaveBeenCalledTimes(1)
        expect(invoiceAffectDaoSpy).toHaveBeenCalledWith(startDateStr, endDateStr, employeeId, undefined, undefined, undefined)
      })
    })
    describe('IS3.3 - given a valid start and end date str, yearMonthList and country', () => {
      const startDateStr = '2019-11-01'
      const endDateStr = '2021-01-01'
      const countryCode = 'CA'

      it('IS3.3.1 - should return billed', async () => {
        // arrange
        const expectedResponse = {
          billedList: [
            {
              month: 202011,
              billed: 50
            },
            {
              month: 202012,
              billed: 100
            },
            {
              month: 202101,
              billed: 150
            }
          ],
          clientIDList: [22222, 33333, 44444]
        }

        invoiceAffectDaoSpy = jest.spyOn(InvoiceAffectDao, 'getInvoicesByDate')
          .mockImplementation(() => new Promise((resolve, reject) => {
            resolve(fakeInvoiceAffectList)
          }))

        // act
        const response = await InvoiceService.getBilled(startDateStr, endDateStr, yearMonthList, undefined, undefined, countryCode)

        // assert
        expect(response).toEqual(expectedResponse)
        expect(invoiceAffectDaoSpy).toHaveBeenCalledTimes(1)
        expect(invoiceAffectDaoSpy).toHaveBeenCalledWith(startDateStr, endDateStr, undefined, undefined, countryCode, undefined)
      })
    })

    describe('IS3.4 - given a valid start and end date str, yearMonthList, clientList and country', () => {
      const startDateStr = '2019-11-01'
      const endDateStr = '2021-01-01'
      const employeeId = 12345
      const countryCode = 'CA'

      it('IS3.4.1 - should return billed', async () => {
        // arrange
        const expectedResponse = {
          billedList: [
            {
              month: 202011,
              billed: 50
            },
            {
              month: 202012,
              billed: 100
            },
            {
              month: 202101,
              billed: 150
            }
          ],
          clientIDList: [22222, 33333, 44444]
        }

        invoiceAffectDaoSpy = jest.spyOn(InvoiceAffectDao, 'getInvoicesByDate')
          .mockImplementation(() => new Promise((resolve, reject) => {
            resolve(fakeInvoiceAffectList)
          }))

        // act
        const response = await InvoiceService.getBilled(startDateStr, endDateStr, yearMonthList, employeeId, undefined, countryCode)

        // assert
        expect(response).toEqual(expectedResponse)
        expect(invoiceAffectDaoSpy).toHaveBeenCalledTimes(1)
        expect(invoiceAffectDaoSpy).toHaveBeenCalledWith(startDateStr, endDateStr, employeeId, undefined, countryCode, undefined)
      })
    })
  })

  describe('IS4 - getClientInformation', () => {
    describe('IS4.1 - given a valid response from the dao', () => {
      it('IS4.1.1 - should resolve list of client information', async () => {
        // arrange
        getClientInformationSpy.mockRestore()
        const expectedResponse = fakeGetClientInformationDaoResponse

        // act and assert
        const response = await InvoiceService.getClientInformation(clientIDList)

        expect(response).toEqual(expectedResponse)
        expect(getClientsInClientIdListDaoSpy).toHaveBeenCalledWith(clientIDList)
      })
    })

    describe('IS4.2 - given a invalid response from the dao', () => {
      it('IS4.2.1 - when dao resolves false should resolve false', async () => {
        // arrange
        getClientsInClientIdListDaoSpy = jest.spyOn(ClientDao, 'getClientsInClientIdList')
          .mockImplementation(() => new Promise((resolve) => {
            resolve(false)
          }))

        // act and assert
        const response = await InvoiceService.getClientInformation(clientIDList)

        expect(response).toEqual(false)
        expect(getClientsInClientIdListDaoSpy).toHaveBeenCalledWith(clientIDList)
      })

      it('IS4.2.2 - when dao rejects specified status and message, should reject specified status and message', async () => {
        // arrange
        const expectedResponse = {
          status: 600,
          message: 'Error.'
        }
        getClientsInClientIdListDaoSpy = jest.spyOn(ClientDao, 'getClientsInClientIdList')
          .mockImplementation(() => new Promise((resolve, reject) => {
            reject(expectedResponse)
          }))

        // act and assert
        await expect(InvoiceService.getClientInformation(clientIDList))
          .rejects.toEqual(expectedResponse)
        expect(getClientsInClientIdListDaoSpy).toHaveBeenCalledWith(clientIDList)
      })

      it('IS4.2.3 - when dao rejects unspecified status and message, should reject default status and message', async () => {
        // arrange
        const expectedResponse = {
          status: 500,
          message: 'Could not fetch clients.'
        }
        getClientsInClientIdListDaoSpy = jest.spyOn(ClientDao, 'getClientsInClientIdList')
          .mockImplementation(() => new Promise((resolve, reject) => {
            reject({})
          }))

        // act and assert
        await expect(InvoiceService.getClientInformation(clientIDList))
          .rejects.toEqual(expectedResponse)
        expect(getClientsInClientIdListDaoSpy).toHaveBeenCalledWith(clientIDList)
      })
    })
  })

  describe('IS5 - getCountriesName', () => {
    describe('IS7.1 - given I enter the application to get the list of countries', () => {
      it('IS7.1.1 - should return a list of country in alphabetical order', async () => {
        // act
        const response = await InvoiceService.getCountriesName()

        // assert
        expect(response).toEqual(fakeCountriesList)
        expect(countryDaoSpy).toHaveBeenCalledTimes(1)
        expect(countryDaoSpy).toHaveBeenCalledWith()
      })

      it('IS7.1.2 - should reject with error when dao throws error', async () => {
        // arrange
        countryDaoSpy = jest.spyOn(CountryDao, 'getAllCountries')
          .mockImplementation(() => new Promise((resolve, reject) => {
            reject({ message: 'dao failed' })
          }))

        // act and assert
        await expect(InvoiceService.getCountriesName()).rejects
          .toEqual({ message: 'dao failed' })
      })

      it('IS7.1.3 - should resolve with false when dao resolves with false', async () => {
        // arrange
        countryDaoSpy = jest.spyOn(CountryDao, 'getAllCountries')
          .mockImplementation(() => new Promise((resolve) => {
            resolve(false)
          }))

        // act and assert
        await expect(InvoiceService.getCountriesName()).resolves
          .toEqual(false)
      })
    })
  })
})
