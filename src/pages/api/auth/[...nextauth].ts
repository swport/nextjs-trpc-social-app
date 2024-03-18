import NextAuth from "next-auth";
import { authOptions } from "@/server/authentication/auth";

export default NextAuth(authOptions);
