import connectDB from "@/db/connectDB";
import { deleteFromCloudinary, uploadToCloudinary } from "@/lib/cloudinary";
import getDataFromToken from "@/lib/get-data-from-token";
import Skill from "@/models/SkillModel";
import User from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";


export async function DELETE(req: NextRequest,
    { params }: {
        params: Promise<{
            skillId: string;
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

        const { skillId } = await params;

        const skill = await Skill.findById(skillId);
        if (!skill) {
            return new NextResponse("Skill not found", { status: 404 });
        }

        // Delete logo from Cloudinary
        if (skill.logo?.public_id) {
            try {
                await deleteFromCloudinary(skill.logo.public_id);
            } catch (err) {
                console.error("Failed to delete logo from Cloudinary:", err);
                // Proceed even if logo deletion fails
            }
        }

        await Skill.findByIdAndDelete(skillId);

        return NextResponse.json({ message: "SKill Deleted!" }, { status: 200 })

    } catch (error) {
        console.log("[ERRIR SKILL DELETE API]", error);

        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export async function PATCH(req: NextRequest, { params }: {
    params: Promise<{
        skillId: string;
    }>
}) {
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

        const { skillId } = await params;
        const formData = await req.formData();

        const skill = await Skill.findById(skillId);
        if (!skill) {
            return new NextResponse("Skill not found", { status: 404 });
        }

        // Handle logo upload
        const logoFile = formData.get("logo") as File;
        if (logoFile && logoFile.size > 0) {
            // Delete old logo from Cloudinary
            if (skill.logo?.public_id) {
                await deleteFromCloudinary(skill.logo.public_id);
            }

            // Upload new logo to Cloudinary
            const arrayBuffer = await logoFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const uploadResult = await uploadToCloudinary(buffer, logoFile.type, {
                folder: "projects/skills"
            });

            skill.logo = {
                public_id: uploadResult.public_id,
                url: uploadResult.secure_url
            };
        }

        // Update text fields
        skill.skill = formData.get("skill");
        skill.level = formData.get("level");
        skill.type = formData.get("type");
        skill.experience = formData.get("experience");
        skill.projects = formData.get("projects");
        skill.description = formData.get("description");

        await skill.save();

        return NextResponse.json({ message: "Skill updated successfully", skill });
    } catch (error) {
        console.log("[ERROR SKILL PATCH API]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}