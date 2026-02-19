import axios from "axios";
import { config } from "../../config";

/**
 * Fetches a remote image by its relative URL and converts it into a File object.
 * Useful for pre-populating file input fields with an existing image (e.g. during profile editing).
 * Throws an error if the image cannot be fetched.
 */
export const fetchImageAndConvertToFile = async (
  imageUrl: string
): Promise<File> => {
  try {
    const response = await axios.get(config.uploadFolderUrl + imageUrl, {
      responseType: "blob",
    });

    // Creating a File object from the Blob
    return new File([response.data], "picture.png", {
      type: response.data.type,
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    throw error;
  }
};
