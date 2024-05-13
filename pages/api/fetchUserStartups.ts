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
    const startups = await prisma.startup.findMany({
        where: {
            // @ts-ignore
            founderId: userId,
        },
    });

    res.status(200).json({ data: startups })
}