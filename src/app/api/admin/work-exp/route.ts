import getDataFromToken from "@/lib/get-data-from-token";
import User from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";
import { WorkExperience } from '@/models/WorkExpModel';
import connectDB from "@/db/connectDB";

export async function POST(req: NextRequest) {
    try {
        await connectDB()
        const decodedToken = await getDataFromToken(req);
        if (!decodedToken || typeof decodedToken === 'string') {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const user = await User.findOne({ _id: decodedToken.id }).select("-password")

        if (!user) {
            return new NextResponse("Unauthorized User", { status: 401 })
        }

        const data = await req.json();

        data.userId = decodedToken?.id

        const WorkExp = await WorkExperience.create(data)

        if (!WorkExp) {
            return new NextResponse("Unable to create Work Experience", { status: 400 })
        }

        return NextResponse.json({ message: "Work Experience Added!", WorkExperience: WorkExp }, { status: 201 })

    } catch (error) {
        console.log("[ERROR ADDING WORK EXPE]", error);

        return new NextResponse("Internal Server Error", { status: 500 })
    }
}