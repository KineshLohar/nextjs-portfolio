import { NextRequest } from "next/server";
import jwt from 'jsonwebtoken'

export default async function getDataFromToken(req: NextRequest) {
    try {
        const token = await req.cookies.get('token')?.value || '';
        if (!token) {
           return null;
        }
        const decodedToken = await jwt.verify(token, process.env.TOKEN_SECRET!)
        return decodedToken;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw new Error(error.message)
    }
}