import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";
import { NextFunction, Request, Response } from "express";
import fs from "fs";

cloudinary.config({
  cloud_name: "planetariumfish",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const uploadImage = async (imagePath: string) => {
  // Use the uploaded file's name as the asset's public ID and
  // allow overwriting the asset with new versions
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };

  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(imagePath, options);
    return result;
  } catch (error) {
    console.error(error);
  }
};

const createUrl = (publicId: string) => {
  // Create an image tag with transformations applied to the src URL
  let imageUrl = cloudinary.url(publicId, {
    transformation: [
      { width: 500, height: 500, gravity: "faces", crop: "thumb" },
    ],
  });
  return imageUrl;
};

export const uploadToCloudinary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    res.status(400).send("No image attached");
    return;
  }
  if (req.file.path)
    try {
      const result = await uploadImage(req.file.path);
      if (!result) throw new Error("Something went wrong with the upload.");
      else {
        let imageUrl = "";
        if (req.file.fieldname === "avatar")
          imageUrl = createUrl(result.public_id);
        else imageUrl = result.secure_url;
        req.body.photo = imageUrl;
        fs.unlinkSync(req.file.path);
        next();
      }
    } catch (err) {
      res.status(500).send(err);
    }
};
