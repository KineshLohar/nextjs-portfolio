// lib/cloudinary.ts
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

type UploadOptions = {
  folder?: string;
  resourceType?: 'image' | 'video' | 'auto';
};

type UploadResult = {
  public_id: string;
  secure_url: string;
  width?: number;
  height?: number;
  format?: string;
  resource_type?: string;
};

// Helper function for single file upload
export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  mimetype: string,
  options: UploadOptions = {}
): Promise<UploadResult> => {
  try {
    const dataUri = `data:${mimetype};base64,${fileBuffer.toString('base64')}`;
    
    const result = await new Promise<UploadResult>((resolve, reject) => {
      cloudinary.uploader.upload(
        dataUri,
        {
          ...options,
          resource_type: options.resourceType || 'auto'
        },
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error) reject(error);
          if (result) resolve(result);
        }
      );
    });

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      resource_type: result.resource_type
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload file to Cloudinary');
  }
};

// Helper function for single file deletion
export const deleteFromCloudinary = async (
  publicId: string,
  resourceType: 'image' | 'video' = 'image'
): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });
  } catch (error) {
    console.error('Cloudinary deletion error:', error);
    throw new Error('Failed to delete file from Cloudinary');
  }
};

// Helper function for multiple files deletion
export const deleteMultipleFromCloudinary = async (
  publicIds: string[],
  resourceType: 'image' | 'video' = 'image'
): Promise<void> => {
  try {
    await Promise.all(
      publicIds.map(publicId => 
        cloudinary.uploader.destroy(publicId, {
          resource_type: resourceType
        })
      )
    );
  } catch (error) {
    console.error('Cloudinary multiple deletion error:', error);
    throw new Error('Failed to delete multiple files from Cloudinary');
  }
};

// Type for image upload results with caption
export type CloudinaryImageWithCaption = {
  public_id: string;
  url: string;
  caption: string;
};