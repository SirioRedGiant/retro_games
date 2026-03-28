const express = require("express");
const route = express.Router();
const controller = require("../controllers/loginController");
const validate = require("../middlewares/validateRegister");
const rateLimit = require("../middlewares/rateLimit");

route.post("/", validate, rateLimit, controller.checkUser);

module.exports = route;
