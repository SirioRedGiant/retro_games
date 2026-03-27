const express = require("express");
const router = express.Router();

// REGISTRO di tutte le risorse del sito
router.get("/", (req, res) => {
  res.json("Welcome to Movies-DB!");
});

// rotta test error 500
router.get("/test-error", (req, res) => {
  a.b;
  res.send("Hello world");
});

module.exports = router;
