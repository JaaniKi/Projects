require('dotenv').config();
const express = require('express');
const { OpenAI } = require('openai');
const path = require('path');
const app = express();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post('/chat', async (req, res) => {
  const message = req.body.message;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Olet asiakaspalvelija verkkokaupassa. Vastaa lyhyesti ja selkeästi, vain tuotteisiin ja tilauksiin liittyviin kysymyksiin."
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    const reply = response.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("Virhe GPT-pyynnössä:", error);
    res.status(500).json({ error: "Palvelinvirhe" });
  }
});

app.listen(3000, () => {
  console.log("Asiakaspalvelubotti pyörii osoitteessa http://localhost:3000");
});
