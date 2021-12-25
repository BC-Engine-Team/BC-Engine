const invoiceService = require('../services/invoice.service');

// Fetch all Invoices from patricia db
exports.findAllInvoices = async (req, res) => {
    if(req.user.role !== "admin") return res.status(403).send();
    await invoiceService.getAllInvoices()
        .then(response => {
            return res.status(200).send(response);
        })
        .catch(err => {
            return res.status(500).send(err);
        });
};

// Fetch all transactions from bosco db
exports.findAllTransactions = async (req, res) => {
    if(req.user.role !== "admin") return res.status(403).send();
    await invoiceService.getAllTransactions()
        .then(response => {
            return res.status(200).send(response);
        })
        .catch(err => {
            return res.status(500).send(err);
        });
};

exports.findTransactionsBetweenDates = async (req, res) => {
    if(req.user.role !== "admin") return res.status(403).send();
    await invoiceService.getTransactionsBetweenDates()
        .then(response => {
            return res.status(200).send(response);
        })
        .catch(err => {
            console.log(err)
            return res.status(500).send(err);
        });
};