import connectDB from "@/db/connectDB";
import { CloudinaryImageWithCaption, deleteFromCloudinary, deleteMultipleFromCloudinary, uploadToCloudinary } from "@/lib/cloudinary";
import getDataFromToken from "@/lib/get-data-from-token";
import ProjectModel from "@/models/ProjectsModel";
import User from "@/models/UserModel";
import { ProjectType } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";



export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const decodedToken = await getDataFromToken(req);
        if (!decodedToken || typeof decodedToken === 'string') {
            return new NextResponse("Unauthorized", { status: 401 })
        }
        const user = await User.findOne({ _id: decodedToken.id }).select("-password")

        if (!user) {
            return new NextResponse("Unauthorized User", { status: 401 })
        }

        const { id } = await params;
        const project: ProjectType | null = await ProjectModel.findById(id);

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        // Delete thumbnail
        await deleteFromCloudinary(project.thumbnail?.id);

        // Delete all images
        const imageIds = project.images.map((img) => img?.public_id);
        await deleteMultipleFromCloudinary(imageIds);

        // Delete document
        await ProjectModel.findByIdAndDelete(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function PATCH(
    req: NextRequest,
    { params }:  { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
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

        if (!id) {
            return new NextResponse("Project Id Missing", { status: 400 })
        }

        // Get existing project
        const project = await ProjectModel.findById(id);
        if (!project) {
            return new NextResponse("Project not found", { status: 404 });
        }

        // Handle deleted images
        const deletedImages = formData.getAll('deletedImages') as string[];
        if (deletedImages.length > 0) {
            try {
                await deleteMultipleFromCloudinary(deletedImages);
            } catch (error) {
                console.error('Error deleting images:', error);
                return new NextResponse("Failed to delete images", { status: 500 });
            }
        }

        // Handle thumbnail update
        const thumbnailFile = formData.get('thumbnail') as File;
        if (thumbnailFile && thumbnailFile.size > 0) {
            try {
                // Delete old thumbnail
                await deleteFromCloudinary(project.thumbnail.id);

                // Upload new thumbnail
                const arrayBuffer = await thumbnailFile.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                const uploadResult = await uploadToCloudinary(
                    buffer,
                    thumbnailFile.type,
                    { folder: 'projects/thumbnails' }
                );

                project.thumbnail = {
                    id: uploadResult.public_id,
                    url: uploadResult.secure_url
                };
            } catch (error) {
                console.error('Thumbnail update error:', error);
                return new NextResponse("Thumbnail update failed", { status: 500 });
            }
        }

        // Handle images updates
        const existingImages: CloudinaryImageWithCaption[] = JSON.parse(
            formData.get('existingImages') as string
        );
        const newImages: { file: File; caption: string }[] = [];

        let imageIndex = 0;
        while (true) {
            const file = formData.get(`newImages[${imageIndex}][file]`);
            const caption = formData.get(`newImages[${imageIndex}][caption]`);

            if (!file || !caption) break;

            newImages.push({
                file: file as File,
                caption: caption.toString()
            });
            imageIndex++;
        }

        const uploadedNewImages: CloudinaryImageWithCaption[] = [];
        for (const image of newImages) {
            try {
                const arrayBuffer = await image.file.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                const uploadResult = await uploadToCloudinary(
                    buffer,
                    image.file.type,
                    { folder: 'projects/images' }
                );

                uploadedNewImages.push({
                    public_id: uploadResult.public_id,
                    url: uploadResult.secure_url,
                    caption: image.caption
                });
            } catch (error) {
                console.error('Image upload error:', error);
                return new NextResponse("Image upload failed", { status: 500 });
            }
        }

        project.images = [
            ...existingImages,
            ...uploadedNewImages
        ];

        // Update text fields
        project.title = formData.get('title');
        project.description = formData.get('description');
        project.demoLink = formData.get('demoLink');
        project.repoLink = formData.get('repoLink');
        project.techs = JSON.parse(formData.get('techs') as string);

        await project.save();

        return NextResponse.json(project);
    } catch (error) {
        console.error('[PROJECT_UPDATE]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}