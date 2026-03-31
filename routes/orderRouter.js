const express = require("express");
const route = express.Router();
const controller = require("../controllers/orderController");

route.get("/order", controller.orderBy);

module.exports = route;
