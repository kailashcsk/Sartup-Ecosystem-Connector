import { getAuth } from '@clerk/nextjs/server';
import prisma from '../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
    data: any
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const data: any = getAuth(req);
    const userId = data.userId;

    if (!userId || typeof userId !== 'string') {
        res.status(400).json({ error: 'Invalid user ID' });
        return;
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { attributes: true }
        });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const userInterests = user.attributes
            .filter(attr => attr.attributeKey === 'interests')
            .map(attr => attr.attributeValue);

        const usersWithSimilarInterestsOrRole = await prisma.user.findMany({
            where: {
                id: { not: userId },
                OR: [
                    { role: user.role },
                    {
                        attributes: {
                            some: {
                                attributeKey: 'interests',
                                attributeValue: { in: userInterests }
                            }
                        }
                    }
                ]
            },
            select: {
                id: true,
                name: true,
                email: true,
                profileImage: true,
                role: true,
                createdAt: true,
                attributes: {
                    where: { attributeKey: 'interests' },
                    select: { attributeValue: true }
                }
            }
        });

        res.status(200).json({ data: usersWithSimilarInterestsOrRole });
    } catch (error) {
        console.error('Error fetching users with similar interests or role:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
