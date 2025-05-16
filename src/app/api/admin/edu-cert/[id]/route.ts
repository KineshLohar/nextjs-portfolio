import connectDB from "@/db/connectDB";
import { deleteFromCloudinary, uploadToCloudinary } from "@/lib/cloudinary";
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

        const eduCert = await EduCert.findById(id);

        if (!eduCert) {
            return new NextResponse("Edu/Cert not found", { status: 404 });
        }

        if (eduCert.thumbnail?.public_id) {
            try {
                await deleteFromCloudinary(eduCert.thumbnail.public_id);
            } catch (err) {
                console.error("Failed to delete thumbnail from Cloudinary:", err);
                // Continue with deletion anyway
            }
        }

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
        const formData = await req.formData();

        const eduCert = await EduCert.findById(id);
        if (!eduCert) {
            return new NextResponse("EduCert not found", { status: 404 });
        }

        eduCert.title = formData.get("title") as string || eduCert.title;
        eduCert.description = formData.get("description") as string || eduCert.description;
        eduCert.type = formData.get("type") as string || eduCert.type;
        eduCert.startDate = formData.get("startDate") ? new Date(formData.get("startDate") as string) : eduCert.startDate;
        eduCert.endDate = formData.get("endDate") ? new Date(formData.get("endDate") as string) : eduCert.endDate;
        eduCert.link = formData.get('link') || eduCert?.link

        // Handle thumbnail update
        const newThumbnailFile = formData.get("thumbnail") as File;

        if (newThumbnailFile && newThumbnailFile.size > 0) {
            if (eduCert.thumbnail?.public_id) {
                await deleteFromCloudinary(eduCert.thumbnail.public_id);
            }

            const buffer = Buffer.from(await newThumbnailFile.arrayBuffer());
            const uploadResult = await uploadToCloudinary(buffer, newThumbnailFile.type, {
                folder: "projects/edu-cert",
            });

            eduCert.thumbnail = {
                public_id: uploadResult.public_id,
                url: uploadResult.secure_url,
            };
        }

        await eduCert.save();

        return NextResponse.json({
            message: "Education or Certification updated successfully",
            data: eduCert
        }, { status: 200 });


    } catch (error) {
        console.log("[ERRIR EDU CERT EDIT API]", error);

        return new NextResponse("Internal Server Error", { status: 500 })
    }
}