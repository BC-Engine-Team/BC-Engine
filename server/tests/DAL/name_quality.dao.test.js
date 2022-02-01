const NameQualityDao = require('../../data_access_layer/daos/name_quality.dao');

let listClientId = ['25652', '21634', '58641'];

describe("Test Name Quality DAO", () => {
    describe("NQD1 - getClientsByEmployee", () => {
        it("NDQ1.1 - Should return list of clients", async () => {
            // arrange
            let employeeId = [22769]

            let dbStub = {
                query: () => {
                    return listClientId;
                }
            };

            let expectedResponse = [listClientId[0].CONNECTION_NAME_ID, listClientId[1].CONNECTION_NAME_ID, listClientId[2].CONNECTION_NAME_ID];

            // act
            const response = await NameQualityDao.getClientsByEmployee(employeeId, dbStub);

            // assert
            expect(response).toEqual(expectedResponse);
        });

        it("NQD1.2 - Should resolve false when Model cant fetch data", async () => {
            // arrange
            let employeeId = [22769]

            let dbStub = {
                query: () => {
                    return false;
                }
            };

            // act
            const response = await NameQualityDao.getClientsByEmployee(employeeId, dbStub);

            // assert
            expect(response).toEqual(false);
        });

        it("NQD1.3 - Should reject error with 500 status and predefined message when model does not define them", async () => {
            // arrange
            let employeeId = [22769]

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
            await expect(NameQualityDao.getClientsByEmployee(employeeId, dbStub)).rejects
                .toEqual(expectedError)
        });

        it("NQD1.4 - Should reject error when Model throws error with defined status and message", async () => {
            // arrange
            let employeeId = [22769]

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
            await expect(NameQualityDao.getClientsByEmployee(employeeId, dbStub)).rejects
                .toEqual(expectedError)
        });
    });
});