const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

async function generateReflection(text) {
    const prompt = `Reflect on this anonymous thought:
    "${text}"
    Provide empathetic, non-judgmental insight that helps the person process their emotions.`;

    const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
    });

    return completion.choices[0].message.content.trim();
}

module.exports = generateReflection;