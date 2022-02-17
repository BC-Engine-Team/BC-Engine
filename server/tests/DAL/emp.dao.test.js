const {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists
} = require('sequelize-test-helpers')

const EmpModel = require('../../data_access_layer/models/mssql_pat/employee.model')
const EmpDAO = require('../../data_access_layer/daos/emp.dao')

const returnedEmp = {
  dataValues: {
    email: 'myEmail@email.com',
    firstName: 'myFName',
    lastName: 'myLName'
  }
}

const returnedEmployeeList = [
  {
    dataValues: {
      email: 'Cathia@benoit-cote.com',
      firstName: 'Cathia',
      lastName: 'Zeppetelli',
      isActive: true
    }
  },
  {
    dataValues: {
      email: 'Giuseppe@benoit-cote.com',
      firstName: 'Giuseppe',
      lastName: 'Calderone',
      isActive: true
    }
  },
  {
    dataValues: {
      email: 'Marilyne@benoit-cote.com',
      firstName: 'Marilyne',
      lastName: 'Séïde',
      isActive: true
    }
  }
]

const SequelizeMock = require('sequelize-mock')
const dbMock = new SequelizeMock()
const EmpMock = dbMock.define('employees', returnedEmp)
const EmpListMock = dbMock.define('employees', returnedEmployeeList)

describe('Test Employee DAL', () => {
  const Model = EmpModel(sequelize, dataTypes)
  const instance = new Model()

  afterEach(() => {
    EmpMock.$queryInterface.$clearResults()
    EmpListMock.$queryInterface.$clearResults()
  })

  beforeEach(() => {
    EmpMock.$queryInterface.$clearResults()
    EmpListMock.$queryInterface.$clearResults()
  })

  // testing the employee model properties
  checkModelName(Model)('PERSON');
  ['firstName', 'lastName', 'email', 'isActive']
    .forEach(checkPropertyExists(instance))

  describe('ED1 - getEmployeeByEmail', () => {
    it('ED1.1 - should return employee when it exists', async () => {
      // arrange
      EmpMock.$queryInterface.$useHandler(function (query, queryOptions, done) {
        return Promise.resolve(returnedEmp)
      })

      // act
      const resp = await EmpDAO.getEmployeeByEmail('myEmail@email.com', EmpMock)

      // assert
      expect(resp.email).toBe('myEmail@email.com')
      expect(resp.name).toBe('myFName myLName')
    })

    it("ED1.2 - should return false when Employee model can't find employee", async () => {
      // arrange
      EmpMock.$queryInterface.$useHandler(function (query, queryOptions, done) {
        return Promise.resolve(false)
      })

      // act
      const resp = await EmpDAO.getEmployeeByEmail('no@email.com', EmpMock)

      // assert
      expect(resp).toBeFalsy()
    })

    it('ED1.3 - should catch specified error thrown by the Employee Model', async () => {
      // arrange
      const expectedResponse = {
        status: 600,
        message: 'Error.'
      }
      EmpMock.$queryInterface.$useHandler(function (query, queryOptions, done) {
        return Promise.reject(expectedResponse)
      })

      // act
      await expect(EmpDAO.getEmployeeByEmail('someEmail', EmpMock))
        .rejects.toEqual(expectedResponse)
    })

    it('ED1.4 - should catch unspecified error thrown by the Employee Model', async () => {
      // arrange
      const expectedResponse = {
        status: 500,
        message: 'some error occured'
      }
      EmpMock.$queryInterface.$useHandler(function (query, queryOptions, done) {
        return Promise.reject({})
      })

      // act
      await expect(EmpDAO.getEmployeeByEmail('someEmail', EmpMock))
        .rejects.toEqual(expectedResponse)
    })
  })
})
