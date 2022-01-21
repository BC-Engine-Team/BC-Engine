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
        dataValues: {
            yearMonth: 202011,
            dueCurrent: 100,
            due1Month: 200,
            due2Month: 50,
            due3Month: 20
        }
    },
    {
        dataValues: {
            yearMonth: 202012,
            dueCurrent: 100,
            due1Month: 200,
            due2Month: 50,
            due3Month: 20
        }
    }
];

let yearMonthList = [202011, 202012];

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
    ['yearMonth', 'dueCurrent', 'due1Month', 'due2Month', 'due3Month']
        .forEach(checkPropertyExists(instance));

    describe("TD1 - getTransactionsStatByYearMonth", () => {
        it("TD1.1 - should return list of stats in correct format", async () => {
            // arrange
            let expectedResponse = [fakeStatsList[0].dataValues, fakeStatsList[1].dataValues];
            AccountingClientStatMock.$queryInterface.$useHandler(function (query, queryOptions, done) {
                return Promise.resolve(fakeStatsList);
            });

            // act and assert
            await expect(TransacStatDao.getTransactionsStatByYearMonth(yearMonthList, AccountingClientStatMock)).resolves
                .toEqual(expectedResponse);
        });

        it("TD1.2 - should return false when model cant fetch data", async () => {
            // arrange
            AccountingClientStatMock.$queryInterface.$useHandler(function (query, queryOptions, done) {
                return Promise.resolve(false);
            });

            // act and assert
            await expect(TransacStatDao.getTransactionsStatByYearMonth(yearMonthList, AccountingClientStatMock)).resolves
                .toEqual(false);
        });

        it("TD1.3 - should return error when model throws error", async () => {
            // arrange
            AccountingClientStatMock.$queryInterface.$useHandler(function (query, queryOptions, done) {
                return Promise.reject({ message: "Error with the model." });
            });

            // act and assert
            await expect(TransacStatDao.getTransactionsStatByYearMonth(yearMonthList, AccountingClientStatMock)).rejects
                .toEqual({ message: "Error with the model." });
        });
    })

});