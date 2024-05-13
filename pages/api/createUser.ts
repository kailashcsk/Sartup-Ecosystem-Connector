import prisma from '../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
    data: any
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const {
        created_at,
        email_addresses,
        id,
        first_name,
        gender,
        image_url,
        last_name,
        last_sign_in_at,

    } = req.body.data;

    const { object, type } = req.body
    // console.log("req.body", object, type)
    if (object === 'event') {
        if (type === 'session.created') {
        } else if (type === 'session.ended') {
        } else if (type === 'user.deleted') {
            console.log("user deleted", id)
            const user = await prisma.user.findFirst({
                where: {
                    id
                }
            })

            if (user) {
                await prisma.user.delete({
                    where: {
                        id
                    }
                })
            }
            res.redirect(301, '/sign-in')
        }else if (type === 'user.created') {

            console.log(JSON.stringify(req.body.data, null, 2))

            const email = email_addresses[0].email_address;

            const user = await prisma.user.findFirst({
                where: {
                    email: email,
                    id
                }
            })

            if (!user) {
                await prisma.user.create({
                    data: {
                        createdAt: new Date(created_at).toISOString(),
                        email,
                        id,
                        name: first_name + ' ' + last_name,
                        updatedAt: last_sign_in_at ? new Date(last_sign_in_at).toISOString() : new Date(created_at).toISOString(),
                        password: '',
                    }
                })
            }
        }
    }

    res.redirect(301, '/dashboard')
}