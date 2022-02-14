var { expect, jest } = require('@jest/globals');

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
    let fakeQuery = { queryString: "fakeQuery", replacements: ["fakeReplace"] };
    let prepareBilledQuerySpy = jest.spyOn(InvoiceAffectDao, 'prepareBilledQuery')
        .mockImplementation(() => { return fakeQuery });

    let dbStub = {
        query: () => {
            return fakeInvoiceList;
        }
    };

    let startDate = "2020-11-01";
    let endDate = "2021-05-01";
    let employeeId = 12345;
    let clientType = "DIRECT";
    let countryCode = "CA";

    describe("IAD1 - getInvoicesByDate", () => {
        describe("IAD1.1 - given valid response from db query", () => {
            it("IAD1.1.1 - should return list of invoices", async () => {
                // arrange
                dbStub = {
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
                const response = await InvoiceAffectDao.getInvoicesByDate(startDate, endDate, employeeId, clientType, countryCode, dbStub);

                // assert
                expect(response).toEqual(expectedResponse);
                expect(prepareBilledQuerySpy).toHaveBeenCalledWith(startDate, endDate, employeeId, clientType, countryCode);
            });
        });

        describe("IAD1.2 - given invalid response from db query", () => {
            it("IAD1.2.1 - should return false when db cant fetch data", async () => {
                // arrange
                dbStub = {
                    query: () => {
                        return false;
                    }
                };

                // act and assert
                await expect(InvoiceAffectDao.getInvoicesByDate(startDate, endDate, employeeId, clientType, countryCode, dbStub)).resolves
                    .toEqual(false);
            });

            it("IAD1.2.2 - when db throws error with specified status and message, should reject specified status and message", async () => {
                // arrange
                let expectedResponse = {
                    status: 600,
                    message: "Error."
                };
                dbStub = {
                    query: () => {
                        return Promise.reject(expectedResponse);
                    }
                };

                // act and assert
                await expect(InvoiceAffectDao.getInvoicesByDate(startDate, endDate, employeeId, clientType, countryCode, dbStub))
                    .rejects.toEqual(expectedResponse);
            });

            it("IAD1.2.3 - when db throws error with unspecified status and message, should reject default status and message", async () => {
                // arrange
                let expectedResponse = {
                    status: 500,
                    message: "Could not fetch invoices."
                };
                dbStub = {
                    query: () => {
                        return Promise.reject({});
                    }
                };

                // act and assert
                await expect(InvoiceAffectDao.getInvoicesByDate(startDate, endDate, employeeId, clientType, countryCode, dbStub))
                    .rejects.toEqual(expectedResponse);
            });
        });
    });

    describe("IAD2 - prepareBilledQuery", () => {

        let expectedQuery = {
            queryString: "".concat("SELECT IH.INVOCIE_DATE, IH.ACTOR_ID, BIA.AFFECT_AMOUNT ",
                "FROM  BOSCO_INVOICE_AFFECT BIA, INVOICE_HEADER IH ",
                "WHERE IH.INVOICE_TYPE in (1,4) AND IH.INVOICE_PREVIEW=0 AND IH.INVOCIE_DATE BETWEEN ? AND ? ",
                "AND BIA.INVOICE_ID=IH.INVOICE_ID AND BIA.AFFECT_ACCOUNT LIKE '%1200%' "),
            replacements: [startDate, endDate]
        };

        describe("IAD2.1 - given startDate and endDate", () => {
            it("IAD2.1.1 - should respond with query only filtering by date", async () => {
                // arrange
                prepareBilledQuerySpy.mockRestore();
                let expectedResponse = expectedQuery;

                // act
                const response = InvoiceAffectDao.prepareBilledQuery(startDate, endDate, undefined, undefined, undefined);

                // assert
                expect(response).toEqual(expectedResponse);
            });
        });

        describe("IAD2.2 - given startDate and endDate, employeeId", () => {
            it("IAD2.2.1 - should respond with query only filtering by date and employee", async () => {
                // arrange
                let expectedQuery = {
                    queryString: "".concat("SELECT IH.INVOCIE_DATE, IH.ACTOR_ID, BIA.AFFECT_AMOUNT ",
                        "FROM  BOSCO_INVOICE_AFFECT BIA, INVOICE_HEADER IH  ",
                        "LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_CONNECTION NC ON NC.CONNECTION_ID=1 AND NC.CONNECTION_NAME_ID=CONVERT(nvarchar, IH.ACTOR_ID) ",
                        "LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_QUALITY NQ1 ON NQ1.NAME_ID=NC.NAME_ID AND NQ1.QUALITY_TYPE_ID=5 ",
                        "WHERE IH.INVOICE_TYPE in (1,4) AND IH.INVOICE_PREVIEW=0 AND IH.INVOCIE_DATE BETWEEN ? AND ? ",
                        "AND BIA.INVOICE_ID=IH.INVOICE_ID AND BIA.AFFECT_ACCOUNT LIKE '%1200%'  AND NQ1.DROPDOWN_CODE=? "),
                    replacements: [startDate, endDate, employeeId]
                };

                // act
                const response = InvoiceAffectDao.prepareBilledQuery(startDate, endDate, employeeId, undefined, undefined);

                // assert
                expect(response).toEqual(expectedQuery);
            });
        });

        describe("IAD2.3 - given startDate and endDate, employeeId, clientType", () => {
            it("IAD2.3.1 - should respond with query only filtering by date and employee and client type", async () => {
                // arrange
                let expectedQuery = {
                    queryString: "".concat("SELECT IH.INVOCIE_DATE, IH.ACTOR_ID, BIA.AFFECT_AMOUNT ",
                        "FROM  BOSCO_INVOICE_AFFECT BIA, INVOICE_HEADER IH  ",
                        "LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_CONNECTION NC ON NC.CONNECTION_ID=1 AND NC.CONNECTION_NAME_ID=CONVERT(nvarchar, IH.ACTOR_ID) ",
                        "LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_QUALITY NQ1 ON NQ1.NAME_ID=NC.NAME_ID AND NQ1.QUALITY_TYPE_ID=5  ",
                        "LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_QUALITY NQ2  ON NQ2.NAME_ID=NC.NAME_ID  AND NQ2.QUALITY_TYPE_ID=3 ",
                        "WHERE IH.INVOICE_TYPE in (1,4) AND IH.INVOICE_PREVIEW=0 AND IH.INVOCIE_DATE BETWEEN ? AND ? ",
                        "AND BIA.INVOICE_ID=IH.INVOICE_ID AND BIA.AFFECT_ACCOUNT LIKE '%1200%'  AND NQ1.DROPDOWN_CODE=?  AND NQ2.DROPDOWN_CODE=? "),
                    replacements: [startDate, endDate, employeeId, clientType]
                };

                // act
                const response = InvoiceAffectDao.prepareBilledQuery(startDate, endDate, employeeId, clientType, undefined);

                // assert
                expect(response).toEqual(expectedQuery);
            });
        });

        describe("IAD2.4 - given startDate and endDate, employeeId, clientType, countryCode", () => {
            it("IAD2.4.1 - should respond with query only filtering by date and employee and client type and country", async () => {
                // arrange
                let expectedQuery = {
                    queryString: "".concat("SELECT IH.INVOCIE_DATE, IH.ACTOR_ID, BIA.AFFECT_AMOUNT ",
                        "FROM  BOSCO_INVOICE_AFFECT BIA, INVOICE_HEADER IH  ",
                        "LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_CONNECTION NC ON NC.CONNECTION_ID=1 AND NC.CONNECTION_NAME_ID=CONVERT(nvarchar, IH.ACTOR_ID) ",
                        "LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_QUALITY NQ1 ON NQ1.NAME_ID=NC.NAME_ID AND NQ1.QUALITY_TYPE_ID=5  ",
                        "LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_QUALITY NQ2  ON NQ2.NAME_ID=NC.NAME_ID  AND NQ2.QUALITY_TYPE_ID=3 ",
                        ", [Bosco reduction].[dbo].NAME N ",
                        "WHERE IH.INVOICE_TYPE in (1,4) AND IH.INVOICE_PREVIEW=0 AND IH.INVOCIE_DATE BETWEEN ? AND ? ",
                        "AND BIA.INVOICE_ID=IH.INVOICE_ID AND BIA.AFFECT_ACCOUNT LIKE '%1200%'  AND NQ1.DROPDOWN_CODE=?  AND NQ2.DROPDOWN_CODE=? ",
                        " AND N.NAME_ID=NC.NAME_ID AND N.LEGAL_COUNTRY_CODE=? "),
                    replacements: [startDate, endDate, employeeId, clientType, countryCode]
                };

                // act
                const response = InvoiceAffectDao.prepareBilledQuery(startDate, endDate, employeeId, clientType, countryCode);

                // assert
                expect(response).toEqual(expectedQuery);
            });
        });

        describe("IAD2.5 - given startDate, endDate and client Type but no employeeId", () => {
            it("IAD2.5.1 - should respond with query filtered by date and client type", () => {
                // arrange
                let expectedQuery = {
                    queryString: "".concat("SELECT IH.INVOCIE_DATE, IH.ACTOR_ID, BIA.AFFECT_AMOUNT ",
                        "FROM  BOSCO_INVOICE_AFFECT BIA, INVOICE_HEADER IH  ",
                        "LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_CONNECTION NC ON NC.CONNECTION_ID=1 AND NC.CONNECTION_NAME_ID=CONVERT(nvarchar, IH.ACTOR_ID) ",
                        " LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_QUALITY NQ2  ON NQ2.NAME_ID=NC.NAME_ID  AND NQ2.QUALITY_TYPE_ID=3 ",
                        "WHERE IH.INVOICE_TYPE in (1,4) AND IH.INVOICE_PREVIEW=0 AND IH.INVOCIE_DATE BETWEEN ? AND ? ",
                        "AND BIA.INVOICE_ID=IH.INVOICE_ID AND BIA.AFFECT_ACCOUNT LIKE '%1200%'  AND NQ2.DROPDOWN_CODE=? "),
                    replacements: [startDate, endDate, clientType]
                };

                // act
                const response = InvoiceAffectDao.prepareBilledQuery(startDate, endDate, undefined, clientType, undefined);

                // assert
                expect(response).toEqual(expectedQuery);
            });
        });

        describe("IAD2.6 - given startDate, endDate and countryCode but no employeeId or clientType", () => {
            it("IAD2.5.1 - should respond with query filtered by date and country", () => {
                // arrange
                let expectedQuery = {
                    queryString: "".concat("SELECT IH.INVOCIE_DATE, IH.ACTOR_ID, BIA.AFFECT_AMOUNT ",
                        "FROM  BOSCO_INVOICE_AFFECT BIA, INVOICE_HEADER IH  ",
                        "LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_CONNECTION NC ON NC.CONNECTION_ID=1 AND NC.CONNECTION_NAME_ID=CONVERT(nvarchar, IH.ACTOR_ID) ",
                        ", [Bosco reduction].[dbo].NAME N ",
                        "WHERE IH.INVOICE_TYPE in (1,4) AND IH.INVOICE_PREVIEW=0 AND IH.INVOCIE_DATE BETWEEN ? AND ? ",
                        "AND BIA.INVOICE_ID=IH.INVOICE_ID AND BIA.AFFECT_ACCOUNT LIKE '%1200%' ",
                        " AND N.NAME_ID=NC.NAME_ID AND N.LEGAL_COUNTRY_CODE=? "),
                    replacements: [startDate, endDate, countryCode]
                };

                // act
                const response = InvoiceAffectDao.prepareBilledQuery(startDate, endDate, undefined, undefined, countryCode);

                // assert
                expect(response).toEqual(expectedQuery);
            });
        });
    });
});
