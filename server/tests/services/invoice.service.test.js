const sinon = require("sinon");
var { expect, jest } = require('@jest/globals');

const InvoiceService = require("../../services/invoice.service");
const TransacStatDao = require("../../data_access_layer/daos/transac_stat.dao");
const InvoiceAffectDao = require("../../data_access_layer/daos/invoice_affect.dao");

let yearMonthList = [202011, 202012, 202101];

let fakeBilledList = [
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
];
let fakeDuesList = [
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
];

let fakeTransacStatList = [
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
];

let fakeInvoiceAffectList = [
    {
        invoiceDate: new Date(2020, 9, 15),
        amount: 50
    },
    {
        invoiceDate: new Date(2020, 10, 15),
        amount: 50
    },
    {
        invoiceDate: new Date(2020, 11, 15),
        amount: 50
    }
];

let expectedGetAverageResponse = {
    2020: [
        {
            month: 202011,
            average: (fakeDuesList[0].totalDues / fakeBilledList[0].billed * 365).toFixed(2),
            group: 2020
        },
        {
            month: 202012,
            average: (fakeDuesList[1].totalDues / fakeBilledList[1].billed * 365).toFixed(2),
            group: 2020
        }
    ],
    2021: [
        {
            month: 202101,
            average: (fakeDuesList[2].totalDues / fakeBilledList[2].billed * 365).toFixed(2),
            group: 2021
        }
    ]
};



let sandbox = sinon.createSandbox();
let getBilledSpy = jest.spyOn(InvoiceService, 'getBilled')
    .mockImplementation(() => new Promise((resolve) => {
        resolve(fakeBilledList);
    }));
let getDuesSpy = jest.spyOn(InvoiceService, 'getDues')
    .mockImplementation(() => new Promise((resolve) => {
        resolve(fakeDuesList);
    }));

let transacStatDaoSpy = jest.spyOn(TransacStatDao, 'getTransactionsStatByYearMonth')
    .mockImplementation(() => new Promise((resolve) => {
        resolve(fakeTransacStatList);
    }));

let invoiceAffectDaoSpy = jest.spyOn(InvoiceAffectDao, 'getInvoicesByDate')
    .mockImplementation(() => new Promise((resolve) => {
        resolve(fakeInvoiceAffectList);
    }));

describe("Test Invoice Service", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        sandbox.restore();
    });

    afterAll(() => {
        process.exit;
    });

    describe("IS1 - getAverages", () => {
        describe("IS1.1 - given two dates", () => {
            it("IS1.1.1 - should respond with the list of averages per month with group key", async () => {
                // arrange
                getDuesSpy = jest.spyOn(InvoiceService, 'getDues')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(fakeDuesList);
                    }));

                // act
                const response = await InvoiceService.getAverages("2020-11-01", "2021-01-01");

                // assert
                expect(response).toEqual(expectedGetAverageResponse);
                expect(getDuesSpy).toBeCalledTimes(1);
                expect(getDuesSpy).toBeCalledWith(yearMonthList);
            });

            it("IS1.1.2 - should respond with error thrown by getDues", async () => {
                // arrange
                getDuesSpy = jest.spyOn(InvoiceService, 'getDues')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        reject({ message: "getDues failed" });
                    }));

                // act and assert
                await expect(InvoiceService.getAverages("2020-11-01", "2021-01-01")).rejects
                    .toEqual({ message: "getDues failed" });
            });

            it("IS1.1.3 - should respond with error thrown by getBilled", async () => {
                // arrange
                getDuesSpy = jest.spyOn(InvoiceService, 'getDues')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(fakeDuesList);
                    }));
                getBilledSpy = jest.spyOn(InvoiceService, 'getBilled')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        reject({ message: "getBilled failed" });
                    }));

                // act and assert
                await expect(InvoiceService.getAverages("2020-11-01", "2021-01-01")).rejects
                    .toEqual({ message: "getBilled failed" });
            });
        });
    });

    describe("IS2 - getDues", () => {
        describe("IS2.1 - given a valid yearMonthList", () => {
            it("IS2.1.1 - should return totalDuesList", async () => {
                // arrange
                getDuesSpy.mockRestore();
                let expectedList = [
                    {
                        month: "202011",
                        totalDues: "190.00"
                    },
                    {
                        month: "202012",
                        totalDues: "190.00"
                    },
                    {
                        month: "202101",
                        totalDues: "190.00"
                    }
                ];

                // act
                const response = await InvoiceService.getDues(yearMonthList);

                // assert
                expect(response).toEqual(expectedList);
                expect(transacStatDaoSpy).toHaveBeenCalledTimes(1);
                expect(transacStatDaoSpy).toHaveBeenCalledWith(yearMonthList);
            });

            it("IS2.1.2 - should reject with error when dao throws error", async () => {
                // arrange
                transacStatDaoSpy = jest.spyOn(TransacStatDao, 'getTransactionsStatByYearMonth')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        reject({ message: "dao failed" });
                    }));

                // act and assert
                await expect(InvoiceService.getDues(yearMonthList)).rejects
                    .toEqual({ message: "dao failed" });
            });

            it("IS2.1.3 - should resolve with false when dao resolves false", async () => {
                // arrange
                transacStatDaoSpy = jest.spyOn(TransacStatDao, 'getTransactionsStatByYearMonth')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        resolve(false);
                    }));

                // act and assert
                await expect(InvoiceService.getDues(yearMonthList)).resolves
                    .toEqual(false);
            });
        });
    });

    describe("IS3 - getBilled", () => {
        describe("IS3.1 - given a valid start and end date str and yearMonthList", () => {
            let startDateStr = '2019-11-01';
            let endDateStr = '2021-01-01';

            it("IS3.1.1 - should return billed", async () => {
                // arrange
                getBilledSpy.mockRestore()
                let expectedList = [
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
                ];

                // act
                const response = await InvoiceService.getBilled(startDateStr, endDateStr, yearMonthList);

                // assert
                expect(response).toEqual(expectedList);
                expect(invoiceAffectDaoSpy).toHaveBeenCalledTimes(1);
                expect(invoiceAffectDaoSpy).toHaveBeenCalledWith(startDateStr, endDateStr);
            });

            it("IS3.1.2 - should reject with error when dao throws error", async () => {
                // arrange
                invoiceAffectDaoSpy = jest.spyOn(InvoiceAffectDao, 'getInvoicesByDate')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        reject({ message: "dao failed" });
                    }));

                // act and assert
                await expect(InvoiceService.getBilled(startDateStr, endDateStr, yearMonthList)).rejects
                    .toEqual({ message: "dao failed" });
            });

            it("IS3.1.3 - should resolve with false when dao resolves with false", async () => {
                // arrange
                invoiceAffectDaoSpy = jest.spyOn(InvoiceAffectDao, 'getInvoicesByDate')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(false);
                    }));

                // act and assert
                await expect(InvoiceService.getBilled(startDateStr, endDateStr, yearMonthList)).resolves
                    .toEqual(false);
            });
        });
    });
});