
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateReflection(text) {
  const prompt = `Reflect on this anonymous thought:

"${text}"

Provide empathetic, non-judgmental insight that helps the person process their emotions. Keep the response thoughtful, supportive, and concise.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-6-luna",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return completion.choices[0].message.content.trim();
}

module.exports = generateReflection;
