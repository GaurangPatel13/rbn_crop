import { backendConfig } from "../constants/mainContent";

export const imageBase64Convertor = (e, setFunc,setPreviewImg) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result;
      const base64StringArray = base64String.split('base64,')[1];
      setFunc(base64StringArray);
      return reader.result;
      
    };
    reader.readAsDataURL(file);
  }
};
export const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    if (!file) return reject("No file provided");

    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};


// export const ImageUrl=(url)=>{
//   return  `${backendConfig.origin}${url}`
// }

export const convertImageUrlToBase64 = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();
  const reader = new FileReader();
  
  return new Promise((resolve, reject) => {
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};


const convertUrlToBase64 = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
