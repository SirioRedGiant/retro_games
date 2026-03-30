const express = require("express");
const route = express.Router();
const control = require("../controllers/userController");
const auth = require("../middlewares/AuthToken");

route.get("/alluser", auth, control.allUser);
route.get("/:username", auth, control.getUser);
route.post("/delete", auth, control.deleteUser);
module.exports = route;
