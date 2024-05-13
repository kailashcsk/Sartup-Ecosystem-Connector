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
    const connections = await prisma.userConnection.findMany({
        where: {
            OR: [
                { userId: userId },
                { connectedUserId: userId }
            ]
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    profileImage: true
                }
            },
            connectedUser: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    profileImage: true
                }
            }
        }
    })

    const connectedUsers = connections.map(connection => {
        if (connection.userId === userId) {
            return connection.connectedUser;
        } else {
            return connection.user;
        }
    });

    res.status(200).json({ data: { connections, connectedUsers } })
}
