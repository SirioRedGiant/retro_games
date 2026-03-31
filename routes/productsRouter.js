const express = require("express");
const route = express.Router();
const controller = require("../controllers/productController");

route.get("/", controller.index);
route.get("/famous", controller.mostFamous);
route.get("/recent", controller.recentlyUpdate);
route.get("/:slug", controller.show);
module.exports = route;
