const databases = require("../databases");
const ClientGradingModel = databases['localdb'].clientGradingData;


exports.updateClientGrading = async (clientGradingGroup, clientGradingModel = ClientGradingModel) => {
    return new Promise((resolve, reject) => {
        clientGradingModel.update(clientGradingGroup)
        .then(async data => {
            if (data) {
                resolve("Client grading modified successfully");
            }
            resolve("Client grading was not updated");
        })
        .catch(err => {
            const response = {
                status: 500,
                data: {},
                message: err.message || "some error occured"
            }
            reject(response);
        })
    });
}