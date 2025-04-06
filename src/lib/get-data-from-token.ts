import { NextRequest } from "next/server";
import jwt from 'jsonwebtoken'

export default async function getDataFromToken(req: NextRequest) {
    try {
        const token = await req.cookies.get('token')?.value || '';
        const decodedToken = await jwt.verify(token, process.env.TOKEN_SECRET!)
        return decodedToken;
    } catch (error: any) {
        throw new Error(error.message)
    }
}