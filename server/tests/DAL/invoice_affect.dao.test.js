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
});