// lib/upload-service.ts
import axios from "axios";

export async function uploadFile(file: File, phoneNumber: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("phoneNumber", phoneNumber);

  const res = await axios.post("http://167.71.131.143:3000//api/v1/upload/uploadFile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
}
