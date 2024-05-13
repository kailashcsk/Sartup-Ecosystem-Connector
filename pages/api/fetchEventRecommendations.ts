

import prisma from '../../lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import events from './data/events.json';
import { TfIdf, PorterStemmer } from 'natural';

type ResponseData = {
    data: any;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const { userId } = getAuth(req);

    // Get the user's interests from the database
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { interests: true },
    });

    if (!user) {
        res.status(404).json({ data: { error: 'User not found' } });
        return;
    }

    const userInterests = user.interests;

    // Create a TF-IDF model
    const tfidf = new TfIdf();
    const stemmer = new PorterStemmer();

    // Preprocess event descriptions and user interests
    const processedEvents = events.map((event) => {
        const processedDescription = stemmer.tokenizeAndStem(event.description.toLowerCase()).join(' ');
        return { ...event, processedDescription };
    });

    const processedUserInterests = userInterests.map((interest) =>
        stemmer.tokenizeAndStem(interest.toLowerCase()).join(' ')
    );

    // Add event descriptions to the TF-IDF model
    processedEvents.forEach((event) => {
        tfidf.addDocument(event.processedDescription);
    });

    // Calculate the similarity scores between user interests and event descriptions
    const similarityScores = processedUserInterests.map((interest) => {
        const scores = processedEvents.map((event) => {
            const eventVector = tfidf.tfidfs(event.processedDescription);
            const interestVector = tfidf.tfidfs(interest);
            return cosineSimilarity(eventVector, interestVector);
        });
        return scores;
    });

    // Calculate the average similarity score for each event
    const averageScores = similarityScores[0].map((_, index) => {
        const sum = similarityScores.reduce((acc, scores) => acc + scores[index], 0);
        return sum / similarityScores.length;
    });

    // Sort events based on the average similarity scores
    const sortedEvents = processedEvents
        .map((event, index) => ({ ...event, score: averageScores[index] }))
        .sort((a, b) => b.score - a.score);

    res.status(200).json({ data: sortedEvents });
}

// Helper function to calculate cosine similarity between two vectors
function cosineSimilarity(vec1: number[], vec2: number[]): number {
    const dotProduct = vec1.reduce((acc, val, index) => acc + val * vec2[index], 0);
    const magnitude1 = Math.sqrt(vec1.reduce((acc, val) => acc + val ** 2, 0));
    const magnitude2 = Math.sqrt(vec2.reduce((acc, val) => acc + val ** 2, 0));
    return dotProduct / (magnitude1 * magnitude2);
}
