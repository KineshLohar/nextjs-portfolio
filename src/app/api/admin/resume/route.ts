import connectDB from "@/db/connectDB";
import getDataFromToken from "@/lib/get-data-from-token";
import User from "@/models/UserModel";
import ResumeModel from "@/models/ResumeModel";
import { NextRequest, NextResponse } from "next/server";



export async function PATCH(req: NextRequest) {
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

        let resume = await ResumeModel.findOneAndUpdate({ resumeId: 1}, data);
        
        if(!resume){
            resume = await ResumeModel.create({ resumeId: 1, link: data?.link})
        }

        return NextResponse.json(resume);
    } catch (error) {
        console.log("[ERROR ADDING WORK EXPE]", error);

        return new NextResponse("Internal Server Error", { status: 500 })
    }
}