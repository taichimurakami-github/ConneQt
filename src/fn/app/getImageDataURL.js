import Resizer from "react-image-file-resizer";

export const getImageDataURL = async (fileBlob, options = {}) => {
  const defalultOptions = {
    size: 300,
    fileType: "JPEG",
    quality: 85,
    rotation: 0,
    outputType: "base64",
  };

  const parsedOptions = {
    ...defalultOptions,
    ...options?.resizeOption,
  };

  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(fileBlob);
    reader.onload = () => {
      console.log(fileBlob);
      //リサイズを実行
      const image = new Image();
      image.src = reader.result;
      image.onload = () => {
        console.log(image.naturalWidth, image.naturalHeight);
        //アスペクト比に従ってデータを算出(横幅基準のaspect-ratio使用)
        const width = parsedOptions.size;
        const height =
          parsedOptions.size * (image.naturalHeight / image.naturalWidth);
        Resizer.imageFileResizer(
          fileBlob,
          width,
          height,
          parsedOptions.fileType,
          parsedOptions.quality,
          parsedOptions.rotation,
          (uri) => {
            resolve(uri);
          },
          parsedOptions.outputType
        );
      };
    };
    reader.onerror = () => reject(reader.error);
  });
};
