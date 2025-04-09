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
        const decodedToken = await getDataFromToken(req);
        if (!decodedToken || typeof decodedToken === 'string') {
            return new NextResponse("Unauthorized", { status: 401 })
        }
        const user = await User.findOne({ _id: decodedToken.id }).select("-password")

        if (!user) {
            return new NextResponse("Unauthorized User", { status: 401 })
        }

        const { skillId } = await params;

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
        const decodedToken = await getDataFromToken(req);
        if (!decodedToken || typeof decodedToken === 'string') {
            return new NextResponse("Unauthorized", { status: 401 })
        }
        const user = await User.findOne({ _id: decodedToken.id }).select("-password")

        if (!user) {
            return new NextResponse("Unauthorized User", { status: 401 })
        }

        const { skillId } = await params;
        const data = await req.json();

        const skill = await Skill.findByIdAndUpdate(skillId, data);

        if (!skill) {
            return NextResponse.json({ message: "Failed to update Skill" }, { status: 400 })
        }

        return NextResponse.json({ message: "Failed to update Skill", skill })

    } catch (error) {
        console.log("[ERRIR SKILL DELETE API]", error);

        return new NextResponse("Internal Server Error", { status: 500 })
    }
}