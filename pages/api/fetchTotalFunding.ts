import prisma from '../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
    data: any
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const totalFunding = await prisma.funding.aggregate({
        where: {
            startup: {
                // @ts-ignore
                founderId: req.query.id,
            },
        },
        _sum: {
            amount: true,
        },
    });


    res.status(200).json({ data: totalFunding })
}