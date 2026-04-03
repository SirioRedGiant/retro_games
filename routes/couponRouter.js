const express = require("express");
const route = express.Router();
const controller = require("../controllers/couponController");

route.post("/", controller.sendCoupon);

module.exports = route;
