const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.post("/", orderController.checkout);
router.get("/order", orderController.orderedBy);

module.exports = router;
