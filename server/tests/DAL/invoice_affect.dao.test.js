const InvoiceAffectDao = require("../../data_access_layer/daos/invoice_affect.dao");

let fakeInvoiceList = [
    {
        INVOCIE_DATE: new Date(2020, 11, 1),
        ACTOR_ID: 1,
        AFFECT_AMOUNT: 100
    },
    {
        INVOCIE_DATE: new Date(2020, 12, 1),
        ACTOR_ID: 2,
        AFFECT_AMOUNT: 125
    },
    {
        INVOCIE_DATE: new Date(2020, 110, 1),
        ACTOR_ID: 3,
        AFFECT_AMOUNT: 150
    }
];

let listClientId = ['25652', '21634', '58641'];

describe("Test Invoice Affect DAO", () => {
    describe("IAD1 - getInvoicesByDate", () => {
        it("IAD1.1 - should return list of invoices", async () => {
            // arrange
            let dbStub = {
                query: () => {
                    return fakeInvoiceList;
                }
            };

            let expectedResponse = [
                {
                    invoiceDate: fakeInvoiceList[0].INVOCIE_DATE,
                    actorId: fakeInvoiceList[0].ACTOR_ID,
                    amount: fakeInvoiceList[0].AFFECT_AMOUNT
                },
                {
                    invoiceDate: fakeInvoiceList[1].INVOCIE_DATE,
                    actorId: fakeInvoiceList[1].ACTOR_ID,
                    amount: fakeInvoiceList[1].AFFECT_AMOUNT
                },
                {
                    invoiceDate: fakeInvoiceList[2].INVOCIE_DATE,
                    actorId: fakeInvoiceList[2].ACTOR_ID,
                    amount: fakeInvoiceList[2].AFFECT_AMOUNT
                }
            ];

            // act
            const response = await InvoiceAffectDao.getInvoicesByDate(new Date, new Date, dbStub);

            // assert
            expect(response).toEqual(expectedResponse);
        });

        it("IAD1.2 - should return false when db cant fetch data", async () => {
            // arrange
            let dbStub = {
                query: () => {
                    return false;
                }
            };

            // act and assert
            await expect(InvoiceAffectDao.getInvoicesByDate(new Date, new Date, dbStub)).resolves
                .toEqual(false);
        });

        it("IAD1.3 - should catch error when db throws error", async () => {
            // arrange
            let dbStub = {
                query: () => {
                    throw new Error("Error with the db.");
                }
            };

            // act and assert
            await expect(InvoiceAffectDao.getInvoicesByDate(new Date(), new Date(), dbStub)).rejects
                .toEqual(new Error("Error with the db."));
        })
    });

    describe("IAD2 - getInvoicesByDateAndEmployee ", () => {
        it("IAD2.1 - Should return list of clients", async () => {
            // arrange
            let startDate = new Date(2020, 11, 1);
            let endDate = new Date(2021, 10, 1);

            let dbStub = {
                query: () => {
                    return fakeInvoiceList;
                }
            };

            let expectedResponse = [
                {
                    invoiceDate: fakeInvoiceList[0].INVOCIE_DATE,
                    actorId: fakeInvoiceList[0].ACTOR_ID,
                    amount: fakeInvoiceList[0].AFFECT_AMOUNT
                },
                {
                    invoiceDate: fakeInvoiceList[1].INVOCIE_DATE,
                    actorId: fakeInvoiceList[1].ACTOR_ID,
                    amount: fakeInvoiceList[1].AFFECT_AMOUNT
                },
                {
                    invoiceDate: fakeInvoiceList[2].INVOCIE_DATE,
                    actorId: fakeInvoiceList[2].ACTOR_ID,
                    amount: fakeInvoiceList[2].AFFECT_AMOUNT
                }
            ];

            // act
            const response = await InvoiceAffectDao.getInvoicesByDateAndEmployee(startDate, endDate, listClientId, dbStub);

            // assert
            expect(response).toEqual(expectedResponse);
        });

        it("IAD2.2 - Should resolve false when Model cant fetch data", async () => {
            // arrange
            let startDate = new Date(2020, 11, 1);
            let endDate = new Date(2021, 10, 1);

            let dbStub = {
                query: () => {
                    return false;
                }
            };

            // act
            const response = await InvoiceAffectDao.getInvoicesByDateAndEmployee(startDate, endDate, listClientId, dbStub);

            // assert
            expect(response).toEqual(false);
        });

        it("IAD2.3 - Should reject error with 500 status and predefined message when model does not define them", async () => {
            // arrange
            let startDate = new Date(2020, 11, 1);
            let endDate = new Date(2021, 10, 1);

            let expectedError = {
                status: 500,
                message: "some error occured"
            };

            let dbStub = {
                query: () => {
                    return Promise.reject(expectedError);
                }
            };

            // act and assert
            await expect(InvoiceAffectDao.getInvoicesByDateAndEmployee(startDate, endDate, listClientId, dbStub)).rejects
                .toEqual(expectedError)
        });

        it("IAD2.4 - Should reject error when Model throws error with defined status and message", async () => {
            // arrange
            let startDate = new Date(2020, 11, 1);
            let endDate = new Date(2021, 10, 1);

            let expectedError = {
                status: 404,
                message: "Error."
            };

            let dbStub = {
                query: () => {
                    return Promise.reject(expectedError);
                }
            };

            // act and assert
            await expect(InvoiceAffectDao.getInvoicesByDateAndEmployee(startDate, endDate, listClientId, dbStub)).rejects
                .toEqual(expectedError)
        });
    });
});
