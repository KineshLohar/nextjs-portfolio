import connectDB from "@/db/connectDB";
import getDataFromToken from "@/lib/get-data-from-token";
import EduCert from "@/models/EduCertModel";
import User from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";


export async function DELETE(req: NextRequest,
    { params }: {
        params: Promise<{
            id: string;
        }>
    }
) {
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

        await EduCert.findByIdAndDelete(id);

        return NextResponse.json({ message: "Education or Certification Deleted!" }, { status: 200 })

    } catch (error) {
        console.log("[ERRIR EDU CERT DELETE API]", error);

        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export async function PATCH(req: NextRequest, { params }: {
    params: Promise<{
        id: string;
    }>
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
        const data = await req.json();

        const updatedData = await EduCert.findByIdAndUpdate(id, data);

        if (!updatedData) {
            return NextResponse.json({ message: "Failed to update Edu or Cert Data" }, { status: 400 })
        }

        return NextResponse.json({ message: "Successfully updated Edu or Cert Data", updatedData })

    } catch (error) {
        console.log("[ERRIR EDU CERT EDIT API]", error);

        return new NextResponse("Internal Server Error", { status: 500 })
    }
}