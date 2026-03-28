const express = require("express");
const route = express.Router();
const control = require("../controllers/registerController");
const validate = require("../middlewares/validateRegister");

route.post("/", validate, control.registerUser);

module.exports = route;
