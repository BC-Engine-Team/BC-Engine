const { sequelize,
    dataTypes,
    checkModelName,
    checkPropertyExists,
    checkHookDefined
} = require('sequelize-test-helpers');
const ClientDao = require("../../data_access_layer/daos/name.dao");
const NameModel = require('../../data_access_layer/models/mssql_bosco/name.model')(sequelize, dataTypes);


let fakeClientList = [
    {
        NAME_ID: 20100,
        NAME: "National Research Council of Canada",
        COUNTRY_LABEL: "Canada"
    },
    {
        NAME_ID: 20234,
        NAME: "Groupe Patrick Ménard Assurances Inc. Groupe Jetté",
        COUNTRY_LABEL: "Canada"
    },
    {
        NAME_ID: 20330,
        NAME: "Martin Aubé",
        COUNTRY_LABEL: "Japan"
    }
];

let fakeClientListFiltered = [
    {
        NAME_ID: 20100,
        NAME: "National Research Council of Canada",
        COUNTRY_LABEL: "Canada"
    },
    {
        NAME_ID: 20234,
        NAME: "Groupe Patrick Ménard Assurances Inc. Groupe Jetté",
        COUNTRY_LABEL: "Canada"
    }
];

let returnedEmployee = [
    {
        nameID: 29910,
        firstName: 'Cathia',
        lastName: 'Zeppetelli'
    }
]

let SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();
var NameMock = dbMock.define('NAME', returnedEmployee);

describe("Test Name DAO", () => {
    const instance = new NameModel();

    afterEach(() => {
        NameMock.$queryInterface.$clearResults();
    })

    beforeEach(() => {
        NameMock.$queryInterface.$clearResults();
    })

    // testing the chart report model properties
    checkModelName(NameModel)('NAME');
    ['nameID', 'firstName', 'lastName']
        .forEach(checkPropertyExists(instance));

    describe("ND1 - getClientByID", () => {
        it("ND1.1 - Should return list of clients", async () => {
            
            // arrange
            let testId = [20100, 20234, 20330];

            let dbStub = {
                query: () => {
                    return fakeClientList;
                }
            };

            let expectedResponse = [
                {
                    nameId: fakeClientList[0].NAME_ID,
                    name: fakeClientList[0].NAME,
                    country: fakeClientList[0].COUNTRY_LABEL
                },
                {
                    nameId: fakeClientList[1].NAME_ID,
                    name: fakeClientList[1].NAME,
                    country: fakeClientList[1].COUNTRY_LABEL
                },
                {
                    nameId: fakeClientList[2].NAME_ID,
                    name: fakeClientList[2].NAME,
                    country: fakeClientList[2].COUNTRY_LABEL
                }
            ];

            // act
            const response = await ClientDao.getClientByID(testId, dbStub);

            // assert
            expect(response).toEqual(expectedResponse);
        });

        it("ND1.2 - should return false when db cant fetch data", async () => {
            // arrange
            let dbStub = {
                query: () => {
                    return false;
                }
            };

            let testId = [0];

            // act and assert
            await expect(ClientDao.getClientByID(testId, dbStub)).resolves
                .toEqual(false);
        });

        it("ND1.3 - should catch error when db throws error", async () => {
            // arrange
            let dbStub = {
                query: () => {
                    throw new Error("Error with the db.");
                }
            };

            let testId = [0];

            // act and assert
            await expect(ClientDao.getClientByID(testId, dbStub)).rejects
                .toEqual(new Error("Error with the db."));
        })
    });

    describe("ND2 - getEmployeeByName", () => {
        it("ND2.1 - Should return one employee corresponding to the name input", async () => {
            
            // arrange
            let firstName = 'Cathia';
            let lastName = 'Seppetelli'

            NameMock.$queryInterface.$useHandler(function (query, queryOptions, done) {
                return Promise.resolve(returnedEmployee);
            });

            // act and assert
            await expect(ClientDao.getEmployeeByName(firstName, lastName, NameMock)).resolves
                .toEqual(returnedEmployee);
        });

        it("ND2.2 - should resolve false when Model cant fetch data", async () => {
            // arrange
            let firstName = 'Cathia';
            let lastName = 'Seppetelli'

            NameMock.$queryInterface.$useHandler(function (query, queryOptions, done) {
                return Promise.resolve(false);
            });

            // act and assert
            await expect(ClientDao.getEmployeeByName(firstName, lastName, NameMock)).resolves
                .toEqual(false);
        });

        it("ND2.3 - should reject error when Model throws error with defined status and message", async () => {
            // arrange
            let firstName = 'Cathia';
            let lastName = 'Seppetelli'

            let expectedError = {
                status: 404,
                message: "Error."
            };

            NameMock.$queryInterface.$useHandler(function (query, queryOptions, done) {
                return Promise.reject(expectedError);
            });

            // act and assert
            await expect(ClientDao.getEmployeeByName(firstName, lastName, NameMock)).rejects
                .toEqual(expectedError);
        });

        it("ND2.4 - should reject error with 500 status and predefined message when model does not define them", async () => {
            // arrange
            let firstName = 'Cathia';
            let lastName = 'Seppetelli'

            let expectedError = {
                status: 500,
                message: "some error occured"
            };

            NameMock.$queryInterface.$useHandler(function (query, queryOptions, done) {
                return Promise.reject({});
            });

            // act and assert
            await expect(ClientDao.getEmployeeByName(firstName, lastName, NameMock)).rejects
                .toEqual(expectedError);
        });
    });

    describe("ND3 - getClientByIDAndCountry", () => {
        it("ND3.1 - Should return employees corresponding to the name input", async () => {
            
            // arrange
            let testId = [20100, 20234];
            let countryName = "Canada";

            let dbStub = {
                query: () => {
                    return fakeClientListFiltered;
                }
            };

            let expectedResponse = [
                {
                    nameId: fakeClientList[0].NAME_ID,
                    name: fakeClientList[0].NAME,
                    country: fakeClientList[0].COUNTRY_LABEL
                },
                {
                    nameId: fakeClientList[1].NAME_ID,
                    name: fakeClientList[1].NAME,
                    country: fakeClientList[1].COUNTRY_LABEL
                }
            ];

            // act
            const response = await ClientDao.getClientByIDAndCountry(testId, countryName, dbStub);

            // assert
            expect(response).toEqual(expectedResponse);
            
        });

        it("ND3.2 - should resolve false when Model cant fetch data", async () => {
             // arrange
            let dbStub = {
                query: () => {
                    return false;
                }
            };

            let testId = [0];
            let countryName = 0;

            // act and assert
            await expect(ClientDao.getClientByIDAndCountry(testId, countryName, dbStub)).resolves
                .toEqual(false);
            
        });

        it("ND3.3 - should catch error when db throws error", async () => {
            // arrange
            let dbStub = {
                query: () => {
                    throw new Error("Error with the db.");
                }
            };

            let testId = [0];
            let countryName = 0;

            // act and assert
            await expect(ClientDao.getClientByIDAndCountry(testId, countryName, dbStub)).rejects
                .toEqual(new Error("Error with the db."));
        });
    });
});