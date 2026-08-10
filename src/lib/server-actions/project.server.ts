"use server"

import "server-only";

import { updateTag } from "next/cache";
import ProjectModel, { type ProjectRaw } from "@/models/ProjectsModel";
import type { ServerResponse } from "@/types/action-response.types";
import { requireAuth } from "../server-auth";
import { deleteFromCloudinary, deleteMultipleFromCloudinary, uploadToCloudinary } from "../cloudinary";
import { withDb } from "@/db/db-helper";
import { Types } from "mongoose";
import { createProjectSchema, deleteProjectSchema, updateProjectSchema, type CreateProjectInput, type DeleteProjectInput, type UpdateProjectInput } from "../validations/project.validation";



export async function createProject(
  input: CreateProjectInput
): Promise<ServerResponse<ProjectRaw>> {
  try {
    await requireAuth();

    const parsed = createProjectSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        data: null,
        error:
          parsed.error.issues[0]?.message ??
          "Invalid project data.",
      };
    }

    const {
      title,
      description,
      demoLink,
      repoLink,
      techs,
      thumbnail,
      images,
    } = parsed.data;

    const thumbnailBuffer = Buffer.from(
      await thumbnail.arrayBuffer()
    );

    const thumbnailResult =
      await uploadToCloudinary(
        thumbnailBuffer,
        thumbnail.type,
        {
          folder: "projects/thumbnails",
        }
      );

    const imageResults = await Promise.all(
      images.map(async ({ file, caption }) => {
        const buffer = Buffer.from(
          await file.arrayBuffer()
        );

        const result =
          await uploadToCloudinary(
            buffer,
            file.type,
            {
              folder: "projects/images",
            }
          );

        return {
          public_id: result.public_id,
          url: result.secure_url,
          caption,
        };
      })
    );

    const project = await withDb(async () => {
      return ProjectModel.create({
        title,
        description,
        demoLink: demoLink || undefined,
        repoLink: repoLink || undefined,
        techs,
        thumbnail: {
          id: thumbnailResult.public_id,
          url: thumbnailResult.secure_url,
        },
        images: imageResults,
      });
    });

    updateTag("projects");

    return {
      success: true,
      data: project.toObject(),
      error: null,
    };
  } catch (error) {
    console.error(
      "[createProject]",
      error
    );

    return {
      success: false,
      data: null,
      error: "Failed to create project.",
    };
  }
}

export async function updateProject(
  input: UpdateProjectInput
): Promise<ServerResponse<null>> {
  try {
    await requireAuth();

    const parsed = updateProjectSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        data: null,
        error:
          parsed.error.issues[0]?.message ??
          "Invalid project data.",
      };
    }

    const {
      id,
      title,
      description,
      demoLink,
      repoLink,
      techs,
      thumbnail,
      images,
    } = parsed.data;

    if (!Types.ObjectId.isValid(id)) {
      return {
        success: false,
        data: null,
        error: "Invalid project ID.",
      };
    }

    const result = await withDb(async () => {
      const project =
        await ProjectModel.findById(id);

      if (!project) {
        return {
          success: false as const,
          error: "Project not found.",
        };
      }

      const oldThumbnailId =
        project.thumbnail?.id ?? null;

      const oldImageIds = (project.images ?? [])
        .map((image) => image.public_id)
        .filter(
          (imageId): imageId is string =>
            Boolean(imageId)
        );

      const existingImages = images.filter(
        (
          image
        ): image is Extract<
          UpdateProjectInput["images"][number],
          { public_id: string }
        > => "public_id" in image
      );

      const newImages = images.filter(
        (
          image
        ): image is Extract<
          UpdateProjectInput["images"][number],
          { file: File }
        > => "file" in image
      );

      let updatedThumbnail =
        project.thumbnail;

      if (thumbnail instanceof File) {
        const buffer = Buffer.from(
          await thumbnail.arrayBuffer()
        );

        const uploadResult =
          await uploadToCloudinary(
            buffer,
            thumbnail.type,
            {
              folder:
                "projects/thumbnails",
            }
          );

        updatedThumbnail = {
          id: uploadResult.public_id,
          url: uploadResult.secure_url,
        };
      }

      const uploadedImages =
        await Promise.all(
          newImages.map(
            async ({
              file,
              caption,
            }) => {
              const buffer =
                Buffer.from(
                  await file.arrayBuffer()
                );

              const result =
                await uploadToCloudinary(
                  buffer,
                  file.type,
                  {
                    folder:
                      "projects/images",
                  }
                );

              return {
                public_id:
                  result.public_id,
                url:
                  result.secure_url,
                caption,
              };
            }
          )
        );

      const finalImages = [
        ...existingImages.map(
          ({
            public_id,
            url,
            caption,
          }) => ({
            public_id,
            url,
            caption,
          })
        ),
        ...uploadedImages,
      ];

      project.title = title;
      project.description =
        description;

      project.demoLink =
        demoLink || undefined;

      project.repoLink =
        repoLink || undefined;

      project.techs = techs.map(
        (tech) =>
          new Types.ObjectId(tech)
      );

      project.thumbnail =
        updatedThumbnail;

      project.set("images", finalImages);

      await project.save();

      const finalImageIds =
        finalImages.map(
          (image) => image.public_id
        );

      const removedImageIds =
        oldImageIds.filter(
          (imageId) =>
            !finalImageIds.includes(
              imageId
            )
        );

      return {
        success: true as const,
        oldThumbnailId:
          thumbnail instanceof File
            ? oldThumbnailId
            : null,
        removedImageIds,
      };
    });

    if (!result.success) {
      return {
        success: false,
        data: null,
        error: result.error,
      };
    }

    if (result.oldThumbnailId) {
      try {
        await deleteFromCloudinary(
          result.oldThumbnailId
        );
      } catch (error) {
        console.error(
          "[updateProject:thumbnail-delete]",
          error
        );
      }
    }

    if (
      result.removedImageIds.length > 0
    ) {
      try {
        await deleteMultipleFromCloudinary(
          result.removedImageIds
        );
      } catch (error) {
        console.error(
          "[updateProject:image-delete]",
          error
        );
      }
    }

    updateTag("projects");

    return {
      success: true,
      data: null,
      error: null,
    };
  } catch (error) {
    console.error(
      "[updateProject]",
      error
    );

    return {
      success: false,
      data: null,
      error: "Failed to update project.",
    };
  }
}

export async function deleteProject(
  input: DeleteProjectInput
): Promise<ServerResponse<null>> {
  try {
    await requireAuth();

    const parsed =
      deleteProjectSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        data: null,
        error:
          parsed.error.issues[0]?.message ??
          "Invalid project ID.",
      };
    }

    const { id } = parsed.data;

    if (!Types.ObjectId.isValid(id)) {
      return {
        success: false,
        data: null,
        error: "Invalid project ID.",
      };
    }

    const result = await withDb(async () => {
      const project =
        await ProjectModel.findById(id);

      if (!project) {
        return {
          success: false as const,
          error: "Project not found.",
        };
      }

      const thumbnailId =
        project.thumbnail?.id;

      const imageIds = (project.images ?? [])
        .map((image) => image.public_id)
        .filter((id): id is string => Boolean(id));

      await ProjectModel.findByIdAndDelete(
        id
      );

      return {
        success: true as const,
        thumbnailId: thumbnailId ?? null,
        imageIds,
      };
    });

    if (!result.success) {
      return {
        success: false,
        data: null,
        error: result.error,
      };
    }

    if (result.thumbnailId) {
      try {
        await deleteFromCloudinary(
          result.thumbnailId
        );
      } catch (error) {
        console.error(
          "[deleteProject] Failed to delete thumbnail:",
          error
        );
      }
    }

    if (result?.imageIds?.length > 0) {
      try {
        await deleteMultipleFromCloudinary(
          result.imageIds
        );
      } catch (error) {
        console.error(
          "[deleteProject] Failed to delete images:",
          error
        );
      }
    }

    updateTag("projects");

    return {
      success: true,
      data: null,
      error: null,
    };
  } catch (error) {
    console.error(
      "[deleteProject]",
      error
    );

    return {
      success: false,
      data: null,
      error: "Failed to delete project.",
    };
  }
}