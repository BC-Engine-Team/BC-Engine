const ManageService = require('../../services/manage.service');
const ClientGradingDAO = require("../../data_access_layer/daos/client_grading.dao");
const NameDAO = require("../../data_access_layer/daos/name.dao");
const InvoiceAffectDao = require("../../data_access_layer/daos/invoice_affect.dao");
const sinon = require("sinon");
var { expect, jest } = require('@jest/globals');
const { afterAll } = require('jest-circus');


let clientsList = [
    {
        nameId: 24505,
        name: "CompanyName",
        country: "Canada",
        grading: "A+"
    },
    {
        nameId: 25641,
        name: "CompanyName",
        country: "Canada",
        grading: "B"
    }
]

const expectedClientGrading = {
    dataValues: {
        clientGradingId: 1,
        maximumGradeAPlus: 300000,
        minimumGradeAPlus: 50012,
        averageCollectionTimeGradeAPlus: 1,
        maximumGradeA: 50003,
        minimumGradeA: 6,
        averageCollectionTimeGradeA: 30,
        maximumGradeB: 50003,
        minimumGradeB: 5,
        averageCollectionTimeGradeB: 1,
        maximumGradeC: 50002,
        minimumGradeC: 4,
        averageCollectionTimeGradeC: 30,
        maximumGradeEPlus: 50001,
        minimumGradeEPlus: 3,
        averageCollectionTimeGradeEPlus: 60
    }
}


const expectedClientGradingForDatabase = {
    maximumGradeAPlus: 300000,
    minimumGradeAPlus: 50012,
    averageCollectionTimeGradeAPlus: 1,
    maximumGradeA: 50003,
    minimumGradeA: 6,
    averageCollectionTimeGradeA: 30,
    maximumGradeB: 50003,
    minimumGradeB: 5,
    averageCollectionTimeGradeB: 1,
    maximumGradeC: 50002,
    minimumGradeC: 4,
    averageCollectionTimeGradeC: 30,
    maximumGradeEPlus: 50001,
    minimumGradeEPlus: 3,
    averageCollectionTimeGradeEPlus: 60
}



const expectedInvoiceAffectAmountWithDaysToPay = [
    {
        nameId: 2231,
        affectAmount: 45002,
        daysToPay: 32
    },
    {
        nameId: 2232,
        affectAmount: 3500,
        daysToPay: 15
    },
    {
        nameId: 2233,
        affectAmount: 21002,
        daysToPay: 45
    }
];

const expectedMaximumMinimum = {
    gradeAPlusDelimitation: {
        minimum: 0,
        maximum: 30
    },
    gradeADelimitation: {
        minimum: 31,
        maximum: 60
    },
    gradeBDelimitation: {
        minimum: 31,
        maximum: 60
    },
    gradeCDelimitation: {
        minimum: 61,
        maximum: 90
    },
    gradeEPlusDelimitation: {
        minimum: 61,
        maximum: 90
    }
}

let listOfRandomNameId = [20000, 20001, 20002, 45000]


let sandbox = sinon.createSandbox();


// all daos spy
let clientGradingDaoSpy = jest.spyOn(ClientGradingDAO, 'getClientGradings')
        .mockImplementation(() => new Promise((resolve) => {
            resolve(expectedClientGrading);
        }));

let nameDaoSpy = jest.spyOn(NameDAO, 'getNameIDAndAffectAmount')
        .mockImplementation(() => new Promise((resolve) => {
            resolve(expectedInvoiceAffectAmountWithDaysToPay);
        }));


let changeClientGradingToAPlusDaoSpy = jest.spyOn(NameDAO, 'changeClientGradingToAPlus')
        .mockImplementation(() => new Promise((resolve) => {
            resolve(false);
        }));

let changeClientGradingToADaoSpy = jest.spyOn(NameDAO, 'changeClientGradingToA')
        .mockImplementation(() => new Promise((resolve) => {
            resolve(false);
        }));

let changeClientGradingToBDaoSpy = jest.spyOn(NameDAO, 'changeClientGradingToB')
        .mockImplementation(() => new Promise((resolve) => {
            resolve(false);
        }));

let changeClientGradingToCDaoSpy = jest.spyOn(NameDAO, 'changeClientGradingToC')
        .mockImplementation(() => new Promise((resolve) => {
            resolve(false);
        }));

let changeClientGradingToEPlusDaoSpy = jest.spyOn(NameDAO, 'changeClientGradingToEPlus')
        .mockImplementation(() => new Promise((resolve) => {
            resolve(false);
        }));

        
let invoiceAffectDaoSpy = jest.spyOn(InvoiceAffectDao, 'findAllClients')
        .mockImplementation(() => new Promise((resolve) => {
            resolve(fakeClientList);
        }));

//all manage service method spy

let createDelimitationForCollectionDaysForEachGradingSpy = jest.spyOn(ManageService, 'createDelimitationForCollectionDaysForEachGrading')
    .mockImplementation(() => new Promise((resolve) => {
        resolve(false);
    }));

let getNameIDAndAffectAmountSpy = jest.spyOn(ManageService, 'getNameIDAndAffectAmount')
    .mockImplementation(() => new Promise((resolve) => {
        resolve(false);
    }));


let changeClientGradingToAPlusSpy = jest.spyOn(ManageService, 'changeClientGradingToAPlus')
    .mockImplementation(() => new Promise((resolve) => {
        resolve(false);
    }));

let changeClientGradingToASpy = jest.spyOn(ManageService, 'changeClientGradingToA')
    .mockImplementation(() => new Promise((resolve) => {
        resolve(false);
    }));

let changeClientGradingToBSpy = jest.spyOn(ManageService, 'changeClientGradingToB')
    .mockImplementation(() => new Promise((resolve) => {
        resolve(false);
    }));

let changeClientGradingToCSpy = jest.spyOn(ManageService, 'changeClientGradingToC')
    .mockImplementation(() => new Promise((resolve) => {
        resolve(false);
    }));

let changeClientGradingToEPlusSpy = jest.spyOn(ManageService, 'changeClientGradingToEPlus')
    .mockImplementation(() => new Promise((resolve) => {
        resolve(false);
    }));


describe("Test Manage Service", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        sandbox.restore();
    });

    afterAll(() => {
        process.exit;
    });


    describe("MS1 - getAllClientGradings", () => {

        describe("MS1.1 - given a client grading brackets group", () => {
            it("MS1.1.1 - Should return the current client gradings brackets with the average collection time for each gradings", async() => {

                // arrange
                clientGradingDaoSpy = jest.spyOn(ClientGradingDAO, 'getClientGradings')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(expectedClientGrading);
                    }));

                // act and assert
                await expect(ManageService.getAllClientGradings()).resolves
                    .toEqual(expectedClientGrading);
            });


            it("MS1.1.2 - should resolve false when dao returns false", async () => {
                // arrange
                clientGradingDaoSpy = jest.spyOn(ClientGradingDAO, 'getClientGradings')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(false);
                    }));

                // act and assert
                await expect(ManageService.getAllClientGradings()).resolves
                    .toEqual(false);
            });

            it("MS1.1.3 - should reject with dao error status and message when dao throws error", async () => {
                // arrange
                let expectedError = {
                    status: 404,
                    message: "Error message."
                };

                clientGradingDaoSpy = jest.spyOn(ClientGradingDAO, 'getClientGradings')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        reject(expectedError);
                    }));

                // act and assert
                await expect(ManageService.getAllClientGradings()).rejects
                    .toEqual(expectedError);
            });

            it("MS1.1.4 - should reject with status 500 and message when dao error doesn't specify", async () => {
                // arrange
                let expectedError = {
                    status: 500,
                    message: "Malfunction in the B&C Engine."
                };

                clientGradingDaoSpy = jest.spyOn(ClientGradingDAO, 'getClientGradings')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        reject({});
                    }));

                // act and assert
                await expect(ManageService.getAllClientGradings()).rejects
                    .toEqual(expectedError);
            });
        });
    });



    describe("MS2 - modifyClientGradings", () => {
        let expectedResult = "Client grading modified successfully";
        describe("MS2.1 - given a valid client grading brackets group modification in the local database", () => {
            it("MS2.1.1 - Should return a confirmation message the brackets has been modified", async() => {

                // arrange
                clientGradingDaoSpy = jest.spyOn(ClientGradingDAO, 'updateClientGrading')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(expectedResult);
                    }));

                // act and assert
                await expect(ManageService.modifyClientGradings(expectedClientGrading)).resolves
                    .toEqual(expectedResult);
            });

            it("MS2.1.2 - should resolve false when dao returns false", async() => {

                // arrange
                clientGradingDaoSpy = jest.spyOn(ClientGradingDAO, 'updateClientGrading')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(false);
                    }));

                // act and assert
                await expect(ManageService.modifyClientGradings(expectedClientGrading)).resolves
                    .toEqual(false);
            });


            it("MS2.1.3 - should reject with dao error status and message when dao throws error", async () => {
                // arrange
                let expectedError = {
                    status: 404,
                    message: "Error message."
                };

                clientGradingDaoSpy = jest.spyOn(ClientGradingDAO, 'updateClientGrading')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        reject(expectedError);
                    }));

                // act and assert
                await expect(ManageService.modifyClientGradings(expectedClientGrading)).rejects
                    .toEqual(expectedError);
            });

            it("MS2.1.4 - should reject with status 500 and message when dao error doesn't specify", async () => {
                // arrange
                let expectedError = {
                    status: 500,
                    message: "Malfunction in the B&C Engine."
                };

                clientGradingDaoSpy = jest.spyOn(ClientGradingDAO, 'updateClientGrading')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        reject({});
                    }));

                // act and assert
                await expect(ManageService.modifyClientGradings(expectedClientGrading)).rejects
                    .toEqual(expectedError);
            });
        });
    });
    
    describe("MS3 - getAllClients", () => {
        it("MS3.1 - should respond with the list of clients", async () => {
            //arrange
            invoiceAffectDaoSpy = jest.spyOn(InvoiceAffectDao, 'findAllClients')
            .mockImplementation(() => new Promise((resolve) => {
                resolve(clientsList);
            }));

            // act
            const response = await ManageService.getAllClients();

            // assert
            expect(response).toEqual(clientsList);
            expect(invoiceAffectDaoSpy).toBeCalledTimes(1);
        });

        it("MS3.2 - should return false when no data is gotten from the database", async () => {
            //arrange
            invoiceAffectDaoSpy = jest.spyOn(InvoiceAffectDao, 'findAllClients')
            .mockImplementation(() => new Promise((resolve) => {
                resolve(false);
            }));

            // act
            const response = await ManageService.getAllClients();

            // assert
            expect(response).toEqual(false);
            expect(invoiceAffectDaoSpy).toBeCalledTimes(1);
        });

        it("MS3.3 - should return error with default message and status", async () => {
            //arrange
            let expectedResponse = {
                status: 500,
                message: "Could not fetch clients."
            };

            invoiceAffectDaoSpy = jest.spyOn(InvoiceAffectDao, 'findAllClients')
            .mockImplementation(() => new Promise((resolve, reject) => {
                reject({message: "", status: ""});
            }));

            // act and assert
            await expect(ManageService.getAllClients()).rejects
                .toEqual(expectedResponse)
            expect(invoiceAffectDaoSpy).toBeCalledTimes(1);
        });

        it("MS3.4 - should return error with specified message and status", async () => {
            //arrange
            let expectedResponse = {
                status: 600,
                message: "Error."
            };

            invoiceAffectDaoSpy = jest.spyOn(InvoiceAffectDao, 'findAllClients')
            .mockImplementation(() => new Promise((resolve, reject) => {
                reject(expectedResponse);
            }));

            // act and assert
            await expect(ManageService.getAllClients()).rejects
                .toEqual(expectedResponse)
            expect(invoiceAffectDaoSpy).toBeCalledTimes(1);
        });
    });
});
