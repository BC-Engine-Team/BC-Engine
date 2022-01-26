const ClientDao = require("../../data_access_layer/daos/client.dao");


let fakeClientList = [
    {
        NAME_ID: 20100,
        NAME_1: "National Research Council of Canada",
        NAME_2: null,
        NAME_3: null,
        COUNTRY_LABEL: "CA"
    },
    {
        NAME_ID: 20234,
        NAME_1: "Groupe Patrick Ménard Assurances Inc.",
        NAME_2: "Groupe Jetté",
        NAME_3: null,
        COUNTRY_LABEL: "CA"
    },
    {
        NAME_ID: 20330,
        NAME_1: "Martin",
        NAME_2: null,
        NAME_3: "Aubé",
        COUNTRY_LABEL: "CA"
    }
];


describe("Test Client DAO", () => {
    describe("CD1 - getClientByID", () => {
        it("CD1.1 - Should return list of clients", async () => {
            
            // arrange
            let testId = [20100, 20234, 20330];

            let dbStub = {
                query: () => {
                    return fakeClientList;
                }
            };

            let expectedResponse = [
                {
                    nameId: fakeClientList[0].NAME_ID,
                    name1: fakeClientList[0].NAME_1,
                    name2: fakeClientList[0].NAME_2,
                    name3: fakeClientList[0].NAME_3,
                    country: fakeClientList[0].COUNTRY_LABEL
                },
                {
                    nameId: fakeClientList[1].NAME_ID,
                    name1: fakeClientList[1].NAME_1,
                    name2: fakeClientList[1].NAME_2,
                    name3: fakeClientList[1].NAME_3,
                    country: fakeClientList[1].COUNTRY_LABEL
                },
                {
                    nameId: fakeClientList[2].NAME_ID,
                    name1: fakeClientList[2].NAME_1,
                    name2: fakeClientList[2].NAME_2,
                    name3: fakeClientList[2].NAME_3,
                    country: fakeClientList[2].COUNTRY_LABEL
                }
            ];

            // act
            const response = await ClientDao.getClientByID(testId, dbStub);

            // assert
            expect(response).toEqual(expectedResponse);
        });

        it("CD1.2 - should return false when db cant fetch data", async () => {
            // arrange
            let dbStub = {
                query: () => {
                    return false;
                }
            };

            let testId = [0];

            // act and assert
            await expect(ClientDao.getClientByID(testId, dbStub)).resolves
                .toEqual(false);
        });

        it("CD1.3 - should catch error when db throws error", async () => {
            // arrange
            let dbStub = {
                query: () => {
                    throw new Error("Error with the db.");
                }
            };

            let testId = [0];

            // act and assert
            await expect(ClientDao.getClientByID(testId, dbStub)).rejects
                .toEqual(new Error("Error with the db."));
        })
    });
});