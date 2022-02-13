const { sequelize,
    dataTypes,
    checkModelName,
    checkPropertyExists,
    checkHookDefined
} = require('sequelize-test-helpers');

const AccountClientStatModel = require('../../data_access_layer/models/mssql_bosco/accounting_client_stat.model');
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

let SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();
var AccountingClientStatMock = dbMock.define('ACCOUNTING_CLIENT_STAT', returnedAccountStat);

describe("Test Transac Stat DAO", () => {
    const Model = AccountClientStatModel(sequelize, dataTypes);
    const instance = new Model();

    afterEach(() => {
        AccountingClientStatMock.$queryInterface.$clearResults();
    })

    beforeEach(() => {
        AccountingClientStatMock.$queryInterface.$clearResults();
    })

    // testing the model properties
    checkModelName(Model)('ACCOUNTING_CLIENT_STAT');
    ['yearMonth', 'dueCurrent', 'due1Month', 'due2Month', 'due3Month', 'amount', 'transactionDate', 'transactionRef', 'connectionId']
        .forEach(checkPropertyExists(instance));


    let dbStub = {
        query: () => {
            return Promise.resolve(fakeStatsList);
        }
    };

    let fakeQuery = {
        queryString: "fakeQuery",
        replacements: ["fakeReplace"]
    };

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
            await expect(TransacStatDao.getTransactionsStatByYearMonth(fakeQuery, dbStub)).resolves
                .toEqual(expectedResponse);
        });

        it("TD1.2 - should return false when model cant fetch data", async () => {
            // arrange
            dbStub = {
                query: () => {
                    return Promise.resolve(false);
                }
            };

            // act and assert
            await expect(TransacStatDao.getTransactionsStatByYearMonth(fakeQuery, dbStub)).resolves
                .toEqual(false);
        });

        it("TD1.3 - should return error when model throws error", async () => {
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
            await expect(TransacStatDao.getTransactionsStatByYearMonth(fakeQuery, dbStub)).rejects
                .toEqual(expectedResponse);
        });
    });
});