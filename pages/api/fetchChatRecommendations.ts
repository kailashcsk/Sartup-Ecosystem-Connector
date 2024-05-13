import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        try {
            const { message } = req.body;

            const response = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: `
                    You are a connection on a social network. Given the following chat message:
                    "${message}". Generate 3 distinct relevant replies conversational recommendations for the above message for a human user. Keep it short and real.`,
                    },
                ],
                max_tokens: 100,
                stop: ['\n'],
                temperature: 0.7,
                n: 3,
            });

            const recommendations = response.choices.map((choice) => choice.message.content?.split('.')[1].trim()).reduce((acc, curr) => {
                if (acc[curr]) {
                    return acc;
                }
                acc[curr] = true;
                return acc;
            }, {});

            res.status(200).json({ recommendations: Object.keys(recommendations).map((recommendation) => recommendation.replaceAll('\\', '').replaceAll('"', ''))});
        } catch (error) {
            console.error('Error generating chat recommendations:', error);
            res.status(500).json({ error: 'Failed to generate chat recommendations' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
