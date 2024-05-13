import prisma from '../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
    data: any
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const startupId = req.query.id;

    try {
        const startup = await prisma.startup.findUnique({
            where: {
                id: startupId as string,
            },
            include: {
                founder: true,
                funding: true,
                mentorships: {
                    include: {
                        mentor: true,
                        mentee: true,
                    },
                },
                partnerships: {
                    include: {
                        partner: true,
                    },
                },
                team: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        if (!startup) {
            return res.status(404).json({ data: null });
        }

        res.status(200).json({ data: startup });
    } catch (error) {
        console.error(error);
        res.status(500).json({ data: null });
    }
}
