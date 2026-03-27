const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");
const upload = require("../middlewares/multer");

// Usa upload.single("image") per la rotta POST
router.post("/", upload.single("image"), movieController.store);

router.get("/", movieController.index);
router.get("/:id", movieController.show);
router.post("/create", upload.single("image"), movieController.store);
router.post("/:id/review", movieController.storeReview);

module.exports = router;
