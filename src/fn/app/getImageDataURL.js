export const getImageDataURL = async (fileData) => {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(fileData);
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
  });
};
