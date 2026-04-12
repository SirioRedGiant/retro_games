const express = require("express");
const axios = require("axios");
const route = express.Router();

route.post("/", async (req, res) => {
  const { system, messages } = req.body;

  if (!system || !Array.isArray(messages)) {
    return res.status(400).json({
      error: "Body non valido. Servono system e messages[]",
    });
  }

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [{ role: "system", content: system }, ...messages],
        temperature: 0.7,
        max_completion_tokens: 800,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    const reply =
      response.data?.choices?.[0]?.message?.content ||
      "Non ho una risposta al momento.";

    return res.json({ reply });
  } catch (error) {
    console.error(error.response?.data || error.message);
    return res.status(500).json({
      error: "Errore nella chiamata Groq",
      details: error.response?.data || error.message,
    });
  }
});

module.exports = route;
