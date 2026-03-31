const express = require("express");
const route = express.Router();
const controller = require("../controllers/productController");

route.get("/", controller.index);
route.get("/:slug", controller.show);
module.exports = route;
