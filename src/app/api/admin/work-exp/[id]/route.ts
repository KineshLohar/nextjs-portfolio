import connectDB from "@/db/connectDB";
import getDataFromToken from "@/lib/get-data-from-token";
import User from "@/models/UserModel";
import { WorkExperience } from "@/models/WorkExpModel";
import { NextRequest, NextResponse } from "next/server";


export async function DELETE(req: NextRequest, { params }: {
    params: {
        id: string;
    }
}) {
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

        const { id } = await params;

        await WorkExperience.findByIdAndDelete(id);

        return NextResponse.json({ message: "Work Experience Deleted!" }, { status: 200 })

    } catch (error) {
        console.log("[ERRIR WOrkEXP DELETE API]", error);
        return NextResponse.json({ message: "Error Deleting work experience!", error }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest, { params }: {
    params: {
        id: string;
    }
}) {
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

        const { id } = await params;
        const data = await req.json()
        const updatedWorkExp = await WorkExperience.findByIdAndUpdate(id, data)

        return NextResponse.json({ message: "Work Experience Deleted!", workExp: updatedWorkExp });
    } catch (error) {
        console.log("[ERRIR WOrkEXP DELETE API]", error);
        return NextResponse.json({ message: "Error Deleting work experience!", error }, { status: 500 })
    }
}