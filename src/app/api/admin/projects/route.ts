// app/api/admin/project/route.ts
import connectDB from "@/db/connectDB";
import { CloudinaryImageWithCaption, uploadToCloudinary } from "@/lib/cloudinary";
import getDataFromToken from "@/lib/get-data-from-token";
import ProjectModel from "@/models/ProjectsModel";
import User from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";

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

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    const formData = await req.formData();

    // Parse form data
    const thumbnailFile = formData.get('thumbnail') as File;

    if (!thumbnailFile || !allowedTypes.includes(thumbnailFile.type)) {
      return new NextResponse("Invalid thumbnail file type", { status: 400 });
    }

    const images = [];
    let imageIndex = 0;

    while (true) {
      const caption = formData.get(`images[${imageIndex}][caption]`);
      const file = formData.get(`images[${imageIndex}][file]`);

      if (!caption || !file) break;

      if (typeof caption !== 'string' || !(file instanceof File)) {
        return new NextResponse("Invalid image format", { status: 400 });
      }

      if (!allowedTypes.includes(file.type)) {
        return new NextResponse(`Invalid file type for image ${imageIndex + 1}`, { status: 400 });
      }

      images.push({
        file,
        caption
      });

      imageIndex++;
    }

    // Upload thumbnail
    const thumbnailBuffer = Buffer.from(await thumbnailFile.arrayBuffer());
    const thumbnailResult = await uploadToCloudinary(
      thumbnailBuffer,
      thumbnailFile.type,
      { folder: 'projects/thumbnails' }
    );

    // Upload images with captions
    const imagesResults: CloudinaryImageWithCaption[] = await Promise.all(
      images.map(async (image) => {
        const buffer = Buffer.from(await image.file.arrayBuffer());
        const result = await uploadToCloudinary(
          buffer,
          image.file.type,
          { folder: 'projects/images' }
        );

        return {
          public_id: result.public_id,
          url: result.secure_url,
          caption: image.caption
        };
      })
    );

    // Create project document
    const project = await ProjectModel.create({
      title: formData.get('title'),
      description: formData.get('description'),
      demoLink: formData.get('demoLink'),
      repoLink: formData.get('repoLink'),
      techs: JSON.parse(formData.get('techs') as string),
      thumbnail: {
        id: thumbnailResult.public_id,
        url: thumbnailResult.secure_url
      },
      images: imagesResults
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
