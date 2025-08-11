const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function moderateText(text) {
  const prompt = `
  Check the following message for any personal info (names, emails, phone, address, social media), threats, harassment, hate speech, or revenge intent. Return "safe" or "unsafe" with reason.

  Message:
  "${text}"
  `;

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3
  });

  const reply = completion.choices[0].message.content.toLowerCase();
  if (reply.includes('unsafe')) return { safe: false, reason: reply };
  return { safe: true };
}

module.exports = moderateText;
