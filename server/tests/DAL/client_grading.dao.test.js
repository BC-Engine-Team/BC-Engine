const ClientGradingDao = require("../../data_access_layer/daos/client_grading.dao");


let fakeClientGradingList = [
    {
        NAME_ID: 20086,
        DROPDOWN_CODE: "C"
    },
    {
        NAME_ID: 26558,
        DROPDOWN_CODE: "E"
    },
    {
        NAME_ID: 24176,
        DROPDOWN_CODE: "A"
    }
];



describe("Test Client Grading DAO", () => {
    describe("CGD1 - getClientGrading", () => {
        it("CGD1.1 - Should return list of grading based on name id", async () => {
            
            // arrange
            let testId = [20086, 26558, 24176];

            let dbStub = {
                query: () => {
                    return fakeClientGradingList;
                }
            };

            let expectedResponse = [
                {
                    nameId: fakeClientGradingList[0].NAME_ID,
                    grading: fakeClientGradingList[0].DROPDOWN_CODE
                },
                {
                    nameId: fakeClientGradingList[1].NAME_ID,
                    grading: fakeClientGradingList[1].DROPDOWN_CODE
                },
                {
                    nameId: fakeClientGradingList[2].NAME_ID,
                    grading: fakeClientGradingList[2].DROPDOWN_CODE
                }
            ];

            // act
            const response = await ClientGradingDao.getClientGrading(testId, dbStub);

            // assert
            expect(response).toEqual(expectedResponse);
        });

        it("CGD1.2 - should return false when db cant fetch data", async () => {
            // arrange
            let dbStub = {
                query: () => {
                    return false;
                }
            };

            let testId = [0];

            // act and assert
            await expect(ClientGradingDao.getClientGrading(testId, dbStub)).resolves
                .toEqual(false);
        });

        it("CGD1.3 - should catch error when db throws error", async () => {
            // arrange
            let dbStub = {
                query: () => {
                    throw new Error("Error with the db.");
                }
            };

            let testId = [0];

            // act and assert
            await expect(ClientGradingDao.getClientGrading(testId, dbStub)).rejects
                .toEqual(new Error("Error with the db."));
        })
    });
});