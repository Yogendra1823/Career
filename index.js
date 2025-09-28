import express from "express";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();
app.use(express.json());

// 1️⃣ Connect to Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// 2️⃣ Connect to Google AI API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// 3️⃣ API Endpoint: Ask AI and Save to DB
app.post("/ask", async (req, res) => {
  const { prompt } = req.body;

  try {
    // Generate AI response
    const result = await model.generateContent(prompt);
    const output = result.response.text();

    // Save to Supabase
    const { data, error } = await supabase
      .from("user_prompts")
      .insert([{ prompt, result: output }]);

    if (error) throw error;

    res.json({ message: "✅ Saved to DB", result: output });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Start server
app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));
