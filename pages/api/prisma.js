import prisma from "generated/prisma";

const users = await prisma.users.findMany();