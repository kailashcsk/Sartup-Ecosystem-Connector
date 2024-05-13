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
            const { postDescription, author, location } = req.body;

            const response = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: `
                    Post details: Author: ${author}, Location: ${location}, Description: ${postDescription}.
                    You are a connection on a social network. Given the above post message, generate a relevant conversational reply comment recommendations for the above post for a human user. Keep it short and real.
                    `,
                    },
                ],
                max_tokens: 100,
                stop: ['\n'],
                temperature: 0.7,
            });

            const recommendation = response.choices[0].message.content?.split('.')[1].trim().replaceAll('\\', '').replaceAll('"', '');

            res.status(200).json({ recommendation });
        } catch (error) {
            console.error('Error generating chat recommendations:', error);
            res.status(500).json({ error: 'Failed to generate chat recommendations' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
