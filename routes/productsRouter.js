const express = require("express");
const route = express.Router();
const controller = require("../controllers/productController");

route.get("/", controller.index);
route.post("/advanced", controller.searchAdvanced);
route.get("/u/famous", controller.mostFamous);
route.get("/u/recent", controller.recentlyUpdate);
route.get("/:slug", controller.show);
module.exports = route;
