import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(process.cwd()))); // Serve index.html

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const BOT_PERSONA = process.env.BOT_PERSONA || "You are a friendly female assistant.";

app.post("/chat", async (req, res) => {
  const { message } = req.body;
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: BOT_PERSONA },
      { role: "user", content: message }
    ],
  });
  res.json({ reply: response.choices[0].message.content });
});

app.get("/", (req, res) => res.sendFile(path.join(process.cwd(), "index.html")));

app.listen(process.env.PORT || 3000, () => console.log("Bot running..."));
