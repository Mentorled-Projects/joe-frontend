import axios from "axios";

export async function uploadFile(file: File, phoneNumber: string, token?: string) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("phoneNumber", phoneNumber);

  const headers: Record<string, string> = {};
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await axios.post(
    `${API_BASE_URL}/api/v1/upload/uploadFile`, 
    formData,
    { headers }
  );

  return res.data;
}