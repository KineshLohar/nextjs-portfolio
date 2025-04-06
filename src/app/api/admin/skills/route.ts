import getDataFromToken from "@/lib/get-data-from-token";
import User from "@/models/UserModel";
import Skill from '@/models/SkillModel'
import { NextRequest, NextResponse } from "next/server";

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

        data.userId = decodedToken?.id

        const skill = await Skill.create(data)

        if (!skill) {
            return new NextResponse("Unable to create Work Experience", { status: 400 })
        }

        return NextResponse.json({ message: "Work Experience Added!", skillData: skill }, { status: 201 })

    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}