import prisma from '../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getAuth } from "@clerk/nextjs/server";

type ResponseData = {
    data: any
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const data: any = getAuth(req);
    const userId = data.userId;
    const feedRecommendations = await prisma.userFeedRecommendation.findMany({
        where: {
            userId: userId
        },
        orderBy: {
            score: 'desc'
        },
        include: {
            recommendedPost: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            profileImage: true
                        }
                    }
                }
            }
        }
    })

    const recommendedPosts = feedRecommendations.map(recommendation => ({
        ...recommendation.recommendedPost,
        author: recommendation.recommendedPost.user
    }));

    res.status(200).json({ data: { feedRecommendations, recommendedPosts } })
}
