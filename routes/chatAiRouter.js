const express = require("express");
const route = express.Router();
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

route.post("/", async (req, res) => {
  try {
    const { system, messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages mancanti" });
    }

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: system || "Sei un assistente utile.",
        },
        ...messages,
      ],
    });

    res.json({
      reply: response.output[0].content[0].text,
    });
  } catch (error) {
    console.error("OPENAI ERROR:", error);

    if (error.code === "insufficient_quota") {
      return res.status(429).json({
        error: "Credito API esaurito. Controlla il billing.",
      });
    }

    res.status(500).json({
      error: "Errore nella richiesta a OpenAI",
    });
  }
});

module.exports = route;
