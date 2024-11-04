const fs = require("fs").promises;
const path = require("path");
const dotenv = require("dotenv");
dotenv.config(); // Load environment variables from .env file
const cloudinary = require("cloudinary").v2;
const isLocal = process.env.STORAGE_TYPE === "local";
const LOCAL_STORAGE_PATH = process.env.LOCAL_STORAGE_PATH || "./public/storage"; // Default value if not set

const winstonLogger = require("../utils/Logger");
const ErrorLogService = require("../services/ErrorLogService");
const { extractUserAgent } = require("../utils/ExtractUserAgent");

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadFileService = async (destinationFolder, file, fileName) => {
  try {
    if (isLocal) {
      // Append LOCAL_STORAGE_PATH to the initial path
      const destinationPath = path.join(
        __dirname,
        "..",
        LOCAL_STORAGE_PATH,
        destinationFolder
      );

      return await storeFileToLocalStorage(destinationPath, file, fileName);
    }
  } catch (error) {
    throw new Error(`Error uploading files: ${error.message}`);
  }
};

const uploadMultipleFilesService = async (destinationFolder, fileArray) => {
  try {
    console.log("islocallllllll", isLocal);
    if (isLocal) {
      // Append LOCAL_STORAGE_PATH to the initial path
      const destinationPath = path.join(
        __dirname,
        "..",
        LOCAL_STORAGE_PATH,
        destinationFolder
      );
      return await storeFilesToLocalStorage(destinationPath, fileArray);
    } else {
      const result = {};
      const fileStoragePathsArray = [];
      console.log("fileArrayyyyyyyy", fileArray)
      for (const file of fileArray) {
        const result = await uploadImageToCloudinary(file);
        fileStoragePathsArray.push(result);
        console.log(`Processed: ${file}`);
      }
      result.success = true;
      result.fileStoragePathsArray = fileStoragePathsArray;
      return result;
    }
  } catch (error) {
    throw new Error(`Error uploading file: ${error.message}`);
  }
};

const storeFileToLocalStorage = async (destinationFolder, file, fileName) => {
  const result = {};
  try {
    // Check if the directory exists
    if (!(await fs.access(destinationFolder).catch(() => false))) {
      // If the directory doesn't exist, create it
      await fs.mkdir(destinationFolder, { recursive: true });
    }

    const filePath = path.join(destinationFolder, fileName);
    await fs.writeFile(filePath, file.buffer);

    result.success = true;
    result.fileStoragePath = filePath;
    return result;
  } catch (error) {
    console.log(error);
    result.success = false;
    result.fileStoragePath = null;
    return result;
  }
};

const storeFilesToLocalStorage = async (destinationFolder, fileArray) => {
  // console.log("destinationFolder", destinationFolder);
  // console.log("fileArray", fileArray);

  const result = {};
  const fileStoragePathsArray = []; // Array to store file paths

  try {
    if (!(await fs.access(destinationFolder).catch(() => false))) {
      // If the directory doesn't exist, create it
      await fs.mkdir(destinationFolder, { recursive: true });
    }
    // Use Promise.all to await all file writing operations
    await Promise.all(
      fileArray.map(async (element) => {
        const fileDestinationPath = path.join(
          destinationFolder,
          element.originalname
        );

        await fs.writeFile(fileDestinationPath, element.buffer);

        fileStoragePathsArray.push(fileDestinationPath);
        console.log(
          `${element.originalname} saved to storage: `,
          element.originalname
        );
      })
    );

    result.success = true;
    result.fileStoragePathsArray = fileStoragePathsArray;

    return result;
  } catch (error) {
    winstonLogger.error(error.message);
    await ErrorLogService.logError(error, true, null, null, null);
    console.error("An error occurred:", error);
    result.success = false;
    result.fileStoragePathsArray = null;
    return result;
  }
};

async function uploadImageBuffer(buffer) {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "e-shop" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      );
      uploadStream.end(buffer);
    });
  } catch (error) {
    console.error("error uploading image buffer to cloudinary: ", error);
  }
}

// Usage example
async function uploadImageToCloudinary(imageFile) {
  try {
    // const imageBuffer = imageFile;
    const uploadResult = await uploadImageBuffer(imageFile.buffer);
    console.log("Uploaded:", uploadResult);
    return uploadResult;
  } catch (error) {
    console.error("Upload Error:", error);
  }
}

module.exports = { uploadFileService, uploadMultipleFilesService };
