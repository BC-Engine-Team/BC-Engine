const InvoiceAffectDao = require("../data_access_layer/daos/invoice_affect.dao");

exports.getAllClients = async () => {
    return new Promise(async (resolve, reject) => {
        let date = new Date
        let yearMonth = (date.getFullYear() - 2) + "-" + this.formatTimes(date.getMonth()) + "-01"

        await InvoiceAffectDao.findAllClients(yearMonth)
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
            });
    });
}

exports.formatTimes = (time) => {
    if(time < 10) time = "0" + time;
    return time;
}