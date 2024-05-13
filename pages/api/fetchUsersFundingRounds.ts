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
    const fundingRounds = await prisma.funding.findMany({
        where: {
            startup: {
                founderId: userId
            }
        }
    })
    res.status(200).json({ data: fundingRounds })
}
