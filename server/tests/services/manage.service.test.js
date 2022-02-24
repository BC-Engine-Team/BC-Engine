const InvoiceAffectDao = require("../../data_access_layer/daos/invoice_affect.dao");
const ManageService = require('../../services/manage.service')
const { afterAll } = require('jest-circus');
var { expect, jest } = require('@jest/globals');

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

let invoiceAffectDaoSpy = jest.spyOn(InvoiceAffectDao, 'findAllClients')
    .mockImplementation(() => new Promise((resolve) => {
        resolve(fakeClientList);
    }));

describe("Test Manage Service", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        process.exit;
    });

    describe("MS1 - getAllClients", () => {
        it("MS1.1 - should respond with the list of clients", async () => {
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

        it("MS1.2 - should return false when no data is gotten from the database", async () => {
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

        it("MS1.3 - should return error with default message and status", async () => {
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

        it("MS1.4 - should return error with specified message and status", async () => {
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
