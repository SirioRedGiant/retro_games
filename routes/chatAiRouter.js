const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/chat", async (req, res) => {  
  const { messages, system } = req.body;

  if (!messages || !system) {
    return res.status(400).json({ error: "Parametri mancanti." });
  }

  if (!process.env.ANTHROPIC_KEY) {
    console.error("ANTHROPIC_KEY non trovata nel file .env");
    return res.status(500).json({ error: "Chiave API mancante." });
  }

  try {
    const { data } = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model: "claude-sonnet-4-20250514",
        max_tokens: 300,
        system,
        messages,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_KEY,
          "anthropic-version": "2023-06-01",
        },
      }
    );

    const reply = data?.content?.[0]?.text || "Nessuna risposta ricevuta.";
    return res.json({ reply });

  } catch (err) {
    console.error("Errore API Anthropic:", err?.response?.data || err.message);
    return res.status(500).json({ error: "Errore nella chiamata all'AI." });
  }
});

module.exports = router;