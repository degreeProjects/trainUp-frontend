import axios from "axios";
import { config } from "../../config";

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
