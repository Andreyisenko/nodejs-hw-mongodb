import cloudinary from 'cloudinary';
import fs from 'node:fs/promises';
import { getEnvVar } from './getEnvVar.js';
import { CLOUDINARY } from '../constants/index.js';

cloudinary.v2.config({
  secure: true,
  cloud_name: getEnvVar(CLOUDINARY.CLOUD_NAME),
  api_key: getEnvVar(CLOUDINARY.API_KEY),
  api_secret: getEnvVar(CLOUDINARY.API_SECRET),
});

export const saveFileToCloudinary = async (file) => {
  // console.log('Uploading to Cloudinary:', file.path); // ← отладка пути

  const response = await cloudinary.v2.uploader.upload(file.path, {
    folder: 'contacts/photos',
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
  });
  // console.log('Cloudinary response:', response); // ← отладка результата

  await fs.unlink(file.path);

  return response.secure_url;
};
