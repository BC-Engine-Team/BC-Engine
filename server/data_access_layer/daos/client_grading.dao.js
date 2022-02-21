const databases = require("../databases");
const ClientGradingModel = databases['localdb'].clientGradingData;


exports.getClientGradings = async(clientGradingModel = ClientGradingModel) => {
    return new Promise((resolve, reject) => {
        clientGradingModel.findOne()
        .then(async data => {
            if (data) {
                resolve(data);
            }
            resolve(false);
        })
        .catch(async err => {
            const response = {
                status: err.status || 500,
                message: err.message || "Could not fetch data."
            };
            reject(response);
        });
    });
};



exports.updateClientGrading = async (clientGradingGroup, clientGradingModel = ClientGradingModel) => {
    return new Promise((resolve, reject) => {
        clientGradingModel.update(clientGradingGroup,
            {
                where: { clientGradingId: 1 }
            })
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