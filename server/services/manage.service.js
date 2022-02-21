const databases = require("../data_access_layer/databases");
const ClientGradingDAO = require("../data_access_layer/daos/client_grading.dao");
const Op = databases.Sequelize.Op;


exports.getClientGradings = async () => {
    return new Promise((resolve, reject) => {
        ClientGradingDAO.getClientGradings()
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

// exports.modifyGradingOfAllClients = async(clientGradingGroup) => {
//     return new Promise((resolve, reject) => {

        

//     });
// };