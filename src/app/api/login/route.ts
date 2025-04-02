import connectDB from "@/db/connectDB";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/UserModel"
import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken'


connectDB()

interface UserProp {
    _id: string;
    email: string;
    password: string;
}

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email) {
            return new NextResponse("Email is required", { status: 400 })
        }

        if (!password) {
            return new NextResponse("Password is required", { status: 400 })
        }

        const user: UserProp = await User.findOne({ email })

        if (!user) {
            return new NextResponse("User not found", { status: 400 })
        }

        const passwordMatch = await bcryptjs.compare(password, user?.password)

        if (!passwordMatch) {
            return new NextResponse("Invalid Credentials", { status: 400 })
        }

        const tokenData = {
            id: user?._id,
            email: user?.email
        }

        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: "1d" })

        return NextResponse.json({ message: "User Logged In Successfully"}).cookies.set('token', token, { httpOnly: true })

    } catch (error) {
        return new NextResponse("Internal Server", { status: 500 })
    }
}