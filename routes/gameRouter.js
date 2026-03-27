const express = require("express");
const router = express.Router();
const gameController = require("../controllers/gameController");
const upload = require("../middlewares/multer");

// Usa upload.single("image") per la rotta POST
router.post("/", upload.single("image"), gameController.store);

router.get("/", gameController.index);
router.get("/:id", gameController.show);
router.post("/create", upload.single("image"), gameController.store);
router.post("/:id/review", gameController.storeReview);

module.exports = router;
