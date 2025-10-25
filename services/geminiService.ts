
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a fallback for development. In a real environment, the key is expected to be set.
  console.warn("API_KEY environment variable not set. Using a placeholder.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || " " });

export const generateAppDescription = async (appName: string, category: string): Promise<string> => {
  if (!API_KEY) {
    return `Đây là mô tả mẫu cho ứng dụng '${appName}' trong danh mục '${category}'. Nó được tạo ra vì không có API key nào được cung cấp.`;
  }
  
  try {
    const prompt = `Tạo một mô tả ngắn gọn, hấp dẫn cho một ứng dụng trên Android TV có tên là "${appName}" thuộc danh mục "${category}". Mô tả phải bằng tiếng Việt và không dài quá 2 câu.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating description:", error);
    return "Không thể tạo mô tả. Vui lòng thử lại.";
  }
};
