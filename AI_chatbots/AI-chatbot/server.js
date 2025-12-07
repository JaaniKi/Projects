// server.js
require('dotenv').config();
const express = require('express');
const { OpenAI } = require('openai');
const path = require('path');
const app = express();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

let conversation = [];

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  conversation.push({ role: "user", content: userMessage });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Olet ystävällinen suomenkielinen botti." },
        ...conversation
      ],
    });

    const botReply = response.choices[0].message.content;
    conversation.push({ role: "assistant", content: botReply });
    res.json({ reply: botReply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Jokin meni pieleen" });
  }
});

app.listen(3000, () => {
  console.log("🚀 Serveri pyörii osoitteessa http://localhost:3000");
});
