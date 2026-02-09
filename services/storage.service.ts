import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
  privateKey: process.env.PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT!,
});

/**
 * Uploads an image to ImageKit.
 */
export const uploadImage = async (
  file: Buffer | string,
  fileName: string,
  folder: string,
) => {
  try {
    const response = await imagekit.upload({
      file: file,
      fileName: fileName,
      folder: folder,
    });
    return response;
  } catch (error) {
    console.error("ImageKit Upload Error:", error);
    throw error;
  }
};

/**
 * Deletes an image from ImageKit.
 */
export const deleteImage = async (fileId: string) => {
  try {
    await imagekit.deleteFile(fileId);
  } catch (error) {
    console.error("ImageKit Delete Error:", error);
    throw error;
  }
};

/**
 * Updates an image (Delete old -> Upload new).
 */
export const updateImage = async (
  fileId: string,
  newFile: Buffer | string,
  newFileName: string,
  folder: string,
) => {
  try {
    if (fileId) {
      await deleteImage(fileId);
    }
    const response = await uploadImage(newFile, newFileName, folder);
    return response;
  } catch (error) {
    console.error("ImageKit Update Error:", error);
    throw error;
  }
};
