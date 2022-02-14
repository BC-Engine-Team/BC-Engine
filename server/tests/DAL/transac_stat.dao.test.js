var { expect, jest } = require('@jest/globals');

const TransacStatDao = require("../../data_access_layer/daos/transac_stat.dao");


let returnedAccountStat = {
    yearMonth: 202011,
    dueCurrent: 100,
    due1Month: 200,
    due2Month: 50,
    due3Month: 20
};

let fakeStatsList = [
    {
        YEAR_MONTH: 202011,
        DUE_1_MONTH: 100,
        DUE_2_MONTH: 200,
        DUE_3_MONTH: 50,
        DUE_CURRENT: 20
    },
    {
        YEAR_MONTH: 202012,
        DUE_1_MONTH: 100,
        DUE_2_MONTH: 200,
        DUE_3_MONTH: 50,
        DUE_CURRENT: 20
    }
];




describe("Test Transac Stat DAO", () => {
    let dbStub = {
        query: () => {
            return Promise.resolve(fakeStatsList);
        }
    };

    let yearMonthList = [202011, 202012];

    let fakeQuery = {
        queryString: "fakeQuery",
        replacements: ["fakeReplace"]
    };

    let prepareDuesQuerySpy = jest.spyOn(TransacStatDao, 'prepareDuesQuery')
        .mockImplementation(() => { return fakeQuery });

    let employeeId = 12345;
    let clientType = 'DIRECT';
    let countryLabel = 'Canada';

    describe("TD1 - getTransactionsStatByYearMonth", () => {



        it("TD1.1 - should return list of stats in correct format", async () => {
            // arrange
            let expectedResponse = [
                {
                    yearMonth: fakeStatsList[0].YEAR_MONTH,
                    dueCurrent: fakeStatsList[0].DUE_CURRENT,
                    due1Month: fakeStatsList[0].DUE_1_MONTH,
                    due2Month: fakeStatsList[0].DUE_2_MONTH,
                    due3Month: fakeStatsList[0].DUE_3_MONTH
                },
                {
                    yearMonth: fakeStatsList[1].YEAR_MONTH,
                    dueCurrent: fakeStatsList[1].DUE_CURRENT,
                    due1Month: fakeStatsList[1].DUE_1_MONTH,
                    due2Month: fakeStatsList[1].DUE_2_MONTH,
                    due3Month: fakeStatsList[1].DUE_3_MONTH
                }
            ];

            // act and assert
            await expect(TransacStatDao.getTransactionsStatByYearMonth(yearMonthList, employeeId, clientType, countryLabel, dbStub)).resolves
                .toEqual(expectedResponse);
            expect(prepareDuesQuerySpy).toHaveBeenCalledWith(yearMonthList, employeeId, clientType, countryLabel);
        });

        it("TD1.2 - should return false when model cant fetch data", async () => {
            // arrange
            dbStub = {
                query: () => {
                    return Promise.resolve(false);
                }
            };

            // act and assert
            await expect(TransacStatDao.getTransactionsStatByYearMonth(yearMonthList, employeeId, clientType, countryLabel, dbStub)).resolves
                .toEqual(false);
            expect(prepareDuesQuerySpy).toHaveBeenCalledWith(yearMonthList, employeeId, clientType, countryLabel);
        });

        it("TD1.3 - when model throws error with specified status and message, should reject with specified status and message", async () => {
            // arrange
            let expectedResponse = {
                status: 600,
                message: "Error."
            };
            dbStub = {
                query: () => {
                    return Promise.reject(expectedResponse)
                }
            };

            // act and assert
            await expect(TransacStatDao.getTransactionsStatByYearMonth(yearMonthList, employeeId, clientType, countryLabel, dbStub)).rejects
                .toEqual(expectedResponse);
            expect(prepareDuesQuerySpy).toHaveBeenCalledWith(yearMonthList, employeeId, clientType, countryLabel);
        });

        it("TD1.4 - when model throws error with unspecified status and message, should reject with default status and message", async () => {
            // arrange
            let expectedResponse = {
                status: 500,
                message: "Could not fetch transactions."
            };
            dbStub = {
                query: () => {
                    return Promise.reject({})
                }
            };

            // act and assert
            await expect(TransacStatDao.getTransactionsStatByYearMonth(yearMonthList, employeeId, clientType, countryLabel, dbStub)).rejects
                .toEqual(expectedResponse);
            expect(prepareDuesQuerySpy).toHaveBeenCalledWith(yearMonthList, employeeId, clientType, countryLabel);
        });
    });

    describe("TD2 - prepareDuesQuery", () => {
        let expectedQuery = {
            queryString: "".concat("SELECT ACS.DUE_CURRENT, ACS.DUE_1_MONTH, ACS.DUE_2_MONTH, ACS.DUE_3_MONTH, ACS.YEAR_MONTH ",
                "FROM ACCOUNTING_CLIENT_STAT ACS ",
                "WHERE ACS.YEAR_MONTH in (?) AND ACS.CONNECTION_ID=3 AND ACS.STAT_TYPE=1"),
            replacements: [yearMonthList]
        };

        describe("TD2.1 - given a yearMonthList", () => {
            it("TD2.1.1 - should respond with query filtered by yearMonth", () => {
                // arrange
                prepareDuesQuerySpy.mockRestore();

                // act
                const response = TransacStatDao.prepareDuesQuery(yearMonthList);

                // assert
                expect(response).toEqual(expectedQuery);
            });
        });

        describe("TD2.2 - given a yearMonthList and an employeeId", () => {
            it("TD2.2.1 - should respond with query filtered by yearMonth and employeeId", () => {
                // arrange
                let expectedQuery = {
                    queryString: "".concat("SELECT ACS.DUE_CURRENT, ACS.DUE_1_MONTH, ACS.DUE_2_MONTH, ACS.DUE_3_MONTH, ACS.YEAR_MONTH ",
                        "FROM ACCOUNTING_CLIENT_STAT ACS ",
                        ", NAME_CONNECTION NC, NAME_QUALITY NQ1, NAME RESP ",
                        "WHERE ACS.YEAR_MONTH in (?) AND ACS.CONNECTION_ID=3 AND ACS.STAT_TYPE=1",
                        " AND NC.CONNECTION_ID=3 AND NC.CONNECTION_NAME_ID=CONVERT(NVARCHAR, ACS.ACC_NAME_ID)",
                        " AND NQ1.NAME_ID=NC.NAME_ID AND NQ1.QUALITY_TYPE_ID=5",
                        " AND CONVERT(NVARCHAR,RESP.NAME_ID)=NQ1.DROPDOWN_CODE",
                        " AND NQ1.DROPDOWN_CODE=? "),
                    replacements: [yearMonthList, employeeId]
                };

                // act
                const response = TransacStatDao.prepareDuesQuery(yearMonthList, employeeId, undefined, undefined);

                // assert
                expect(response).toEqual(expectedQuery);
            });
        });

        describe("TD2.3 - given a yearMonthList, an employeeId and a clientType", () => {
            it("TD2.3.1 - should respond with query filtered by yearMonth and employeeId and clientType", () => {
                // arrange
                let expectedQuery = {
                    queryString: "".concat("SELECT ACS.DUE_CURRENT, ACS.DUE_1_MONTH, ACS.DUE_2_MONTH, ACS.DUE_3_MONTH, ACS.YEAR_MONTH ",
                        "FROM ACCOUNTING_CLIENT_STAT ACS ",
                        ", NAME_CONNECTION NC, NAME_QUALITY NQ1, NAME RESP ",
                        ", NAME_QUALITY NQ2 ",
                        "WHERE ACS.YEAR_MONTH in (?) AND ACS.CONNECTION_ID=3 AND ACS.STAT_TYPE=1",
                        " AND NC.CONNECTION_ID=3 AND NC.CONNECTION_NAME_ID=CONVERT(NVARCHAR, ACS.ACC_NAME_ID)",
                        " AND NQ1.NAME_ID=NC.NAME_ID AND NQ1.QUALITY_TYPE_ID=5",
                        " AND CONVERT(NVARCHAR,RESP.NAME_ID)=NQ1.DROPDOWN_CODE",
                        " AND NQ1.DROPDOWN_CODE=? ",
                        " AND NC.NAME_ID=NQ2.NAME_ID",
                        " AND NQ2.QUALITY_TYPE_ID=3",
                        " AND NQ2.DROPDOWN_CODE=? "),
                    replacements: [yearMonthList, employeeId, clientType]
                };

                // act
                const response = TransacStatDao.prepareDuesQuery(yearMonthList, employeeId, clientType, undefined);

                // assert
                expect(response).toEqual(expectedQuery);
            });
        });

        describe("TD2.4 - given a yearMonthList, an employeeId, a clientType and a countryLabel", () => {
            it("TD2.4.1 - should respond with query filtered by yearMonth and employeeId and clientType and country", () => {
                // arrange
                let expectedQuery = {
                    queryString: "".concat("SELECT ACS.DUE_CURRENT, ACS.DUE_1_MONTH, ACS.DUE_2_MONTH, ACS.DUE_3_MONTH, ACS.YEAR_MONTH ",
                        "FROM ACCOUNTING_CLIENT_STAT ACS ",
                        ", NAME_CONNECTION NC, NAME_QUALITY NQ1, NAME RESP ",
                        ", NAME_QUALITY NQ2 ",
                        ", ACCOUNTING_NAME AN ",
                        "WHERE ACS.YEAR_MONTH in (?) AND ACS.CONNECTION_ID=3 AND ACS.STAT_TYPE=1",
                        " AND NC.CONNECTION_ID=3 AND NC.CONNECTION_NAME_ID=CONVERT(NVARCHAR, ACS.ACC_NAME_ID)",
                        " AND NQ1.NAME_ID=NC.NAME_ID AND NQ1.QUALITY_TYPE_ID=5",
                        " AND CONVERT(NVARCHAR,RESP.NAME_ID)=NQ1.DROPDOWN_CODE",
                        " AND NQ1.DROPDOWN_CODE=? ",
                        " AND NC.NAME_ID=NQ2.NAME_ID",
                        " AND NQ2.QUALITY_TYPE_ID=3",
                        " AND NQ2.DROPDOWN_CODE=? ",
                        " AND ACS.ACC_NAME_ID=AN.ACC_NAME_ID AND AN.ACC_NAME_COUNTRY=? "),
                    replacements: [yearMonthList, employeeId, clientType, countryLabel]
                };

                // act
                const response = TransacStatDao.prepareDuesQuery(yearMonthList, employeeId, clientType, countryLabel);

                // assert
                expect(response).toEqual(expectedQuery);
            });
        });

        describe("TD2.5 - given a yearMonthList and client type but no employeeId", () => {
            it("TD2.5.1 - should return query filtered by yearMonth and client Type", () => {
                // arrange
                let expectedQuery = {
                    queryString: "".concat("SELECT ACS.DUE_CURRENT, ACS.DUE_1_MONTH, ACS.DUE_2_MONTH, ACS.DUE_3_MONTH, ACS.YEAR_MONTH ",
                        "FROM ACCOUNTING_CLIENT_STAT ACS ",
                        ", NAME_CONNECTION NC ",
                        ", NAME_QUALITY NQ2 ",
                        "WHERE ACS.YEAR_MONTH in (?) AND ACS.CONNECTION_ID=3 AND ACS.STAT_TYPE=1",
                        " AND NC.CONNECTION_ID=3  AND NC.CONNECTION_NAME_ID=CONVERT(NVARCHAR, ACS.ACC_NAME_ID) ",
                        " AND NC.NAME_ID=NQ2.NAME_ID",
                        " AND NQ2.QUALITY_TYPE_ID=3",
                        " AND NQ2.DROPDOWN_CODE=? "),
                    replacements: [yearMonthList, clientType]
                };

                // act
                const response = TransacStatDao.prepareDuesQuery(yearMonthList, undefined, clientType, undefined);

                // assert
                expect(response).toEqual(expectedQuery);
            });
        });

    });
});