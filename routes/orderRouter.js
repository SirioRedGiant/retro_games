const express = require("express");
const route = express.Router();
const controller = require("../controllers/orderController");

route.get("/byname", controller.orderByName);

module.exports = route;
