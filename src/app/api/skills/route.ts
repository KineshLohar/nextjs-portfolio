import connectDB from "@/db/connectDB";
import Skill from "@/models/SkillModel";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        await connectDB();

        const data = await Skill.find();

        // const data = await Skill.aggregate([
        //     {
        //         $group: {
        //             _id: '$type',
        //             skills: {
        //                 $push: {
        //                     _id: '$_id',
        //                     userId: '$userId',
        //                     skill: '$skill',
        //                     level: '$level',
        //                     experience: '$experience',
        //                     projects: '$projects',
        //                     description: '$description',
        //                     logo: {
        //                         public_id: "$logo.public_id",
        //                         url: "$logo.url"
        //                       },
        //                     createdAt: '$createdAt',
        //                     updatedAt: '$updatedAt'
        //                 }
        //             }
        //         }
        //     },
        //     {
        //         $project: {
        //             _id: 0,
        //             type: '$_id',
        //             skills: 1
        //         }
        //     }
        // ])

        if (!data) {
            return new NextResponse('Skills not found!', { status: 400 })
        }

        return NextResponse.json(data);
    } catch (error) {
        console.log("ERROR GETTING SKILLS", error);
        return NextResponse.json(error, { status: 500 })
    }
}