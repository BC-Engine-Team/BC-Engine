const { response } = require('express');
const manageService = require('../services/manage.service');


exports.getClientGradings = async (req, res) => {
    if (req.user.role !== "admin") return res.status(403).send();

    await manageService.getClientGradings()
        .then(async response => {
            if (response) {
                return res.send(response);
            }
            return res.status(500).send({ message: "The data could not be fetched." });
        })
        .catch(async err => {
            return res.status(err.status || 500).send({ message: err.message || "Malfunction in the B&C Engine." });
        });
}


exports.modifyClientGradings = async (req, res) => {
    if (req.user.role !== "admin") return res.status(403).send();

    //validate request
    if (!req.body.maximumGradeAPlus || req.body.maximumGradeAPlus === 0
        || !req.body.minimumGradeAPlus || req.body.minimumGradeAPlus === 0
        || !req.body.averageCollectionTimeGradeAPlus || req.body.averageCollectionTimeGradeAPlus === 0
        || !req.body.maximumGradeA || req.body.maximumGradeA === 0
        || !req.body.minimumGradeA || req.body.minimumGradeA === 0
        || !req.body.averageCollectionTimeGradeA || req.body.averageCollectionTimeGradeA === 0
        || !req.body.maximumGradeB || req.body.maximumGradeB === 0
        || !req.body.minimumGradeB || req.body.minimumGradeB === 0
        || !req.body.averageCollectionTimeGradeB || req.body.averageCollectionTimeGradeB === 0
        || !req.body.maximumGradeC || req.body.maximumGradeC === 0
        || !req.body.minimumGradeC || req.body.minimumGradeC === 0
        || !req.body.averageCollectionTimeGradeC || req.body.averageCollectionTimeGradeC === 0
        || !req.body.maximumGradeEPlus || req.body.maximumGradeEPlus === 0
        || !req.body.minimumGradeEPlus || req.body.minimumGradeEPlus === 0
        || !req.body.averageCollectionTimeGradeEPlus || req.body.averageCollectionTimeGradeEPlus === 0)
        return res.status(400).send({ message: "Content cannot be empty." });
    

    let clientGradingGroup = {
        maximumGradeAPlus: req.body.maximumGradeAPlus,
        minimumGradeAPlus: req.body.minimumGradeAPlus,
        averageCollectionTimeGradeAPlus: req.body.averageCollectionTimeGradeAPlus,
        maximumGradeA: req.body.maximumGradeA,
        minimumGradeA: req.body.minimumGradeA,
        averageCollectionTimeGradeA: req.body.averageCollectionTimeGradeA,
        maximumGradeB: req.body.maximumGradeB,
        minimumGradeB: req.body.minimumGradeB,
        averageCollectionTimeGradeB: req.body.averageCollectionTimeGradeB,
        maximumGradeC: req.body.maximumGradeC,
        minimumGradeC: req.body.minimumGradeC,
        averageCollectionTimeGradeC: req.body.averageCollectionTimeGradeC,
        maximumGradeEPlus: req.body.maximumGradeEPlus,
        minimumGradeEPlus: req.body.minimumGradeEPlus,
        averageCollectionTimeGradeEPlus: req.body.averageCollectionTimeGradeEPlus
    }

    await manageService.modifyClientGradings(clientGradingGroup)
        .then(async response => {
            if(response) {
                return res.send(response);
            }
            return res.status(500).send({ message: "The data could not be modified"});
        })
        .catch(async err => {
            return res.status(err.status || 500).send({ message: err.message });
        });
}


exports.sendNewClientGradingInDatabase = async (req, res) => {
    if (req.user.role !== "admin") return res.status(403).send();


    let clientGradingGroup = {
        maximumGradeAPlus: req.body.maximumGradeAPlus,
        minimumGradeAPlus: req.body.minimumGradeAPlus,
        averageCollectionTimeGradeAPlus: req.body.averageCollectionTimeGradeAPlus,
        maximumGradeA: req.body.maximumGradeA,
        minimumGradeA: req.body.minimumGradeA,
        averageCollectionTimeGradeA: req.body.averageCollectionTimeGradeA,
        maximumGradeB: req.body.maximumGradeB,
        minimumGradeB: req.body.minimumGradeB,
        averageCollectionTimeGradeB: req.body.averageCollectionTimeGradeB,
        maximumGradeC: req.body.maximumGradeC,
        minimumGradeC: req.body.minimumGradeC,
        averageCollectionTimeGradeC: req.body.averageCollectionTimeGradeC,
        maximumGradeEPlus: req.body.maximumGradeEPlus,
        minimumGradeEPlus: req.body.minimumGradeEPlus,
        averageCollectionTimeGradeEPlus: req.body.averageCollectionTimeGradeEPlus
    }

    await manageService.sendNewClientGradingInDatabase(clientGradingGroup)
        .then(async response => {
            if(response) {
                return res.send(response);
            }
            return res.status(500).send({ message: "The data could not be modified"});
        })
        .catch(async err => {
            return res.status(err.status || 500).send({ message: err.message });
        });
}