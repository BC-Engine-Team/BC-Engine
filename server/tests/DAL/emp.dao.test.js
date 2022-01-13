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


let SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();
var EmpMock = dbMock.define('employees', returnedEmp);

describe("Test Employee DAL", () => {
    const Model = EmpModel(sequelize, dataTypes);
    const instance = new Model();

    afterEach(() => {
        EmpMock.$queryInterface.$clearResults();
    });

    beforeEach(() => {
        EmpMock.$queryInterface.$clearResults();
    });

    // testing the employee model properties
    checkModelName(Model)('PERSON');
    ['firstName', 'lastName', 'email']
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
});

