const { response } = require("express");
const manageController = require("../controllers/manage.controller");
let router = require("express").Router();
const authService = require('../services/auth.service');



router.put("/modifyClientGrading", authService.authenticateToken, manageController.modifyClientGradings);