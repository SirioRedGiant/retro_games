const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const validationCheck = require("../middlewares/checkoutValidation");

router.post("/", validationCheck, orderController.checkout);
router.get("/order", orderController.orderedBy);

module.exports = router;
