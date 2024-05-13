import prisma from '../../lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';

type ResponseData = {
  message: string;
  startup?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === 'POST') {
    const data: any = getAuth(req);
    const userId = data.userId;

    const {
      name,
      description,
      logo,
      industry,
      stage,
      foundedDate,
      website,
      socialMedia,
    } = req.body;

    try {
      const startup = await prisma.startup.create({
        data: {
          name,
          description,
          logo,
          industry,
          stage,
          foundedDate: new Date(foundedDate),
          website,
          socialMedia,
          founder: {
            connect: {
              id: userId,
            },
          },
        },
      });

      res.status(201).json({ message: 'Startup created successfully', startup });
    } catch (error) {
      console.error('Error creating startup:', error);
      res.status(500).json({ message: 'Failed to create startup' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
