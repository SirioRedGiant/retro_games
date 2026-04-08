const express = require("express");
const route = express.Router();
const controller = require("../controllers/productController");
const validateAdvanced = require("../middlewares/validateAdvance");

route.get("/", controller.index);
route.post("/advanced", validateAdvanced, controller.searchAdvanced);
route.get("/u/famous", controller.mostFamous);
route.get("/u/recent", controller.recentlyUpdate);
route.get("/:slug", controller.show);
module.exports = route;
