import cloudinary from "cloudinary";
import dotenv from "dotenv";
dotenv.config();
cloudinary.config({
  cloud_name: process.env.cloudName,
  api_key: process.env.apiKey,
  api_secret: process.env.apiSecret,
  //? to store image as htts
  secure: true,
});

export default cloudinary.v2;
