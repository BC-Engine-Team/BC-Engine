const sinon = require("sinon");
var { expect, jest } = require('@jest/globals');

const InvoiceService = require("../../services/invoice.service");
const TransacStatDao = require("../../data_access_layer/daos/transac_stat.dao");
const InvoiceAffectDao = require("../../data_access_layer/daos/invoice_affect.dao");
const ClientDao = require("../../data_access_layer/daos/name.dao");
const ClientGradingDao = require("../../data_access_layer/daos/client_grading.dao");
const NameQualityDao = require("../../data_access_layer/daos/name_quality.dao");
const CountryDao = require("../../data_access_layer/daos/country.dao");

let yearMonthList = [202011, 202012, 202101];
let nameIdList = [32590, 36052, 37960];


let fakeBilledList = {
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
};

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
];

let fakeInvoiceAffectListWithEmptyClientList = [
    {
        invoiceDate: new Date(2020, 9, 15),
        amount: 0
    },
    {
        invoiceDate: new Date(2020, 10, 15),
        amount: 0
    },
    {
        invoiceDate: new Date(2020, 11, 15),
        amount: 0
    }
];

let fakeExpectedGetAverageResponse = [
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
                name: "IRIS DYNAMICS LTD",
                country: "Canada",
                grading: "C"
            },
            {
                nameId: 36052,
                name: "Moussa Cisse KEITA",
                country: "Canada",
                grading: "N/A"
            },
            {
                nameId: 37960,
                name: "FROST BROWN TODD LLC",
                country: "United States",
                grading: "N/A"
            }
        ]
    }
];

let fakeClientNameCountryList = [
    {
        nameId: 32590,
        name: "IRIS DYNAMICS LTD",
        country: "Canada",
        grading: ""
    },
    {
        nameId: 36052,
        name: "Moussa Cisse KEITA",
        country: "Canada",
        grading: ""
    },
    {
        nameId: 37960,
        name: "FROST BROWN TODD LLC",
        country: "United States",
        grading: ""
    }
];


let fakeClientDAOList = [
    {
        nameId: 1,
        name: "Banque Royale",
        country: "Canada",
        grading: ""
    },
    {
        nameId: 2,
        name: "Benoit Cote",
        country: "Canada",
        grading: ""
    },
    {
        nameId: 3,
        name: "FrostBrown Todd",
        country: "United States",
        grading: ""
    },
    {
        nameId: 4,
        name: "Enterprise Engine",
        country: "Australia",
        grading: ""
    },
    {
        nameId: 5,
        name: "Beinjing Xia Long Inc. Train",
        country: "China",
        grading: ""
    },
    {
        nameId: 6,
        name: "Mappa Design Studio",
        country: "Japan",
        grading: ""
    },
    {
        nameId: 7,
        name: "Plank Productions Inc.",
        country: "Canada",
        grading: ""
    },
    {
        nameId: 8,
        name: "Unknown user",
        country: "Canada",
        grading: ""
    }
]


let fakeClientGradingList = [
    {
        nameId: 32590,
        grading: "C"
    },
    {
        nameId: 360521,
        grading: ""
    },
    {
        nameId: 379602,
        grading: ""
    }
]


let fakeClientGradingDAOList = [
    {
        nameId: 32590,
        grading: "C"
    },
    {
        nameId: 36052,
        grading: ""
    },
    {
        nameId: 37960,
        grading: ""
    }
]


let fakeCountriesList = [
    {
        countryLabel: "Albania"
    },
    {
        countryLabel: "Italy"
    },
    {
        countryLabel: "Morocco"
    }
]


let sandbox = sinon.createSandbox();


//the methods in invoice services

let getBilledSpy = jest.spyOn(InvoiceService, 'getBilled')
    .mockImplementation(() => new Promise((resolve) => {
        resolve(fakeBilledList);
    }));

let getDuesSpy = jest.spyOn(InvoiceService, 'getDues')
    .mockImplementation(() => new Promise((resolve) => {
        resolve(fakeDuesList);
    }));


let getClientSpy = jest.spyOn(InvoiceService, 'getNamesAndCountries')
    .mockImplementation(() => new Promise((resolve) => {
        resolve(fakeClientNameCountryList);
    }));

let getClientGradingSpy = jest.spyOn(InvoiceService, 'getClientGrading')
    .mockImplementation(() => new Promise((resolve) => {
        resolve(fakeClientGradingList);
    }));

let getCountriesNameSpy = jest.spyOn(InvoiceService, 'getCountriesName')
    .mockImplementation(() => new Promise((resolve) => {
        resolve(fakeContriesList);
    }));


//the dao objects to get data from database

let transacStatDaoSpy = jest.spyOn(TransacStatDao, 'getTransactionsStatByYearMonth')
    .mockImplementation(() => new Promise((resolve) => {
        resolve(fakeTransacStatList);
    }));

let invoiceAffectDaoSpy = jest.spyOn(InvoiceAffectDao, 'getInvoicesByDate')
    .mockImplementation(() => new Promise((resolve) => {
        resolve(fakeInvoiceAffectList);
    }));

let clientDaoSpy = jest.spyOn(ClientDao, 'getClientByID')
    .mockImplementation(() => new Promise((resolve) => {
        resolve(fakeClientDAOList);
    }));

let clientGradingDaoSpy = jest.spyOn(ClientGradingDao, 'getClientGrading')
    .mockImplementation(() => new Promise((resolve) => {
        resolve(fakeClientGradingDAOList);
    }));

let nameQualityDaoSpy = jest.spyOn(NameQualityDao, 'getClientsByEmployee')
    .mockImplementation(() => new Promise((resolve) => {
        resolve(nameIdList);
    }));

let countryDaoSpy = jest.spyOn(CountryDao, 'getAllCountries')
    .mockImplementation(() => new Promise((resolve) => {
        resolve(fakeCountriesList)
    }))




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
                //arrange
                getClientSpy = jest.spyOn(InvoiceService, 'getNamesAndCountries')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(fakeClientNameCountryList);
                    }));


                getClientGradingSpy = jest.spyOn(InvoiceService, 'getClientGrading')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(fakeClientGradingList);
                    }));

                // act
                const response = await InvoiceService.getAverages("2020-11-01", "2021-01-01");

                // assert
                expect(response).toEqual(fakeExpectedGetAverageResponse);
                expect(getDuesSpy).toBeCalledTimes(1);
                expect(getDuesSpy).toBeCalledWith(yearMonthList, undefined, undefined, undefined);

                expect(getClientSpy).toBeCalledTimes(1);
                expect(getClientGradingSpy).toBeCalledTimes(1);
            });

            it("IS1.1.3 - should respond with error thrown by getDues", async () => {
                // arrange
                getDuesSpy = jest.spyOn(InvoiceService, 'getDues')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        reject({ message: "getDues failed" });
                    }));

                // act and assert
                await expect(InvoiceService.getAverages("2020-11-01", "2021-01-01")).rejects
                    .toEqual({ message: "getDues failed" });
            });

            it("IS1.1.4 - should respond with error thrown by getBilled", async () => {
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

            it("IS1.1.5 - should respond with error message 400 when start date is after end date", async () => {
                // arrange
                let startDate = "2020-11-01";
                let endDate = "2019-11-01";
                let expectedError = {
                    status: 400,
                    message: "Invalid date order."
                }

                // act and assert
                await expect(InvoiceService.getAverages(startDate, endDate)).rejects
                    .toEqual(expectedError);
            });

            it("IS1.1.6 - should respond with error thrown by getNamesAndCountries", async () => {
                // arrange
                getDuesSpy = jest.spyOn(InvoiceService, 'getDues')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(fakeDuesList);
                    }));

                getBilledSpy = jest.spyOn(InvoiceService, 'getBilled')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(fakeBilledList);
                    }));
                getClientSpy = jest.spyOn(InvoiceService, 'getNamesAndCountries')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        reject({ message: "getNamesAndCountries failed" });
                    }));


                // act and assert
                await expect(InvoiceService.getAverages("2020-11-01", "2021-01-01")).rejects
                    .toEqual({ message: "getNamesAndCountries failed" });

            });

            it("IS1.1.7 - should respond with error thrown by getClientGrading", async () => {
                // arrange
                getDuesSpy = jest.spyOn(InvoiceService, 'getDues')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(fakeDuesList);
                    }));

                getBilledSpy = jest.spyOn(InvoiceService, 'getBilled')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(fakeBilledList);
                    }));
                getClientSpy = jest.spyOn(InvoiceService, 'getNamesAndCountries')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(fakeClientNameCountryList);
                    }));
                getClientGradingSpy = jest.spyOn(InvoiceService, 'getClientGrading')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        reject({ message: "getClientGrading failed" });
                    }));

                // act and assert
                await expect(InvoiceService.getAverages("2020-11-01", "2021-01-01")).rejects
                    .toEqual({ message: "getClientGrading failed" });
            });
        });


        describe("IS1.2 - given two dates and employeeId", () => {
            let employeeId = 22769;
            it("IS1.2.1 - should respond with the list of averages per month with group key", async () => {
                //arrange
                getClientSpy = jest.spyOn(InvoiceService, 'getNamesAndCountries')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(fakeClientNameCountryList);
                    }));


                getClientGradingSpy = jest.spyOn(InvoiceService, 'getClientGrading')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(fakeClientGradingList);
                    }));

                // act
                const response = await InvoiceService.getAverages("2020-11-01", "2021-01-01", employeeId);

                // assert
                expect(response).toEqual(fakeExpectedGetAverageResponse);
                expect(getDuesSpy).toBeCalledTimes(1);
                expect(getDuesSpy).toBeCalledWith(yearMonthList, employeeId, undefined, undefined);

                expect(getClientSpy).toBeCalledTimes(1);
                expect(getClientGradingSpy).toBeCalledTimes(1);
            });

            it("IS1.2.2 - should respond with error thrown by getDues", async () => {
                // arrange
                getDuesSpy = jest.spyOn(InvoiceService, 'getDues')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        reject({ message: "getDues failed" });
                    }));

                // act and assert
                await expect(InvoiceService.getAverages("2020-11-01", "2021-01-01", employeeId)).rejects
                    .toEqual({ message: "getDues failed" });
            });

            it("IS1.2.3 - should respond with error thrown by getBilled", async () => {
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
                await expect(InvoiceService.getAverages("2020-11-01", "2021-01-01", employeeId)).rejects
                    .toEqual({ message: "getBilled failed" });
            });

            it("IS1.2.4 - should respond with error message 400 when start date is after end date", async () => {
                // arrange
                let startDate = "2020-11-01";
                let endDate = "2019-11-01";
                let expectedError = {
                    status: 400,
                    message: "Invalid date order."
                }

                // act and assert
                await expect(InvoiceService.getAverages(startDate, endDate, employeeId)).rejects
                    .toEqual(expectedError);
            });

            it("IS1.2.5 - should respond with error thrown by getNamesAndCountries", async () => {
                // arrange
                getDuesSpy = jest.spyOn(InvoiceService, 'getDues')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(fakeDuesList);
                    }));

                getBilledSpy = jest.spyOn(InvoiceService, 'getBilled')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(fakeBilledList);
                    }));

                getClientSpy = jest.spyOn(InvoiceService, 'getNamesAndCountries')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        reject({ message: "getNamesAndCountries failed" });
                    }));


                // act and assert
                await expect(InvoiceService.getAverages("2020-11-01", "2021-01-01", employeeId)).rejects
                    .toEqual({ message: "getNamesAndCountries failed" });

            });

            it("IS1.2.6 - should respond with error thrown by getClientGrading", async () => {
                // arrange
                getDuesSpy = jest.spyOn(InvoiceService, 'getDues')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(fakeDuesList);
                    }));

                getBilledSpy = jest.spyOn(InvoiceService, 'getBilled')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(fakeBilledList);
                    }));

                getClientSpy = jest.spyOn(InvoiceService, 'getNamesAndCountries')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(fakeClientNameCountryList);
                    }));

                getClientGradingSpy = jest.spyOn(InvoiceService, 'getClientGrading')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        reject({ message: "getClientGrading failed" });
                    }));

                // act and assert
                await expect(InvoiceService.getAverages("2020-11-01", "2021-01-01", employeeId)).rejects
                    .toEqual({ message: "getClientGrading failed" });
            });
        });

        describe("IS1.3 - given two dates and a country value", () => {
            let countryName = "Canada";
            let employeeId = 22769;

            it("IS1.3.1 - should respond with the list of averages per month with group key for a specific country", async () => {
                //arrange
                getClientSpy = jest.spyOn(InvoiceService, 'getNamesAndCountries')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(fakeClientNameCountryList);
                    }));


                getClientGradingSpy = jest.spyOn(InvoiceService, 'getClientGrading')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(fakeClientGradingList);
                    }));

                // act
                const response = await InvoiceService.getAverages("2020-11-01", "2021-01-01", undefined, undefined, countryName);

                // assert
                expect(response).toEqual(fakeExpectedGetAverageResponse);
                expect(getDuesSpy).toBeCalledTimes(1);
                expect(getDuesSpy).toBeCalledWith(yearMonthList, undefined, undefined, countryName);

                expect(getClientSpy).toBeCalledTimes(1);
                expect(getClientGradingSpy).toBeCalledTimes(1);
            });

            it("IS1.3.2 - should respond with the list of averages per month with group key if option all country is selected", async () => {
                //arrange
                getClientSpy = jest.spyOn(InvoiceService, 'getNamesAndCountries')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(fakeClientNameCountryList);
                    }));


                getClientGradingSpy = jest.spyOn(InvoiceService, 'getClientGrading')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(fakeClientGradingList);
                    }));

                // act
                const response = await InvoiceService.getAverages("2020-11-01", "2021-01-01", undefined, undefined, "All");

                // assert
                expect(response).toEqual(fakeExpectedGetAverageResponse);
                expect(getDuesSpy).toBeCalledTimes(1);
                expect(getDuesSpy).toBeCalledWith(yearMonthList, undefined, undefined, "All");

                expect(getClientSpy).toBeCalledTimes(1);
                expect(getClientGradingSpy).toBeCalledTimes(1);
            });


            it("IS1.3.3 - should respond with error thrown by getDues", async () => {
                // arrange
                getDuesSpy = jest.spyOn(InvoiceService, 'getDues')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        reject({ message: "getDues failed" });
                    }));

                // act and assert
                await expect(InvoiceService.getAverages("2020-11-01", "2021-01-01", undefined, countryName)).rejects
                    .toEqual({ message: "getDues failed" });
            });

            it("IS1.3.4 - should respond with error thrown by getBilled", async () => {
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
                await expect(InvoiceService.getAverages("2020-11-01", "2021-01-01", undefined, countryName)).rejects
                    .toEqual({ message: "getBilled failed" });
            });


            it("IS1.3.5 - should respond with error thrown by getNamesAndCountries", async () => {
                // arrange
                getDuesSpy = jest.spyOn(InvoiceService, 'getDues')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(fakeDuesList);
                    }));

                getBilledSpy = jest.spyOn(InvoiceService, 'getBilled')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(fakeBilledList);
                    }));

                getClientSpy = jest.spyOn(InvoiceService, 'getNamesAndCountries')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        reject({ message: "getNamesAndCountries failed" });
                    }));


                // act and assert
                await expect(InvoiceService.getAverages("2020-11-01", "2021-01-01", undefined, countryName)).rejects
                    .toEqual({ message: "getNamesAndCountries failed" });

            });

            it("IS1.3.6 - should respond with error thrown by getClientGrading", async () => {
                // arrange
                getDuesSpy = jest.spyOn(InvoiceService, 'getDues')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(fakeDuesList);
                    }));

                getBilledSpy = jest.spyOn(InvoiceService, 'getBilled')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(fakeBilledList);
                    }));

                getClientSpy = jest.spyOn(InvoiceService, 'getNamesAndCountries')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(fakeClientNameCountryList);
                    }));

                getClientGradingSpy = jest.spyOn(InvoiceService, 'getClientGrading')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        reject({ message: "getClientGrading failed" });
                    }));

                // act and assert
                await expect(InvoiceService.getAverages("2020-11-01", "2021-01-01", undefined, countryName)).rejects
                    .toEqual({ message: "getClientGrading failed" });
            });


            it("IS1.3.6 - should respond with error message 400 when start date is after end date", async () => {
                // arrange
                let startDate = "2020-11-01";
                let endDate = "2019-11-01";
                let expectedError = {
                    status: 400,
                    message: "Invalid date order."
                }

                // act and assert
                await expect(InvoiceService.getAverages(startDate, endDate, undefined, countryName)).rejects
                    .toEqual(expectedError);
            });
        });
    });

    let fakePreparedQuery = { queryString: "fakeQueryString", replacements: ["fakeReplace"] };
    let prepareDuesQuerySpy = jest.spyOn(InvoiceService, 'prepareDuesQuery')
        .mockImplementation(() => {
            return fakePreparedQuery;
        });

    describe("IS2 - getDues", () => {
        describe("IS2.1 - given a valid yearMonthList and nothing else", () => {
            it("IS2.1.1 - should return totalDuesList", async () => {
                // arrange
                prepareDuesQuerySpy = jest.spyOn(InvoiceService, 'prepareDuesQuery')
                    .mockImplementation(() => {
                        return fakePreparedQuery;
                    });
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
                expect(prepareDuesQuerySpy).toHaveBeenCalledWith(yearMonthList, undefined, undefined, undefined);
                expect(transacStatDaoSpy).toHaveBeenCalledTimes(1);
                expect(transacStatDaoSpy).toHaveBeenCalledWith(fakePreparedQuery);
            });

            it("IS2.1.2 - when dao throws unspecified error status and message, should reject with default status and message ", async () => {
                // arrange
                let expectedResponse = {
                    status: 500,
                    message: "Could not get dues."
                };
                transacStatDaoSpy = jest.spyOn(TransacStatDao, 'getTransactionsStatByYearMonth')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        reject({});
                    }));

                // act and assert
                await expect(InvoiceService.getDues(yearMonthList)).rejects
                    .toEqual(expectedResponse);
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

        describe("IS2.2 - given a valid yearMonthList and employeeId", () => {
            it("IS2.2.1 - should return totalDuesList", async () => {
                // arrange
                let employeeId = 22769;
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

                transacStatDaoSpy = jest.spyOn(TransacStatDao, 'getTransactionsStatByYearMonth')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        resolve(fakeTransacStatList);
                    }));

                // act
                const response = await InvoiceService.getDues(yearMonthList, employeeId);

                // assert
                expect(response).toEqual(expectedList);
                expect(prepareDuesQuerySpy).toHaveBeenCalledWith(yearMonthList, employeeId, undefined, undefined);
                expect(transacStatDaoSpy).toHaveBeenCalledWith(fakePreparedQuery);
            });
        });

        describe("IS2.3 - given a valid yearMonthList and countryCode", () => {
            it("IS2.3.1 - should return totalDuesList", async () => {
                // arrange
                let countryName = "Canada";
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

                transacStatDaoSpy = jest.spyOn(TransacStatDao, 'getTransactionsStatByYearMonth')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        resolve(fakeTransacStatList);
                    }));

                // act
                const response = await InvoiceService.getDues(yearMonthList, undefined, undefined, countryName);

                // assert
                expect(response).toEqual(expectedList);
                expect(prepareDuesQuerySpy).toHaveBeenCalledWith(yearMonthList, undefined, undefined, countryName);
                expect(transacStatDaoSpy).toHaveBeenCalledWith(fakePreparedQuery);
            });
        });


        describe("IS2.4 - given a valid yearMonthList, employeeId and country", () => {
            it("IS2.4.1 - should return totalDuesList", async () => {
                // arrange
                let employeeId = 22769;
                let countryName = "Canada";
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

                transacStatDaoSpy = jest.spyOn(TransacStatDao, 'getTransactionsStatByYearMonth')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        resolve(fakeTransacStatList);
                    }));

                // act
                const response = await InvoiceService.getDues(yearMonthList, employeeId, undefined, countryName);

                // assert
                expect(response).toEqual(expectedList);
                expect(prepareDuesQuerySpy).toHaveBeenCalledWith(yearMonthList, employeeId, undefined, countryName);
                expect(transacStatDaoSpy).toHaveBeenCalledWith(fakePreparedQuery);
            });
        });
    });

    let prepareBilledQuerySpy = jest.spyOn(InvoiceService, 'prepareBilledQuery')
        .mockImplementation(() => {
            return fakePreparedQuery
        });

    describe("IS3 - getBilled", () => {
        describe("IS3.1 - given a valid start and end date str and yearMonthList", () => {
            let startDateStr = '2019-11-01';
            let endDateStr = '2021-01-01';

            it("IS3.1.1 - should return billed", async () => {
                // arrange
                getBilledSpy.mockRestore();
                let expectedResponse = {
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
                };

                // act
                const response = await InvoiceService.getBilled(startDateStr, endDateStr, yearMonthList);

                // assert
                expect(response).toEqual(expectedResponse);
                expect(prepareBilledQuerySpy).toHaveBeenCalledWith(startDateStr, endDateStr, undefined, undefined, undefined);
                expect(invoiceAffectDaoSpy).toHaveBeenCalledWith(fakePreparedQuery);
            });

            it("IS3.1.2 - when dao throws error with specified status and message, should reject with specified status and message", async () => {
                // arrange
                let expectedResponse = {
                    status: 600,
                    message: "Error."
                };
                invoiceAffectDaoSpy = jest.spyOn(InvoiceAffectDao, 'getInvoicesByDate')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        reject(expectedResponse);
                    }));

                // act and assert
                await expect(InvoiceService.getBilled(startDateStr, endDateStr, yearMonthList)).rejects
                    .toEqual(expectedResponse);
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

        describe("IS3.2 - given a valid start and end date str, yearMonthList and clientList", () => {
            let startDateStr = '2019-11-01';
            let endDateStr = '2021-01-01';

            it("IS3.2.1 - should return billed", async () => {
                // arrange

                let expectedResponse = {
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
                };

                invoiceAffectDaoSpy = jest.spyOn(InvoiceAffectDao, 'getInvoicesByDate')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        resolve(fakeInvoiceAffectList)
                    }));

                // act
                const response = await InvoiceService.getBilled(startDateStr, endDateStr, yearMonthList, nameIdList);

                // assert
                expect(response).toEqual(expectedResponse);
                expect(invoiceAffectDaoSpy).toHaveBeenCalledTimes(1);
                expect(invoiceAffectDaoSpy).toHaveBeenCalledWith(fakePreparedQuery);
            });
        });
        describe("IS3.3 - given a valid start and end date str, yearMonthList and country", () => {
            let startDateStr = '2019-11-01';
            let endDateStr = '2021-01-01';
            let countryName = "Canada";

            it("IS3.3.1 - should return billed", async () => {

                // arrange
                let expectedResponse = {
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
                };

                invoiceAffectDaoSpy = jest.spyOn(InvoiceAffectDao, 'getInvoicesByDate')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        resolve(fakeInvoiceAffectList)
                    }));

                // act
                const response = await InvoiceService.getBilled(startDateStr, endDateStr, yearMonthList, undefined, countryName);

                // assert
                expect(response).toEqual(expectedResponse);
                expect(invoiceAffectDaoSpy).toHaveBeenCalledTimes(1);
                expect(invoiceAffectDaoSpy).toHaveBeenCalledWith(fakePreparedQuery);
            });
        });


        describe("IS3.4 - given a valid start and end date str, yearMonthList, clientList and country", () => {
            let startDateStr = '2019-11-01';
            let endDateStr = '2021-01-01';
            let countryName = "Canada";

            it("IS3.4.1 - should return billed", async () => {

                // arrange
                let expectedResponse = {
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
                };

                invoiceAffectDaoSpy = jest.spyOn(InvoiceAffectDao, 'getInvoicesByDate')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        resolve(fakeInvoiceAffectList)
                    }));

                // act
                const response = await InvoiceService.getBilled(startDateStr, endDateStr, yearMonthList, 12345, countryName);

                // assert
                expect(response).toEqual(expectedResponse);
                expect(invoiceAffectDaoSpy).toHaveBeenCalledTimes(1);
                expect(invoiceAffectDaoSpy).toHaveBeenCalledWith(fakePreparedQuery);
            });
        });
    });


    describe("IS4 - getNamesAndCountries", () => {
        describe("IS4.1 - given a valid list of nameId with undefined country", () => {

            let fakeClientIdList = [1, 2, 3, 4, 5, 6, 7, 8];
            it("IS4.1.1 - should return a list of nameId, names and country label", async () => {

                //arrange 
                getClientSpy.mockRestore()

                // act
                const response = await InvoiceService.getNamesAndCountries(fakeClientIdList);

                // assert
                expect(response).toEqual(fakeClientDAOList);
                expect(clientDaoSpy).toHaveBeenCalledTimes(1);
                expect(clientDaoSpy).toHaveBeenCalledWith(fakeClientIdList);
            });


            it("IS4.1.2 - should reject with error when dao throws error", async () => {
                //arrange
                clientDaoSpy = jest.spyOn(ClientDao, 'getClientByID')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        reject({ message: "dao failed" });
                    }));

                // act and assert
                await expect(InvoiceService.getNamesAndCountries(nameIdList)).rejects
                    .toEqual({ message: "dao failed" });
            });

            it("IS4.1.3 - should resolve with false when dao resolves with false", async () => {

                //arrange
                clientDaoSpy = jest.spyOn(ClientDao, 'getClientByID')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(false);
                    }));

                // act and assert
                await expect(InvoiceService.getNamesAndCountries(nameIdList)).resolves
                    .toEqual(false);
            });
        });

        describe("IS4.2 - given a valid list of nameId and country", () => {
            let fakeClientIdList = [1, 2, 3, 4, 5, 6, 7, 8];
            let countryName = "Canada";
            it("IS4.2.1 - should return a list of nameId, names and country label", async () => {

                //arrange 
                getClientSpy.mockRestore()

                let fakeClientListFilteredResponse = [
                    {
                        nameId: 1,
                        name: "Banque Royale",
                        country: "Canada",
                        grading: ""
                    },
                    {
                        nameId: 2,
                        name: "Benoit Cote",
                        country: "Canada",
                        grading: ""
                    },
                    {
                        nameId: 7,
                        name: "Plank Productions Inc.",
                        country: "Canada",
                        grading: ""
                    },
                    {
                        nameId: 8,
                        name: "Unknown user",
                        country: "Canada",
                        grading: ""
                    }
                ];

                clientDaoSpy = jest.spyOn(ClientDao, 'getClientByIDAndCountry')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(fakeClientListFilteredResponse);
                    }));

                // act
                const response = await InvoiceService.getNamesAndCountries(fakeClientIdList, undefined, countryName);

                // assert
                expect(response).toEqual(fakeClientListFilteredResponse);
                expect(clientDaoSpy).toHaveBeenCalledTimes(1);
                expect(clientDaoSpy).toHaveBeenCalledWith(fakeClientIdList, countryName);
            });

            it("IS4.2.2 - should resolve with false when dao resolves with false", async () => {

                //arrange
                clientDaoSpy = jest.spyOn(ClientDao, 'getClientByIDAndCountry')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(false);
                    }));

                // act and assert
                expect(InvoiceService.getNamesAndCountries(nameIdList, undefined, countryName)).resolves
                    .toEqual(false);
            });

            it("IS4.2.3 - should reject with error when dao throws error", async () => {
                //arrange
                clientDaoSpy = jest.spyOn(ClientDao, 'getClientByIDAndCountry')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        reject({ message: "dao failed" });
                    }));

                // act and assert
                expect(InvoiceService.getNamesAndCountries(nameIdList, undefined, countryName)).rejects
                    .toEqual({ message: "dao failed" });
            });
        });


        describe("IS4.3 - given a valid list of nameId and employeeId", () => {
            let fakeClientIdList = [1, 2, 3, 4, 5, 6, 7, 8];
            let employeeId = 20044;
            it("IS4.3.1 - should return a list of nameId, names and country label", async () => {

                //arrange 
                getClientSpy.mockRestore()

                let fakeClientListFilteredResponse = [
                    {
                        nameId: 1,
                        name: "Banque Royale",
                        country: "Canada",
                        grading: ""
                    },
                    {
                        nameId: 2,
                        name: "Benoit Cote",
                        country: "Canada",
                        grading: ""
                    },
                    {
                        nameId: 7,
                        name: "Plank Productions Inc.",
                        country: "Canada",
                        grading: ""
                    },
                    {
                        nameId: 8,
                        name: "Unknown user",
                        country: "Canada",
                        grading: ""
                    }
                ];

                clientDaoSpy = jest.spyOn(ClientDao, 'getClientByIDAndEmployee')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(fakeClientListFilteredResponse);
                    }));

                // act
                const response = await InvoiceService.getNamesAndCountries(fakeClientIdList, employeeId, undefined);

                // assert
                expect(response).toEqual(fakeClientListFilteredResponse);
                expect(clientDaoSpy).toHaveBeenCalledTimes(1);
                expect(clientDaoSpy).toHaveBeenCalledWith(fakeClientIdList, employeeId);
            });

            it("IS4.3.2 - should resolve with false when dao resolves with false", async () => {

                //arrange
                clientDaoSpy = jest.spyOn(ClientDao, 'getClientByIDAndEmployee')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(false);
                    }));

                // act and assert
                expect(InvoiceService.getNamesAndCountries(nameIdList, employeeId, undefined)).resolves
                    .toEqual(false);
            });

            it("IS4.3.3 - should reject with error when dao throws error", async () => {
                //arrange
                clientDaoSpy = jest.spyOn(ClientDao, 'getClientByIDAndEmployee')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        reject({ message: "dao failed" });
                    }));

                // act and assert
                expect(InvoiceService.getNamesAndCountries(nameIdList, employeeId, undefined)).rejects
                    .toEqual({ message: "dao failed" });
            });
        });


        describe("IS4.4 - given a valid list of nameId, employeeId and country", () => {
            let fakeClientIdList = [1, 2, 3, 4, 5, 6, 7, 8];
            let countryName = "Canada";
            let employeeId = 20044;
            it("IS4.4.1 - should return a list of nameId, names and country label", async () => {

                //arrange 
                getClientSpy.mockRestore()

                let fakeClientListFilteredResponse = [
                    {
                        nameId: 1,
                        name: "Banque Royale",
                        country: "Canada",
                        grading: ""
                    },
                    {
                        nameId: 2,
                        name: "Benoit Cote",
                        country: "Canada",
                        grading: ""
                    },
                    {
                        nameId: 7,
                        name: "Plank Productions Inc.",
                        country: "Canada",
                        grading: ""
                    },
                    {
                        nameId: 8,
                        name: "Unknown user",
                        country: "Canada",
                        grading: ""
                    }
                ];

                clientDaoSpy = jest.spyOn(ClientDao, 'getClientByIDAndEmployeeAndCountry')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(fakeClientListFilteredResponse);
                    }));

                // act
                const response = await InvoiceService.getNamesAndCountries(fakeClientIdList, employeeId, countryName);

                // assert
                expect(response).toEqual(fakeClientListFilteredResponse);
                expect(clientDaoSpy).toHaveBeenCalledTimes(1);
                expect(clientDaoSpy).toHaveBeenCalledWith(fakeClientIdList, employeeId, countryName);
            });

            it("IS4.3.2 - should resolve with false when dao resolves with false", async () => {

                //arrange
                clientDaoSpy = jest.spyOn(ClientDao, 'getClientByIDAndEmployeeAndCountry')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(false);
                    }));

                // act and assert
                expect(InvoiceService.getNamesAndCountries(nameIdList, employeeId, countryName)).resolves
                    .toEqual(false);
            });

            it("IS4.3.3 - should reject with error when dao throws error", async () => {
                //arrange
                clientDaoSpy = jest.spyOn(ClientDao, 'getClientByIDAndEmployeeAndCountry')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        reject({ message: "dao failed" });
                    }));

                // act and assert
                expect(InvoiceService.getNamesAndCountries(nameIdList, employeeId, countryName)).rejects
                    .toEqual({ message: "dao failed" });
            });
        });


    });


    describe("IS5 - getClientGrading", () => {
        describe("IS5.1 - given a list of valid name id", () => {

            let nameIdList = [32590, 36052, 37960];

            it("IS5.1.1 - should return a list of nameid and gradings", async () => {
                //assert 
                getClientGradingSpy.mockRestore()

                let expectedClientGradingList = [
                    {
                        nameId: 32590,
                        grading: "C"
                    },
                    {
                        nameId: 36052,
                        grading: ""
                    },
                    {
                        nameId: 37960,
                        grading: ""
                    }
                ];

                // act
                const response = await InvoiceService.getClientGrading(nameIdList);

                // assert
                expect(response).toEqual(expectedClientGradingList);
                expect(clientGradingDaoSpy).toHaveBeenCalledTimes(1);
                expect(clientGradingDaoSpy).toHaveBeenCalledWith(nameIdList);
            });

            it("IS5.1.2 - should reject with error when dao throws error", async () => {
                // arrange
                clientGradingDaoSpy = jest.spyOn(ClientGradingDao, 'getClientGrading')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        reject({ message: "dao failed" });
                    }));

                // act and assert
                await expect(InvoiceService.getClientGrading(nameIdList)).rejects
                    .toEqual({ message: "dao failed" });
            });

            it("IS5.1.3 - should resolve with false when dao resolves with false", async () => {
                // arrange
                clientGradingDaoSpy = jest.spyOn(ClientGradingDao, 'getClientGrading')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(false);
                    }));

                // act and assert
                await expect(InvoiceService.getClientGrading(nameIdList)).resolves
                    .toEqual(false);
            });
        });
    });

    describe("IS6 - prepareDuesQuery", () => {
        let expectedQuery = {
            queryString: "SELECT ACS.DUE_CURRENT, ACS.DUE_1_MONTH, ACS.DUE_2_MONTH, ACS.DUE_3_MONTH, ACS.YEAR_MONTH FROM ACCOUNTING_CLIENT_STAT ACS WHERE ACS.YEAR_MONTH in (?) AND ACS.CONNECTION_ID=3 AND ACS.STAT_TYPE=1",
            replacements: [yearMonthList]
        };

        describe("IS6.1 - given a yearMonthList", () => {
            // arrange
            prepareDuesQuerySpy.mockRestore();

            // act
            const response = InvoiceService.prepareDuesQuery(yearMonthList);

            // assert
            expect(response).toEqual(expectedQuery);
        });

        describe("IS6.2 - given a yearMonthList and an employeeId", () => {

        });

        describe("IS6.3 - given a yearMonthList, an employeeId and a clientType", () => {

        });

        describe("IS6.4 - given a yearMonthList, an employeeId, a clientType and a countryLabel", () => {

        });
    });

    describe("IS7 - getCountriesName", () => {
        describe("IS7.1 - given I enter the application to get the list of countries", () => {
            it("IS7.1.1 - should return a list of country in alphabetical order", async () => {

                //assert 
                getCountriesNameSpy.mockRestore()

                // act
                const response = await InvoiceService.getCountriesName();

                // assert
                expect(response).toEqual(fakeCountriesList);
                expect(countryDaoSpy).toHaveBeenCalledTimes(1);
                expect(countryDaoSpy).toHaveBeenCalledWith();
            });

            it("IS7.1.2 - should reject with error when dao throws error", async () => {

                // arrange
                countryDaoSpy = jest.spyOn(CountryDao, 'getAllCountries')
                    .mockImplementation(() => new Promise((resolve, reject) => {
                        reject({ message: "dao failed" });
                    }));

                // act and assert
                await expect(InvoiceService.getCountriesName()).rejects
                    .toEqual({ message: "dao failed" });
            });

            it("IS7.1.3 - should resolve with false when dao resolves with false", async () => {

                // arrange
                countryDaoSpy = jest.spyOn(CountryDao, 'getAllCountries')
                    .mockImplementation(() => new Promise((resolve) => {
                        resolve(false);
                    }));

                // act and assert
                await expect(InvoiceService.getCountriesName()).resolves
                    .toEqual(false);
            });
        });
    });
});