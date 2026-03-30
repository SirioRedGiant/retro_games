const rate = require("express-rate-limit");

const rateLimit = rate({
  windowMs: 15 * 60 * 1000, // 15 minuti
  max: 15, // max 3 tentativi per IP
  message: {
    success: false,
    error: "Troppi tentativi, riprova più tardi",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = rateLimit;
