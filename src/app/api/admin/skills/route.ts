import getDataFromToken from "@/lib/get-data-from-token";
import User from "@/models/UserModel";
import Skill from '@/models/SkillModel';
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/db/connectDB";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const decodedToken = await getDataFromToken(req);

        if (!decodedToken || typeof decodedToken === 'string') {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await User.findOne({ _id: decodedToken.id }).select("-password");

        if (!user) {
            return new NextResponse("Unauthorized User", { status: 401 });
        }

        const formData = await req.formData();

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

        // Get and validate logo
        const logoFile = formData.get("logo") as File;
        if (!logoFile || !(logoFile instanceof File) || !allowedTypes.includes(logoFile.type)) {
            return new NextResponse("Invalid or missing logo image", { status: 400 });
        }

        // Convert logo to buffer and upload to Cloudinary
        const logoBuffer = Buffer.from(await logoFile.arrayBuffer());
        const logoUpload = await uploadToCloudinary(logoBuffer, logoFile.type, {
            folder: "projects/skills"
        });

        // Create skill object from formData
        const skill = await Skill.create({
            userId: decodedToken.id,
            skill: formData.get("skill"),
            level: formData.get("level"),
            type: formData.get("type"),
            experience: formData.get("experience"),
            projects: formData.get("projects"),
            description: formData.get("description"),
            logo: {
                public_id: logoUpload.public_id,
                url: logoUpload.secure_url
            }
        });

        if (!skill) {
            return new NextResponse("Unable to create Skill", { status: 400 });
        }

        return NextResponse.json({ message: "Skill Added!", skillData: skill }, { status: 201 });

    } catch (error) {
        console.log("[POST SKILL]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
