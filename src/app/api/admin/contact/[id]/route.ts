import connectDB from "@/db/connectDB";
import getDataFromToken from "@/lib/get-data-from-token";
import ContactRequest from "@/models/ContactRequestModel";
import User from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";

connectDB()

export async function DELETE(req: NextRequest,
    { params }: {
        params: Promise<{
            id: string;
        }>
    }
) {
    try {
        const decodedToken = await getDataFromToken(req);
        if (!decodedToken || typeof decodedToken === 'string') {
            return new NextResponse("Unauthorized", { status: 401 })
        }
        const user = await User.findOne({ _id: decodedToken.id }).select("-password")

        if (!user) {
            return new NextResponse("Unauthorized User", { status: 401 })
        }

        const { id } = await params;

        await ContactRequest.findByIdAndDelete(id);

        return NextResponse.json({ message: "Contact Deleted!" }, { status: 200 })

    } catch (error) {
        console.log("[ERRIR EDU CERT DELETE API]", error);

        return new NextResponse("Internal Server Error", { status: 500 })
    }
}