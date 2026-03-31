const express = require("express");
const router = express.Router();

// REGISTRO di tutte le risorse del sito
router.get("/", (req, res) => {
  res.json({ message: "Welcome to Start-db!" });
});

module.exports = router;
