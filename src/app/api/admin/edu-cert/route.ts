import connectDB from "@/db/connectDB";
import getDataFromToken from "@/lib/get-data-from-token";
import User from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";
import EduCert from '@/models/EduCertModel'

connectDB();

export async function POST(req: NextRequest) {
    try {
        const decodedToken = await getDataFromToken(req);
        if (!decodedToken || typeof decodedToken === 'string') {
            return new NextResponse("Unauthorized", { status: 401 })
        }
        const user = await User.findOne({ _id: decodedToken.id }).select("-password")

        if (!user) {
            return new NextResponse("Unauthorized User", { status: 401 })
        }

        const data = await req.json();

        data.userId = user?._id;

        const created = await EduCert.create(data);

        return NextResponse.json({ message: "Education or Certification Added!", data: created }, { status: 201 })

    } catch (error) {
        return NextResponse.json({ message: "Internal server error", error }, { status: 500 })
    }
}