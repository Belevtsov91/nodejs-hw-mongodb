


import { v2 as cloudinary } from 'cloudinary';


const getCloudName = () => process.env.CLOUDINARY_CLOUD_NAME;
const getApiKey = () => process.env.CLOUDINARY_API_KEY;
const getApiSecret = () => process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
  cloud_name: getCloudName(),
  api_key: getApiKey(),
  api_secret: getApiSecret(),
});

export default cloudinary;
