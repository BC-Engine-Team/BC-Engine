const {sequelize,
    dataTypes,
    checkModelName,
    checkPropertyExists,
    checkHookDefined
} = require('sequelize-test-helpers');

const EmpModel = require('../../data_access_layer/models/mssql_pat/employee.model');
const EmpDAO = require('../../data_access_layer/daos/emp.dao');

let returnedEmp = {
    dataValues: {
        email: 'myEmail@email.com',
        firstName: 'myFName',
        lastName: 'myLName'
    }
}

let returnedEmployeeList = [
    {
        dataValues: {
            email: 'Cathia@benoit-cote.com',
            firstName: 'Cathia',
            lastName: 'Zeppetelli',
            isActive: true
        },
    },
    {
        dataValues: {
            email: 'Giuseppe@benoit-cote.com',
            firstName: 'Giuseppe',
            lastName: 'Calderone',
            isActive: true
        },
    },
    {
        dataValues: {
            email: 'Marilyne@benoit-cote.com',
            firstName: 'Marilyne',
            lastName: 'Séïde',
            isActive: true
        },
    }
]

let SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();
var EmpMock = dbMock.define('employees', returnedEmp);
var EmpListMock = dbMock.define('employees', returnedEmployeeList)

describe("Test Employee DAL", () => {
    const Model = EmpModel(sequelize, dataTypes);
    const instance = new Model();

    afterEach(() => {
        EmpMock.$queryInterface.$clearResults();
        EmpListMock.$queryInterface.$clearResults();
    });

    beforeEach(() => {
        EmpMock.$queryInterface.$clearResults();
        EmpListMock.$queryInterface.$clearResults();
    });

    // testing the employee model properties
    checkModelName(Model)('PERSON');
    ['firstName', 'lastName', 'email', 'isActive']
        .forEach(checkPropertyExists(instance));

    describe("ED1 - getEmployeeByEmail", () => {
        it("ED1.1 - should return employee when it exists", async () => {
            // arrange
            EmpMock.$queryInterface.$useHandler(function(query, queryOptions, done){
                return Promise.resolve(returnedEmp);
            });

            // act
            const resp = await EmpDAO.getEmployeeByEmail("myEmail@email.com", EmpMock);

            // assert
            expect(resp.email).toBe("myEmail@email.com");
            expect(resp.name).toBe("myFName myLName");
        });

        it("ED1.2 - should return false when Employee model can't find employee", async () => {
            // arrange
            EmpMock.$queryInterface.$useHandler(function(query,queryOptions, done){
                return Promise.resolve(false);
            });

            // act
            const resp = await EmpDAO.getEmployeeByEmail("no@email.com", EmpMock);

            // assert
            expect(resp).toBeFalsy();
        });

        it("ED1.3 - should catch error thrown by the Employee Model", async () => {
            // arrange
            EmpMock.$queryInterface.$useHandler(function(query, queryOptions, done){
                return Promise.reject(new Error("Error with the Employee Model."));
            });

            // act
            await EmpDAO.getEmployeeByEmail("", EmpMock).catch(err => {
                // assert
                expect(err.message).toBe("Error with the Employee Model.");
            });
        });
    });

    describe("ED2 - getAllEmployees", () => {
        it("ED2.1 - should return a list of employees", async () => {
            
            // arrange
            EmpListMock.$queryInterface.$useHandler(function(query, queryOptions, done){
                return Promise.resolve(returnedEmployeeList);
            });

            // act
            const response = await EmpDAO.getAllEmployees(EmpListMock);

            // assert
            expect(response.length).toBe(3);
        });

        it("ED2.2 - should resolve false when Model cant fetch data", async () => {
            // arrange
            EmpListMock.$queryInterface.$useHandler(function (query, queryOptions, done) {
                return Promise.resolve(false);
            });

            // act and assert
            await expect(EmpDAO.getAllEmployees(EmpListMock)).resolves
                .toEqual(false);
        });

        it("ED2.3 - should reject error when Model throws error with defined status and message", async () => {
            // arrange
            let expectedError = {
                status: 404,
                message: "Error."
            };

            EmpListMock.$queryInterface.$useHandler(function (query, queryOptions, done) {
                return Promise.reject(expectedError);
            });

            // act and assert
            await expect(EmpDAO.getAllEmployees(EmpListMock)).rejects
                .toEqual(expectedError);
        });

        it("ND2.4 - should reject error with 500 status and predefined message when model does not define them", async () => {
            // arrange
            let expectedError = {
                status: 500,
                message: "some error occured"
            };

            EmpListMock.$queryInterface.$useHandler(function (query, queryOptions, done) {
                return Promise.reject({});
            });

            // act and assert
            await expect(EmpDAO.getAllEmployees(EmpListMock)).rejects
                .toEqual(expectedError);
        });
    });
});

