import connectDB from "@/db/connectDB";
import getDataFromToken from "@/lib/get-data-from-token";
import User from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";
import EduCert from '@/models/EduCertModel'
import { uploadToCloudinary } from "@/lib/cloudinary";

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

        const formData = await req.formData();

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        const imageFile = formData.get("thumbnail") as Blob;

        if (!imageFile || !(imageFile instanceof Blob) || !allowedTypes.includes(imageFile.type)) {
            return new NextResponse("Invalid or missing image", { status: 400 });
        }

        const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
        const uploadResult = await uploadToCloudinary(imageBuffer, imageFile.type, {
            folder: "projects/edu-cert",
        });

        const newEntry = await EduCert.create({
            userId: user._id,
            title: formData.get("title"),
            description: formData.get("description"),
            type: formData.get("type"),
            thumbnail: {
                public_id: uploadResult.public_id,
                url: uploadResult.secure_url
            },
            startDate: formData.get("startDate"),
            endDate: formData.get("endDate"),
            link: formData.get('link')
        });

        return NextResponse.json(
            { message: "Education or Certification Added!", data: newEntry },
            { status: 201 }
        );


    } catch (error) {
        console.log("[API ERROR ADD EDU CERT]", error)
        return NextResponse.json({ message: "Internal server error", error }, { status: 500 })
    }
}