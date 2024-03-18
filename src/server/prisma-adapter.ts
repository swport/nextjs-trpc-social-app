import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/server/db";

const PrismaAdapterBase = PrismaAdapter(prisma);

export default PrismaAdapterBase;