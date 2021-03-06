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

let fakeClientList = [
    {
        NAME_ID: 24505,
        NAME: "CompanyName",
        COUNTRY_LABEL: "Canada",
        DROPDOWN_CODE: "A+"
    },
    {
        NAME_ID: 25641,
        NAME: "CompanyName",
        COUNTRY_LABEL: "Canada",
        DROPDOWN_CODE: "B"
    },
]

describe("Test Invoice Affect DAO", () => {
    let fakeQuery = { queryString: "fakeQuery", replacements: ["fakeReplace"] };
    let prepareBilledQuerySpy = jest.spyOn(InvoiceAffectDao, 'prepareBilledQuery')
        .mockImplementation(() => { return fakeQuery });

    let dbStub = {
        query: () => {
            return fakeInvoiceList;
        }
    };

    let startDate = "2020-11-01"
    let endDate = "2021-05-01"
    let employeeId = 12345
    let clientType = "DIRECT"
    let countryCode = "CA"
    let ageOfAccount = "<30"
    let accountType = "Payables"

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
                const response = await InvoiceAffectDao.getInvoicesByDate(startDate, endDate, employeeId, clientType, countryCode, ageOfAccount, undefined, dbStub);

                // assert
                expect(response).toEqual(expectedResponse);
                expect(prepareBilledQuerySpy).toHaveBeenCalledWith(startDate, endDate, employeeId, clientType, countryCode, ageOfAccount, undefined);
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
                await expect(InvoiceAffectDao.getInvoicesByDate(startDate, endDate, employeeId, clientType, countryCode, ageOfAccount, undefined, dbStub)).resolves
                    .toEqual(false);
                expect(prepareBilledQuerySpy).toHaveBeenCalledWith(startDate, endDate, employeeId, clientType, countryCode, ageOfAccount, undefined);
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
                await expect(InvoiceAffectDao.getInvoicesByDate(startDate, endDate, employeeId, clientType, countryCode, ageOfAccount, undefined, dbStub))
                    .rejects.toEqual(expectedResponse);
                expect(prepareBilledQuerySpy).toHaveBeenCalledWith(startDate, endDate, employeeId, clientType, countryCode, ageOfAccount, undefined);
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
                await expect(InvoiceAffectDao.getInvoicesByDate(startDate, endDate, employeeId, clientType, countryCode, ageOfAccount, undefined, dbStub))
                    .rejects.toEqual(expectedResponse);
                expect(prepareBilledQuerySpy).toHaveBeenCalledWith(startDate, endDate, employeeId, clientType, countryCode, ageOfAccount, undefined);
            });
        });
    });

    describe("IAD2 - prepareBilledQuery", () => {

        let expectedQuery = {
            queryString: "".concat("SELECT IH.INVOCIE_DATE, IH.ACTOR_ID, BIA.AFFECT_AMOUNT ",
                "FROM BOSCO_INVOICE_AFFECT BIA, INVOICE_HEADER IH ",
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
                const response = InvoiceAffectDao.prepareBilledQuery(startDate, endDate, undefined, undefined, undefined, undefined, undefined);

                // assert
                expect(response).toEqual(expectedResponse);
            });
        });

        describe("IAD2.2 - given startDate and endDate, employeeId", () => {
            it("IAD2.2.1 - should respond with query only filtering by date and employee", async () => {
                // arrange
                let expectedQuery = {
                    queryString: "".concat("SELECT IH.INVOCIE_DATE, IH.ACTOR_ID, BIA.AFFECT_AMOUNT ",
                        "FROM BOSCO_INVOICE_AFFECT BIA, INVOICE_HEADER IH  ",
                        "LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_CONNECTION NC ON NC.CONNECTION_ID=1 AND NC.CONNECTION_NAME_ID=CONVERT(nvarchar, IH.ACTOR_ID) ",
                        "LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_QUALITY NQ1 ON NQ1.NAME_ID=NC.NAME_ID AND NQ1.QUALITY_TYPE_ID=5 ",
                        "WHERE IH.INVOICE_TYPE in (1,4) AND IH.INVOICE_PREVIEW=0 AND IH.INVOCIE_DATE BETWEEN ? AND ? ",
                        "AND BIA.INVOICE_ID=IH.INVOICE_ID AND BIA.AFFECT_ACCOUNT LIKE '%1200%'  AND NQ1.DROPDOWN_CODE=? "),
                    replacements: [startDate, endDate, employeeId]
                };

                // act
                const response = InvoiceAffectDao.prepareBilledQuery(startDate, endDate, employeeId, undefined, undefined, undefined, undefined);

                // assert
                expect(response).toEqual(expectedQuery);
            });
        });

        describe("IAD2.3 - given startDate and endDate, employeeId, clientType", () => {
            it("IAD2.3.1 - should respond with query only filtering by date and employee and client type", async () => {
                // arrange
                let expectedQuery = {
                    queryString: "".concat("SELECT IH.INVOCIE_DATE, IH.ACTOR_ID, BIA.AFFECT_AMOUNT ",
                        "FROM BOSCO_INVOICE_AFFECT BIA, INVOICE_HEADER IH  ",
                        "LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_CONNECTION NC ON NC.CONNECTION_ID=1 AND NC.CONNECTION_NAME_ID=CONVERT(nvarchar, IH.ACTOR_ID) ",
                        "LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_QUALITY NQ1 ON NQ1.NAME_ID=NC.NAME_ID AND NQ1.QUALITY_TYPE_ID=5  ",
                        "LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_QUALITY NQ2  ON NQ2.NAME_ID=NC.NAME_ID  AND NQ2.QUALITY_TYPE_ID=3 ",
                        "WHERE IH.INVOICE_TYPE in (1,4) AND IH.INVOICE_PREVIEW=0 AND IH.INVOCIE_DATE BETWEEN ? AND ? ",
                        "AND BIA.INVOICE_ID=IH.INVOICE_ID AND BIA.AFFECT_ACCOUNT LIKE '%1200%'  AND NQ1.DROPDOWN_CODE=?  AND NQ2.DROPDOWN_CODE=? "),
                    replacements: [startDate, endDate, employeeId, clientType]
                };

                // act
                const response = InvoiceAffectDao.prepareBilledQuery(startDate, endDate, employeeId, clientType, undefined, undefined, undefined);

                // assert
                expect(response).toEqual(expectedQuery);
            });
        });

        describe("IAD2.4 - given startDate and endDate, employeeId, clientType, countryCode", () => {
            it("IAD2.4.1 - should respond with query only filtering by date and employee and client type and country", async () => {
                // arrange
                let expectedQuery = {
                    queryString: "".concat("SELECT IH.INVOCIE_DATE, IH.ACTOR_ID, BIA.AFFECT_AMOUNT ",
                        "FROM BOSCO_INVOICE_AFFECT BIA, INVOICE_HEADER IH  ",
                        "LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_CONNECTION NC ON NC.CONNECTION_ID=1 AND NC.CONNECTION_NAME_ID=CONVERT(nvarchar, IH.ACTOR_ID) ",
                        "LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_QUALITY NQ1 ON NQ1.NAME_ID=NC.NAME_ID AND NQ1.QUALITY_TYPE_ID=5  ",
                        "LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_QUALITY NQ2  ON NQ2.NAME_ID=NC.NAME_ID  AND NQ2.QUALITY_TYPE_ID=3  ",
                        "LEFT OUTER JOIN [Bosco reduction].[dbo].ACCOUNTING_CLIENT AC ON AC.TRANSACTION_REF=CONVERT(NVARCHAR,IH.INVOICE_ID) ",
                        ", [Bosco reduction].[dbo].NAME N ",
                        "WHERE IH.INVOICE_TYPE in (1,4) AND IH.INVOICE_PREVIEW=0 AND IH.INVOCIE_DATE BETWEEN ? AND ? ",
                        "AND BIA.INVOICE_ID=IH.INVOICE_ID AND BIA.AFFECT_ACCOUNT LIKE '%1200%'  AND NQ1.DROPDOWN_CODE=?  AND NQ2.DROPDOWN_CODE=? ",
                        " AND N.NAME_ID=NC.NAME_ID AND N.LEGAL_COUNTRY_CODE=? "),
                    replacements: [startDate, endDate, employeeId, clientType, countryCode]
                };

                // act
                const response = InvoiceAffectDao.prepareBilledQuery(startDate, endDate, employeeId, clientType, countryCode, undefined, undefined);

                // assert
                expect(response).toEqual(expectedQuery);
            });
        });

        describe("IAD2.5 - given startDate and endDate, employeeId, clientType, countryCode, and ageOfAccount", () => {
            it("IAD2.5.1 - when <30, should respond with query only filtering by date and employee and client type and country and age of account under 30 days", async () => {
                // arrange
                let expectedQuery = {
                    queryString: "".concat("SELECT IH.INVOCIE_DATE, IH.ACTOR_ID, BIA.AFFECT_AMOUNT ",
                        "FROM BOSCO_INVOICE_AFFECT BIA, INVOICE_HEADER IH  ",
                        "LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_CONNECTION NC ON NC.CONNECTION_ID=1 AND NC.CONNECTION_NAME_ID=CONVERT(nvarchar, IH.ACTOR_ID) ",
                        "LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_QUALITY NQ1 ON NQ1.NAME_ID=NC.NAME_ID AND NQ1.QUALITY_TYPE_ID=5  ",
                        "LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_QUALITY NQ2  ON NQ2.NAME_ID=NC.NAME_ID  AND NQ2.QUALITY_TYPE_ID=3 ",
                        " LEFT OUTER JOIN [Bosco reduction].[dbo].ACCOUNTING_CLIENT AC ON AC.TRANSACTION_REF=CONVERT(NVARCHAR,IH.INVOICE_ID) ",
                        ", [Bosco reduction].[dbo].NAME N ",
                        "WHERE IH.INVOICE_TYPE in (1,4) AND IH.INVOICE_PREVIEW=0 AND IH.INVOCIE_DATE BETWEEN ? AND ? ",
                        "AND BIA.INVOICE_ID=IH.INVOICE_ID AND BIA.AFFECT_ACCOUNT LIKE '%1200%'  AND NQ1.DROPDOWN_CODE=?  AND NQ2.DROPDOWN_CODE=? ",
                        " AND DATEDIFF(day, IH.INVOCIE_DATE, AC.CLEARING_LAST_TRANSACTION)<30 ",
                        " AND N.NAME_ID=NC.NAME_ID AND N.LEGAL_COUNTRY_CODE=? "),
                    replacements: [startDate, endDate, employeeId, clientType, countryCode]
                };

                // act
                const response = InvoiceAffectDao.prepareBilledQuery(startDate, endDate, employeeId, clientType, countryCode, ageOfAccount, undefined);

                // assert
                expect(response).toEqual(expectedQuery);
            });

            it("IAD2.5.2 - when 30-60, should respond with query only filtering by date and employee and client type and country and age of account between 30 and 60 days", async () => {
                // arrange
                let expectedQuery = {
                    queryString: "".concat("SELECT IH.INVOCIE_DATE, IH.ACTOR_ID, BIA.AFFECT_AMOUNT ",
                        "FROM BOSCO_INVOICE_AFFECT BIA, INVOICE_HEADER IH  ",
                        "LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_CONNECTION NC ON NC.CONNECTION_ID=1 AND NC.CONNECTION_NAME_ID=CONVERT(nvarchar, IH.ACTOR_ID) ",
                        "LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_QUALITY NQ1 ON NQ1.NAME_ID=NC.NAME_ID AND NQ1.QUALITY_TYPE_ID=5  ",
                        "LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_QUALITY NQ2  ON NQ2.NAME_ID=NC.NAME_ID  AND NQ2.QUALITY_TYPE_ID=3 ",
                        " LEFT OUTER JOIN [Bosco reduction].[dbo].ACCOUNTING_CLIENT AC ON AC.TRANSACTION_REF=CONVERT(NVARCHAR,IH.INVOICE_ID) ",
                        ", [Bosco reduction].[dbo].NAME N ",
                        "WHERE IH.INVOICE_TYPE in (1,4) AND IH.INVOICE_PREVIEW=0 AND IH.INVOCIE_DATE BETWEEN ? AND ? ",
                        "AND BIA.INVOICE_ID=IH.INVOICE_ID AND BIA.AFFECT_ACCOUNT LIKE '%1200%'  AND NQ1.DROPDOWN_CODE=?  AND NQ2.DROPDOWN_CODE=? ",
                        " AND DATEDIFF(day, IH.INVOCIE_DATE, AC.CLEARING_LAST_TRANSACTION)>=30 ",
                        "AND DATEDIFF(day, IH.INVOCIE_DATE, AC.CLEARING_LAST_TRANSACTION)<60 ",
                        " AND N.NAME_ID=NC.NAME_ID AND N.LEGAL_COUNTRY_CODE=? "),
                    replacements: [startDate, endDate, employeeId, clientType, countryCode]
                };

                // act
                const response = InvoiceAffectDao.prepareBilledQuery(startDate, endDate, employeeId, clientType, countryCode, "30-60", undefined);

                // assert
                expect(response).toEqual(expectedQuery);
            });

            it("IAD2.5.3 - when 60-90, should respond with query only filtering by date and employee and client type and country and age of account between 60 and 90 days", async () => {
                // arrange
                let expectedQuery = {
                    queryString: "".concat("SELECT IH.INVOCIE_DATE, IH.ACTOR_ID, BIA.AFFECT_AMOUNT ",
                        "FROM BOSCO_INVOICE_AFFECT BIA, INVOICE_HEADER IH  ",
                        "LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_CONNECTION NC ON NC.CONNECTION_ID=1 AND NC.CONNECTION_NAME_ID=CONVERT(nvarchar, IH.ACTOR_ID) ",
                        "LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_QUALITY NQ1 ON NQ1.NAME_ID=NC.NAME_ID AND NQ1.QUALITY_TYPE_ID=5  ",
                        "LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_QUALITY NQ2  ON NQ2.NAME_ID=NC.NAME_ID  AND NQ2.QUALITY_TYPE_ID=3 ",
                        " LEFT OUTER JOIN [Bosco reduction].[dbo].ACCOUNTING_CLIENT AC ON AC.TRANSACTION_REF=CONVERT(NVARCHAR,IH.INVOICE_ID) ",
                        ", [Bosco reduction].[dbo].NAME N ",
                        "WHERE IH.INVOICE_TYPE in (1,4) AND IH.INVOICE_PREVIEW=0 AND IH.INVOCIE_DATE BETWEEN ? AND ? ",
                        "AND BIA.INVOICE_ID=IH.INVOICE_ID AND BIA.AFFECT_ACCOUNT LIKE '%1200%'  AND NQ1.DROPDOWN_CODE=?  AND NQ2.DROPDOWN_CODE=? ",
                        " AND DATEDIFF(day, IH.INVOCIE_DATE, AC.CLEARING_LAST_TRANSACTION)>=60 ",
                        "AND DATEDIFF(day, IH.INVOCIE_DATE, AC.CLEARING_LAST_TRANSACTION)<=90 ",
                        " AND N.NAME_ID=NC.NAME_ID AND N.LEGAL_COUNTRY_CODE=? "),
                    replacements: [startDate, endDate, employeeId, clientType, countryCode]
                };

                // act
                const response = InvoiceAffectDao.prepareBilledQuery(startDate, endDate, employeeId, clientType, countryCode, "60-90", undefined);

                // assert
                expect(response).toEqual(expectedQuery);
            });

            it("IAD2.5.4 - when >90, should respond with query only filtering by date and employee and client type and country and age of account over 90 days", async () => {
                // arrange
                let expectedQuery = {
                    queryString: "".concat("SELECT IH.INVOCIE_DATE, IH.ACTOR_ID, BIA.AFFECT_AMOUNT ",
                        "FROM BOSCO_INVOICE_AFFECT BIA, INVOICE_HEADER IH  ",
                        "LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_CONNECTION NC ON NC.CONNECTION_ID=1 AND NC.CONNECTION_NAME_ID=CONVERT(nvarchar, IH.ACTOR_ID) ",
                        "LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_QUALITY NQ1 ON NQ1.NAME_ID=NC.NAME_ID AND NQ1.QUALITY_TYPE_ID=5  ",
                        "LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_QUALITY NQ2  ON NQ2.NAME_ID=NC.NAME_ID  AND NQ2.QUALITY_TYPE_ID=3 ",
                        " LEFT OUTER JOIN [Bosco reduction].[dbo].ACCOUNTING_CLIENT AC ON AC.TRANSACTION_REF=CONVERT(NVARCHAR,IH.INVOICE_ID) ",
                        ", [Bosco reduction].[dbo].NAME N ",
                        "WHERE IH.INVOICE_TYPE in (1,4) AND IH.INVOICE_PREVIEW=0 AND IH.INVOCIE_DATE BETWEEN ? AND ? ",
                        "AND BIA.INVOICE_ID=IH.INVOICE_ID AND BIA.AFFECT_ACCOUNT LIKE '%1200%'  AND NQ1.DROPDOWN_CODE=?  AND NQ2.DROPDOWN_CODE=? ",
                        " AND DATEDIFF(day, IH.INVOCIE_DATE, AC.CLEARING_LAST_TRANSACTION)>90 ",
                        " AND N.NAME_ID=NC.NAME_ID AND N.LEGAL_COUNTRY_CODE=? "),
                    replacements: [startDate, endDate, employeeId, clientType, countryCode]
                };

                // act
                const response = InvoiceAffectDao.prepareBilledQuery(startDate, endDate, employeeId, clientType, countryCode, ">90", undefined);

                // assert
                expect(response).toEqual(expectedQuery);
            });
        });

        describe("IAD2.6 - given startDate, endDate, ageOfAccount, but no employeeId", () => {
            it("IAD2.6.1 - should respond with query only filtering by date and age of account", async () => {
                // arrange
                let expectedQuery = {
                    queryString: "".concat("SELECT IH.INVOCIE_DATE, IH.ACTOR_ID, BIA.AFFECT_AMOUNT ",
                        "FROM BOSCO_INVOICE_AFFECT BIA, INVOICE_HEADER IH  ",
                        "LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_CONNECTION NC ON NC.CONNECTION_ID=1 AND NC.CONNECTION_NAME_ID=CONVERT(nvarchar, IH.ACTOR_ID) ",
                        " LEFT OUTER JOIN [Bosco reduction].[dbo].ACCOUNTING_CLIENT AC ON AC.TRANSACTION_REF=CONVERT(NVARCHAR,IH.INVOICE_ID) ",
                        "WHERE IH.INVOICE_TYPE in (1,4) AND IH.INVOICE_PREVIEW=0 AND IH.INVOCIE_DATE BETWEEN ? AND ? ",
                        "AND BIA.INVOICE_ID=IH.INVOICE_ID AND BIA.AFFECT_ACCOUNT LIKE '%1200%' ",
                        " AND DATEDIFF(day, IH.INVOCIE_DATE, AC.CLEARING_LAST_TRANSACTION)<30 "),
                    replacements: [startDate, endDate]
                };

                // act
                const response = InvoiceAffectDao.prepareBilledQuery(startDate, endDate, undefined, undefined, undefined, ageOfAccount, undefined);

                // assert
                expect(response).toEqual(expectedQuery);
            });
        });

        describe("IAD2.7 - given startDate, endDate and client Type but no employeeId", () => {
            it("IAD2.7.1 - should respond with query filtered by date and client type", () => {
                // arrange
                let expectedQuery = {
                    queryString: "".concat("SELECT IH.INVOCIE_DATE, IH.ACTOR_ID, BIA.AFFECT_AMOUNT ",
                        "FROM BOSCO_INVOICE_AFFECT BIA, INVOICE_HEADER IH  ",
                        "LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_CONNECTION NC ON NC.CONNECTION_ID=1 AND NC.CONNECTION_NAME_ID=CONVERT(nvarchar, IH.ACTOR_ID) ",
                        " LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_QUALITY NQ2  ON NQ2.NAME_ID=NC.NAME_ID  AND NQ2.QUALITY_TYPE_ID=3 ",
                        "WHERE IH.INVOICE_TYPE in (1,4) AND IH.INVOICE_PREVIEW=0 AND IH.INVOCIE_DATE BETWEEN ? AND ? ",
                        "AND BIA.INVOICE_ID=IH.INVOICE_ID AND BIA.AFFECT_ACCOUNT LIKE '%1200%'  AND NQ2.DROPDOWN_CODE=? "),
                    replacements: [startDate, endDate, clientType]
                };

                // act
                const response = InvoiceAffectDao.prepareBilledQuery(startDate, endDate, undefined, clientType, undefined, undefined, undefined);

                // assert
                expect(response).toEqual(expectedQuery);
            });
        });

        describe("IAD2.8 - given startDate, endDate and countryCode but no employeeId or clientType", () => {
            it("IAD2.8.1 - should respond with query filtered by date and country", () => {
                // arrange
                let expectedQuery = {
                    queryString: "".concat("SELECT IH.INVOCIE_DATE, IH.ACTOR_ID, BIA.AFFECT_AMOUNT ",
                        "FROM BOSCO_INVOICE_AFFECT BIA, INVOICE_HEADER IH  ",
                        "LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_CONNECTION NC ON NC.CONNECTION_ID=1 AND NC.CONNECTION_NAME_ID=CONVERT(nvarchar, IH.ACTOR_ID) ",
                        " LEFT OUTER JOIN [Bosco reduction].[dbo].ACCOUNTING_CLIENT AC ON AC.TRANSACTION_REF=CONVERT(NVARCHAR,IH.INVOICE_ID) ",
                        ", [Bosco reduction].[dbo].NAME N ",
                        "WHERE IH.INVOICE_TYPE in (1,4) AND IH.INVOICE_PREVIEW=0 AND IH.INVOCIE_DATE BETWEEN ? AND ? ",
                        "AND BIA.INVOICE_ID=IH.INVOICE_ID AND BIA.AFFECT_ACCOUNT LIKE '%1200%' ",
                        " AND N.NAME_ID=NC.NAME_ID AND N.LEGAL_COUNTRY_CODE=? "),
                    replacements: [startDate, endDate, countryCode]
                };

                // act
                const response = InvoiceAffectDao.prepareBilledQuery(startDate, endDate, undefined, undefined, countryCode, undefined, undefined);

                // assert
                expect(response).toEqual(expectedQuery);
            });
        });

        describe("IAD2.9 - given startDate, endDate and account type Payables but no employeeId, countryCode, ageOfAccount or clientType", () => {
            it("IAD2.9.1 - should respond with query filtered by date and account type Payables", () => {
                // arrange
                let expectedQuery = {
                    queryString: "".concat("SELECT AC.TRANSACTION_DATE AS INVOCIE_DATE, IH.ACTOR_ID, AC.TRANSACTION_AMOUNT AS AFFECT_AMOUNT ",
                        "FROM [Bosco reduction].[dbo].ACCOUNTING_CLIENT AC, [Patricia reduction].[dbo].EXTERNAL_COSTS_HEAD IH ",
                        "WHERE AC.CONNECTION_ID=7 AND AC.TRANSACTION_TYPE_ID=0 AND AC.TRANSACTION_DATE BETWEEN ? AND ? ",
                        "AND AC.TRANSACTION_REF=CONVERT(NVARCHAR,IH.EXTERNAL_INVOICE_REMARK) "),
                    replacements: [startDate, endDate]
                };

                // act
                const response = InvoiceAffectDao.prepareBilledQuery(startDate, endDate, undefined, undefined, undefined, undefined, accountType);

                // assert
                expect(response).toEqual(expectedQuery);
            });
        });

        describe("IAD2.10 - given startDate, endDate, ageOfAccount and account type Payables but no employeeId, countryCode or clientType,", () => {
            it("IAD2.10.1 - should respond with query filtered by date age of the account and account type Payables", () => {
                // arrange
                let expectedQuery = {
                    queryString: "".concat("SELECT AC.TRANSACTION_DATE AS INVOCIE_DATE, IH.ACTOR_ID, AC.TRANSACTION_AMOUNT AS AFFECT_AMOUNT ",
                    "FROM [Bosco reduction].[dbo].ACCOUNTING_CLIENT AC, [Patricia reduction].[dbo].EXTERNAL_COSTS_HEAD IH ",
                    " LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_CONNECTION NC ON NC.CONNECTION_ID=1 AND NC.CONNECTION_NAME_ID=CONVERT(nvarchar, IH.ACTOR_ID) ",
                    "WHERE AC.CONNECTION_ID=7 AND AC.TRANSACTION_TYPE_ID=0 AND AC.TRANSACTION_DATE BETWEEN ? AND ? ",
                    "AND AC.TRANSACTION_REF=CONVERT(NVARCHAR,IH.EXTERNAL_INVOICE_REMARK) ",
                    " AND DATEDIFF(day, AC.TRANSACTION_DATE, AC.CLEARING_LAST_TRANSACTION)<30 "),
                    replacements: [startDate, endDate]
                };

                // act
                const response = InvoiceAffectDao.prepareBilledQuery(startDate, endDate, undefined, undefined, undefined, ageOfAccount, accountType);

                // assert
                expect(response).toEqual(expectedQuery);
            });
        });

        describe("IAD2.11 - given startDate, endDate, employeeId, countryCode, clientType, ageOfAccount and account type Payables", () => {
            it("IAD2.11.1 - should respond with query filtered by date employee, country, type of client, age of the account and account type Payables", () => {
                // arrange
                let expectedQuery = {
                    queryString: "".concat("SELECT AC.TRANSACTION_DATE AS INVOCIE_DATE, IH.ACTOR_ID, AC.TRANSACTION_AMOUNT AS AFFECT_AMOUNT ",
                        "FROM [Bosco reduction].[dbo].ACCOUNTING_CLIENT AC, [Patricia reduction].[dbo].EXTERNAL_COSTS_HEAD IH ",
                        " LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_CONNECTION NC ON NC.CONNECTION_ID=1 AND NC.CONNECTION_NAME_ID=CONVERT(nvarchar, IH.ACTOR_ID) ",
                        "LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_QUALITY NQ1 ON NQ1.NAME_ID=NC.NAME_ID AND NQ1.QUALITY_TYPE_ID=5 ",
                        " LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_QUALITY NQ2  ON NQ2.NAME_ID=NC.NAME_ID  AND NQ2.QUALITY_TYPE_ID=3 ",
                        ", [Bosco reduction].[dbo].NAME N ",
                        "WHERE AC.CONNECTION_ID=7 AND AC.TRANSACTION_TYPE_ID=0 AND AC.TRANSACTION_DATE BETWEEN ? AND ? ",
                        "AND AC.TRANSACTION_REF=CONVERT(NVARCHAR,IH.EXTERNAL_INVOICE_REMARK) ",
                        " AND NQ1.DROPDOWN_CODE=?  AND NQ2.DROPDOWN_CODE=? ",
                        " AND DATEDIFF(day, AC.TRANSACTION_DATE, AC.CLEARING_LAST_TRANSACTION)<30  AND N.NAME_ID=NC.NAME_ID AND N.LEGAL_COUNTRY_CODE=? "),
                    replacements: [startDate, endDate, employeeId, clientType, countryCode]
                };

                // act
                const response = InvoiceAffectDao.prepareBilledQuery(startDate, endDate, employeeId, clientType, countryCode, ageOfAccount, accountType);

                // assert
                expect(response).toEqual(expectedQuery);
            });
        });

        describe("IAD2.12 - given startDate, endDate, countryCode and account type Payables but no employeeId, ageOfAccount or clientType", () => {
            it("IAD2.12.1 - should respond with query filtered by date, country and account type Payables", () => {
                // arrange
                let expectedQuery = {
                    queryString: "".concat("SELECT AC.TRANSACTION_DATE AS INVOCIE_DATE, IH.ACTOR_ID, AC.TRANSACTION_AMOUNT AS AFFECT_AMOUNT ",
                        "FROM [Bosco reduction].[dbo].ACCOUNTING_CLIENT AC, [Patricia reduction].[dbo].EXTERNAL_COSTS_HEAD IH ",
                        " LEFT OUTER JOIN [Bosco reduction].[dbo].NAME_CONNECTION NC ON NC.CONNECTION_ID=1 AND NC.CONNECTION_NAME_ID=CONVERT(nvarchar, IH.ACTOR_ID) ",
                        ", [Bosco reduction].[dbo].NAME N ",
                        "WHERE AC.CONNECTION_ID=7 AND AC.TRANSACTION_TYPE_ID=0 AND AC.TRANSACTION_DATE BETWEEN ? AND ? ",
                        "AND AC.TRANSACTION_REF=CONVERT(NVARCHAR,IH.EXTERNAL_INVOICE_REMARK) ",
                        " AND N.NAME_ID=NC.NAME_ID AND N.LEGAL_COUNTRY_CODE=? "),
                    replacements: [startDate, endDate, countryCode]
                };

                // act
                const response = InvoiceAffectDao.prepareBilledQuery(startDate, endDate, undefined, undefined, countryCode, undefined, accountType);

                // assert
                expect(response).toEqual(expectedQuery);
            });
        });
    });
    describe("IAD3 - findAllClients", () => {
        it("IAD3.1 - should return list of invoices", async () => {
            // arrange
            dbStub = {
                query: () => {
                    return fakeClientList;
                }
            };

            let expectedResponse = [
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

            // act
            const response = await InvoiceAffectDao.findAllClients('2018-11-01', dbStub);

            // assert
            expect(response).toEqual(expectedResponse);
        });

        it("IAD3.2 - should return false when db cant fetch data", async () => {
            // arrange
            dbStub = {
                query: () => {
                    return Promise.resolve(false);
                }
            };

            // act and assert
            await expect(InvoiceAffectDao.findAllClients('2018-11-01', dbStub)).resolves
                .toEqual(false);
        });

        it("IAD3.3 - when db throws error with specified status and message, should reject specified status and message", async () => {
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
            await expect(InvoiceAffectDao.findAllClients('2018-11-01', dbStub))
                .rejects.toEqual(expectedResponse);
        });

        it("IAD3.4 - when db throws error with unspecified status and message, should reject default status and message", async () => {
            // arrange
            let expectedResponse = {
                status: 500,
                message: "Could not fetch clients."
            };
            
            dbStub = {
                query: () => {
                    return Promise.reject({});
                }
            };

            // act and assert
            await expect(InvoiceAffectDao.findAllClients('2018-11-01', dbStub))
                .rejects.toEqual(expectedResponse);
        });
    });
});
