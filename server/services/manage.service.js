const databases = require("../data_access_layer/databases");
const ClientGradingDAO = require("../data_access_layer/daos/client_grading.dao");
const NameDAO = require("../data_access_layer/daos/name.dao");
const Op = databases.Sequelize.Op;


exports.getAllClientGradings = async () => {
    return new Promise((resolve, reject) => {
        ClientGradingDAO.getClientGradings()
            .then(async data => {
                if (data) resolve(data)
                resolve(false);
            })
            .catch(err => {
                const response = {
                    status: err.status || 500,
                    message: err.message || "Malfunction in the B&C Engine."
                };
                reject(response);
            });
    });
}



exports.modifyClientGradings = async (clientGradingGroup) => {
    return new Promise((resolve, reject) => {
        ClientGradingDAO.updateClientGrading(clientGradingGroup)
            .then(async data => {
                if(data) resolve(data);
                resolve(false);
            })
            .catch(err => {
                const response = {
                    status: err.status || 500,
                    message: err.message || "Malfunction in the B&C Engine."
                };
                reject(response);
            });
    }); 
}


exports.sendNewClientGradingInDatabase = async (clientGradingGroup) => {
    return new Promise(async (resolve, reject) => {

        // initialize query variables to modify or add for all employees and clients

        let gradingGroup = {
            maximumGradeAPlus: clientGradingGroup.maximumGradeAPlus,
            minimumGradeAPlus: clientGradingGroup.minimumGradeAPlus,
            averageCollectionTimeGradeAPlus: clientGradingGroup.averageCollectionTimeGradeAPlus,
            maximumGradeA: clientGradingGroup.maximumGradeA,
            minimumGradeA: clientGradingGroup.minimumGradeA,
            averageCollectionTimeGradeA: clientGradingGroup.averageCollectionTimeGradeA,
            maximumGradeB: clientGradingGroup.maximumGradeB,
            minimumGradeB: clientGradingGroup.minimumGradeB,
            averageCollectionTimeGradeB: clientGradingGroup.averageCollectionTimeGradeB,
            maximumGradeC: clientGradingGroup.maximumGradeC,
            minimumGradeC: clientGradingGroup.minimumGradeC,
            averageCollectionTimeGradeC: clientGradingGroup.averageCollectionTimeGradeC,
            maximumGradeEPlus: clientGradingGroup.maximumGradeEPlus,
            minimumGradeEPlus: clientGradingGroup.minimumGradeEPlus,
            averageCollectionTimeGradeEPlus: clientGradingGroup.averageCollectionTimeGradeEPlus
        };

        let averageCollectionDelimiters = [];
        let nameIdListWithAffectAmount = [];
        let totalBillAmountAndAverageForEachClients = [];


        let listOfClientsWithGradeAPlus = [];
        let listOfClientsWithGradeA = [];
        let listOfClientsWithGradeB = [];
        let listOfClientsWithGradeC = [];
        let listOfClientsWithGradeEPlus = [];
        let returnData = "";

        //Create the delimitation of the average collection time for each grading
        await this.createDelimitationForCollectionDaysForEachGrading(gradingGroup.averageCollectionTimeGradeAPlus, gradingGroup.averageCollectionTimeGradeA, gradingGroup.averageCollectionTimeGradeB, gradingGroup.averageCollectionTimeGradeC, gradingGroup.averageCollectionTimeGradeEPlus)
            .then(async data => {
                averageCollectionDelimiters = data;
            })
            .catch(err => {
                reject(err);
        });


        // Get the list of all name id and all affect amount for the date
        await this.getNameIDAndAffectAmount()
            .then(async data => {
                nameIdListWithAffectAmount = data;
            }).catch(err => {
                reject(err);
        });
        

        // Group each invoice by clients
        const groupedInvoice = nameIdListWithAffectAmount.reduce((groups, item) => ({
            ...groups,
            [item.nameId]: [...(groups[item.nameId] || []), item]
        }), {});
        

        //create a totalBillAmount and an average collection day for each client
        for (var i = 0; i < Object.keys(groupedInvoice).length; i++){
            let totalBillAmountForOneClient = 0;
            let averageCollectionDayForOneClient = 0;
            let totalCollectionsDay = 0;

            let billList = Object.entries(groupedInvoice)[i][1];

            billList.map(c => {
                nameId: c.nameId;
                affectAmount: c.affectAmount;
                daysToPay: c.daysToPay;
            });
            
            for(var j = 0; j < billList.length; j++){
                totalBillAmountForOneClient += billList[j].affectAmount;
                totalCollectionsDay += billList[j].daysToPay;
            }
            averageCollectionDayForOneClient = totalCollectionsDay / billList.length;

            totalBillAmountAndAverageForEachClients.push({   
                nameId: billList[0].nameId,
                totalBillAmountForOneClient: totalBillAmountForOneClient,
                averageCollectionDayForOneClient: averageCollectionDayForOneClient
            });
        }
        

        for(var i = 0; i < totalBillAmountAndAverageForEachClients.length; i++)
        {
            //to check if it is of grade A+
            if (averageCollectionDelimiters.gradeAPlusDelimitation.minimum < totalBillAmountAndAverageForEachClients[i].averageCollectionDayForOneClient
            && averageCollectionDelimiters.gradeAPlusDelimitation.maximum >= totalBillAmountAndAverageForEachClients[i].averageCollectionDayForOneClient
            && totalBillAmountAndAverageForEachClients[i].totalBillAmountForOneClient >= gradingGroup.minimumGradeAPlus){

                listOfClientsWithGradeAPlus.push(totalBillAmountAndAverageForEachClients[i].nameId)                
            }

            //to check if it is of grade A
            else if (averageCollectionDelimiters.gradeADelimitation.minimum < totalBillAmountAndAverageForEachClients[i].averageCollectionDayForOneClient
            && averageCollectionDelimiters.gradeADelimitation.maximum >= totalBillAmountAndAverageForEachClients[i].averageCollectionDayForOneClient
            && totalBillAmountAndAverageForEachClients[i].totalBillAmountForOneClient >= gradingGroup.minimumGradeA
            && totalBillAmountAndAverageForEachClients[i].totalBillAmountForOneClient < gradingGroup.maximumGradeA){

                listOfClientsWithGradeA.push(totalBillAmountAndAverageForEachClients[i].nameId);
            }

            //to check if it is of grade B
            else if (averageCollectionDelimiters.gradeBDelimitation.minimum < totalBillAmountAndAverageForEachClients[i].averageCollectionDayForOneClient
                && averageCollectionDelimiters.gradeBDelimitation.maximum >= totalBillAmountAndAverageForEachClients[i].averageCollectionDayForOneClient
                && totalBillAmountAndAverageForEachClients[i].totalBillAmountForOneClient >= gradingGroup.minimumGradeB
                && totalBillAmountAndAverageForEachClients[i].totalBillAmountForOneClient < gradingGroup.maximumGradeB){


                    listOfClientsWithGradeB.push(totalBillAmountAndAverageForEachClients[i].nameId);
            }

            //to check if it is of grade C
            else if (averageCollectionDelimiters.gradeCDelimitation.minimum < totalBillAmountAndAverageForEachClients[i].averageCollectionDayForOneClient
                && averageCollectionDelimiters.gradeCDelimitation.maximum >= totalBillAmountAndAverageForEachClients[i].averageCollectionDayForOneClient
                && totalBillAmountAndAverageForEachClients[i].totalBillAmountForOneClient >= gradingGroup.minimumGradeC
                && totalBillAmountAndAverageForEachClients[i].totalBillAmountForOneClient < gradingGroup.maximumGradeC){

                    listOfClientsWithGradeC.push(totalBillAmountAndAverageForEachClients[i].nameId);
            }

            //to check if it is of grade E+
            else if (averageCollectionDelimiters.gradeEPlusDelimitation.minimum < totalBillAmountAndAverageForEachClients[i].averageCollectionDayForOneClient
                && averageCollectionDelimiters.gradeEPlusDelimitation.maximum >= totalBillAmountAndAverageForEachClients[i].averageCollectionDayForOneClient
                && totalBillAmountAndAverageForEachClients[i].totalBillAmountForOneClient >= gradingGroup.minimumGradeEPlus
                && totalBillAmountAndAverageForEachClients[i].totalBillAmountForOneClient < gradingGroup.maximumGradeEPlus){
                    
                    listOfClientsWithGradeEPlus.push(totalBillAmountAndAverageForEachClients[i].nameId);
            }
        }

        
        //modify the grading for each clients
        if (listOfClientsWithGradeAPlus.length > 0){
            await this.changeClientGradingToAPlus(listOfClientsWithGradeAPlus)
                .then(async data => {
                    returnData = data;
                }).catch(err => {
                    const response = {
                        status: err.status || 500,
                        message: err.message || "Could not modify the gradings"
                    };
                    reject(response);
            });
        }

        if (listOfClientsWithGradeA.length > 0) {
            await this.changeClientGradingToA(listOfClientsWithGradeA)
                .then(async data => {
                    returnData = data;
                }).catch(err => {
                    const response = {
                        status: err.status || 500,
                        message: err.message || "Could not modify the gradings"
                    };
                    reject(response);
            });
        }

        if (listOfClientsWithGradeB.length > 0) {
            await this.changeClientGradingToB(listOfClientsWithGradeB)
                .then(async data => {
                    returnData = data;
                }).catch(err => {
                    const response = {
                        status: err.status || 500,
                        message: err.message || "Could not modify the gradings"
                    };
                    reject(response);
            });
        }

        if (listOfClientsWithGradeC.length > 0) {
            await this.changeClientGradingToC(listOfClientsWithGradeC)
                .then(async data => {
                    returnData = data;
                }).catch(err => {
                    const response = {
                        status: err.status || 500,
                        message: err.message || "Could not modify the gradings"
                    };
                    reject(response);
            });
        }

        if (listOfClientsWithGradeEPlus.length > 0) {
            await this.changeClientGradingToEPlus(listOfClientsWithGradeEPlus)
                .then(async data => {
                    returnData = data;
                }).catch(err => {
                    const response = {
                        status: err.status || 500,
                        message: err.message || "Could not modify the gradings"
                    };
                    reject(response);
            });
        }
        resolve(returnData);
    });
}


exports.getNameIDAndAffectAmount = async () => {
    return new Promise(async (resolve, reject) => {
        await NameDAO.getNameIDAndAffectAmount()
            .then(async data => {
                if (data) resolve(data);
                resolve(false);
            })
            .catch(err => {
                const response = {
                    status: err.status || 500,
                    message: err.message || "Could not fetch clients."
                };
                reject(response);
            })
    });
}


exports.createDelimitationForCollectionDaysForEachGrading = async (gradeAPlusCollectionDays, gradeACollectionDays, gradeBCollectionDays, gradeCCollectionDays, gradeEPlusCollectionDays) => {
    return new Promise(async (resolve) => {

        let gradeAPlusDelimitation = {
            minimum: 0,
            maximum: 0
        };

        let gradeADelimitation = {
            minimum: 0,
            maximum: 0
        };

        let gradeBDelimitation = {
            minimum: 0,
            maximum: 0
        };

        let gradeCDelimitation = {
            minimum: 0,
            maximum: 0
        };

        let gradeEPlusDelimitation = {
            minimum: 0,
            maximum: 0
        };
    
        switch(gradeAPlusCollectionDays){
            case '30': 
                gradeAPlusDelimitation.minimum = 0;
                gradeAPlusDelimitation.maximum = 30;
                break;
            case '60':
                gradeAPlusDelimitation.minimum = 31;
                gradeAPlusDelimitation.maximum = 60;
                break;
            case '90':
                gradeAPlusDelimitation.minimum = 61;
                gradeAPlusDelimitation.maximum = 90;
                break;
            case '1': 
                gradeAPlusDelimitation.minimum = 91;
                gradeAPlusDelimitation.maximum = Number.MAX_SAFE_INTEGER;
                break;
        }

        switch(gradeACollectionDays){
            case '30': 
                gradeADelimitation.minimum = 0;
                gradeADelimitation.maximum = 30;
                break;
            case '60':
                gradeADelimitation.minimum = 31;
                gradeADelimitation.maximum = 60;
                break;
            case '90':
                gradeADelimitation.minimum = 61;
                gradeADelimitation.maximum = 90;
                break;
            case '1': 
                gradeADelimitation.minimum = 91;
                gradeADelimitation.maximum = Number.MAX_SAFE_INTEGER;
                break;
        }

        switch(gradeBCollectionDays){
            case '30': 
                gradeBDelimitation.minimum = 0;
                gradeBDelimitation.maximum = 30;
                break;
            case '60':
                gradeBDelimitation.minimum = 31;
                gradeBDelimitation.maximum = 60;
                break;
            case '90':
                gradeBDelimitation.minimum = 61;
                gradeBDelimitation.maximum = 90;
                break;
            case '1': 
                gradeBDelimitation.minimum = 91;
                gradeBDelimitation.maximum = Number.MAX_SAFE_INTEGER;
                break;
        }

        switch(gradeCCollectionDays){
            case '30': 
                gradeCDelimitation.minimum = 0;
                gradeCDelimitation.maximum = 30;
                break;
            case '60':
                gradeCDelimitation.minimum = 31;
                gradeCDelimitation.maximum = 60;
                break;
            case '90':
                gradeCDelimitation.minimum = 61;
                gradeCDelimitation.maximum = 90;
                break;
            case '1': 
                gradeCDelimitation.minimum = 91;
                gradeCDelimitation.maximum = Number.MAX_SAFE_INTEGER;
                break;
        }

        switch(gradeEPlusCollectionDays){
            case '30': 
                gradeEPlusDelimitation.minimum = 0;
                gradeEPlusDelimitation.maximum = 30;
                break;
            case '60':
                gradeEPlusDelimitation.minimum = 31;
                gradeEPlusDelimitation.maximum = 60;
                break;
            case '90':
                gradeEPlusDelimitation.minimum = 61;
                gradeEPlusDelimitation.maximum = 90;
                break;
            case '1': 
                gradeEPlusDelimitation.minimum = 91;
                gradeEPlusDelimitation.maximum = Number.MAX_SAFE_INTEGER;
                break;
        }

        let groupedDelimiters = {
            gradeAPlusDelimitation: gradeAPlusDelimitation,
            gradeADelimitation: gradeADelimitation,
            gradeBDelimitation: gradeBDelimitation,
            gradeCDelimitation: gradeCDelimitation,
            gradeEPlusDelimitation: gradeEPlusDelimitation
        }
        resolve(groupedDelimiters);
    });
}


exports.changeClientGradingToAPlus = async (listOfClientsWithGradeAPlus) => {
    return new Promise(async (resolve, reject) => {
        await NameDAO.changeClientGradingToAPlus(listOfClientsWithGradeAPlus)
            .then(async data => {
                if (data) resolve(data);
                resolve(false);
            })
            .catch(err => {
                const response = {
                    status: err.status || 500,
                    message: err.message || "Could not modify any gradings"
                };
                reject(response);
            })
    });
}


exports.changeClientGradingToA = async (listOfClientsWithGradeA) => {
    return new Promise(async (resolve, reject) => {
        await NameDAO.changeClientGradingToA(listOfClientsWithGradeA)
            .then(async data => {
                if (data) resolve(data);
                resolve(false);
            })
            .catch(err => {
                const response = {
                    status: err.status || 500,
                    message: err.message || "Could not modify any gradings"
                };
                reject(response);
            })
    });
}


exports.changeClientGradingToB = async (listOfClientsWithGradeB) => {
    return new Promise(async (resolve, reject) => {
        await NameDAO.changeClientGradingToB(listOfClientsWithGradeB)
            .then(async data => {
                if (data) resolve(data);
                resolve(false);
            })
            .catch(err => {
                const response = {
                    status: err.status || 500,
                    message: err.message || "Could not modify any gradings"
                };
                reject(response);
            })
    });
}


exports.changeClientGradingToC = async (listOfClientsWithGradeC) => {
    return new Promise(async (resolve, reject) => {
        await NameDAO.changeClientGradingToC(listOfClientsWithGradeC)
            .then(async data => {
                if (data) resolve(data);
                resolve(false);
            })
            .catch(err => {
                const response = {
                    status: err.status || 500,
                    message: err.message || "Could not modify any gradings"
                };
                reject(response);
            })
    });
}


exports.changeClientGradingToEPlus = async (listOfClientsWithGradeEPlus) => {
    return new Promise(async (resolve, reject) => {
        await NameDAO.changeClientGradingToEPlus(listOfClientsWithGradeEPlus)
            .then(async data => {
                if (data) resolve(data);
                resolve(false);
            })
            .catch(err => {
                const response = {
                    status: err.status || 500,
                    message: err.message || "Could not modify any gradings"
                };
                reject(response);
            })
    });
}
