import { GoogleGenerativeAI, Part } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

export async function processImageWithGemini(imageData: Buffer): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const base64Image = imageData.toString('base64');

    const imagePart: Part = {
      inlineData: {
        data: base64Image,
        mimeType: 'image/jpeg',
      },
    };

    const prompt = "Analyze this image and provide a detailed explanation of what you see. If there's text, transcribe it. If there's a problem or question, provide a solution or answer.";

    const result = await model.generateContent([prompt, imagePart]);
    const response = result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error('Error processing image with Gemini:', error);
    throw new Error('Failed to process image with Gemini API');
  }
}
